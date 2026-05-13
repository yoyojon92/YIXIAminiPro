export interface Coupon {
  id: string
  name: string          // 券名称
  type: 'new_user' | 'share' | 'first_order' | 'member_monthly'
  discount: number      // 抵扣金额（元）
  minSpend: number      // 最低消费门槛
  icon: string          // emoji图标
  expireDays: number    // 有效期（天）
  description: string   // 描述文案
  isUsed: boolean       // 是否已使用
}

// 新用户注册券
export const NEW_USER_COUPONS: Coupon[] = [
  { id: 'coupon_new_1', name: '新人尝鲜券', type: 'new_user', discount: 5, minSpend: 20, icon: '🎉', expireDays: 7, description: '新用户注册即领，满20减5', isUsed: false },
]

// 分享券（分享给好友后获得）
export const SHARE_COUPONS: Coupon[] = [
  { id: 'coupon_share_1', name: '分享助力券', type: 'share', discount: 3, minSpend: 15, icon: '🤝', expireDays: 5, description: '分享给好友后获得，满15减3', isUsed: false },
]

// 首单券（完成首单后获得）
export const FIRST_ORDER_COUPONS: Coupon[] = [
  { id: 'coupon_first_1', name: '回头客券', type: 'first_order', discount: 8, minSpend: 30, icon: '🔄', expireDays: 14, description: '首单完成后获得，满30减8', isUsed: false },
]

// 会员月度券（每月自动发放）
export const MEMBER_MONTHLY_COUPONS: Coupon[] = [
  { id: 'coupon_member_1', name: '会员专属券', type: 'member_monthly', discount: 10, minSpend: 50, icon: '👑', expireDays: 30, description: '会员每月领取，满50减10', isUsed: false },
]

// 获取用户所有可用代券
export function getUserCoupons(): Coupon[] {
  return [...NEW_USER_COUPONS, ...SHARE_COUPONS, ...FIRST_ORDER_COUPONS, ...MEMBER_MONTHLY_COUPONS]
    .filter(c => !c.isUsed)
}

// 根据订单金额计算可用代券
export function getAvailableCoupons(totalAmount: number): Coupon[] {
  return getUserCoupons().filter(c => totalAmount >= c.minSpend)
}
