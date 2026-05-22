/**
 * 配送费/快递费计算
 * 校内配送：2瓶起送，起送费2元，每增加1瓶加1元
 * 京东快递：省内首重1kg¥12续重¥4/kg，省外首重1kg¥18续重¥6/kg
 */
import { create } from 'zustand'

export function calcCampusDeliveryFee(bottleCount: number): { fee: number; canDeliver: boolean } {
  if (bottleCount < 2) return { fee: 0, canDeliver: false }
  return { fee: 2 + (bottleCount - 2) * 1, canDeliver: true }
}

export const PRODUCT_WEIGHT: Record<string, number> = {
  '330ml': 0.45,
  '500ml': 0.65,
  'gift_2': 1.1,
  'gift_4': 2.0,
}

export type JDExpressZone = 'same_province' | 'cross_province'

export function calcJDExpressFee(totalWeightKg: number, zone: JDExpressZone = 'same_province'): number {
  if (zone === 'same_province') {
    if (totalWeightKg <= 1) return 12
    return 12 + Math.ceil(totalWeightKg - 1) * 4
  } else {
    if (totalWeightKg <= 1) return 18
    return 18 + Math.ceil(totalWeightKg - 1) * 6
  }
}

export type DeliveryMode = 'campus' | 'jd_express'

export interface DeliveryOption {
  mode: DeliveryMode
  label: string
  description: string
  fee: number
  canDeliver: boolean
  estimatedTime: string
}

interface DeliveryState {
  calcDeliveryOptions: (bottleCount: number, totalWeightKg: number, isSameProvince: boolean) => DeliveryOption[]
  calcTotalWeight: (items: Array<{ capacity: string; quantity: number }>) => number
}

export const useDeliveryStore = create<DeliveryState>()(() => ({
  calcDeliveryOptions: (bottleCount, totalWeightKg, isSameProvince) => {
    const options: DeliveryOption[] = []
    const campusResult = calcCampusDeliveryFee(bottleCount)
    options.push({
      mode: 'campus',
      label: '校内配送',
      description: campusResult.canDeliver ? `跑腿员送酒到校内，${bottleCount}瓶` : '2瓶起送',
      fee: campusResult.fee,
      canDeliver: campusResult.canDeliver,
      estimatedTime: '约30分钟'
    })
    const jdFeeSame = calcJDExpressFee(totalWeightKg, 'same_province')
    options.push({
      mode: 'jd_express',
      label: '京东快递（省内）',
      description: `预计${totalWeightKg.toFixed(1)}kg，次日达`,
      fee: jdFeeSame,
      canDeliver: true,
      estimatedTime: '次日达'
    })
    if (!isSameProvince) {
      const jdFeeCross = calcJDExpressFee(totalWeightKg, 'cross_province')
      options.push({
        mode: 'jd_express',
        label: '京东快递（省外）',
        description: `预计${totalWeightKg.toFixed(1)}kg，2-3天`,
        fee: jdFeeCross,
        canDeliver: true,
        estimatedTime: '2-3天'
      })
    }
    return options
  },
  calcTotalWeight: (items) => {
    return items.reduce((total, item) => {
      const unitWeight = PRODUCT_WEIGHT[item.capacity] || 0.5
      return total + unitWeight * item.quantity
    }, 0)
  }
}))
