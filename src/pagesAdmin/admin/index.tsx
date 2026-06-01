import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  Users,
  Calendar,
  Sparkles,
  ChartBarBig,
  Link2,
  TriangleAlert,
  TrendingUp,
  TrendingDown,
  CircleCheck,
  Clock,
  ShoppingBag
} from 'lucide-react-taro'
import { useAdminStore } from '@/store/adminStore'

export default function AdminDashboard() {
  const { dashboard, products, counselors, activities } = useAdminStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'trends'>('overview')
  
  useDidShow(() => {
    // 刷新数据
  })
  
  const goToPage = (page: string) => {
    Taro.navigateTo({ url: `/pages/admin/${page}` })
  }
  
  // 库存预警产品
  const lowStockProducts = products.filter(p => p.stock < 50 && p.status === 'on_sale')
  
  // 待处理活动
  const pendingActivities = activities.filter(a => a.status === 'published' || a.status === 'ongoing')
  
  // TOP3销量产品
  const topProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 3)
  
  // TOP3销售额辅导员
  const topCounselors = [...counselors].sort((a, b) => b.monthlySales - a.monthlySales).slice(0, 3)
  
  // 计算趋势
  const salesTrend = dashboard.salesTrend
  const latestTrend = salesTrend.length >= 2
    ? ((salesTrend[salesTrend.length - 1].sales - salesTrend[salesTrend.length - 2].sales) / salesTrend[salesTrend.length - 2].sales * 100).toFixed(1)
    : '0'
  const isTrendUp = parseFloat(latestTrend) >= 0

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部渐变区域 */}
      <View className="bg-gradient-to-br from-violet-600 to-purple-700 pt-12 pb-6 px-4">
        <View className="flex items-center mb-4">
          <LayoutDashboard size={24} color="#fff" />
          <Text className="text-white text-xl font-bold ml-2">管理控制中心</Text>
        </View>
        
        {/* 概览卡片 */}
        <View className="grid grid-cols-2 gap-3">
          <View className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-3">
            <Text className="text-white text-opacity-70 text-xs">今日销售额</Text>
            <Text className="text-white text-2xl font-bold">¥{dashboard.todaySales.toLocaleString()}</Text>
          </View>
          <View className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-3">
            <Text className="text-white text-opacity-70 text-xs">今日订单</Text>
            <Text className="text-white text-2xl font-bold">{dashboard.todayOrders}单</Text>
          </View>
          <View className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-3">
            <Text className="text-white text-opacity-70 text-xs">本月销售额</Text>
            <Text className="text-white text-xl font-bold">¥{(dashboard.monthSales / 10000).toFixed(1)}万</Text>
          </View>
          <View className="bg-white bg-opacity-20 backdrop-blur rounded-xl p-3">
            <Text className="text-white text-opacity-70 text-xs">活跃辅导员</Text>
            <Text className="text-white text-2xl font-bold">{dashboard.activeCounselors}人</Text>
          </View>
        </View>
      </View>
      
      {/* 预警区 */}
      {(dashboard.lowStockCount > 0 || dashboard.pendingActivities > 0) && (
        <View className="mx-4 -mt-3 bg-orange-50 rounded-xl p-3 border border-orange-200">
          <View className="flex items-center mb-2">
            <TriangleAlert size={16} color="#f97316" />
            <Text className="text-orange-600 font-medium ml-1">预警提醒</Text>
          </View>
          {dashboard.lowStockCount > 0 && (
            <Text className="text-orange-600 text-sm block">• {dashboard.lowStockCount}款产品库存不足50件</Text>
          )}
          {dashboard.pendingActivities > 0 && (
            <Text className="text-orange-600 text-sm block">• {dashboard.pendingActivities}场活动待处理</Text>
          )}
        </View>
      )}
      
      {/* Tab切换 */}
      <View className="flex border-b border-gray-200 bg-white mt-4">
        {(['overview', 'alerts', 'trends'] as const).map((tab) => (
          <View
            key={tab}
            className={`flex-1 py-3 text-center ${activeTab === tab ? 'border-b-2 border-violet-600' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <Text className={activeTab === tab ? 'text-violet-600 font-medium' : 'text-gray-500'}>
              {tab === 'overview' ? '概览' : tab === 'alerts' ? '预警' : '趋势'}
            </Text>
          </View>
        ))}
      </View>
      
      <View className="p-4">
        {activeTab === 'overview' && (
          <>
            {/* 快捷操作 */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-3 block">快捷操作</Text>
              <View className="grid grid-cols-4 gap-3">
                {[
                  { icon: Package, label: '产品管理', page: 'products', color: '#3b82f6' },
                  { icon: Users, label: '辅导员', page: 'counselor', color: '#10b981' },
                  { icon: Calendar, label: '活动', page: 'activity', color: '#f59e0b' },
                  { icon: Sparkles, label: 'IP管理', page: 'ip-manage', color: '#8b5cf6' },
                  { icon: ChartBarBig, label: '画像', page: 'user-profile', color: '#ef4444' },
                  { icon: Link2, label: '链接', page: 'links', color: '#06b6d4' },
                ].map((item) => (
                  <View
                    key={item.page}
                    className="bg-white rounded-xl p-3 flex flex-col items-center shadow-sm"
                    onClick={() => goToPage(item.page)}
                  >
                    <item.icon size={24} color={item.color} />
                    <Text className="text-gray-600 text-xs mt-1">{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* 实时动态 */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-3 block">实时动态</Text>
              <View className="bg-white rounded-xl p-3 space-y-2">
                <View className="flex items-center">
                  <CircleCheck size={16} color="#10b981" />
                  <Text className="text-gray-600 text-sm ml-2">张明辉完成订单 #1024 配送</Text>
                  <Text className="text-gray-400 text-xs ml-auto">3分钟前</Text>
                </View>
                <View className="flex items-center">
                  <ShoppingBag size={16} color="#3b82f6" />
                  <Text className="text-gray-600 text-sm ml-2">新订单 #1025 已支付待发货</Text>
                  <Text className="text-gray-400 text-xs ml-auto">5分钟前</Text>
                </View>
                <View className="flex items-center">
                  <Users size={16} color="#f59e0b" />
                  <Text className="text-gray-600 text-sm ml-2">新用户 小王 完成注册</Text>
                  <Text className="text-gray-400 text-xs ml-auto">8分钟前</Text>
                </View>
                <View className="flex items-center">
                  <Clock size={16} color="#8b5cf6" />
                  <Text className="text-gray-600 text-sm ml-2">618品酒会 已有78人报名</Text>
                  <Text className="text-gray-400 text-xs ml-auto">10分钟前</Text>
                </View>
              </View>
            </View>
          </>
        )}
        
        {activeTab === 'alerts' && (
          <View className="space-y-3">
            {/* 库存预警 */}
            <View className="bg-white rounded-xl p-3">
              <Text className="text-gray-700 font-medium mb-2 block">库存预警</Text>
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((p) => (
                  <View key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <View className="flex items-center">
                      <Text className="text-lg mr-2">{p.icon}</Text>
                      <Text className="text-gray-600">{p.name}</Text>
                    </View>
                    <View className="flex items-center">
                      <Text className="text-red-500 font-medium">{p.stock}件</Text>
                      <View
                        className="ml-2 px-2 py-1 bg-violet-100 rounded text-violet-600 text-xs"
                        onClick={() => goToPage('products')}
                      >
                        补货
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400 text-sm">暂无库存预警</Text>
              )}
            </View>
            
            {/* 待处理活动 */}
            <View className="bg-white rounded-xl p-3">
              <Text className="text-gray-700 font-medium mb-2 block">待处理活动</Text>
              {pendingActivities.length > 0 ? (
                pendingActivities.map((a) => (
                  <View key={a.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <View>
                      <Text className="text-gray-600 block">{a.title}</Text>
                      <Text className="text-gray-400 text-xs">{a.date} {a.time}</Text>
                    </View>
                    <View
                      className="px-2 py-1 bg-orange-100 rounded text-orange-600 text-xs"
                      onClick={() => goToPage('activity')}
                    >
                      处理
                    </View>
                  </View>
                ))
              ) : (
                <Text className="text-gray-400 text-sm">暂无待处理活动</Text>
              )}
            </View>
          </View>
        )}
        
        {activeTab === 'trends' && (
          <View className="space-y-3">
            {/* 销售趋势 */}
            <View className="bg-white rounded-xl p-3">
              <View className="flex items-center justify-between mb-3">
                <Text className="text-gray-700 font-medium">销售趋势（近7日）</Text>
                <View className="flex items-center">
                  {isTrendUp ? <TrendingUp size={16} color="#10b981" /> : <TrendingDown size={16} color="#ef4444" />}
                  <Text className={isTrendUp ? 'text-green-500 text-sm ml-1' : 'text-red-500 text-sm ml-1'}>
                    {isTrendUp ? '+' : ''}{latestTrend}%
                  </Text>
                </View>
              </View>
              {/* 简单柱状图 */}
              <View className="flex items-end justify-between h-32 px-2">
                {dashboard.salesTrend.map((item, index) => {
                  const maxSales = Math.max(...dashboard.salesTrend.map(d => d.sales))
                  const height = (item.sales / maxSales) * 100
                  return (
                    <View key={index} className="flex flex-col items-center flex-1">
                      <View
                        className="w-6 bg-violet-500 rounded-t"
                        style={{ height: `${height}%`, minHeight: '8px' }}
                      />
                      <Text className="text-gray-400 text-xs mt-1">{item.date.slice(3)}</Text>
                    </View>
                  )
                })}
              </View>
            </View>
            
            {/* TOP3产品 */}
            <View className="bg-white rounded-xl p-3">
              <Text className="text-gray-700 font-medium mb-2 block">销量TOP3产品</Text>
              {topProducts.map((p, index) => (
                <View key={p.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <View className="flex items-center">
                    <Text className="text-violet-600 font-bold mr-2">{index + 1}</Text>
                    <Text className="text-lg mr-2">{p.icon}</Text>
                    <Text className="text-gray-600">{p.name}</Text>
                  </View>
                  <Text className="text-gray-500">{p.sales}件</Text>
                </View>
              ))}
            </View>
            
            {/* TOP3辅导员 */}
            <View className="bg-white rounded-xl p-3">
              <Text className="text-gray-700 font-medium mb-2 block">销售额TOP3辅导员</Text>
              {topCounselors.map((c, index) => (
                <View key={c.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <View className="flex items-center">
                    <Text className="text-violet-600 font-bold mr-2">{index + 1}</Text>
                    <Text className="text-gray-600">{c.name}</Text>
                  </View>
                  <Text className="text-gray-500">¥{c.monthlySales.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
