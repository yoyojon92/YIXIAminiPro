// 宿舍地址数据
export interface DormitoryZone {
  id: string
  name: string
  buildings: string[]
  deliveryFee: number
  estimatedMinutes: number
}

export const DORMITORY_ZONES: DormitoryZone[] = [
  {
    id: 'zone_001',
    name: '南苑生活区',
    buildings: ['1号楼', '2号楼', '3号楼', '4号楼', '5号楼', '6号楼'],
    deliveryFee: 1,
    estimatedMinutes: 15,
  },
  {
    id: 'zone_002',
    name: '北苑生活区',
    buildings: ['7号楼', '8号楼', '9号楼', '10号楼', '11号楼'],
    deliveryFee: 1,
    estimatedMinutes: 20,
  },
  {
    id: 'zone_003',
    name: '西苑生活区',
    buildings: ['12号楼', '13号楼', '14号楼', '15号楼'],
    deliveryFee: 1,
    estimatedMinutes: 25,
  },
]

export function getZoneById(id: string): DormitoryZone | undefined {
  return DORMITORY_ZONES.find(z => z.id === id)
}
