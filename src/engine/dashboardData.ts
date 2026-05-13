// 模拟后台数据（后续对接真实后端）
export interface DashboardStats {
  // 用户数据
  totalUsers: number
  newUsersToday: number
  activeUsersToday: number
  memberCount: number
  memberRate: number // 会员占比

  // 销售数据
  totalOrders: number
  todayOrders: number
  todayRevenue: number
  totalRevenue: number
  avgOrderValue: number

  // 产品数据
  topProducts: { name: string; sales: number; revenue: number }[]

  // UGC数据
  totalUGCWorks: number
  todayVotes: number
  topWorks: { title: string; author: string; votes: number }[]

  // 推送数据
  totalPushes: number
  pushClickRate: number

  // 代券数据
  totalCouponsIssued: number
  couponUsageRate: number
}

// 从各 store 聚合数据
export function aggregateDashboard(): DashboardStats {
  // 模拟数据（实际从各 store + 云数据库读取）
  return {
    totalUsers: 1280,
    newUsersToday: 23,
    activeUsersToday: 156,
    memberCount: 89,
    memberRate: 6.95,
    totalOrders: 456,
    todayOrders: 12,
    todayRevenue: 489.6,
    totalRevenue: 18234.5,
    avgOrderValue: 39.98,
    topProducts: [
      { name: '桃你欢心', sales: 128, revenue: 5107.2 },
      { name: '楂香四溢', sales: 96, revenue: 2870.4 },
      { name: '大吉大梨', sales: 78, revenue: 3112.2 },
      { name: '似水榴年', sales: 65, revenue: 2788.5 },
      { name: '葡写浪漫', sales: 52, revenue: 2225.6 },
    ],
    totalUGCWorks: 38,
    todayVotes: 45,
    topWorks: [
      { title: '桃夭的春日约会', author: '小美同学', votes: 128 },
      { title: '楂楂的冒险日记', author: '小明同学', votes: 96 },
      { title: '夏日清凉特饮', author: '果酒爱好者', votes: 78 },
    ],
    totalPushes: 126,
    pushClickRate: 23.8,
    totalCouponsIssued: 456,
    couponUsageRate: 42.3,
  }
}
