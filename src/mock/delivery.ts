/**
 * 配送与自提数据
 */

// 自提点数据
export interface PickupPoint {
  id: string
  name: string
  address: string
  distance: string       // 距离，如"500m"
  businessHours: string  // 营业时间
  isNearest?: boolean    // 是否最近
  tag?: string           // 标签，如"推荐"
}

// 配送方式
export type DeliveryMode = 'delivery' | 'pickup' | 'shipping'

// 自提点列表（可扩展，后续对接真实数据）
export const PICKUP_POINTS: PickupPoint[] = [
  {
    id: 'pickup_001',
    name: '公司展销店',
    address: '青岛农业大学南门邑夏展销中心',
    distance: '200m',
    businessHours: '09:00-21:00',
    isNearest: true,
    tag: '推荐'
  },
  {
    id: 'pickup_002',
    name: '1号超市',
    address: '校园东区1号超市',
    distance: '350m',
    businessHours: '08:00-22:00',
  },
  {
    id: 'pickup_003',
    name: '2号超市',
    address: '校园西区2号超市',
    distance: '600m',
    businessHours: '08:00-22:00',
  }
]

// 配送费规则
export const DELIVERY_RULES = {
  // 校内配送：2瓶起送，起送费2元，每增1瓶+1元
  minBottles: 2,
  baseFee: 2,
  perBottleFee: 1,
  deliveryDesc: '校内2瓶起送，配送费2元起',
}

// 厂家邮寄运费规则（京东快递）
export const SHIPPING_RULES = {
  // 省内：首重1kg¥12/续重¥4；省外：首重1kg¥18/续重¥6
  inProvince: { firstKg: 12, extraKg: 4 },
  outProvince: { firstKg: 18, extraKg: 6 },
  // 618活动价：省内1kg¥8.9/3kg¥9.9/5kg¥11.9
  promo618: {
    inProvince: [
      { maxKg: 1, fee: 8.9 },
      { maxKg: 3, fee: 9.9 },
      { maxKg: 5, fee: 11.9 },
    ]
  },
  shippingDesc: '厂家直发·京东快递',
}

/**
 * 计算校内配送费
 */
export const calcDeliveryFee = (bottleCount: number): number => {
  if (bottleCount < DELIVERY_RULES.minBottles) return -1
  return DELIVERY_RULES.baseFee + (bottleCount - DELIVERY_RULES.minBottles) * DELIVERY_RULES.perBottleFee
}

/**
 * 计算厂家邮寄运费
 * @param weightKg 重量(kg)
 * @param inProvince 是否省内
 * @param usePromo 是否使用618活动价
 */
export const calcShippingFee = (weightKg: number, inProvince: boolean, usePromo: boolean = false): number => {
  if (usePromo) {
    const promoTiers = SHIPPING_RULES.promo618.inProvince
    for (const tier of promoTiers) {
      if (weightKg <= tier.maxKg) return tier.fee
    }
    // 超出活动档位，按普通续重算
    const rules = inProvince ? SHIPPING_RULES.inProvince : SHIPPING_RULES.outProvince
    return rules.firstKg + Math.ceil(weightKg - 1) * rules.extraKg
  }
  const rules = inProvince ? SHIPPING_RULES.inProvince : SHIPPING_RULES.outProvince
  return rules.firstKg + Math.ceil(weightKg - 1) * rules.extraKg
}
