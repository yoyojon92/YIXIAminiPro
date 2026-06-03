/**
 * 经销商+代理商状态管理
 * 经销商：分享小程序→20人成为创始会员→解锁经销商→5%返利+专属码+团购团长
 * 代理商：基于经销商资格→替客户下单+去营销+业绩看板
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { taroStorage } from './taroStorage'

/** 经销商等级 */
export type DealerLevel = 'none' | 'bronze' | 'silver' | 'gold'

/** 代理商等级 */
export type AgentLevel = 'none' | 'intern' | 'regular' | 'senior'

/** 返利记录 */
export interface CommissionRecord {
  id: string
  orderId: string
  amount: number
  productId: string
  productName: string
  buyerOpenid: string
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

/** 经销商自提订单 */
export interface DealerPickupOrder {
  id: string
  orderNo: string
  customerName: string
  customerPhone: string
  products: Array<{ name: string; qty: number; price: number }>
  totalAmount: number
  redeemCode?: string
  status: 'pending' | 'preparing' | 'ready' | 'picked_up' | 'delivering'
  deliveryMethod: 'pickup' | 'third_party'
  createdAt: number
  pickedUpAt?: number
}

/** 代理商代下单记录 */
export interface AgentOrder {
  id: string
  orderNo: string
  customerName: string
  customerPhone: string
  products: Array<{ name: string; qty: number; price: number }>
  totalAmount: number
  deliveryMethod: 'pickup' | 'delivery' | 'mail'
  status: 'pending' | 'completed'
  createdAt: number
}

interface DealerState {
  // === 经销商 ===
  isDealer: boolean
  dealerLevel: DealerLevel
  dealerCode: string | null
  referralCount: number
  referralOpenids: string[]
  totalCommission: number
  availableCommission: number
  commissionRecords: CommissionRecord[]
  withdrawRecords: WithdrawRecord[]
  groupBuyEligible: boolean
  dealerOrders: DealerPickupOrder[]

  // === 代理商 ===
  isAgent: boolean
  agentLevel: AgentLevel
  todayCommission: number
  todayOrderCount: number
  totalAgentSales: number
  agentOrders: AgentOrder[]

  // === 经销商操作 ===
  checkAndUnlockDealer: (currentReferralCount: number) => void
  addReferral: (openid: string) => void
  generateDealerCode: () => string
  addCommission: (record: Omit<CommissionRecord, 'id' | 'createdAt' | 'status'>) => void
  withdrawCommission: (amount: number) => void
  acceptDealerOrder: (orderId: string) => void
  prepareDealerOrder: (orderId: string) => void
  completePickupOrder: (orderId: string) => void
  callThirdPartyDelivery: (orderId: string) => void

  // === 代理商操作 ===
  createAgentOrder: (order: Omit<AgentOrder, 'id' | 'orderNo' | 'createdAt' | 'status'>) => void
  completeAgentOrder: (orderId: string) => void
  getTodayPerformance: () => { commission: number; orderCount: number }

  // === 通用 ===
  getNextDealerMilestone: () => { current: number; target: number; level: string }
  getDealerLevelName: () => string
  getAgentLevelName: () => string
  getCommissionRate: () => number
}

/** 等级阈值 */
const DEALER_THRESHOLDS: Record<DealerLevel, number> = {
  none: 0,
  bronze: 20,
  silver: 50,
  gold: 100,
}

const AGENT_SALES_THRESHOLDS: Record<AgentLevel, number> = {
  none: 0,
  intern: 500,
  regular: 2000,
  senior: 5000,
}

export const useDealerStore = create<DealerState>()(
  persist(
    (set, get) => ({
      isDealer: false,
      dealerLevel: 'none',
      dealerCode: null,
      referralCount: 0,
      referralOpenids: [],
      totalCommission: 0,
      availableCommission: 0,
      commissionRecords: [],
      withdrawRecords: [],
      groupBuyEligible: false,
      dealerOrders: [],

      isAgent: false,
      agentLevel: 'none',
      todayCommission: 0,
      todayOrderCount: 0,
      totalAgentSales: 0,
      agentOrders: [],

      checkAndUnlockDealer: (currentReferralCount) => {
        const state = get()
        let newLevel: DealerLevel = 'none'
        if (currentReferralCount >= 100) newLevel = 'gold'
        else if (currentReferralCount >= 50) newLevel = 'silver'
        else if (currentReferralCount >= 20) newLevel = 'bronze'

        if (newLevel !== state.dealerLevel) {
          const justUnlocked = !state.isDealer && newLevel !== 'none'
          set({
            isDealer: newLevel !== 'none',
            dealerLevel: newLevel,
            referralCount: currentReferralCount,
            groupBuyEligible: newLevel !== 'none',
          })
          if (justUnlocked) {
            Taro.showToast({ title: '恭喜解锁经销商等级！', icon: 'success' })
          }
        }
      },

      addReferral: (openid) => {
        const { referralOpenids, referralCount } = get()
        if (referralOpenids.includes(openid)) return
        const newOpenids = [...referralOpenids, openid]
        const newCount = referralCount + 1
        set({ referralOpenids: newOpenids, referralCount: newCount })
        get().checkAndUnlockDealer(newCount)
      },

      generateDealerCode: () => {
        const state = get()
        if (state.dealerCode) return state.dealerCode
        const ts = Date.now().toString(36).slice(-4).toUpperCase()
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let rand = ''
        for (let i = 0; i < 3; i++) {
          rand += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        const code = `DL${ts}${rand}`
        set({ dealerCode: code })
        return code
      },

      addCommission: (record) => {
        const newRecord: CommissionRecord = {
          ...record,
          id: `comm_${Date.now()}`,
          createdAt: Date.now(),
          status: 'pending',
        }
        const { commissionRecords, totalCommission, availableCommission } = get()
        set({
          commissionRecords: [...commissionRecords, newRecord],
          totalCommission: totalCommission + record.amount,
          availableCommission: availableCommission + record.amount,
        })
      },

      withdrawCommission: (amount) => {
        const { availableCommission, withdrawRecords } = get()
        if (amount > availableCommission) {
          Taro.showToast({ title: '可提现余额不足', icon: 'none' })
          return
        }
        const newWithdraw: WithdrawRecord = {
          id: `wd_${Date.now()}`,
          amount,
          status: 'pending',
          createdAt: Date.now(),
        }
        set({
          availableCommission: availableCommission - amount,
          withdrawRecords: [...withdrawRecords, newWithdraw],
        })
        Taro.showToast({ title: '提现申请已提交', icon: 'success' })
      },

      acceptDealerOrder: (orderId) => {
        const { dealerOrders } = get()
        set({
          dealerOrders: dealerOrders.map(o =>
            o.id === orderId ? { ...o, status: 'preparing' as const } : o
          ),
        })
      },

      prepareDealerOrder: (orderId) => {
        const { dealerOrders } = get()
        set({
          dealerOrders: dealerOrders.map(o =>
            o.id === orderId ? { ...o, status: 'ready' as const } : o
          ),
        })
      },

      completePickupOrder: (orderId) => {
        const { dealerOrders } = get()
        set({
          dealerOrders: dealerOrders.map(o =>
            o.id === orderId ? { ...o, status: 'picked_up' as const, pickedUpAt: Date.now() } : o
          ),
        })
      },

      callThirdPartyDelivery: (orderId) => {
        const { dealerOrders } = get()
        set({
          dealerOrders: dealerOrders.map(o =>
            o.id === orderId ? { ...o, status: 'delivering' as const, deliveryMethod: 'third_party' as const } : o
          ),
        })
        Taro.navigateTo({ url: '/pagesOrder/callDelivery/index' })
      },

      createAgentOrder: (order) => {
        const { agentOrders, totalAgentSales, todayCommission, todayOrderCount } = get()
        const newOrder: AgentOrder = {
          ...order,
          id: `agent_${Date.now()}`,
          orderNo: `AYX${Date.now().toString(36).slice(-6).toUpperCase()}`,
          createdAt: Date.now(),
          status: 'pending',
        }
        const commission = Math.round(order.totalAmount * 0.05 * 100) / 100
        const newTotalSales = totalAgentSales + order.totalAmount
        let newAgentLevel: AgentLevel = 'none'
        if (newTotalSales >= 5000) newAgentLevel = 'senior'
        else if (newTotalSales >= 2000) newAgentLevel = 'regular'
        else if (newTotalSales >= 500) newAgentLevel = 'intern'
        set({
          agentOrders: [...agentOrders, newOrder],
          totalAgentSales: newTotalSales,
          todayCommission: todayCommission + commission,
          todayOrderCount: todayOrderCount + 1,
          agentLevel: newAgentLevel,
          isAgent: newAgentLevel !== 'none',
        })
        Taro.showToast({ title: '代下单成功！', icon: 'success' })
      },

      completeAgentOrder: (orderId) => {
        const { agentOrders } = get()
        set({
          agentOrders: agentOrders.map(o =>
            o.id === orderId ? { ...o, status: 'completed' as const } : o
          ),
        })
      },

      getTodayPerformance: () => {
        const { todayCommission, todayOrderCount } = get()
        return { commission: todayCommission, orderCount: todayOrderCount }
      },

      getNextDealerMilestone: () => {
        const { dealerLevel, referralCount } = get()
        const levels: DealerLevel[] = ['none', 'bronze', 'silver', 'gold']
        const currentIdx = levels.indexOf(dealerLevel)
        const nextLevel = currentIdx < levels.length - 1 ? levels[currentIdx + 1] : null
        if (!nextLevel) return { current: referralCount, target: 100, level: '黄金经销商(已满级)' }
        return {
          current: referralCount,
          target: DEALER_THRESHOLDS[nextLevel],
          level: nextLevel === 'bronze' ? '青铜经销商' : nextLevel === 'silver' ? '白银经销商' : '黄金经销商',
        }
      },

      getDealerLevelName: () => {
        const names: Record<DealerLevel, string> = {
          none: '未解锁',
          bronze: '青铜经销商',
          silver: '白银经销商',
          gold: '黄金经销商',
        }
        return names[get().dealerLevel]
      },

      getAgentLevelName: () => {
        const names: Record<AgentLevel, string> = {
          none: '未解锁',
          intern: '实习代理商',
          regular: '正式代理商',
          senior: '资深代理商',
        }
        return names[get().agentLevel]
      },

      getCommissionRate: () => {
        const rates: Record<DealerLevel, number> = { none: 0, bronze: 5, silver: 7, gold: 10 }
        return rates[get().dealerLevel]
      },
    }),
    {
      name: 'dealer-store',
      storage: taroStorage,
      partialize: (state) => ({
        isDealer: state.isDealer,
        dealerLevel: state.dealerLevel,
        dealerCode: state.dealerCode,
        referralCount: state.referralCount,
        referralOpenids: state.referralOpenids,
        totalCommission: state.totalCommission,
        availableCommission: state.availableCommission,
        commissionRecords: state.commissionRecords,
        withdrawRecords: state.withdrawRecords,
        groupBuyEligible: state.groupBuyEligible,
        dealerOrders: state.dealerOrders,
        isAgent: state.isAgent,
        agentLevel: state.agentLevel,
        todayCommission: state.todayCommission,
        todayOrderCount: state.todayOrderCount,
        totalAgentSales: state.totalAgentSales,
        agentOrders: state.agentOrders,
      }),
    }
  )
)
