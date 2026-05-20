/**
 * 充值卡 Store - 完整充值卡逻辑
 * 功能：充值卡管理、9折消费、充值记录
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { taroStorage } from './taroStorage'

// 充值卡接口
export interface RechargeCard {
  id: string
  name: string
  balance: number
  originalAmount: number // 原始充值金额
  bonusAmount: number // 赠送金额
  discount: number // 折扣比例 0.9 = 9折
  validUntil: string
  status: 'active' | 'expired' | 'used'
  createdAt: string
}

// 充值套餐
export interface RechargePackage {
  id: string
  name: string
  amount: number // 支付金额
  bonus: number // 赠送金额
  discount: number // 消费折扣
  recommended?: boolean
}

// 充值记录
export interface RechargeRecord {
  id: string
  cardId: string
  cardName: string
  type: 'purchase' | 'consume' | 'refund'
  amount: number
  balance: number
  description: string
  createdAt: string
}

// 预设充值套餐
const RECHARGE_PACKAGES: RechargePackage[] = [
  { id: 'pkg_100', name: '充值100元', amount: 100, bonus: 0, discount: 1 },
  { id: 'pkg_200', name: '充值200元', amount: 200, bonus: 20, discount: 0.95, recommended: true },
  { id: 'pkg_500', name: '充值500元', amount: 500, bonus: 80, discount: 0.9, recommended: true },
  { id: 'pkg_1000', name: '充值1000元', amount: 1000, bonus: 200, discount: 0.85 }
]

interface RechargeState {
  cards: RechargeCard[]
  totalBalance: number
  records: RechargeRecord[]
  packages: RechargePackage[]
  
  // 充值卡管理
  addCard: (packageId: string) => Promise<boolean>
  useBalance: (amount: number, cardId?: string) => boolean
  deductWithDiscount: (amount: number) => { success: boolean; paidAmount: number; discount: number }
  loadCards: () => void
  
  // 记录管理
  addRecord: (cardId: string, cardName: string, type: 'purchase' | 'consume' | 'refund', amount: number, balance: number, description: string) => void
  loadRecords: () => void
  
  // 套餐管理
  getPackage: (packageId: string) => RechargePackage | undefined
  getRecommendedPackages: () => RechargePackage[]
  
  // 查询
  getBestDiscountCard: () => RechargeCard | null
  canUseCard: (amount: number) => boolean
}

export const useRechargeStore = create<RechargeState>()(
  persist(
    (set, get) => ({
      cards: [],
      totalBalance: 0,
      records: [],
      packages: RECHARGE_PACKAGES,

      // 购买充值卡
      addCard: async (packageId: string): Promise<boolean> => {
        const state = get()
        const pkg = state.packages.find(p => p.id === packageId)
        if (!pkg) {
          Taro.showToast({ title: '套餐不存在', icon: 'none' })
          return false
        }

        // 模拟支付成功
        const newCard: RechargeCard = {
          id: `rc_${Date.now()}`,
          name: pkg.name,
          balance: pkg.amount + pkg.bonus,
          originalAmount: pkg.amount,
          bonusAmount: pkg.bonus,
          discount: pkg.discount,
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'), // 1年有效期
          status: 'active',
          createdAt: new Date().toLocaleString('zh-CN')
        }

        const cards = [newCard, ...state.cards]
        const totalBalance = cards.reduce((sum, c) => c.status === 'active' ? sum + c.balance : sum, 0)

        // 添加购买记录
        get().addRecord(newCard.id, newCard.name, 'purchase', pkg.amount, newCard.balance, '购买充值卡')

        set({ cards, totalBalance })
        Taro.showToast({ title: '充值成功', icon: 'success' })
        return true
      },

      // 使用余额（指定卡片）
      useBalance: (amount: number, cardId?: string) => {
        const state = get()
        if (state.totalBalance < amount) return false

        let remaining = amount
        const cards = state.cards.map((card) => {
          if (remaining <= 0 || card.status !== 'active') return card
          if (cardId && card.id !== cardId) return card

          const deduct = Math.min(card.balance, remaining)
          remaining -= deduct
          return { ...card, balance: card.balance - deduct }
        })

        const totalBalance = cards.reduce((sum, c) => c.status === 'active' ? sum + c.balance : sum, 0)
        
        // 更新卡片状态
        const updatedCards = cards.map(c => 
          c.balance === 0 ? { ...c, status: 'used' as const } : c
        )

        set({ cards: updatedCards, totalBalance })
        return true
      },

      // 9折扣款（优先使用折扣最低的卡）
      deductWithDiscount: (amount: number) => {
        const state = get()
        const bestCard = get().getBestDiscountCard()
        
        if (!bestCard || state.totalBalance < amount * (bestCard.discount || 1)) {
          return { success: false, paidAmount: amount, discount: 1 }
        }

        const discount = bestCard.discount || 1
        const paidAmount = amount * discount

        // 扣款
        let remaining = paidAmount
        const cards = state.cards.map((card) => {
          if (remaining <= 0 || card.status !== 'active') return card
          const deduct = Math.min(card.balance, remaining)
          remaining -= deduct
          return { ...card, balance: card.balance - deduct }
        })

        const totalBalance = cards.reduce((sum, c) => c.status === 'active' ? sum + c.balance : sum, 0)
        set({ cards, totalBalance })

        return { success: true, paidAmount, discount }
      },

      // 加载Mock数据
      loadCards: () => set({
        cards: [
          {
            id: 'rc_1',
            name: '充值卡 500元',
            balance: 350,
            originalAmount: 500,
            bonusAmount: 80,
            discount: 0.9,
            validUntil: '2025-12-31',
            status: 'active',
            createdAt: '2025-01-01 10:00:00'
          },
          {
            id: 'rc_2',
            name: '充值卡 200元',
            balance: 180,
            originalAmount: 200,
            bonusAmount: 20,
            discount: 0.95,
            validUntil: '2025-06-30',
            status: 'active',
            createdAt: '2025-01-10 14:30:00'
          }
        ],
        totalBalance: 530
      }),

      // 添加记录
      addRecord: (cardId, cardName, type, amount, balance, description) => set((state) => {
        const record: RechargeRecord = {
          id: `rr_${Date.now()}`,
          cardId,
          cardName,
          type,
          amount,
          balance,
          description,
          createdAt: new Date().toLocaleString('zh-CN')
        }
        return { records: [record, ...state.records] }
      }),

      // 加载Mock记录
      loadRecords: () => set({
        records: [
          {
            id: 'rr_1',
            cardId: 'rc_1',
            cardName: '充值卡 500元',
            type: 'consume',
            amount: 100,
            balance: 350,
            description: '购买商品消费',
            createdAt: '2025-01-15 10:30:00'
          },
          {
            id: 'rr_2',
            cardId: 'rc_1',
            cardName: '充值卡 500元',
            type: 'purchase',
            amount: 500,
            balance: 580,
            description: '购买充值卡',
            createdAt: '2025-01-01 10:00:00'
          }
        ]
      }),

      // 获取套餐
      getPackage: (packageId) => {
        return get().packages.find(p => p.id === packageId)
      },

      // 获取推荐套餐
      getRecommendedPackages: () => {
        return get().packages.filter(p => p.recommended)
      },

      // 获取最佳折扣卡
      getBestDiscountCard: () => {
        const state = get()
        const activeCards = state.cards.filter(c => c.status === 'active' && c.balance > 0)
        if (activeCards.length === 0) return null
        return activeCards.reduce((best, card) => 
          card.discount < best.discount ? card : best
        )
      },

      // 检查是否可用充值卡支付
      canUseCard: (amount: number) => {
        const state = get()
        const bestCard = get().getBestDiscountCard()
        if (!bestCard) return false
        return state.totalBalance >= amount * bestCard.discount
      }
    }),
    {
      name: 'yixia-recharge-storage',
      storage: taroStorage,
      partialize: (state) => ({
        cards: state.cards,
        totalBalance: state.totalBalance,
        records: state.records
      })
    }
  )
)
