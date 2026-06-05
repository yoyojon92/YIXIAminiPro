/**
 * 经销商+代理商状态管理（V5 - 2026-06-05积分体系重构）
 * 核心变更：积分替代押金，1元=1积分只做记录不做货币
 * 配货逻辑：首次2000@9.5折 + 升银追加3000@9折 + 升金追加8000@8.5折
 * 不在小程序内收款，接美团储值系统，核销后积分同步
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

/** V5代理配置：积分门槛+配货金额+折扣 */
export const AGENT_CONFIG: Record<Exclude<AgentLevel, 'none'>, {
  pointsThreshold: number
  name: string
  initialStockAmount: number
  discount: number
  durationMonths: number
  commissionRate: number
  secondaryRate: number
  upgradeRestockAmount?: number
  upgradeRestockDiscount?: number
}> = {
  bronze: {
    pointsThreshold: 2000,
    name: '铜牌代理',
    initialStockAmount: 2000,
    discount: 9.5,
    durationMonths: 3,
    commissionRate: 10,
    secondaryRate: 0,
    upgradeRestockAmount: 3000,
    upgradeRestockDiscount: 9,
  },
  silver: {
    pointsThreshold: 5000,
    name: '银牌代理',
    initialStockAmount: 3000,
    discount: 9,
    durationMonths: 6,
    commissionRate: 15,
    secondaryRate: 0,
    upgradeRestockAmount: 8000,
    upgradeRestockDiscount: 8.5,
  },
  gold: {
    pointsThreshold: 10000,
    name: '金牌代理',
    initialStockAmount: 8000,
    discount: 8.5,
    durationMonths: 12,
    commissionRate: 18,
    secondaryRate: 5,
  },
}

/** 积分记录 */
export interface PointsRecord {
  id: string
  type: 'recharge' | 'referral_register' | 'referral_founding' | 'subordinate_sale' | 'meituan_sync'
  amount: number
  description: string
  createdAt: number
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

/** 接单 */
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

/** 单品日销量 */
export interface DailySaleRecord {
  productId: string
  productName: string
  date: string
  quantity: number
  revenue: number
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

const DEALER_UNLOCK_COUNT = 10
const DEALER_PROMO_END = new Date('2026-07-30T23:59:59').getTime()

interface DealerState {
  isDealer: boolean
  dealerCode: string
  referralCount: number
  referrals: ReferralRecord[]
  totalCommission: number
  availableCommission: number
  commissionRecords: CommissionRecord[]
  withdrawRecords: WithdrawRecord[]
  // V5积分
  pointsRecords: PointsRecord[]
  totalPoints: number
  rechargedPoints: number
  earnedPoints: number
  // 代理
  isAgent: boolean
  agentLevel: AgentLevel
  agentActivatedAt: number | null
  agentExpireAt: number | null
  agentTotalSales: number
  agentCommission: number
  agentSecondaryCode: string
  agentSecondarySales: number
  agentInventory: AgentInventoryItem[]
  hasStockedUp: boolean
  hasUpgradeStockedUp: boolean
  // 订单/核销
  customerOrders: CustomerOrder[]
  currentCustomerOrder: CustomerOrder | null
  overflowOrders: OverflowOrder[]
  verifyRecords: VerifyRecord[]
  dailySales: DailySaleRecord[]
}

interface DealerActions {
  unlockDealer: () => void
  addReferral: (openid: string, nickname: string, isFoundingMember: boolean) => void
  setReferralPaid: (openid: string) => void
  withdrawCommission: (amount: number) => void
  getDealerProgressText: () => string
  // V5积分
  rechargePoints: (amount: number, description?: string) => void
  addReferralPoints: () => void
  addReferralFoundingPoints: (buyerName: string) => void
  addSubordinateSalePoints: (amount: number, buyerName: string) => void
  syncMeituanPoints: (amount: number, orderNo?: string) => void
  getWithdrawablePoints: () => number
  withdrawPoints: (amount: number) => boolean
  getPointsLevel: () => AgentLevel
  getPointsRecords: () => PointsRecord[]
  // 代理
  activateAgent: (level: AgentLevel) => void
  upgradeAgent: (rechargeAmount: number) => void
  upgradeRestock: () => void
  getAgentDiscount: () => number
  getAgentCommissionRate: () => number
  getAgentDaysLeft: () => number
  isAgentExpired: () => boolean
  stockUp: () => void
  restock: () => void
  deductInventory: (productId: string, qty: number) => void
  getInventoryTotal: () => { totalRetail: number; totalQty: number; soldQty: number }
  canRestock: () => boolean
  // 订单/核销
  createCustomerOrder: (phone: string, address: string, name: string, deliveryType: 'pickup' | 'delivery') => CustomerOrder
  addItemsToCustomerOrder: (orderId: string, items: { productId: string; productName: string; quantity: number; price: number }[]) => void
  completeCustomerOrder: (orderId: string) => void
  verifyOrderByCode: (code: string) => CustomerOrder | null
  confirmVerify: (orderId: string) => void
  getPendingVerifyOrders: () => CustomerOrder[]
  acceptOverflowOrder: (orderId: string) => void
  declineOverflowOrder: (orderId: string) => void
  fulfillOverflowOrder: (orderId: string) => void
  recordDailySale: (productId: string, productName: string, quantity: number, revenue: number) => void
  getDailySalesReport: (date?: string) => DailySaleRecord[]
}

export const useDealerStore = create<DealerState & DealerActions>()(
  persist(
    (set, get) => ({
      isDealer: false,
      dealerCode: '',
      referralCount: 0,
      referrals: [],
      totalCommission: 0,
      availableCommission: 0,
      commissionRecords: [],
      withdrawRecords: [],
      // V5积分
      pointsRecords: [],
      totalPoints: 0,
      rechargedPoints: 0,
      earnedPoints: 0,
      // 代理
      isAgent: false,
      agentLevel: 'none' as AgentLevel,
      agentActivatedAt: null,
      agentExpireAt: null,
      agentTotalSales: 0,
      agentCommission: 0,
      agentSecondaryCode: '',
      agentSecondarySales: 0,
      agentInventory: [],
      hasStockedUp: false,
      hasUpgradeStockedUp: false,
      // 订单/核销
      customerOrders: [],
      currentCustomerOrder: null,
      overflowOrders: [],
      verifyRecords: [],
      dailySales: [],

      // ========== 经销商方法 ==========

      unlockDealer: () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        const ts = Date.now().toString(36).slice(-4).toUpperCase()
        let rand = ''
        for (let i = 0; i < 3; i++) rand += chars.charAt(Math.floor(Math.random() * chars.length))
        const dealerCode = `DL${ts}${rand}`
        set({ isDealer: true, dealerCode })
        Taro.showToast({ title: '经销商已解锁！', icon: 'success' })
      },

      addReferral: (openid, nickname, isFoundingMember) => {
        const { referrals, referralCount } = get()
        if (referrals.some(r => r.openid === openid)) return
        const newReferral: ReferralRecord = { openid, nickname, joinedAt: Date.now(), paidAt: null, isFoundingMember }
        const newReferrals = [...referrals, newReferral]
        set({ referrals: newReferrals, referralCount: referralCount + 1 })
        get().addReferralPoints()
        if (isFoundingMember) {
          get().addReferralFoundingPoints(nickname)
        }
        if (newReferrals.filter(r => r.isFoundingMember).length >= DEALER_UNLOCK_COUNT && !get().isDealer) {
          get().unlockDealer()
        }
      },

      setReferralPaid: (openid) => {
        const { referrals } = get()
        const updated = referrals.map(r => r.openid === openid ? { ...r, paidAt: Date.now(), isFoundingMember: true } : r)
        set({ referrals: updated })
        if (updated.filter(r => r.isFoundingMember).length >= DEALER_UNLOCK_COUNT && !get().isDealer) {
          get().unlockDealer()
        }
      },

      withdrawCommission: (amount) => {
        const { availableCommission, withdrawRecords } = get()
        if (amount > availableCommission) return
        const record: WithdrawRecord = { id: `wd_${Date.now()}`, amount, status: 'pending', createdAt: Date.now() }
        set({ availableCommission: availableCommission - amount, withdrawRecords: [...withdrawRecords, record] })
        Taro.showToast({ title: '提现申请已提交', icon: 'success' })
      },

      // ========== V5积分体系方法 ==========

      rechargePoints: (amount, description) => {
        const { pointsRecords, totalPoints, rechargedPoints } = get()
        const record: PointsRecord = {
          id: `pt_${Date.now()}`,
          type: 'recharge',
          amount,
          description: description || `充值¥${amount}，获得${amount}积分`,
          createdAt: Date.now(),
        }
        set({
          pointsRecords: [...pointsRecords, record],
          totalPoints: totalPoints + amount,
          rechargedPoints: rechargedPoints + amount,
        })
      },

      addReferralPoints: () => {
        const { pointsRecords, totalPoints, earnedPoints } = get()
        const record: PointsRecord = {
          id: `pt_${Date.now()}_ref`,
          type: 'referral_register',
          amount: 1,
          description: '推荐新用户注册+1积分',
          createdAt: Date.now(),
        }
        set({
          pointsRecords: [...pointsRecords, record],
          totalPoints: totalPoints + 1,
          earnedPoints: earnedPoints + 1,
        })
      },

      addReferralFoundingPoints: (buyerName) => {
        const { pointsRecords, totalPoints, earnedPoints } = get()
        const record: PointsRecord = {
          id: `pt_${Date.now()}_found`,
          type: 'referral_founding',
          amount: 10,
          description: `推荐${buyerName}购买创始会员+10积分`,
          createdAt: Date.now(),
        }
        set({
          pointsRecords: [...pointsRecords, record],
          totalPoints: totalPoints + 10,
          earnedPoints: earnedPoints + 10,
        })
      },

      addSubordinateSalePoints: (amount, buyerName) => {
        const { pointsRecords, totalPoints, earnedPoints } = get()
        const points = Math.round(amount * 0.01)
        if (points <= 0) return
        const record: PointsRecord = {
          id: `pt_${Date.now()}_sub`,
          type: 'subordinate_sale',
          amount: points,
          description: `名下用户${buyerName}消费¥${amount}，奖励${points}积分`,
          createdAt: Date.now(),
        }
        set({
          pointsRecords: [...pointsRecords, record],
          totalPoints: totalPoints + points,
          earnedPoints: earnedPoints + points,
        })
      },

      syncMeituanPoints: (amount, orderNo) => {
        const { pointsRecords, totalPoints, rechargedPoints } = get()
        const record: PointsRecord = {
          id: `pt_${Date.now()}_mt`,
          type: 'meituan_sync',
          amount,
          description: `美团储值核销${orderNo ? `(${orderNo})` : ''}同步${amount}积分`,
          createdAt: Date.now(),
        }
        set({
          pointsRecords: [...pointsRecords, record],
          totalPoints: totalPoints + amount,
          rechargedPoints: rechargedPoints + amount,
        })
      },

      getWithdrawablePoints: () => {
        const { totalPoints, rechargedPoints } = get()
        return Math.max(0, totalPoints - rechargedPoints)
      },

      withdrawPoints: (amount) => {
        const withdrawable = get().getWithdrawablePoints()
        if (amount > withdrawable) {
          Taro.showToast({ title: '可提现积分不足', icon: 'none' })
          return false
        }
        const { earnedPoints, withdrawRecords } = get()
        const record: WithdrawRecord = { id: `wd_${Date.now()}`, amount, status: 'pending', createdAt: Date.now() }
        set({
          earnedPoints: earnedPoints - amount,
          totalPoints: get().totalPoints - amount,
          withdrawRecords: [...withdrawRecords, record],
        })
        Taro.showToast({ title: '提现申请已提交', icon: 'success' })
        return true
      },

      getPointsLevel: () => {
        const { totalPoints } = get()
        if (totalPoints >= 10000) return 'gold'
        if (totalPoints >= 5000) return 'silver'
        if (totalPoints >= 2000) return 'bronze'
        return 'none'
      },

      getPointsRecords: () => {
        return [...get().pointsRecords].sort((a, b) => b.createdAt - a.createdAt)
      },

      // ========== 代理商方法 ==========

      activateAgent: (level) => {
        if (level === 'none') return
        const config = AGENT_CONFIG[level]
        const now = Date.now()
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let secondaryCode = ''
        if (level === 'gold') {
          const ts = now.toString(36).slice(-4).toUpperCase()
          for (let i = 0; i < 4; i++) secondaryCode += chars.charAt(Math.floor(Math.random() * chars.length))
          secondaryCode = `AG${ts}${secondaryCode}`
        }
        set({
          isAgent: true,
          agentLevel: level,
          agentActivatedAt: now,
          agentExpireAt: now + config.durationMonths * 30 * 86400000,
          agentSecondaryCode: secondaryCode,
          hasStockedUp: false,
          hasUpgradeStockedUp: false,
        })
      },

      upgradeAgent: (rechargeAmount) => {
        const { agentLevel, isAgent, agentTotalSales, agentCommission } = get()
        if (!isAgent || agentLevel === 'none') return
        get().rechargePoints(rechargeAmount, `充值¥${rechargeAmount}升级代理`)
        const newLevel = get().getPointsLevel()
        if (newLevel === agentLevel || newLevel === 'none') {
          Taro.showToast({ title: '积分未达到升级门槛', icon: 'none' })
          return
        }
        get().activateAgent(newLevel)
        set({
          agentTotalSales,
          agentCommission,
          hasUpgradeStockedUp: false,
        })
        const newConfig = AGENT_CONFIG[newLevel]
        Taro.showToast({ title: `恭喜升级为${newConfig.name}！`, icon: 'success' })
      },

      upgradeRestock: () => {
        const { agentLevel, isAgent, hasUpgradeStockedUp, agentInventory } = get()
        if (!isAgent || agentLevel === 'none' || hasUpgradeStockedUp) return
        const config = AGENT_CONFIG[agentLevel]
        if (!config.upgradeRestockAmount) return
        const allocation = DEFAULT_ALLOCATION[agentLevel]
        const newItems: AgentInventoryItem[] = allocation.map(item => ({
          productId: item.productId,
          productName: item.name,
          quantity: Math.ceil(item.qty * 0.5),
          sold: 0,
          price: item.price,
          image: item.img,
        }))
        const merged = [...agentInventory]
        newItems.forEach(newItem => {
          const existing = merged.find(i => i.productId === newItem.productId)
          if (existing) {
            existing.quantity += newItem.quantity
          } else {
            merged.push(newItem)
          }
        })
        set({ agentInventory: merged, hasUpgradeStockedUp: true })
        Taro.showToast({ title: `追加配货完成！¥${config.upgradeRestockAmount}按${config.discount}折`, icon: 'success' })
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

      recordDailySale: (productId, productName, quantity, revenue) => {
        const today = new Date().toISOString().slice(0, 10)
        const { dailySales } = get()
        const existing = dailySales.find(d => d.productId === productId && d.date === today)
        if (existing) {
          const updated = dailySales.map(d => d.productId === productId && d.date === today ? { ...d, quantity: d.quantity + quantity, revenue: d.revenue + revenue } : d)
          set({ dailySales: updated })
        } else {
          set({ dailySales: [...dailySales, { productId, productName, date: today, quantity, revenue }] })
        }
      },

      getDailySalesReport: (date) => {
        const targetDate = date || new Date().toISOString().slice(0, 10)
        return get().dailySales.filter(d => d.date === targetDate)
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
        pointsRecords: state.pointsRecords, totalPoints: state.totalPoints, rechargedPoints: state.rechargedPoints, earnedPoints: state.earnedPoints,
        isAgent: state.isAgent, agentLevel: state.agentLevel, agentActivatedAt: state.agentActivatedAt, agentExpireAt: state.agentExpireAt,
        agentTotalSales: state.agentTotalSales, agentSecondaryCode: state.agentSecondaryCode, agentSecondarySales: state.agentSecondarySales, agentCommission: state.agentCommission,
        agentInventory: state.agentInventory, hasStockedUp: state.hasStockedUp, hasUpgradeStockedUp: state.hasUpgradeStockedUp,
        customerOrders: state.customerOrders, overflowOrders: state.overflowOrders, verifyRecords: state.verifyRecords, dailySales: state.dailySales,
      }),
    }
  )
)
