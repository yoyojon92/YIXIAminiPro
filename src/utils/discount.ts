/**
 * 满减计算工具（所有用户通用）
 * 满30减2 / 满50减6 / 满100减15
 */

export interface DiscountTier {
  threshold: number   // 门槛金额
  discount: number    // 减免金额
  label: string       // 展示文案
}

/** 满减阶梯（从高到低匹配） */
export const DISCOUNT_TIERS: DiscountTier[] = [
  { threshold: 100, discount: 15, label: '满100减15' },
  { threshold: 50, discount: 6, label: '满50减6' },
  { threshold: 30, discount: 2, label: '满30减2' },
]

/**
 * 计算满减优惠
 * @param amount 商品总金额（不含运费）
 * @returns { discount: 减免金额, tier: 匹配的满减阶梯, label: 文案 }
 */
export const calcDiscount = (amount: number): { discount: number; tier: DiscountTier | null; label: string } => {
  for (const tier of DISCOUNT_TIERS) {
    if (amount >= tier.threshold) {
      return { discount: tier.discount, tier, label: tier.label }
    }
  }
  return { discount: 0, tier: null, label: '' }
}

/**
 * 计算距离下一档满减还差多少
 * @param amount 商品总金额
 * @returns { need: 还差金额, tier: 下一档满减, label: 文案 }
 */
export const calcNextDiscount = (amount: number): { need: number; tier: DiscountTier | null; label: string } => {
  // 从低到高找第一个未达标的
  for (let i = DISCOUNT_TIERS.length - 1; i >= 0; i--) {
    if (amount < DISCOUNT_TIERS[i].threshold) {
      return {
        need: DISCOUNT_TIERS[i].threshold - amount,
        tier: DISCOUNT_TIERS[i],
        label: `再买¥${(DISCOUNT_TIERS[i].threshold - amount).toFixed(1)}享${DISCOUNT_TIERS[i].label}`,
      }
    }
  }
  return { need: 0, tier: null, label: '' }
}

/**
 * 1元小酒票是否可在当前订单使用
 * @param deliveryMode 配送模式: 'delivery' | 'pickup' | 'shipping'
 * @param orderAmount 订单金额（不含运费）
 * @returns boolean
 */
export const canUseTicket = (deliveryMode: string, orderAmount: number): boolean => {
  switch (deliveryMode) {
    case 'pickup':
      return true // 自提无门槛
    case 'delivery':
      return orderAmount >= 50 // 同城满50
    case 'shipping':
      return orderAmount >= 30 // 邮寄满30
    default:
      return false
  }
}
