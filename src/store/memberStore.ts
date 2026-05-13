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
        if (!isMember) {
          return [
            '上传动漫OS作品（解锁创意墙投稿权限）',
            '全场果酒享8.5折（会员价实时计算）',
            '社交拉票权（创意墙作品可发起拉票）',
            '月度冠军评选（专属会员荣誉标识）',
            '每月领3张代金券',
          ]
        }
        return [
          '专属会员价（全场8.5折）',
          '社交拉票权（创意墙作品可发起拉票）',
          '月度冠军评选（专属会员荣誉标识）',
          '每月领3张代金券',
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
