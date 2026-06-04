/**
 * 经销商+代理商状态管理（V3 - 2026-06-05重构）
 * 
 * 经销商：纯分销零库存零风险
 *   - 分享专属码→好友扫码注册并支付9.9成为创始会员→累计10人自动成为经销商
 *   - 好友终身消费的1%作为佣金
 *   - 活动期至7月30日
 * 
 * 代理商：囤货拿货折扣+销售提成
 *   - 铜牌代理¥2000：9.5折拿货，3个月，10%提成
 *   - 银牌代理¥5000：9折拿货，6个月，15%提成
 *   - 金牌代理¥10000：8.5折拿货，1年，18%提成+次级代理5%分红
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { taroStorage } from './taroStorage'

/** 经销商状态 */
export type DealerStatus = 'none' | 'active'

/** 代理商等级 */
export type AgentLevel = 'none' | 'bronze' | 'silver' | 'gold'

/** 代理商等级名称映射 */
export const AGENT_LEVEL_NAMES: Record<AgentLevel, string> = {
  none: '未开通',
  bronze: '铜牌代理',
  silver: '银牌代理',
  gold: '金牌代理',
}

/** 代理商等级配置 */
export const AGENT_CONFIG: Record<Exclude<AgentLevel, 'none'>, {
  deposit: number
  name: string
  discount: number        // 折扣：9.5=9.5折
  durationMonths: number  // 代理权月数
  commissionRate: number  // 销售提成百分比
  secondaryRate: number   // 次级代理分红百分比
}> = {
  bronze: {
    deposit: 2000,
    name: '铜牌代理',
    discount: 9.5,
    durationMonths: 3,
    commissionRate: 10,
    secondaryRate: 0,
  },
  silver: {
    deposit: 5000,
    name: '银牌代理',
    discount: 9,
    durationMonths: 6,
    commissionRate: 15,
    secondaryRate: 0,
  },
  gold: {
    deposit: 10000,
    name: '金牌代理',
    discount: 8.5,
    durationMonths: 12,
    commissionRate: 18,
    secondaryRate: 5,
  },
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
  joinedAt: number     // 注册时间
  paidAt: number | null // 支付9.9时间
  isFoundingMember: boolean
}

interface DealerState {
  // === 经销商 ===
  isDealer: boolean
  dealerCode: string | null         // 经销商专属分享码
  referralCount: number             // 已推荐并支付9.9的人数
  referrals: ReferralRecord[]       // 推荐记录
  totalCommission: number           // 累计佣金
  availableCommission: number       // 可提现佣金
  commissionRecords: CommissionRecord[]
  withdrawRecords: WithdrawRecord[]

  // === 代理商 ===
  isAgent: boolean
  agentLevel: AgentLevel
  agentActivatedAt: number | null   // 开通时间戳
  agentExpireAt: number | null      // 到期时间戳
  agentTotalSales: number           // 代理期间累计销售
  agentSecondaryCode: string | null // 次级代理分享码（仅金牌）
  agentSecondarySales: number       // 次级代理销售总额
  agentCommission: number           // 代理提成累计

  // === 经销商操作 ===
  addReferral: (openid: string, nickname: string, paid: boolean) => void
  checkAndUnlockDealer: () => void
  generateDealerCode: () => string
  addCommission: (record: Omit<CommissionRecord, 'id' | 'createdAt' | 'status'>) => void
  withdrawCommission: (amount: number) => void

  // === 代理商操作 ===
  activateAgent: (level: AgentLevel) => void
  addAgentSales: (amount: number) => void
  addSecondarySales: (amount: number) => void
  checkAgentUpgrade: () => void
  getAgentDiscount: () => number
  getAgentCommissionRate: () => number
  getAgentDaysLeft: () => number
  isAgentExpired: () => boolean

  // === 通用 ===
  getDealerProgressText: () => string
}

/** 经销商解锁所需推荐人数 */
const DEALER_UNLOCK_COUNT = 10

/** 经销商活动截止：2026-07-30 23:59:59 */
const DEALER_PROMO_END = new Date('2026-07-30T23:59:59').getTime()

/** 代理商升级条件 */
const AGENT_UPGRADE_CONDITIONS = {
  bronze: { salesTarget: 2000, nextDeposit: 3000, nextLevel: 'silver' as AgentLevel },
  silver: { salesTarget: 5000, nextDeposit: 5000, nextLevel: 'gold' as AgentLevel },
  gold: null, // 已最高级
}

export const useDealerStore = create<DealerState>()(
  persist(
    (set, get) => ({
      // === 经销商初始 ===
      isDealer: false,
      dealerCode: null,
      referralCount: 0,
      referrals: [],
      totalCommission: 0,
      availableCommission: 0,
      commissionRecords: [],
      withdrawRecords: [],

      // === 代理商初始 ===
      isAgent: false,
      agentLevel: 'none',
      agentActivatedAt: null,
      agentExpireAt: null,
      agentTotalSales: 0,
      agentSecondaryCode: null,
      agentSecondarySales: 0,
      agentCommission: 0,

      // === 经销商操作 ===
      addReferral: (openid, nickname, paid) => {
        const { referrals, referralCount } = get()
        if (referrals.find(r => r.openid === openid)) return
        const newReferral: ReferralRecord = {
          openid,
          nickname,
          joinedAt: Date.now(),
          paidAt: paid ? Date.now() : null,
          isFoundingMember: paid,
        }
        const newReferrals = [...referrals, newReferral]
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

      // === 代理商操作 ===
      activateAgent: (level) => {
        if (level === 'none') return
        const config = AGENT_CONFIG[level]
        const now = Date.now()
        const expireAt = new Date(now).setMonth(new Date(now).getMonth() + config.durationMonths)
        const secondaryCode = level === 'gold' ? `AG${Date.now().toString(36).slice(-4).toUpperCase()}` : null
        set({
          isAgent: true,
          agentLevel: level,
          agentActivatedAt: now,
          agentExpireAt: expireAt,
          agentTotalSales: 0,
          agentSecondaryCode: secondaryCode,
          agentSecondarySales: 0,
          agentCommission: 0,
        })
        Taro.showToast({ title: `${config.name}开通成功！`, icon: 'success' })
      },

      addAgentSales: (amount) => {
        const { agentTotalSales, agentCommission, agentLevel } = get()
        if (agentLevel === 'none') return
        const config = AGENT_CONFIG[agentLevel]
        const commission = Math.round(amount * config.commissionRate / 100 * 100) / 100
        set({
          agentTotalSales: agentTotalSales + amount,
          agentCommission: agentCommission + commission,
        })
        get().checkAgentUpgrade()
      },

      addSecondarySales: (amount) => {
        const { agentSecondarySales } = get()
        set({ agentSecondarySales: agentSecondarySales + amount })
      },

      checkAgentUpgrade: () => {
        const { agentLevel, agentTotalSales, agentActivatedAt } = get()
        if (agentLevel === 'none' || agentLevel === 'gold') return
        const condition = AGENT_UPGRADE_CONDITIONS[agentLevel]
        if (!condition) return
        // 检查是否在代理期内达到销售目标
        const now = Date.now()
        const config = AGENT_CONFIG[agentLevel]
        const expireAt = agentActivatedAt! + config.durationMonths * 30 * 86400000
        if (now > expireAt) return // 已过期不累计
        if (agentTotalSales >= condition.salesTarget) {
          Taro.showModal({
            title: '升级提示',
            content: `您已达到${condition.salesTarget}元销售目标！再次拿货¥${condition.nextDeposit}即可升级为${AGENT_LEVEL_NAMES[condition.nextLevel]}，是否现在升级？`,
            confirmText: '去升级',
            cancelText: '稍后',
          })
        }
      },

      getAgentDiscount: () => {
        const { agentLevel } = get()
        if (agentLevel === 'none') return 10 // 无折扣
        return AGENT_CONFIG[agentLevel].discount
      },

      getAgentCommissionRate: () => {
        const { agentLevel } = get()
        if (agentLevel === 'none') return 0
        return AGENT_CONFIG[agentLevel].commissionRate
      },

      getAgentDaysLeft: () => {
        const { agentExpireAt, isAgent } = get()
        if (!isAgent || !agentExpireAt) return 0
        const left = agentExpireAt - Date.now()
        return left > 0 ? Math.ceil(left / 86400000) : 0
      },

      isAgentExpired: () => {
        const { agentExpireAt, isAgent } = get()
        if (!isAgent || !agentExpireAt) return false
        return Date.now() > agentExpireAt
      },

      getDealerProgressText: () => {
        const { isDealer, referralCount } = get()
        if (isDealer) return '已解锁经销商'
        const promoActive = Date.now() < DEALER_PROMO_END
        if (!promoActive) return '活动已结束'
        return `推荐${referralCount}/${DEALER_UNLOCK_COUNT}人`
      },
    }),
    {
      name: 'dealer-store',
      storage: taroStorage,
      partialize: (state) => ({
        isDealer: state.isDealer,
        dealerCode: state.dealerCode,
        referralCount: state.referralCount,
        referrals: state.referrals,
        totalCommission: state.totalCommission,
        availableCommission: state.availableCommission,
        commissionRecords: state.commissionRecords,
        withdrawRecords: state.withdrawRecords,
        isAgent: state.isAgent,
        agentLevel: state.agentLevel,
        agentActivatedAt: state.agentActivatedAt,
        agentExpireAt: state.agentExpireAt,
        agentTotalSales: state.agentTotalSales,
        agentSecondaryCode: state.agentSecondaryCode,
        agentSecondarySales: state.agentSecondarySales,
        agentCommission: state.agentCommission,
      }),
    }
  )
)
