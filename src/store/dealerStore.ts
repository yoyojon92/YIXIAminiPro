/**
 * 经销商+代理商状态管理（V4 - 2026-06-05重构）
 * 代理商/自提点：囤货+进货/补货+替顾客下单+核销+接单
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { taroStorage } from './taroStorage'

export type DealerStatus = 'none' | 'active'
export type AgentLevel = 'none' | 'bronze' | 'silver' | 'gold'

export const AGENT_LEVEL_NAMES: Record<AgentLevel, string> = {
  none: '未开通',
  bronze: '铜牌代理',
  silver: '银牌代理',
  gold: '金牌代理',
}

export const AGENT_CONFIG: Record<Exclude<AgentLevel, 'none'>, {
  deposit: number
  name: string
  discount: number
  durationMonths: number
  commissionRate: number
  secondaryRate: number
}> = {
  bronze: { deposit: 2000, name: '铜牌代理', discount: 9.5, durationMonths: 3, commissionRate: 10, secondaryRate: 0 },
  silver: { deposit: 5000, name: '银牌代理', discount: 9, durationMonths: 6, commissionRate: 15, secondaryRate: 0 },
  gold: { deposit: 10000, name: '金牌代理', discount: 8.5, durationMonths: 12, commissionRate: 18, secondaryRate: 5 },
}

/** 代理库存项 */
export interface AgentInventoryItem {
  productId: string
  productName: string
  quantity: number
  sold: number
  price: number
  image: string
}

/** 替顾客下单记录 */
export interface CustomerOrder {
  id: string
  customerPhone: string
  customerAddress: string
  customerName: string
  items: { productId: string; productName: string; quantity: number; price: number }[]
  totalAmount: number
  status: 'shopping' | 'paid' | 'delivered'
  createdAt: number
  deliveryType: 'pickup' | 'delivery'
  verifyCode?: string
}

/** 接单（附近自提点缺货漏单） */
export interface OverflowOrder {
  id: string
  fromPickupPoint: string
  items: { productId: string; productName: string; quantity: number; price: number }[]
  totalAmount: number
  status: 'pending' | 'accepted' | 'declined' | 'fulfilled'
  createdAt: number
  commission: number
}

/** 核销记录 */
export interface VerifyRecord {
  id: string
  orderId: string
  verifyCode: string
  customerPhone: string
  items: { productName: string; quantity: number; price: number }[]
  totalAmount: number
  verifiedAt: number
}

/** 返利记录 */
export interface CommissionRecord {
  id: string
  orderId: string
  amount: number
  buyerName: string
  productName: string
  createdAt: number
  status: 'pending' | 'settled' | 'withdrawn'
}

/** 提现记录 */
export interface WithdrawRecord {
  id: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  createdAt: number
  completedAt?: number
}

/** 经销商推荐记录 */
export interface ReferralRecord {
  openid: string
  nickname: string
  joinedAt: number
  paidAt: number | null
  isFoundingMember: boolean
}

/** 默认进货分配方案 */
const DEFAULT_ALLOCATION: Record<Exclude<AgentLevel, 'none'>, Array<{ productId: string; name: string; qty: number; price: number; img: string }>> = {
  bronze: [
    { productId: 'prod_pomegranate_new', name: '榴红心事', qty: 15, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/01-liu-hong-xin-shi.webp' },
    { productId: 'prod_peach_new', name: '桃心微醺', qty: 15, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/03-tao-xin-an-dong.webp' },
    { productId: 'prod_red_wine', name: '红葡萄果酒', qty: 8, price: 38.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/06-hong-pu-tao-guo-jiu.webp' },
    { productId: 'prod_apple_wine', name: '青苹微醺', qty: 10, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/04-qing-ping-wei-zui.webp' },
    { productId: 'prod_guava_wine', name: '芭乐金银花', qty: 4, price: 38.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/05-fen-le-wu-qiong.webp' },
    { productId: 'prod_grape_wine', name: '葡香暗渡', qty: 10, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/02-pu-xiang-an-du.webp' },
    { productId: 'prod_pomelo_old', name: '柚见倾心', qty: 8, price: 16.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-old/01-you-zi-jiu.webp' },
    { productId: 'prod_hawthorn_old', name: '山楂之恋', qty: 8, price: 16.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-old/02-yi-meng-shan-zha-jiu.webp' },
    { productId: 'prod_hawthorn_oolong_old', name: '山楂乌龙', qty: 8, price: 16.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-old/03-shan-zha-wu-long-jiu.webp' },
  ],
  silver: [
    { productId: 'prod_pomegranate_new', name: '榴红心事', qty: 40, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/01-liu-hong-xin-shi.webp' },
    { productId: 'prod_peach_new', name: '桃心微醺', qty: 40, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/03-tao-xin-an-dong.webp' },
    { productId: 'prod_red_wine', name: '红葡萄果酒', qty: 20, price: 38.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/06-hong-pu-tao-guo-jiu.webp' },
    { productId: 'prod_apple_wine', name: '青苹微醺', qty: 25, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/04-qing-ping-wei-zui.webp' },
    { productId: 'prod_guava_wine', name: '芭乐金银花', qty: 10, price: 38.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/05-fen-le-wu-qiong.webp' },
    { productId: 'prod_grape_wine', name: '葡香暗渡', qty: 25, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/02-pu-xiang-an-du.webp' },
    { productId: 'prod_pomelo_old', name: '柚见倾心', qty: 15, price: 16.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-old/01-you-zi-jiu.webp' },
    { productId: 'prod_hawthorn_old', name: '山楂之恋', qty: 15, price: 16.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-old/02-yi-meng-shan-zha-jiu.webp' },
    { productId: 'prod_hawthorn_oolong_old', name: '山楂乌龙', qty: 15, price: 16.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-old/03-shan-zha-wu-long-jiu.webp' },
  ],
  gold: [
    { productId: 'prod_pomegranate_new', name: '榴红心事', qty: 80, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/01-liu-hong-xin-shi.webp' },
    { productId: 'prod_peach_new', name: '桃心微醺', qty: 80, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/03-tao-xin-an-dong.webp' },
    { productId: 'prod_red_wine', name: '红葡萄果酒', qty: 40, price: 38.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/06-hong-pu-tao-guo-jiu.webp' },
    { productId: 'prod_apple_wine', name: '青苹微醺', qty: 50, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/04-qing-ping-wei-zui.webp' },
    { productId: 'prod_guava_wine', name: '芭乐金银花', qty: 20, price: 38.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/05-fen-le-wu-qiong.webp' },
    { productId: 'prod_grape_wine', name: '葡香暗渡', qty: 50, price: 18.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-wine/02-pu-xiang-an-du.webp' },
    { productId: 'prod_pomelo_old', name: '柚见倾心', qty: 30, price: 16.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-old/01-you-zi-jiu.webp' },
    { productId: 'prod_hawthorn_old', name: '山楂之恋', qty: 30, price: 16.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-old/02-yi-meng-shan-zha-jiu.webp' },
    { productId: 'prod_hawthorn_oolong_old', name: '山楂乌龙', qty: 30, price: 16.8, img: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products/yixia-old/03-shan-zha-wu-long-jiu.webp' },
  ],
}

interface DealerState {
  isDealer: boolean
  dealerCode: string | null
  referralCount: number
  referrals: ReferralRecord[]
  totalCommission: number
  availableCommission: number
  commissionRecords: CommissionRecord[]
  withdrawRecords: WithdrawRecord[]

  isAgent: boolean
  agentLevel: AgentLevel
  agentActivatedAt: number | null
  agentExpireAt: number | null
  agentTotalSales: number
  agentSecondaryCode: string | null
  agentSecondarySales: number
  agentCommission: number

  agentInventory: AgentInventoryItem[]
  hasStockedUp: boolean
  customerOrders: CustomerOrder[]
  currentCustomerOrder: CustomerOrder | null
  overflowOrders: OverflowOrder[]
  verifyRecords: VerifyRecord[]

  addReferral: (openid: string, nickname: string, paid: boolean) => void
  checkAndUnlockDealer: () => void
  generateDealerCode: () => string
  addCommission: (record: Omit<CommissionRecord, 'id' | 'createdAt' | 'status'>) => void
  withdrawCommission: (amount: number) => void

  activateAgent: (level: AgentLevel) => void
  addAgentSales: (amount: number) => void
  addSecondarySales: (amount: number) => void
  checkAgentUpgrade: () => void
  getAgentDiscount: () => number
  getAgentCommissionRate: () => number
  getAgentDaysLeft: () => number
  isAgentExpired: () => boolean

  stockUp: () => void
  restock: () => void
  deductInventory: (productId: string, qty: number) => void
  getInventoryTotal: () => { totalRetail: number; totalQty: number; soldQty: number }
  canRestock: () => boolean

  createCustomerOrder: (phone: string, address: string, name: string, deliveryType: 'pickup' | 'delivery') => CustomerOrder
  addItemsToCustomerOrder: (orderId: string, items: { productId: string; productName: string; quantity: number; price: number }[]) => void
  completeCustomerOrder: (orderId: string) => void

  verifyOrderByCode: (code: string) => CustomerOrder | null
  confirmVerify: (orderId: string) => void
  getPendingVerifyOrders: () => CustomerOrder[]

  acceptOverflowOrder: (orderId: string) => void
  declineOverflowOrder: (orderId: string) => void
  fulfillOverflowOrder: (orderId: string) => void

  getDealerProgressText: () => string
}

const DEALER_UNLOCK_COUNT = 10
const DEALER_PROMO_END = new Date('2026-07-30T23:59:59').getTime()
const AGENT_UPGRADE_CONDITIONS: Record<string, { salesTarget: number; nextDeposit: number; nextLevel: AgentLevel } | null> = {
  bronze: { salesTarget: 2000, nextDeposit: 3000, nextLevel: 'silver' },
  silver: { salesTarget: 5000, nextDeposit: 5000, nextLevel: 'gold' },
  gold: null,
}

const generateMockOverflowOrders = (): OverflowOrder[] => ([
  {
    id: 'overflow_001',
    fromPickupPoint: '东门便利店',
    items: [
      { productId: 'prod_pomegranate_new', productName: '榴红心事', quantity: 3, price: 18.8 },
      { productId: 'prod_peach_new', productName: '桃心微醺', quantity: 2, price: 18.8 },
    ],
    totalAmount: 94,
    status: 'pending',
    createdAt: Date.now() - 3600000,
    commission: 9.4,
  },
  {
    id: 'overflow_002',
    fromPickupPoint: '南门超市',
    items: [
      { productId: 'prod_red_wine', productName: '红葡萄果酒', quantity: 5, price: 38.8 },
    ],
    totalAmount: 194,
    status: 'pending',
    createdAt: Date.now() - 7200000,
    commission: 19.4,
  },
])

export const useDealerStore = create<DealerState>()(
  persist(
    (set, get) => ({
      isDealer: false,
      dealerCode: null,
      referralCount: 0,
      referrals: [],
      totalCommission: 0,
      availableCommission: 0,
      commissionRecords: [],
      withdrawRecords: [],

      isAgent: false,
      agentLevel: 'none' as AgentLevel,
      agentActivatedAt: null,
      agentExpireAt: null,
      agentTotalSales: 0,
      agentSecondaryCode: null,
      agentSecondarySales: 0,
      agentCommission: 0,

      agentInventory: [],
      hasStockedUp: false,
      customerOrders: [],
      currentCustomerOrder: null,
      overflowOrders: [],
      verifyRecords: [],

      addReferral: (openid, nickname, paid) => {
        const { referrals } = get()
        if (referrals.find(r => r.openid === openid)) return
        const newReferrals = [...referrals, { openid, nickname, joinedAt: Date.now(), paidAt: paid ? Date.now() : null, isFoundingMember: paid }]
        const paidCount = newReferrals.filter(r => r.isFoundingMember).length
        set({ referrals: newReferrals, referralCount: paidCount })
        get().checkAndUnlockDealer()
      },

      checkAndUnlockDealer: () => {
        const { referralCount, isDealer } = get()
        if (!isDealer && referralCount >= DEALER_UNLOCK_COUNT) {
          set({ isDealer: true })
          Taro.showToast({ title: '恭喜成为经销商！', icon: 'success' })
        }
      },

      generateDealerCode: () => {
        const state = get()
        if (state.dealerCode) return state.dealerCode
        const ts = Date.now().toString(36).slice(-4).toUpperCase()
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let rand = ''
        for (let i = 0; i < 3; i++) rand += chars.charAt(Math.floor(Math.random() * chars.length))
        const code = `DL${ts}${rand}`
        set({ dealerCode: code })
        return code
      },

      addCommission: (record) => {
        const newRecord: CommissionRecord = { ...record, id: `comm_${Date.now()}`, createdAt: Date.now(), status: 'pending' }
        const { commissionRecords, totalCommission, availableCommission } = get()
        set({ commissionRecords: [...commissionRecords, newRecord], totalCommission: totalCommission + record.amount, availableCommission: availableCommission + record.amount })
      },

      withdrawCommission: (amount) => {
        const { availableCommission, withdrawRecords } = get()
        if (amount > availableCommission) { Taro.showToast({ title: '可提现余额不足', icon: 'none' }); return }
        set({ availableCommission: availableCommission - amount, withdrawRecords: [...withdrawRecords, { id: `wd_${Date.now()}`, amount, status: 'pending', createdAt: Date.now() }] })
        Taro.showToast({ title: '提现申请已提交', icon: 'success' })
      },

      activateAgent: (level) => {
        if (level === 'none') return
        const config = AGENT_CONFIG[level]
        const now = Date.now()
        const expireAt = new Date(now).setMonth(new Date(now).getMonth() + config.durationMonths)
        const secondaryCode = level === 'gold' ? `AG${Date.now().toString(36).slice(-4).toUpperCase()}` : null
        set({ isAgent: true, agentLevel: level, agentActivatedAt: now, agentExpireAt: expireAt, agentTotalSales: 0, agentSecondaryCode: secondaryCode, agentSecondarySales: 0, agentCommission: 0, agentInventory: [], hasStockedUp: false, overflowOrders: generateMockOverflowOrders() })
        Taro.showToast({ title: `${config.name}开通成功！`, icon: 'success' })
      },

      addAgentSales: (amount) => {
        const { agentTotalSales, agentCommission, agentLevel } = get()
        if (agentLevel === 'none') return
        const config = AGENT_CONFIG[agentLevel]
        const commission = Math.round(amount * config.commissionRate / 100 * 100) / 100
        set({ agentTotalSales: agentTotalSales + amount, agentCommission: agentCommission + commission })
        get().checkAgentUpgrade()
      },

      addSecondarySales: (amount) => {
        set({ agentSecondarySales: get().agentSecondarySales + amount })
      },

      checkAgentUpgrade: () => {
        const { agentLevel, agentTotalSales, agentActivatedAt } = get()
        if (agentLevel === 'none' || agentLevel === 'gold') return
        const condition = AGENT_UPGRADE_CONDITIONS[agentLevel]
        if (!condition) return
        const now = Date.now()
        const config = AGENT_CONFIG[agentLevel]
        const expireAt = agentActivatedAt! + config.durationMonths * 30 * 86400000
        if (now > expireAt) return
        if (agentTotalSales >= condition.salesTarget) {
          Taro.showModal({ title: '升级提示', content: `您已达到${condition.salesTarget}元销售目标！再次拿货¥${condition.nextDeposit}即可升级为${AGENT_LEVEL_NAMES[condition.nextLevel]}，是否现在升级？`, confirmText: '去升级', cancelText: '稍后' })
        }
      },

      getAgentDiscount: () => { const { agentLevel } = get(); return agentLevel === 'none' ? 10 : AGENT_CONFIG[agentLevel].discount },
      getAgentCommissionRate: () => { const { agentLevel } = get(); return agentLevel === 'none' ? 0 : AGENT_CONFIG[agentLevel].commissionRate },
      getAgentDaysLeft: () => { const { agentExpireAt, isAgent } = get(); if (!isAgent || !agentExpireAt) return 0; const left = agentExpireAt - Date.now(); return left > 0 ? Math.ceil(left / 86400000) : 0 },
      isAgentExpired: () => { const { agentExpireAt, isAgent } = get(); if (!isAgent || !agentExpireAt) return false; return Date.now() > agentExpireAt },

      stockUp: () => {
        const { agentLevel, hasStockedUp } = get()
        if (agentLevel === 'none' || hasStockedUp) return
        const allocation = DEFAULT_ALLOCATION[agentLevel]
        const inventory: AgentInventoryItem[] = allocation.map(item => ({ productId: item.productId, productName: item.name, quantity: item.qty, sold: 0, price: item.price, image: item.img }))
        set({ agentInventory: inventory, hasStockedUp: true })
        Taro.showToast({ title: '进货成功！酒水已分配', icon: 'success' })
      },

      restock: () => {
        const { agentLevel, agentInventory } = get()
        if (agentLevel === 'none') return
        const allocation = DEFAULT_ALLOCATION[agentLevel]
        const newInventory = agentInventory.map(item => {
          const allocItem = allocation.find(a => a.productId === item.productId)
          const addQty = allocItem ? Math.ceil(allocItem.qty / 2) : 0
          return { ...item, quantity: item.quantity + addQty }
        })
        set({ agentInventory: newInventory })
        Taro.showToast({ title: '补货成功！', icon: 'success' })
      },

      deductInventory: (productId, qty) => {
        const { agentInventory, agentTotalSales, agentCommission, agentLevel } = get()
        if (agentLevel === 'none') return
        const config = AGENT_CONFIG[agentLevel]
        const product = agentInventory.find(i => i.productId === productId)
        const saleAmount = product ? product.price * qty : 0
        const commission = Math.round(saleAmount * config.commissionRate / 100 * 100) / 100
        const newInventory = agentInventory.map(item => {
          if (item.productId === productId) {
            const newQty = Math.max(0, item.quantity - qty)
            const newSold = item.sold + Math.min(qty, item.quantity)
            return { ...item, quantity: newQty, sold: newSold }
          }
          return item
        })
        set({ agentInventory: newInventory, agentTotalSales: agentTotalSales + saleAmount, agentCommission: agentCommission + commission })
      },

      getInventoryTotal: () => {
        const { agentInventory } = get()
        let totalRetail = 0, totalQty = 0, soldQty = 0
        agentInventory.forEach(item => { totalRetail += item.price * item.quantity; totalQty += item.quantity; soldQty += item.sold })
        return { totalRetail: Math.round(totalRetail * 100) / 100, totalQty, soldQty }
      },

      canRestock: () => { const { agentInventory, hasStockedUp } = get(); if (!hasStockedUp) return false; return agentInventory.some(item => item.sold > 0) },

      createCustomerOrder: (phone, address, name, deliveryType) => {
        const ts = Date.now().toString(36).slice(-4).toUpperCase()
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let rand = ''
        for (let i = 0; i < 4; i++) rand += chars.charAt(Math.floor(Math.random() * chars.length))
        const verifyCode = deliveryType === 'pickup' ? `YX${ts}${rand}` : undefined
        const order: CustomerOrder = { id: `co_${Date.now()}`, customerPhone: phone, customerAddress: address, customerName: name, items: [], totalAmount: 0, status: 'shopping', createdAt: Date.now(), deliveryType, verifyCode }
        set({ customerOrders: [...get().customerOrders, order], currentCustomerOrder: order })
        return order
      },

      addItemsToCustomerOrder: (orderId, items) => {
        const { customerOrders, currentCustomerOrder } = get()
        const updatedOrders = customerOrders.map(o => {
          if (o.id === orderId) {
            const newItems = [...o.items, ...items]
            const totalAmount = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
            return { ...o, items: newItems, totalAmount }
          }
          return o
        })
        items.forEach(item => { get().deductInventory(item.productId, item.quantity) })
        const updatedCurrent = currentCustomerOrder?.id === orderId ? updatedOrders.find(o => o.id === orderId) || null : currentCustomerOrder
        set({ customerOrders: updatedOrders, currentCustomerOrder: updatedCurrent })
      },

      completeCustomerOrder: (orderId) => {
        const { customerOrders, currentCustomerOrder } = get()
        const updatedOrders = customerOrders.map(o => o.id === orderId ? { ...o, status: 'paid' as const } : o)
        const updatedCurrent = currentCustomerOrder?.id === orderId ? null : currentCustomerOrder
        set({ customerOrders: updatedOrders, currentCustomerOrder: updatedCurrent })
        Taro.showToast({ title: '下单成功！', icon: 'success' })
      },

      verifyOrderByCode: (code) => {
        const { customerOrders } = get()
        return customerOrders.find(o => o.verifyCode === code && o.status === 'paid') || null
      },

      confirmVerify: (orderId) => {
        const { customerOrders, verifyRecords, agentCommission, agentLevel } = get()
        const order = customerOrders.find(o => o.id === orderId)
        if (!order) return
        const updatedOrders = customerOrders.map(o => o.id === orderId ? { ...o, status: 'delivered' as const } : o)
        const record: VerifyRecord = { id: `vr_${Date.now()}`, orderId, verifyCode: order.verifyCode || '', customerPhone: order.customerPhone, items: order.items, totalAmount: order.totalAmount, verifiedAt: Date.now() }
        const config = agentLevel !== 'none' ? AGENT_CONFIG[agentLevel] : null
        const commission = config ? Math.round(order.totalAmount * config.commissionRate / 100 * 100) / 100 : 0
        set({ customerOrders: updatedOrders, verifyRecords: [...verifyRecords, record], agentCommission: agentCommission + commission })
        Taro.showToast({ title: '核销成功！已发货', icon: 'success' })
      },

      getPendingVerifyOrders: () => {
        return get().customerOrders.filter(o => o.status === 'paid' && o.deliveryType === 'pickup')
      },

      acceptOverflowOrder: (orderId) => {
        const { overflowOrders, agentCommission } = get()
        const order = overflowOrders.find(o => o.id === orderId)
        const updated = overflowOrders.map(o => o.id === orderId ? { ...o, status: 'accepted' as const } : o)
        set({ overflowOrders: updated, agentCommission: agentCommission + (order ? order.commission : 0) })
        Taro.showToast({ title: '已接单！', icon: 'success' })
      },

      declineOverflowOrder: (orderId) => {
        set({ overflowOrders: get().overflowOrders.map(o => o.id === orderId ? { ...o, status: 'declined' as const } : o) })
      },

      fulfillOverflowOrder: (orderId) => {
        const { overflowOrders, agentTotalSales } = get()
        const order = overflowOrders.find(o => o.id === orderId)
        set({ overflowOrders: overflowOrders.map(o => o.id === orderId ? { ...o, status: 'fulfilled' as const } : o), agentTotalSales: agentTotalSales + (order ? order.totalAmount : 0) })
        Taro.showToast({ title: '配送完成！', icon: 'success' })
      },

      getDealerProgressText: () => {
        const { isDealer, referralCount } = get()
        if (isDealer) return '已解锁经销商'
        if (Date.now() >= DEALER_PROMO_END) return '活动已结束'
        return `推荐${referralCount}/${DEALER_UNLOCK_COUNT}人`
      },
    }),
    {
      name: 'dealer-store',
      storage: taroStorage,
      partialize: (state) => ({
        isDealer: state.isDealer, dealerCode: state.dealerCode, referralCount: state.referralCount, referrals: state.referrals,
        totalCommission: state.totalCommission, availableCommission: state.availableCommission, commissionRecords: state.commissionRecords, withdrawRecords: state.withdrawRecords,
        isAgent: state.isAgent, agentLevel: state.agentLevel, agentActivatedAt: state.agentActivatedAt, agentExpireAt: state.agentExpireAt,
        agentTotalSales: state.agentTotalSales, agentSecondaryCode: state.agentSecondaryCode, agentSecondarySales: state.agentSecondarySales, agentCommission: state.agentCommission,
        agentInventory: state.agentInventory, hasStockedUp: state.hasStockedUp, customerOrders: state.customerOrders, overflowOrders: state.overflowOrders, verifyRecords: state.verifyRecords,
      }),
    }
  )
)
