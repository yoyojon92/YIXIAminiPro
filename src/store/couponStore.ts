import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import type { Coupon } from '@/data/coupons'
import { NEW_USER_COUPONS, MEMBER_MONTHLY_COUPONS } from '@/data/coupons'

interface CouponState {
  // 用户拥有的代券列表
  coupons: Coupon[]
  
  // 当前选中的代券
  selectedCoupon: Coupon | null
  
  // Actions
  selectCoupon: (couponId: string) => void
  useCoupon: (couponId: string) => void
  addCoupon: (coupon: Coupon) => void
  checkNewUserCoupon: () => void
  clearUsedCoupons: () => void
  getAvailableCoupons: (totalAmount: number) => Coupon[]
  getUnusedCoupons: () => Coupon[]
  getUsedCoupons: () => Coupon[]
  getExpiredCoupons: () => Coupon[]
}

// 埋点上报
const trackEvent = (data: Record<string, unknown>) => {
  console.log('[埋点]', JSON.stringify(data))
  // 实际项目中可以上报到分析平台
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      coupons: [],
      selectedCoupon: null,
      
      // 选中代券
      selectCoupon: (couponId) => {
        const { coupons } = get()
        const coupon = coupons.find(c => c.id === couponId)
        set({ selectedCoupon: coupon || null })
        
        if (coupon) {
          trackEvent({
            action: 'coupon_select',
            couponId: coupon.id,
            couponType: coupon.type,
            timestamp: Date.now()
          })
        }
      },
      
      // 使用代券
      useCoupon: (couponId) => {
        const { coupons, selectedCoupon } = get()
        set({
          coupons: coupons.map(c => 
            c.id === couponId ? { ...c, isUsed: true } : c
          ),
          selectedCoupon: selectedCoupon?.id === couponId ? null : selectedCoupon
        })
        
        const coupon = coupons.find(c => c.id === couponId)
        if (coupon) {
          trackEvent({
            userId: 'current_user', // 实际项目从用户系统获取
            couponId: coupon.id,
            discount: coupon.discount,
            action: 'coupon_use',
            timestamp: Date.now()
          })
        }
      },
      
      // 添加新券
      addCoupon: (coupon) => {
        const { coupons } = get()
        // 避免重复添加
        if (!coupons.find(c => c.id === coupon.id)) {
          set({ coupons: [...coupons, coupon] })
          
          trackEvent({
            userId: 'current_user',
            couponId: coupon.id,
            couponType: coupon.type,
            action: 'coupon_receive',
            timestamp: Date.now()
          })
        }
      },
      
      // 新用户自动发券
      checkNewUserCoupon: () => {
        const { coupons } = get()
        // 如果用户没有任何券，视为新用户，发放新人券
        if (coupons.length === 0) {
          NEW_USER_COUPONS.forEach(coupon => {
            get().addCoupon({ ...coupon })
          })
          Taro.showToast({ title: '获得新人优惠券！', icon: 'success' })
        }
      },
      
      // 清理已使用券
      clearUsedCoupons: () => {
        const { coupons } = get()
        set({ coupons: coupons.filter(c => !c.isUsed) })
      },
      
      // 获取可用代券（根据订单金额）
      getAvailableCoupons: (totalAmount) => {
        const { coupons } = get()
        return coupons.filter(c => !c.isUsed && totalAmount >= c.minSpend)
      },
      
      // 获取未使用代券
      getUnusedCoupons: () => {
        const { coupons } = get()
        return coupons.filter(c => !c.isUsed)
      },
      
      // 获取已使用代券
      getUsedCoupons: () => {
        const { coupons } = get()
        return coupons.filter(c => c.isUsed)
      },
      
      // 获取已过期代券
      getExpiredCoupons: () => {
        const { coupons } = get()
        return coupons.filter(c => !c.isUsed && (Date.now() - (c as any).receivedAt > c.expireDays * 86400000))
      },
      
      // 发放会员月度券
      grantMemberMonthlyCoupon: () => {
        MEMBER_MONTHLY_COUPONS.forEach(coupon => {
          get().addCoupon({ 
            ...coupon, 
            id: `${coupon.id}_${Date.now()}`,
            receivedAt: Date.now()
          } as any)
        })
      }
    }),
    { name: 'coupon-store' }
  )
)

// 会员开通埋点
export const trackMemberJoin = (level: 'monthly' | 'annual', price: number) => {
  trackEvent({
    userId: 'current_user',
    action: 'member_join',
    level,
    price,
    timestamp: Date.now()
  })
}

// 会员弹窗查看埋点
export const trackMemberModalView = () => {
  trackEvent({
    userId: 'current_user',
    action: 'member_modal_view',
    timestamp: Date.now()
  })
}
