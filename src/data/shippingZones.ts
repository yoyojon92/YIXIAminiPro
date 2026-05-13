export interface ShippingZone {
  id: string
  name: string
  provinces: string[]
  baseFee: number
  perBottleFee: number
  freeShippingThreshold: number
}

export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'zone_shandong',
    name: '山东省内',
    provinces: ['山东省'],
    baseFee: 5,
    perBottleFee: 1,
    freeShippingThreshold: 99,
  },
  {
    id: 'zone_east',
    name: '华东地区',
    provinces: ['江苏省', '浙江省', '上海市', '安徽省', '江西省', '福建省'],
    baseFee: 8,
    perBottleFee: 2,
    freeShippingThreshold: 129,
  },
  {
    id: 'zone_north',
    name: '华北地区',
    provinces: ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区'],
    baseFee: 8,
    perBottleFee: 2,
    freeShippingThreshold: 129,
  },
  {
    id: 'zone_south',
    name: '华南地区',
    provinces: ['广东省', '广西壮族自治区', '海南省'],
    baseFee: 10,
    perBottleFee: 3,
    freeShippingThreshold: 159,
  },
  {
    id: 'zone_central',
    name: '华中地区',
    provinces: ['河南省', '湖北省', '湖南省'],
    baseFee: 10,
    perBottleFee: 3,
    freeShippingThreshold: 159,
  },
  {
    id: 'zone_west',
    name: '西部地区',
    provinces: [
      '四川省',
      '重庆市',
      '贵州省',
      '云南省',
      '西藏自治区',
      '陕西省',
      '甘肃省',
      '青海省',
      '宁夏回族自治区',
      '新疆维吾尔自治区',
    ],
    baseFee: 15,
    perBottleFee: 5,
    freeShippingThreshold: 199,
  },
  {
    id: 'zone_northeast',
    name: '东北地区',
    provinces: ['辽宁省', '吉林省', '黑龙江省'],
    baseFee: 12,
    perBottleFee: 4,
    freeShippingThreshold: 159,
  },
]

export function getZoneByProvince(province: string): ShippingZone | undefined {
  return SHIPPING_ZONES.find((zone) => zone.provinces.includes(province))
}

export function calculateShipping(
  province: string,
  bottleCount: number,
  totalAmount: number
): { zone: ShippingZone | undefined; shippingFee: number; isFreeShipping: boolean } {
  const zone = getZoneByProvince(province)
  if (!zone) return { zone: undefined, shippingFee: 0, isFreeShipping: false }
  const isFree = totalAmount >= zone.freeShippingThreshold
  if (isFree) return { zone, shippingFee: 0, isFreeShipping: true }
  const fee = zone.baseFee + (bottleCount - 1) * zone.perBottleFee
  return { zone, shippingFee: Math.max(fee, 0), isFreeShipping: false }
}
