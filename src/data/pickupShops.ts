// 自提点数据
export interface PickupShop {
  id: string
  name: string
  address: string
  city: string
  district: string
  phone: string
  hours: string
  latitude: number
  longitude: number
}

export const PICKUP_SHOPS: PickupShop[] = [
  {
    id: 'shop_001',
    name: '邑夏校园驿站（南门）',
    address: '青岛市城阳区长城路700号 青岛农业大学南门东侧',
    city: '青岛市',
    district: '城阳区',
    phone: '138-0000-0001',
    hours: '08:00-22:00',
    latitude: 36.3063,
    longitude: 120.3918,
  },
  {
    id: 'shop_002',
    name: '邑夏校园驿站（北门）',
    address: '青岛市城阳区长城路700号 青岛农业大学北门西侧',
    city: '青岛市',
    district: '城阳区',
    phone: '138-0000-0002',
    hours: '08:00-22:00',
    latitude: 36.3098,
    longitude: 120.3918,
  },
  {
    id: 'shop_003',
    name: '邑夏社区店（宝龙广场）',
    address: '青岛市城阳区文阳路677号宝龙城市广场B1层',
    city: '青岛市',
    district: '城阳区',
    phone: '138-0000-0003',
    hours: '10:00-22:00',
    latitude: 36.3112,
    longitude: 120.3988,
  },
  {
    id: 'shop_004',
    name: '邑夏社区店（利群商厦）',
    address: '青岛市城阳区正阳中路157号利群商厦1楼',
    city: '青岛市',
    district: '城阳区',
    phone: '138-0000-0004',
    hours: '09:30-21:30',
    latitude: 36.3075,
    longitude: 120.3956,
  },
]

export function getShopsByDistrict(district: string): PickupShop[] {
  return PICKUP_SHOPS.filter(s => s.district === district)
}

export function getShopById(id: string): PickupShop | undefined {
  return PICKUP_SHOPS.find(s => s.id === id)
}
