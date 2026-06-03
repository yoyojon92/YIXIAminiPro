import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { taroStorage } from './taroStorage'

type MemberLevel = 'trial' | 'founding' // 9.9创始会员

/** 1元小酒票可选商品ID（老款330ml） */
export const TICKET_WINE_IDS = [
  'prod_hawthorn_old',      // 沂蒙山楂酒
  'prod_hawthorn_oolong_old', // 山楂乌龙酒
  'prod_pomelo_old',        // 柚子酒
] as const

export const TICKET_WINE_NAMES: Record<string, string> = {
  'prod_hawthorn_old': '沂蒙山楂酒',
  'prod_hawthorn_oolong_old': '山楂乌龙酒',
  'prod_pomelo_old': '柚子酒',
}

interface MemberState {
  isMember: boolean
  memberExpire: number | null // 过期时间戳（毫秒）创始会员统一到2026-12-31
  memberLevel: MemberLevel
  showMemberModal: boolean

  // 1元小酒票
  ticketClaimedMonth: string | null // 格式 '2026-06'，当月已领
  ticketSelectedWine: string | null // 当月选的老款酒ID
  showTicketModal: boolean         // 小酒票弹窗

  // 入会赠饮
  welcomeGiftClaimed: boolean // 是否已领入会赠饮

  // 生日礼遇
  birthdayDate: string | null // 格式 'MM-DD'，会员生日

  // 每周特价
  weeklySpecialUsed: string | null // 本周特价已用日期 '2026-W23'

  // Actions
  joinMember: () => void
  renewMember: () => void
  expireMember: () => void
  setShowMemberModal: (show: boolean) => void

  // 小酒票
  claimTicket: (wineId: string) => void
  canClaimTicket: () => boolean
  setShowTicketModal: (show: boolean) => void

  // 入会赠饮
  claimWelcomeGift: () => void

  // 每周特价
  useWeeklySpecial: () => void
  canUseWeeklySpecial: () => boolean

  getMemberBenefits: () => string[]
  getRemainingDays: () => number
}

/** 当前年月字符串，如 '2026-06' */
const getCurrentMonth = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** 当前周标识，如 '2026-W23' */
const getCurrentWeek = () => {
  const d = new Date()
  const start = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${week}`
}

/** 创始会员统一到期：2026-12-31 23:59:59 */
const FOUNDING_EXPIRE = new Date('2026-12-31T23:59:59').getTime()

export const useMemberStore = create<MemberState>()(
  persist(
    (set, get) => ({
      isMember: false,
      memberExpire: null,
      memberLevel: 'trial',
      showMemberModal: false,

      // 小酒票
      ticketClaimedMonth: null,
      ticketSelectedWine: null,
      showTicketModal: false,

      // 入会赠饮
      welcomeGiftClaimed: false,

      // 生日礼遇
      birthdayDate: null,

      // 每周特价
      weeklySpecialUsed: null,

      setShowMemberModal: (show) => set({ showMemberModal: show }),

      joinMember: () => {
        set({
          isMember: true,
          memberExpire: FOUNDING_EXPIRE,
          memberLevel: 'founding',
          showMemberModal: false,
        })
        Taro.showToast({ title: '9.9创始会员开通成功！', icon: 'success' })
      },

      renewMember: () => {
        // 创始会员暂不支持续费，到期后可再购
        Taro.showToast({ title: '创始会员无需续费', icon: 'none' })
      },

      expireMember: () => {
        set({ isMember: false, memberExpire: null, memberLevel: 'trial', ticketClaimedMonth: null, ticketSelectedWine: null })
      },

      // === 1元小酒票 ===
      canClaimTicket: () => {
        const { isMember, ticketClaimedMonth } = get()
        if (!isMember) return false
        return ticketClaimedMonth !== getCurrentMonth()
      },

      claimTicket: (wineId: string) => {
        set({
          ticketClaimedMonth: getCurrentMonth(),
          ticketSelectedWine: wineId,
          showTicketModal: false,
        })
        Taro.showToast({ title: '1元小酒票领取成功！', icon: 'success' })
      },

      setShowTicketModal: (show) => set({ showTicketModal: show }),

      // === 入会赠饮 ===
      claimWelcomeGift: () => {
        set({ welcomeGiftClaimed: true })
        Taro.showToast({ title: '入会赠饮已领取！', icon: 'success' })
      },

      // === 每周特价 ===
      canUseWeeklySpecial: () => {
        const { isMember, weeklySpecialUsed } = get()
        if (!isMember) return false
        return weeklySpecialUsed !== getCurrentWeek()
      },

      useWeeklySpecial: () => {
        set({ weeklySpecialUsed: getCurrentWeek() })
      },

      getMemberBenefits: () => {
        const { isMember } = get()
        if (!isMember) {
          return [
            '入会赠饮1瓶（老款果酒随机）',
            '每月1元小酒票（3种老款酒3选1）',
            '每周特价¥9.9（老款果酒）',
            '生日礼遇（生日当天全场9折）',
          ]
        }
        return [
          '每月1元小酒票（老款酒3选1）',
          '每周特价¥9.9（老款果酒）',
          '入会赠饮1瓶',
          '生日礼遇（生日当天全场9折）',
        ]
      },

      getRemainingDays: () => {
        const { memberExpire, isMember } = get()
        if (!isMember || !memberExpire) return 0
        const remaining = memberExpire - Date.now()
        return remaining > 0 ? Math.ceil(remaining / 86400000) : 0
      },
    }),
    {
      name: 'member-store',
      storage: taroStorage,
      partialize: (state) => ({
        isMember: state.isMember,
        memberExpire: state.memberExpire,
        memberLevel: state.memberLevel,
        ticketClaimedMonth: state.ticketClaimedMonth,
        ticketSelectedWine: state.ticketSelectedWine,
        welcomeGiftClaimed: state.welcomeGiftClaimed,
        birthdayDate: state.birthdayDate,
        weeklySpecialUsed: state.weeklySpecialUsed,
      }),
    }
  )
)
