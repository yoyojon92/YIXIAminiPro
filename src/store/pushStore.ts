import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import type { PushMessage, PushScenario } from '@/engine/pushRules'
import { generatePushMessage, shouldPush } from '@/engine/pushRules'
import type { TagId } from '@/data/userTags'

// 通知消息（扩展自 PushMessage）
export interface Notification extends PushMessage {
  id: string
  isRead: boolean
  timestamp: number
  icon?: string
}

interface PushState {
  // 推送消息列表
  messages: Notification[]
  // 未读消息数
  unreadCount: number
  // 消息开关
  pushEnabled: boolean
  // 最后推送时间
  lastPushTime: number | null
  
  // Actions
  addMessage: (message: Notification) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearMessages: () => void
  setPushEnabled: (enabled: boolean) => void
  checkAndGeneratePushes: (tags: TagId[], behaviorData: Record<string, any>) => void
  
  // 推送触发器
  triggerPush: (
    tags: TagId[],
    scenario: PushScenario,
    behaviorData?: Record<string, any>
  ) => PushMessage | null
}

// 模拟推送（实际项目中会调用微信订阅消息API）
export const usePushStore = create<PushState>()(
  persist(
    (set, get) => ({
      messages: [],
      unreadCount: 0,
      pushEnabled: true,
      lastPushTime: null,
      
      addMessage: (message: Notification) => {
        const id = message.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const notification: Notification = { ...message, id, isRead: false, timestamp: Date.now() }
        set((state) => ({
          messages: [notification, ...state.messages].slice(0, 50),
          unreadCount: state.unreadCount + 1,
          lastPushTime: Date.now(),
        }))
        
        // 显示本地通知
        if (get().pushEnabled) {
          Taro.showToast({
            title: message.title,
            icon: 'none',
            duration: 2000,
          })
        }
      },
      
      markAsRead: (_index: string) => {
        set((state) => ({
          messages: state.messages.map(m => m.id === _index ? { ...m, isRead: true } : m),
          unreadCount: Math.max(0, state.unreadCount - (state.messages.find(m => m.id === _index)?.isRead ? 0 : 1)),
        }))
      },
      
      markAllAsRead: () => {
        set((state) => ({
          messages: state.messages.map(m => ({ ...m, isRead: true })),
          unreadCount: 0,
        }))
      },
      
      clearMessages: () => {
        set({ messages: [], unreadCount: 0 })
      },
      
      setPushEnabled: (enabled) => {
        set({ pushEnabled: enabled })
      },
      
      checkAndGeneratePushes: (tags, behaviorData) => {
        const state = get()
        if (!state.pushEnabled) return
        
        // 检查各种推送场景
        const scenarios: Array<{ scenario: PushScenario; data: Record<string, any> }> = []
        
        // 会员权益提醒
        if (tags.includes('member')) {
          scenarios.push({ scenario: 'member_benefit_reminder', data: {} })
        }
        
        // 会员即将到期
        if (tags.includes('member') && behaviorData.memberDaysLeft <= 7) {
          scenarios.push({ scenario: 'member_expiring_soon', data: { daysLeft: behaviorData.memberDaysLeft } })
        }
        
        // 代券即将过期
        if (behaviorData.couponCount > 0) {
          scenarios.push({ scenario: 'coupon_expire_warning', data: behaviorData })
        }
        
        // 复购提醒
        if (behaviorData.lastPurchaseDays >= 7) {
          scenarios.push({ scenario: 'repurchase_suggestion', data: { daysSince: behaviorData.lastPurchaseDays } })
        }
        
        // UGC投票提醒
        if (tags.includes('voter') || tags.includes('content_creator')) {
          scenarios.push({ scenario: 'ugc_vote_reminder', data: { isVoter: tags.includes('voter') } })
        }
        
        // 生成并添加消息
        scenarios.forEach(({ scenario, data }) => {
          const message = generatePushMessage(tags, scenario, data)
          if (message && shouldPush(tags, scenario, data)) {
            state.addMessage(message as Notification)
          }
        })
      },
      
      triggerPush: (tags, scenario, behaviorData) => {
        const state = get()
        
        // 检查推送开关
        if (!state.pushEnabled) return null
        
        // 检查是否应该推送
        if (!shouldPush(tags, scenario, behaviorData || {})) return null
        
        // 生成推送消息
        const message = generatePushMessage(tags, scenario, behaviorData || {})
        if (!message) return null
        
        // 添加消息
        state.addMessage({
          ...message,
          id: `push_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          timestamp: Date.now(),
          isRead: false,
        })
        
        return message
      },
    }),
    { name: 'push-store' }
  )
)

// 便捷的推送触发函数
export function triggerMemberBenefitReminder(tags: TagId[]) {
  const store = usePushStore.getState()
  return store.triggerPush(tags, 'member_benefit_reminder', {})
}

export function triggerCouponExpireWarning(tags: TagId[], couponName: string, daysLeft: number) {
  const store = usePushStore.getState()
  return store.triggerPush(tags, 'coupon_expire_warning', { couponName, daysLeft })
}

export function triggerNewProductMatch(tags: TagId[]) {
  const store = usePushStore.getState()
  return store.triggerPush(tags, 'new_product_match', {})
}

export function triggerUGCVoteReminder(tags: TagId[], isVoter: boolean) {
  const store = usePushStore.getState()
  return store.triggerPush(tags, 'ugc_vote_reminder', { isVoter })
}

export function triggerRankingChange(tags: TagId[], workTitle: string, rank: number, votesNeeded: number) {
  const store = usePushStore.getState()
  return store.triggerPush(tags, 'ranking_change', { workTitle, rank, votesNeeded })
}

export function triggerRepurchaseSuggestion(tags: TagId[], daysSince: number) {
  const store = usePushStore.getState()
  return store.triggerPush(tags, 'repurchase_suggestion', { daysSince })
}

export function triggerFlashSaleNotify(tags: TagId[]) {
  const store = usePushStore.getState()
  return store.triggerPush(tags, 'flash_sale_notify', {})
}

export function triggerMemberExpiringSoon(tags: TagId[], daysLeft: number) {
  const store = usePushStore.getState()
  return store.triggerPush(tags, 'member_expiring_soon', { daysLeft })
}
