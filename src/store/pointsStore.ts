/**
 * 积分 Store - 完整积分逻辑
 * 功能：积分获取规则、积分消费、积分过期、积分对话
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { taroStorage } from './taroStorage'

// 积分记录接口
export interface PointsRecord {
  id: string
  type: 'earn' | 'spend' | 'expire' | 'gift'
  amount: number
  balance: number
  source: string
  description: string
  createdAt: string
}

// 积分规则接口
export interface PointsRule {
  source: string
  points: number
  description: string
  dailyLimit?: number
}

// 积分兑换项
export interface PointsReward {
  id: string
  name: string
  points: number
  type: 'coupon' | 'gift' | 'product'
  description: string
  image?: string
}

// 预设积分规则
const POINTS_RULES: PointsRule[] = [
  { source: 'order', points: 1, description: '每消费1元获得1积分' },
  { source: 'sign', points: 10, description: '每日签到获得10积分', dailyLimit: 10 },
  { source: 'review', points: 20, description: '评价商品获得20积分', dailyLimit: 60 },
  { source: 'share', points: 5, description: '分享商品获得5积分', dailyLimit: 15 },
  { source: 'invite', points: 100, description: '邀请新用户获得100积分' },
  { source: 'birthday', points: 200, description: '生日当天获得200积分' }
]

// 积分兑换商品
const POINTS_REWARDS: PointsReward[] = [
  { id: 'reward_1', name: '满20减5优惠券', points: 100, type: 'coupon', description: '订单满20元可用' },
  { id: 'reward_2', name: '满50减15优惠券', points: 250, type: 'coupon', description: '订单满50元可用' },
  { id: 'reward_3', name: '精美果酒杯', points: 500, type: 'gift', description: '邑夏定制玻璃酒杯' },
  { id: 'reward_4', name: '桃你欢心果酒', points: 800, type: 'product', description: '330ml 蜜桃果酒一瓶' }
]

interface PointsState {
  balance: number
  totalEarned: number
  totalSpent: number
  expiringSoon: number
  records: PointsRecord[]
  rules: PointsRule[]
  rewards: PointsReward[]
  
  // 积分操作
  addPoints: (amount: number, source: string, description: string) => void
  spendPoints: (amount: number, source: string, description: string) => boolean
  expirePoints: (amount: number) => void
  loadRecords: () => void
  
  // 积分规则
  getPointsForOrder: (orderAmount: number) => number
  getRule: (source: string) => PointsRule | undefined
  getAvailableRewards: () => PointsReward[]
  canRedeem: (rewardId: string) => boolean
  redeem: (rewardId: string) => boolean
  
  // 积分对话
  chat: (message: string) => string
}

// 积分对话规则库
const CHAT_RESPONSES: Record<string, string> = {
  '积分怎么获得': '您可以通过以下方式获得积分：\n1. 每消费1元获得1积分\n2. 每日签到获得10积分\n3. 评价商品获得20积分\n4. 分享商品获得5积分\n5. 邀请新用户获得100积分',
  '积分能换什么': '积分可以兑换：\n• 100积分 → 满20减5优惠券\n• 250积分 → 满50减15优惠券\n• 500积分 → 精美果酒杯\n• 800积分 → 桃你欢心果酒',
  '积分会过期吗': '积分有效期为1年，每年12月31日会自动清理上年获得的积分，请及时使用哦~',
  '签到': '签到成功！恭喜您获得10积分！',
  '我的积分': '您当前有 {balance} 积分，累计获得 {totalEarned} 积分，已使用 {totalSpent} 积分。'
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      balance: 2580,
      totalEarned: 5280,
      totalSpent: 2700,
      expiringSoon: 120,
      records: [],
      rules: POINTS_RULES,
      rewards: POINTS_REWARDS,

      // 增加积分
      addPoints: (amount, source, description) => set((state) => {
        const newBalance = state.balance + amount
        const record: PointsRecord = {
          id: `pr_${Date.now()}`,
          type: 'earn',
          amount,
          balance: newBalance,
          source,
          description,
          createdAt: new Date().toLocaleString('zh-CN')
        }
        return {
          balance: newBalance,
          totalEarned: state.totalEarned + amount,
          records: [record, ...state.records]
        }
      }),

      // 消费积分
      spendPoints: (amount, source, description) => {
        const state = get()
        if (state.balance < amount) {
          Taro.showToast({ title: '积分不足', icon: 'none' })
          return false
        }
        const newBalance = state.balance - amount
        const record: PointsRecord = {
          id: `pr_${Date.now()}`,
          type: 'spend',
          amount,
          balance: newBalance,
          source,
          description,
          createdAt: new Date().toLocaleString('zh-CN')
        }
        set({
          balance: newBalance,
          totalSpent: state.totalSpent + amount,
          records: [record, ...state.records]
        })
        return true
      },

      // 积分过期
      expirePoints: (amount) => set((state) => {
        const newBalance = state.balance - amount
        const record: PointsRecord = {
          id: `pr_${Date.now()}`,
          type: 'expire',
          amount,
          balance: newBalance,
          source: 'expire',
          description: '积分过期',
          createdAt: new Date().toLocaleString('zh-CN')
        }
        return {
          balance: newBalance,
          expiringSoon: 0,
          records: [record, ...state.records]
        }
      }),

      // 加载记录
      loadRecords: () => set({
        records: [
          {
            id: 'pr_1',
            type: 'earn',
            amount: 100,
            balance: 2580,
            source: 'order',
            description: '购买商品获得积分',
            createdAt: '2025-01-15 10:30:00'
          },
          {
            id: 'pr_2',
            type: 'spend',
            amount: 200,
            balance: 2480,
            source: 'redeem',
            description: '兑换优惠券',
            createdAt: '2025-01-14 15:20:00'
          },
          {
            id: 'pr_3',
            type: 'earn',
            amount: 10,
            balance: 2680,
            source: 'sign',
            description: '每日签到',
            createdAt: '2025-01-14 08:00:00'
          },
          {
            id: 'pr_4',
            type: 'earn',
            amount: 50,
            balance: 2690,
            source: 'order',
            description: '购买桃你欢心果酒',
            createdAt: '2025-01-13 16:45:00'
          },
          {
            id: 'pr_5',
            type: 'gift',
            amount: 100,
            balance: 2640,
            source: 'invite',
            description: '邀请新用户注册',
            createdAt: '2025-01-12 09:20:00'
          }
        ]
      }),

      // 计算订单积分
      getPointsForOrder: (orderAmount) => {
        return Math.floor(orderAmount) // 每消费1元获得1积分
      },

      // 获取积分规则
      getRule: (source) => {
        return get().rules.find(r => r.source === source)
      },

      // 获取可兑换奖励
      getAvailableRewards: () => {
        return get().rewards
      },

      // 判断是否可兑换
      canRedeem: (rewardId) => {
        const state = get()
        const reward = state.rewards.find(r => r.id === rewardId)
        if (!reward) return false
        return state.balance >= reward.points
      },

      // 兑换奖励
      redeem: (rewardId) => {
        const state = get()
        const reward = state.rewards.find(r => r.id === rewardId)
        if (!reward) return false
        return get().spendPoints(reward.points, 'redeem', `兑换${reward.name}`)
      },

      // 积分对话
      chat: (message) => {
        const state = get()
        const lowerMessage = message.toLowerCase()
        
        // 匹配规则库
        for (const [key, response] of Object.entries(CHAT_RESPONSES)) {
          if (lowerMessage.includes(key)) {
            return response
              .replace('{balance}', String(state.balance))
              .replace('{totalEarned}', String(state.totalEarned))
              .replace('{totalSpent}', String(state.totalSpent))
          }
        }
        
        // 默认回复
        if (lowerMessage.includes('积分')) {
          return `您当前有 ${state.balance} 积分。您可以问："积分怎么获得"、"积分能换什么"、"积分会过期吗"等。`
        }
        
        return '我是积分小助手，可以帮您解答积分相关问题。您可以问：积分怎么获得？积分能换什么？积分会过期吗？'
      }
    }),
    {
      name: 'yixia-points-storage',
      storage: taroStorage,
      partialize: (state) => ({
        balance: state.balance,
        totalEarned: state.totalEarned,
        totalSpent: state.totalSpent,
        expiringSoon: state.expiringSoon,
        records: state.records
      })
    }
  )
)
