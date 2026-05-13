import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { TrendingUp, Users, ShoppingBag, Award, FileText, Ticket, Bell, LayoutDashboard } from 'lucide-react-taro'
import { aggregateDashboard, type DashboardStats } from '@/engine/dashboardData'
import { USER_TAGS, TAG_CATEGORIES } from '@/data/userTags'

// 埋点
const trackDashboardView = () => {
  console.log('[埋点] dashboard_view', { timestamp: Date.now() })
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month'>('today')

  useEffect(() => {
    // 加载数据
    setStats(aggregateDashboard())
    // 埋点
    trackDashboardView()
  }, [])

  // 标签分类统计
  const tagStatsByCategory = TAG_CATEGORIES.map(cat => ({
    ...cat,
    count: Object.entries(USER_TAGS).filter(([id]) => USER_TAGS[id as keyof typeof USER_TAGS].category === cat.id).length
  }))

  const maxSales = stats?.topProducts[0]?.sales || 1

  return (
    <ScrollView className="min-h-screen bg-slate-900 pb-safe" scrollY>
      {/* 顶部标题 */}
      <View className="sticky top-0 z-10 bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <Text className="block text-lg font-bold text-white">数据看板</Text>
        <View className="flex gap-2">
          {(['today', 'week', 'month'] as const).map(range => (
            <View
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1 rounded-full text-xs ${
                dateRange === range
                  ? 'bg-purple-500 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Text className="block text-xs">{range === 'today' ? '今日' : range === 'week' ? '本周' : '本月'}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="p-4 space-y-4">
        {/* 核心指标卡片 */}
        <View className="grid grid-cols-2 gap-3">
          {/* 今日订单 */}
          <View className="bg-slate-800 rounded-xl p-4">
            <View className="flex items-center gap-2 mb-2">
              <ShoppingBag size={16} color="#10B981" />
              <Text className="block text-xs text-slate-400">今日订单</Text>
            </View>
            <Text className="block text-2xl font-bold text-green-400">{stats?.todayOrders || 0}</Text>
            <Text className="block text-xs text-slate-500 mt-1">金额 ¥{stats?.todayRevenue?.toFixed(2) || '0.00'}</Text>
          </View>

          {/* 活跃用户 */}
          <View className="bg-slate-800 rounded-xl p-4">
            <View className="flex items-center gap-2 mb-2">
              <Users size={16} color="#3B82F6" />
              <Text className="block text-xs text-slate-400">活跃用户</Text>
            </View>
            <Text className="block text-2xl font-bold text-blue-400">{stats?.activeUsersToday || 0}</Text>
            <Text className="block text-xs text-slate-500 mt-1">新增 {stats?.newUsersToday || 0} 人</Text>
          </View>

          {/* 会员数 */}
          <View className="bg-slate-800 rounded-xl p-4">
            <View className="flex items-center gap-2 mb-2">
              <Award size={16} color="#FBBF24" />
              <Text className="block text-xs text-slate-400">会员数</Text>
            </View>
            <Text className="block text-2xl font-bold text-yellow-400">{stats?.memberCount || 0}</Text>
            <Text className="block text-xs text-slate-500 mt-1">占比 {stats?.memberRate?.toFixed(1) || 0}%</Text>
          </View>

          {/* UGC投稿 */}
          <View className="bg-slate-800 rounded-xl p-4">
            <View className="flex items-center gap-2 mb-2">
              <FileText size={16} color="#8B5CF6" />
              <Text className="block text-xs text-slate-400">UGC投稿</Text>
            </View>
            <Text className="block text-2xl font-bold text-purple-400">{stats?.totalUGCWorks || 0}</Text>
            <Text className="block text-xs text-slate-500 mt-1">今日投票 {stats?.todayVotes || 0}</Text>
          </View>
        </View>

        {/* 产品销量排行 */}
        <View className="bg-slate-800 rounded-xl p-4">
          <View className="flex items-center gap-2 mb-3">
            <LayoutDashboard size={16} color="#EC4899" />
            <Text className="block text-sm font-semibold text-white">产品销量排行</Text>
          </View>
          <View className="space-y-3">
            {stats?.topProducts.map((product, idx) => (
              <View key={product.name} className="flex items-center gap-3">
                <Text className="block w-4 text-xs text-slate-500">{idx + 1}</Text>
                <View className="flex-1">
                  <View className="flex justify-between mb-1">
                    <Text className="block text-sm text-white">{product.name}</Text>
                    <Text className="block text-xs text-slate-400">{product.sales}件</Text>
                  </View>
                  <View className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                      style={{ width: `${(product.sales / maxSales) * 100}%` }}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 创意墙热门作品 */}
        <View className="bg-slate-800 rounded-xl p-4">
          <View className="flex items-center gap-2 mb-3">
            <TrendingUp size={16} color="#F59E0B" />
            <Text className="block text-sm font-semibold text-white">创意墙热门作品</Text>
          </View>
          <View className="space-y-3">
            {stats?.topWorks.map((work, idx) => (
              <View key={work.title} className="flex items-center gap-3 bg-slate-700 rounded-lg p-3">
                <Text className="block w-6 text-center text-lg">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                </Text>
                <View className="flex-1">
                  <Text className="block text-sm text-white">{work.title}</Text>
                  <Text className="block text-xs text-slate-400">@{work.author}</Text>
                </View>
                <View className="text-right">
                  <Text className="block text-sm font-semibold text-yellow-400">{work.votes}</Text>
                  <Text className="block text-xs text-slate-500">票</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 推送效果 + 代券统计 */}
        <View className="grid grid-cols-2 gap-3">
          {/* 推送效果 */}
          <View className="bg-slate-800 rounded-xl p-4">
            <View className="flex items-center gap-2 mb-2">
              <Bell size={16} color="#06B6D4" />
              <Text className="block text-xs text-slate-400">推送效果</Text>
            </View>
            <Text className="block text-xl font-bold text-cyan-400">{stats?.totalPushes || 0}</Text>
            <Text className="block text-xs text-slate-500 mt-1">发送数</Text>
            <View className="mt-2 flex items-baseline gap-1">
              <Text className="block text-lg font-bold text-cyan-300">{stats?.pushClickRate || 0}%</Text>
              <Text className="block text-xs text-slate-500">点击率</Text>
            </View>
          </View>

          {/* 代券统计 */}
          <View className="bg-slate-800 rounded-xl p-4">
            <View className="flex items-center gap-2 mb-2">
              <Ticket size={16} color="#10B981" />
              <Text className="block text-xs text-slate-400">代券统计</Text>
            </View>
            <Text className="block text-xl font-bold text-green-400">{stats?.totalCouponsIssued || 0}</Text>
            <Text className="block text-xs text-slate-500 mt-1">发放数</Text>
            <View className="mt-2 flex items-baseline gap-1">
              <Text className="block text-lg font-bold text-green-300">{stats?.couponUsageRate || 0}%</Text>
              <Text className="block text-xs text-slate-500">使用率</Text>
            </View>
          </View>
        </View>

        {/* 用户标签分布 */}
        <View className="bg-slate-800 rounded-xl p-4">
          <View className="flex items-center gap-2 mb-3">
            <Award size={16} color="#8B5CF6" />
            <Text className="block text-sm font-semibold text-white">用户标签分布</Text>
          </View>
          <View className="grid grid-cols-2 gap-3">
            {tagStatsByCategory.map(cat => (
              <View key={cat.id} className="bg-slate-700 rounded-lg p-3">
                <View className="flex items-center gap-2 mb-1">
                  <Text className="block">{cat.icon}</Text>
                  <Text className="block text-xs text-white">{cat.name}</Text>
                </View>
                <Text className="block text-lg font-bold text-purple-400">{cat.count}</Text>
                <Text className="block text-xs text-slate-500">个标签</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 汇总数据 */}
        <View className="bg-slate-800 rounded-xl p-4">
          <Text className="block text-sm font-semibold text-white mb-3">数据汇总</Text>
          <View className="grid grid-cols-3 gap-4 text-center">
            <View>
              <Text className="block text-xl font-bold text-white">{stats?.totalOrders || 0}</Text>
              <Text className="block text-xs text-slate-500">总订单</Text>
            </View>
            <View>
              <Text className="block text-xl font-bold text-white">¥{(stats?.totalRevenue || 0).toFixed(0)}</Text>
              <Text className="block text-xs text-slate-500">总收入</Text>
            </View>
            <View>
              <Text className="block text-xl font-bold text-white">¥{(stats?.avgOrderValue || 0).toFixed(0)}</Text>
              <Text className="block text-xs text-slate-500">客单价</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}
