import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'

type MemberLevel = 'trial' | 'monthly' | 'annual'

interface MemberState {
  isMember: boolean
  memberExpire: number | null // 过期时间戳（毫秒）
  memberLevel: MemberLevel
  showMemberModal: boolean
  
  // Actions
  joinMember: (level: 'monthly' | 'annual') => void
  renewMember: () => void
  expireMember: () => void
  setShowMemberModal: (show: boolean) => void
  getMemberBenefits: () => string[]
  getRemainingDays: () => number
}

export const useMemberStore = create<MemberState>()(
  persist(
    (set, get) => ({
      isMember: false,
      memberExpire: null,
      memberLevel: 'trial',
      showMemberModal: false,
      
      setShowMemberModal: (show) => set({ showMemberModal: show }),
      
      joinMember: (level) => {
        const now = Date.now()
        const expire = level === 'monthly' ? now + 30 * 86400000 : now + 365 * 86400000
        set({ 
          isMember: true, 
          memberExpire: expire, 
          memberLevel: level,
          showMemberModal: false 
        })
        Taro.showToast({ title: '会员开通成功！', icon: 'success' })
      },
      
      renewMember: () => {
        const { memberExpire, memberLevel } = get()
        const base = memberExpire && memberExpire > Date.now() ? memberExpire : Date.now()
        const addDays = memberLevel === 'annual' ? 365 : 30
        set({ memberExpire: base + addDays * 86400000 })
        Taro.showToast({ title: '续费成功！', icon: 'success' })
      },
      
      expireMember: () => {
        set({ isMember: false, memberExpire: null, memberLevel: 'trial' })
      },

      getMemberBenefits: () => {
        const { isMember } = get()
        const baseBenefits = [
          '专属会员价（全场9.5折）',
          '每月1张5元代金券',
          '新品优先体验资格',
        ]
        if (!isMember) {
          return baseBenefits
        }
        return [
          '专属会员价（全场9折）',
          '每月2张10元代金券',
          '新品优先体验资格',
          '专属客服通道',
          '生日专属礼包',
        ]
      },

      getRemainingDays: () => {
        const { memberExpire, isMember } = get()
        if (!isMember || !memberExpire) return 0
        const remaining = memberExpire - Date.now()
        return remaining > 0 ? Math.ceil(remaining / 86400000) : 0
      },
    }),
    { name: 'member-store' }
  )
)
