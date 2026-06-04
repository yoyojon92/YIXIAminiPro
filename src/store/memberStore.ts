import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { taroStorage } from './taroStorage'

type MemberLevel = 'trial' | 'founding' // 9.9创始会员

/** 1元小酒票可选商品ID（经典款330ml） */
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
  ticketSelectedWine: string | null // 当月选的经典款酒ID
  showTicketModal: boolean         // 小酒票弹窗

  // 入会赠饮
  welcomeGiftClaimed: boolean      // 是否已领入会赠饮
  welcomeGiftWineId: string | null // 赠饮选的酒ID
  welcomeGiftDeliveryMode: 'pickup' | 'delivery' | null // 赠饮领取方式
  welcomeGiftRedeemCode: string | null // 核销码（自提时）
  welcomeGiftRedeemed: boolean     // 核销码是否已使用
  showWelcomeGiftModal: boolean    // 入会赠饮弹窗

  // 生日礼遇
  birthdayDate: string | null // 格式 'MM-DD'，会员生日
  birthdayUsedYear: string | null // 格式 '2026'，生日折扣已用年份，全年一次

  // 会员信息完善
  profileCompleted: boolean // 是否已完善个人信息（姓名+生日+手机号）
  profileName: string | null
  profilePhone: string | null

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

  // 生日礼遇
  setBirthdayDate: (date: string) => void
  canUseBirthdayDiscount: () => boolean
  useBirthdayDiscount: () => void

  // 会员信息完善
  setProfileCompleted: (name: string, phone: string, birthday: string) => void

  // 入会赠饮
  claimWelcomeGiftWithWine: (wineId: string, mode: 'pickup' | 'delivery') => string | null
  redeemWelcomeGift: () => void
  setShowWelcomeGiftModal: (show: boolean) => void

  // 每周特价
  useWeeklySpecial: () => void
  canUseWeeklySpecial: () => boolean

  isPromoActive: () => boolean
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

/** 9.9创始会员活动截止：2026-06-30 23:59:59 */
const PROMO_END = new Date('2026-06-30T23:59:59').getTime()

/** 创始会员统一到期：2026-12-31 23:59:59 */
const FOUNDING_EXPIRE = new Date('2026-12-31T23:59:59').getTime()

/** 生成核销码：YX + 时间戳36进制后4位 + 随机4位大写字母数字 */
const generateRedeemCode = (): string => {
  const ts = Date.now().toString(36).slice(-4).toUpperCase()
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let rand = ''
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `YX${ts}${rand}`
}

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
      welcomeGiftWineId: null,
      welcomeGiftDeliveryMode: null,
      welcomeGiftRedeemCode: null,
      welcomeGiftRedeemed: false,
      showWelcomeGiftModal: false,

      // 生日礼遇
      birthdayDate: null,
      birthdayUsedYear: null,

      // 会员信息完善
      profileCompleted: false,
      profileName: null,
      profilePhone: null,

      // 每周特价
      weeklySpecialUsed: null,

      setShowMemberModal: (show) => set({ showMemberModal: show }),

      joinMember: () => {
        set({
          isMember: true,
          memberExpire: FOUNDING_EXPIRE,
          memberLevel: 'founding',
          showMemberModal: false,
          // 入会后自动弹出赠饮弹窗
          showWelcomeGiftModal: true,
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
        const { isMember, ticketClaimedMonth, welcomeGiftClaimed } = get()
        if (!isMember) return false
        if (welcomeGiftClaimed) return false // 首单0元和1元小酒票二选一，已领赠饮不可领小酒票
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
      claimWelcomeGiftWithWine: (wineId: string, mode: 'pickup' | 'delivery') => {
        const redeemCode = mode === 'pickup' ? generateRedeemCode() : null
        set({
          welcomeGiftClaimed: true,
          welcomeGiftWineId: wineId,
          welcomeGiftDeliveryMode: mode,
          welcomeGiftRedeemCode: redeemCode,
          ticketClaimedMonth: getCurrentMonth(), // 首单0元和1元小酒票二选一，领赠饮=本月小酒票已用
        })
        return redeemCode
      },

      redeemWelcomeGift: () => {
        set({ welcomeGiftRedeemed: true })
      },

      setShowWelcomeGiftModal: (show) => set({ showWelcomeGiftModal: show }),

      // === 生日礼遇 ===
      setBirthdayDate: (date: string) => set({ birthdayDate: date }),

      canUseBirthdayDiscount: () => {
        const { isMember, birthdayUsedYear, profileCompleted } = get()
        if (!isMember) return false
        if (!profileCompleted) return false
        const year = new Date().getFullYear().toString()
        return birthdayUsedYear !== year
      },

      useBirthdayDiscount: () => {
        const year = new Date().getFullYear().toString()
        set({ birthdayUsedYear: year })
      },

      // === 会员信息完善 ===
      setProfileCompleted: (name: string, phone: string, birthday: string) => {
        set({
          profileCompleted: true,
          profileName: name,
          profilePhone: phone,
          birthdayDate: birthday,
        })
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

      isPromoActive: () => Date.now() < PROMO_END,

      getMemberBenefits: () => {
        const { isMember } = get()
        if (!isMember) {
          return [
            '首单0元送酒 或 1元小酒票（二选一，经典款3选1）',
            '生日全场9折（全年1次，需完善个人信息）',
            '活动期至2026年6月30日',
          ]
        }
        return [
          '首单0元送酒（经典款果酒3选1）',
          '每月1元小酒票（经典款3选1仅¥1）',
          '生日全场9折（全年1次，需完善个人信息）',
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
        welcomeGiftWineId: state.welcomeGiftWineId,
        welcomeGiftDeliveryMode: state.welcomeGiftDeliveryMode,
        welcomeGiftRedeemCode: state.welcomeGiftRedeemCode,
        welcomeGiftRedeemed: state.welcomeGiftRedeemed,
        birthdayDate: state.birthdayDate,
        birthdayUsedYear: state.birthdayUsedYear,
        profileCompleted: state.profileCompleted,
        profileName: state.profileName,
        profilePhone: state.profilePhone,
        weeklySpecialUsed: state.weeklySpecialUsed,
      }),
    }
  )
)
