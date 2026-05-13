import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import type { PushMessage, PushScenario } from '@/engine/pushRules'
import { generatePushMessage, shouldPush } from '@/engine/pushRules'
import type { TagId } from '@/data/userTags'

interface PushState {
  // 推送消息列表
  messages: PushMessage[]
  // 未读消息数
  unreadCount: number
  // 消息开关
  pushEnabled: boolean
  // 最后推送时间
  lastPushTime: number | null
  
  // Actions
  addMessage: (message: PushMessage) => void
  markAsRead: (index: number) => void
  markAllAsRead: () => void
  clearMessages: () => void
  setPushEnabled: (enabled: boolean) => void
  
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
      
      addMessage: (message) => {
        set((state) => ({
          messages: [message, ...state.messages].slice(0, 50), // 最多保留50条
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
      
      markAsRead: (_index) => {
        set((state) => ({
          unreadCount: Math.max(0, state.unreadCount - 1),
        }))
      },
      
      markAllAsRead: () => {
        set({ unreadCount: 0 })
      },
      
      clearMessages: () => {
        set({ messages: [], unreadCount: 0 })
      },
      
      setPushEnabled: (enabled) => {
        set({ pushEnabled: enabled })
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
        state.addMessage(message)
        
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
