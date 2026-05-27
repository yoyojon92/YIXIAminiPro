import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { taroStorage } from './taroStorage'

// ====== 产品管理 ======
export type ProductStatus = 'on_sale' | 'off_sale' | 'pre_sale'

export interface AdminProduct {
  id: string
  name: string
  category: 'fruit_wine' | 'grain_wine' | 'nfc_juice' | 'gift_box'
  price: number
  originalPrice: number
  spec: string
  stock: number
  status: ProductStatus
  isRecommended: boolean
  recommendOrder: number
  sales: number
  icon: string
  ipCharacter?: string
  description?: string
  lastStockUpdate: string
}

// ====== 辅导员管理 ======
export type CounselorTier = 'junior' | 'senior' | 'gold'

export interface CounselorData {
  id: string
  name: string
  avatar: string
  phone: string
  tier: CounselorTier
  registeredStudents: number
  monthlySales: number
  monthlyCommission: number
  totalCommission: number
  offlineEvents: number
  onlineRate: number
  offlineRate: number
  status: 'active' | 'inactive'
  joinDate: string
  counselorCode: string
}

// ====== 线下活动 ======
export type ActivityStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled'

export interface OfflineActivity {
  id: string
  title: string
  date: string
  time: string
  location: string
  counselorId: string
  counselorName: string
  maxAttendees: number
  registeredCount: number
  checkedInCount: number
  onSiteSales: number
  onSiteOrders: number
  status: ActivityStatus
  description: string
  ticketPrice: number
  checkInCode: string
}

// ====== IP管理 ======
export interface IPCharacter {
  id: string
  organRole: string
  name: string
  emotion: string
  color: string
  emoji: string
  wine: string
  catchphrase: string
  description: string
  isActive: boolean
  lastUpdated: string
}

// ====== 外部链接 ======
export interface ExternalLink {
  id: string
  title: string
  url: string
  category: 'factory' | 'school' | 'partner'
  icon: string
  description: string
  isActive: boolean
  sortOrder: number
}

// ====== 消费者画像 ======
export interface UserProfileData {
  totalUsers: number
  activeUsers: number
  newUsersThisMonth: number
  schoolDistribution: { name: string; count: number; percent: number }[]
  tastePreference: { name: string; count: number; percent: number }[]
  consumptionLevel: { level: string; label: string; count: number; percent: number }[]
}

// ====== 看板概览 ======
export interface DashboardOverview {
  todaySales: number
  todayOrders: number
  todayNewUsers: number
  activeCounselors: number
  monthSales: number
  monthOrders: number
  monthNewUsers: number
  lowStockCount: number
  pendingActivities: number
  salesTrend: { date: string; sales: number; orders: number }[]
}

// Mock数据 - 产品
const MOCK_PRODUCTS: AdminProduct[] = [
  {
    id: 'fw-001',
    name: '榴红心事',
    category: 'fruit_wine',
    price: 68,
    originalPrice: 88,
    spec: '330ml',
    stock: 156,
    status: 'on_sale',
    isRecommended: true,
    recommendOrder: 1,
    sales: 328,
    icon: '🥂',
    ipCharacter: '榴榴心语者',
    description: '石榴果酒，甜蜜心事',
    lastStockUpdate: '2026-05-26 10:30'
  },
  {
    id: 'fw-002',
    name: '番红暗许',
    category: 'fruit_wine',
    price: 58,
    originalPrice: 78,
    spec: '330ml',
    stock: 89,
    status: 'on_sale',
    isRecommended: true,
    recommendOrder: 2,
    sales: 256,
    icon: '🍷',
    ipCharacter: '番番暗许者',
    description: '番茄果酒，酸甜可口',
    lastStockUpdate: '2026-05-25 15:20'
  },
  {
    id: 'fw-003',
    name: '桃心暗动',
    category: 'fruit_wine',
    price: 48,
    originalPrice: 68,
    spec: '330ml',
    stock: 234,
    status: 'on_sale',
    isRecommended: true,
    recommendOrder: 3,
    sales: 189,
    icon: '🍑',
    ipCharacter: '桃桃心动者',
    description: '蜜桃果酒，清新甜蜜',
    lastStockUpdate: '2026-05-26 08:00'
  },
  {
    id: 'fw-004',
    name: '清苹微醉',
    category: 'fruit_wine',
    price: 52,
    originalPrice: 72,
    spec: '330ml',
    stock: 0,
    status: 'off_sale',
    isRecommended: false,
    recommendOrder: 0,
    sales: 145,
    icon: '🍏',
    ipCharacter: '苹苹微醺者',
    description: '青苹果酒，清爽怡人',
    lastStockUpdate: '2026-05-24 12:00'
  },
  {
    id: 'fw-005',
    name: '葡香暗度',
    category: 'fruit_wine',
    price: 78,
    originalPrice: 98,
    spec: '330ml',
    stock: 67,
    status: 'on_sale',
    isRecommended: false,
    recommendOrder: 0,
    sales: 167,
    icon: '🍇',
    ipCharacter: '葡葡暗香者',
    description: '葡萄果酒，醇香浓郁',
    lastStockUpdate: '2026-05-25 18:30'
  },
  {
    id: 'fw-006',
    name: '为爱而生',
    category: 'fruit_wine',
    price: 128,
    originalPrice: 168,
    spec: '500ml',
    stock: 45,
    status: 'on_sale',
    isRecommended: true,
    recommendOrder: 4,
    sales: 89,
    icon: '❤️',
    ipCharacter: '爱爱而生者',
    description: '限量款果酒，爱的味道',
    lastStockUpdate: '2026-05-26 09:00'
  }
]

// Mock数据 - 辅导员
const MOCK_COUNSELORS: CounselorData[] = [
  {
    id: 'c-001',
    name: '张明辉',
    avatar: '👤',
    phone: '138****5678',
    tier: 'gold',
    registeredStudents: 156,
    monthlySales: 12850,
    monthlyCommission: 1542,
    totalCommission: 45680,
    offlineEvents: 8,
    onlineRate: 0.12,
    offlineRate: 0.15,
    status: 'active',
    joinDate: '2025-09-01',
    counselorCode: 'YX001'
  },
  {
    id: 'c-002',
    name: '李雅琪',
    avatar: '👤',
    phone: '139****1234',
    tier: 'senior',
    registeredStudents: 89,
    monthlySales: 8960,
    monthlyCommission: 896,
    totalCommission: 28560,
    offlineEvents: 5,
    onlineRate: 0.10,
    offlineRate: 0.12,
    status: 'active',
    joinDate: '2025-11-15',
    counselorCode: 'YX002'
  },
  {
    id: 'c-003',
    name: '王浩然',
    avatar: '👤',
    phone: '137****9876',
    tier: 'junior',
    registeredStudents: 34,
    monthlySales: 4580,
    monthlyCommission: 366,
    totalCommission: 8920,
    offlineEvents: 2,
    onlineRate: 0.08,
    offlineRate: 0.10,
    status: 'active',
    joinDate: '2026-03-01',
    counselorCode: 'YX003'
  }
]

// Mock数据 - 线下活动
const MOCK_ACTIVITIES: OfflineActivity[] = [
  {
    id: 'act-001',
    title: '618品酒会',
    date: '2026-06-18',
    time: '19:00-22:00',
    location: '青岛农业大学东区操场',
    counselorId: 'c-001',
    counselorName: '张明辉',
    maxAttendees: 100,
    registeredCount: 78,
    checkedInCount: 0,
    onSiteSales: 0,
    onSiteOrders: 0,
    status: 'published',
    description: '夏季限定果酒品鉴会',
    ticketPrice: 0,
    checkInCode: 'CHK618'
  },
  {
    id: 'act-002',
    title: '毕业季特惠活动',
    date: '2026-06-25',
    time: '15:00-18:00',
    location: '青岛农业大学南门广场',
    counselorId: 'c-002',
    counselorName: '李雅琪',
    maxAttendees: 200,
    registeredCount: 156,
    checkedInCount: 0,
    onSiteSales: 0,
    onSiteOrders: 0,
    status: 'published',
    description: '毕业季专属优惠活动',
    ticketPrice: 0,
    checkInCode: 'CHK625'
  },
  {
    id: 'act-003',
    title: '新生入学福利日',
    date: '2026-05-20',
    time: '10:00-16:00',
    location: '青岛农业大学图书馆前',
    counselorId: 'c-001',
    counselorName: '张明辉',
    maxAttendees: 150,
    registeredCount: 150,
    checkedInCount: 128,
    onSiteSales: 15680,
    onSiteOrders: 89,
    status: 'completed',
    description: '新生专享福利活动',
    ticketPrice: 0,
    checkInCode: 'CHK520'
  }
]

// Mock数据 - IP角色
const MOCK_IP_CHARACTERS: IPCharacter[] = [
  {
    id: 'ip-001',
    organRole: 'liver',
    name: '榴榴心语者',
    emotion: '热情奔放',
    color: '#E53935',
    emoji: '❤️',
    wine: '榴红心事',
    catchphrase: '心事如榴，甜蜜入心',
    description: '代表热情与奔放的石榴人格',
    isActive: true,
    lastUpdated: '2026-05-20'
  },
  {
    id: 'ip-002',
    organRole: 'heart',
    name: '番番暗许者',
    emotion: '温柔含蓄',
    color: '#FF7043',
    emoji: '💗',
    wine: '番红暗许',
    catchphrase: '暗许芳心，酸甜自知',
    description: '代表温柔与含蓄的番茄人格',
    isActive: true,
    lastUpdated: '2026-05-20'
  },
  {
    id: 'ip-003',
    organRole: 'spleen',
    name: '桃桃心动者',
    emotion: '甜美可爱',
    color: '#FF80AB',
    emoji: '💖',
    wine: '桃心暗动',
    catchphrase: '心动时刻，甜美如初',
    description: '代表甜美与可爱的蜜桃人格',
    isActive: true,
    lastUpdated: '2026-05-20'
  },
  {
    id: 'ip-004',
    organRole: 'lung',
    name: '苹苹微醺者',
    emotion: '清新淡雅',
    color: '#81C784',
    emoji: '💚',
    wine: '清苹微醉',
    catchphrase: '微醺时刻，清新怡人',
    description: '代表清新与淡雅的青苹果人格',
    isActive: true,
    lastUpdated: '2026-05-20'
  },
  {
    id: 'ip-005',
    organRole: 'kidney',
    name: '葡葡暗香者',
    emotion: '成熟稳重',
    color: '#7E57C2',
    emoji: '💜',
    wine: '葡香暗度',
    catchphrase: '暗香浮动，醇厚绵长',
    description: '代表成熟与稳重的葡萄人格',
    isActive: true,
    lastUpdated: '2026-05-20'
  }
]

// Mock数据 - 外部链接
const MOCK_EXTERNAL_LINKS: ExternalLink[] = [
  {
    id: 'link-001',
    title: '邑夏酒厂官网',
    url: 'https://yixia-wine.com',
    category: 'factory',
    icon: '🏭',
    description: '厂家官方网站，产品溯源',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'link-002',
    title: '青岛农业大学',
    url: 'https://qau.edu.cn',
    category: 'school',
    icon: '🎓',
    description: '校方官网，校园活动入口',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'link-003',
    title: '兴水河酒业',
    url: 'https://xingshuihe.com',
    category: 'partner',
    icon: '🤝',
    description: '粮食酒品牌合作方',
    isActive: true,
    sortOrder: 3
  }
]

// Mock数据 - 消费者画像
const MOCK_USER_PROFILE: UserProfileData = {
  totalUsers: 2856,
  activeUsers: 1567,
  newUsersThisMonth: 328,
  schoolDistribution: [
    { name: '青岛农业大学', count: 1567, percent: 54.8 },
    { name: '青岛大学', count: 456, percent: 16.0 },
    { name: '山东科技大学', count: 389, percent: 13.6 },
    { name: '其他高校', count: 444, percent: 15.6 }
  ],
  tastePreference: [
    { name: '果酒系列', count: 1856, percent: 65.0 },
    { name: 'NFC果汁', count: 678, percent: 23.7 },
    { name: '粮食酒', count: 322, percent: 11.3 }
  ],
  consumptionLevel: [
    { level: 'high', label: '高消费(500+)', count: 456, percent: 16.0 },
    { level: 'medium', label: '中消费(200-500)', count: 867, percent: 30.4 },
    { level: 'low', label: '低消费(200以下)', count: 1533, percent: 53.6 }
  ]
}

// Mock数据 - 看板概览
const MOCK_DASHBOARD: DashboardOverview = {
  todaySales: 8650,
  todayOrders: 56,
  todayNewUsers: 23,
  activeCounselors: 3,
  monthSales: 156780,
  monthOrders: 1024,
  monthNewUsers: 328,
  lowStockCount: 2,
  pendingActivities: 2,
  salesTrend: [
    { date: '05-20', sales: 12560, orders: 82 },
    { date: '05-21', sales: 8960, orders: 58 },
    { date: '05-22', sales: 15680, orders: 102 },
    { date: '05-23', sales: 11230, orders: 74 },
    { date: '05-24', sales: 9870, orders: 64 },
    { date: '05-25', sales: 13450, orders: 88 },
    { date: '05-26', sales: 8650, orders: 56 }
  ]
}

interface AdminState {
  dashboard: DashboardOverview
  products: AdminProduct[]
  counselors: CounselorData[]
  activities: OfflineActivity[]
  ipCharacters: IPCharacter[]
  externalLinks: ExternalLink[]
  userProfile: UserProfileData
  
  // 产品操作
  toggleProductStatus: (id: string) => void
  updateProductStock: (id: string, stock: number) => void
  toggleProductRecommend: (id: string) => void
  addProduct: (product: AdminProduct) => void
  updateProduct: (id: string, product: Partial<AdminProduct>) => void
  
  // 辅导员操作
  updateCounselorTier: (id: string, tier: CounselorTier) => void
  updateCounselorRate: (id: string, onlineRate: number, offlineRate: number) => void
  toggleCounselorStatus: (id: string) => void
  
  // 活动操作
  createActivity: (activity: OfflineActivity) => void
  updateActivityStatus: (id: string, status: ActivityStatus) => void
  checkInActivity: (id: string) => void
  
  // IP操作
  updateIPCharacter: (id: string, character: Partial<IPCharacter>) => void
  toggleIPActive: (id: string) => void
  
  // 链接操作
  addExternalLink: (link: ExternalLink) => void
  updateExternalLink: (id: string, link: Partial<ExternalLink>) => void
  toggleLinkActive: (id: string) => void
  reorderLinks: (id: string, newOrder: number) => void
  
  // 刷新数据
  refreshDashboard: () => void
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      dashboard: MOCK_DASHBOARD,
      products: MOCK_PRODUCTS,
      counselors: MOCK_COUNSELORS,
      activities: MOCK_ACTIVITIES,
      ipCharacters: MOCK_IP_CHARACTERS,
      externalLinks: MOCK_EXTERNAL_LINKS,
      userProfile: MOCK_USER_PROFILE,
      
      // 产品操作
      toggleProductStatus: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: p.status === 'on_sale' ? 'off_sale' : 'on_sale',
                  lastStockUpdate: new Date().toLocaleString()
                }
              : p
          )
        }))
        get().refreshDashboard()
      },
      
      updateProductStock: (id, stock) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  stock,
                  lastStockUpdate: new Date().toLocaleString()
                }
              : p
          )
        }))
        get().refreshDashboard()
      },
      
      toggleProductRecommend: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  isRecommended: !p.isRecommended,
                  recommendOrder: p.isRecommended ? 0 : 1
                }
              : p
          )
        }))
      },
      
      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, product]
        }))
      },
      
      updateProduct: (id, product) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...product } : p
          )
        }))
      },
      
      // 辅导员操作
      updateCounselorTier: (id, tier) => {
        set((state) => ({
          counselors: state.counselors.map((c) =>
            c.id === id ? { ...c, tier } : c
          )
        }))
      },
      
      updateCounselorRate: (id, onlineRate, offlineRate) => {
        set((state) => ({
          counselors: state.counselors.map((c) =>
            c.id === id ? { ...c, onlineRate, offlineRate } : c
          )
        }))
      },
      
      toggleCounselorStatus: (id) => {
        set((state) => ({
          counselors: state.counselors.map((c) =>
            c.id === id
              ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
              : c
          )
        }))
      },
      
      // 活动操作
      createActivity: (activity) => {
        set((state) => ({
          activities: [...state.activities, activity]
        }))
        get().refreshDashboard()
      },
      
      updateActivityStatus: (id, status) => {
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === id ? { ...a, status } : a
          )
        }))
        get().refreshDashboard()
      },
      
      checkInActivity: (id) => {
        set((state) => ({
          activities: state.activities.map((a) =>
            a.id === id
              ? { ...a, checkedInCount: a.checkedInCount + 1 }
              : a
          )
        }))
      },
      
      // IP操作
      updateIPCharacter: (id, character) => {
        set((state) => ({
          ipCharacters: state.ipCharacters.map((ip) =>
            ip.id === id
              ? { ...ip, ...character, lastUpdated: new Date().toLocaleDateString() }
              : ip
          )
        }))
      },
      
      toggleIPActive: (id) => {
        set((state) => ({
          ipCharacters: state.ipCharacters.map((ip) =>
            ip.id === id ? { ...ip, isActive: !ip.isActive } : ip
          )
        }))
      },
      
      // 链接操作
      addExternalLink: (link) => {
        set((state) => ({
          externalLinks: [...state.externalLinks, link]
        }))
      },
      
      updateExternalLink: (id, link) => {
        set((state) => ({
          externalLinks: state.externalLinks.map((l) =>
            l.id === id ? { ...l, ...link } : l
          )
        }))
      },
      
      toggleLinkActive: (id) => {
        set((state) => ({
          externalLinks: state.externalLinks.map((l) =>
            l.id === id ? { ...l, isActive: !l.isActive } : l
          )
        }))
      },
      
      reorderLinks: (id, newOrder) => {
        set((state) => ({
          externalLinks: state.externalLinks.map((l) =>
            l.id === id ? { ...l, sortOrder: newOrder } : l
          )
        }))
      },
      
      // 刷新看板
      refreshDashboard: () => {
        const { products, activities, counselors } = get()
        const lowStockCount = products.filter((p) => p.stock < 50 && p.status === 'on_sale').length
        const pendingActivities = activities.filter(
          (a) => a.status === 'published' || a.status === 'ongoing'
        ).length
        const activeCounselors = counselors.filter((c) => c.status === 'active').length
        
        set((state) => ({
          dashboard: {
            ...state.dashboard,
            lowStockCount,
            pendingActivities,
            activeCounselors
          }
        }))
      }
    }),
    {
      name: 'admin-storage',
      storage: taroStorage
    }
  )
)
