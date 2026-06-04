import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import {
  BarChart3, Package, Truck, CalendarPlus, Users, Wallet,
  TrendingUp, AlertTriangle, ArrowRight, DollarSign,
  ShoppingBag, Clock, CheckCircle, XCircle, Plus,
  ChevronRight, Bell, Settings, Store, Award, Gift,
  RefreshCcw, Send, Target, PieChart
} from 'lucide-react-taro'

// ====== 类型定义 ======
interface SalesData {
  todaySales: number
  todayOrders: number
  todayNewMembers: number
  monthSales: number
  monthOrders: number
  monthNewMembers: number
  yesterdaySales: number
  profitRate: number
}

interface ProductItem {
  id: string
  name: string
  spec: string
  price: number
  stock: number
  weekSales: number
  status: 'on_sale' | 'off_sale' | 'pre_sale'
  velocity: number // 周销量/库存 = 周转率
}

interface DealerItem {
  id: string
  name: string
  level: string
  referralCount: number
  totalCommission: number
  monthSales: number
  withdrawable: number
  status: 'active' | 'pending'
}

interface ActivityItem {
  id: string
  title: string
  type: 'promo' | 'group' | 'new_product' | 'holiday'
  status: 'draft' | 'active' | 'ended'
  startDate: string
  participants: number
  sales: number
}

interface PickupPoint {
  id: string
  name: string
  address: string
  pendingOrders: number
  todayRedeemed: number
  stockLow: boolean
}

// ====== Mock数据 ======
const MOCK_SALES: SalesData = {
  todaySales: 1860,
  todayOrders: 23,
  todayNewMembers: 8,
  monthSales: 42580,
  monthOrders: 567,
  monthNewMembers: 156,
  yesterdaySales: 1520,
  profitRate: 0.42
}

const MOCK_PRODUCTS: ProductItem[] = [
  { id: '1', name: '榴红心事', spec: '330ml', price: 18.8, stock: 156, weekSales: 89, status: 'on_sale', velocity: 0.57 },
  { id: '2', name: '葡香暗度', spec: '330ml', price: 18.8, stock: 67, weekSales: 78, status: 'on_sale', velocity: 1.16 },
  { id: '3', name: '桃心暗动', spec: '330ml', price: 18.8, stock: 234, weekSales: 56, status: 'on_sale', velocity: 0.24 },
  { id: '4', name: '青苹微醉', spec: '330ml', price: 18.8, stock: 12, weekSales: 45, status: 'on_sale', velocity: 3.75 },
  { id: '5', name: '芭乐微醺', spec: '500ml', price: 39.9, stock: 89, weekSales: 34, status: 'on_sale', velocity: 0.38 },
  { id: '6', name: '干红小酿', spec: '500ml', price: 49.9, stock: 45, weekSales: 23, status: 'on_sale', velocity: 0.51 },
  { id: '7', name: '老款·青梅', spec: '330ml', price: 16.8, stock: 0, weekSales: 0, status: 'off_sale', velocity: 0 },
  { id: '8', name: '老款·桂花', spec: '330ml', price: 16.8, stock: 320, weekSales: 12, status: 'on_sale', velocity: 0.04 },
]

const MOCK_DEALERS: DealerItem[] = [
  { id: 'd1', name: '张明辉', level: '黄金', referralCount: 112, totalCommission: 4568, monthSales: 12850, withdrawable: 1285, status: 'active' },
  { id: 'd2', name: '李雅琪', level: '白银', referralCount: 53, totalCommission: 2156, monthSales: 8960, withdrawable: 627, status: 'active' },
  { id: 'd3', name: '王浩然', level: '青铜', referralCount: 24, totalCommission: 892, monthSales: 4580, withdrawable: 229, status: 'active' },
  { id: 'd4', name: '陈思远', level: '—', referralCount: 8, totalCommission: 0, monthSales: 0, withdrawable: 0, status: 'pending' },
]

const MOCK_ACTIVITIES: ActivityItem[] = [
  { id: 'a1', title: '618创始会员大促', type: 'holiday', status: 'active', startDate: '2026-06-01', participants: 234, sales: 12800 },
  { id: 'a2', title: '毕业季10人拼团', type: 'group', status: 'active', startDate: '2026-06-01', participants: 89, sales: 6200 },
  { id: 'a3', title: '新品芭乐上市', type: 'new_product', status: 'ended', startDate: '2026-05-20', participants: 156, sales: 8900 },
]

const MOCK_PICKUP_POINTS: PickupPoint[] = [
  { id: 'p1', name: '南门店', address: '青农大南门商业街A12', pendingOrders: 5, todayRedeemed: 12, stockLow: false },
  { id: 'p2', name: '东区店', address: '东区食堂旁快递站', pendingOrders: 3, todayRedeemed: 8, stockLow: true },
  { id: 'p3', name: '北苑店', address: '北苑7号楼下便利店', pendingOrders: 7, todayRedeemed: 15, stockLow: false },
]

type TabKey = 'data' | 'production' | 'distribution' | 'activity'

export default function BossDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>('data')
  const sales = MOCK_SALES
  const dayGrowth = ((sales.todaySales - sales.yesterdaySales) / sales.yesterdaySales * 100).toFixed(1)
  const isGrowthUp = parseFloat(dayGrowth) >= 0

  // 生产建议：按周转率排序
  const productionAlerts = MOCK_PRODUCTS
    .filter(p => p.status === 'on_sale')
    .sort((a, b) => b.velocity - a.velocity)

  const urgentProduce = productionAlerts.filter(p => p.velocity > 1 || p.stock < 30)
  const slowProducts = productionAlerts.filter(p => p.velocity < 0.1)

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部 */}
      <View className="bg-gradient-to-br from-gray-900 to-gray-800 pt-12 pb-6 px-4">
        <View className="flex items-center justify-between mb-5">
          <View className="flex items-center">
            <Store size={22} color="#FBBF24" />
            <Text className="text-white text-lg font-bold ml-2">邑夏老板台</Text>
          </View>
          <View className="flex items-center gap-3">
            <Bell size={20} color="#D1D5DB" />
            <Settings size={20} color="#D1D5DB" />
          </View>
        </View>

        {/* 今日核心数据 */}
        <View className="grid grid-cols-3 gap-3">
          <View className="bg-white bg-opacity-10 rounded-xl p-3">
            <Text className="text-gray-400 text-xs">今日营收</Text>
            <Text className="text-white text-2xl font-bold">¥{sales.todaySales.toLocaleString()}</Text>
            <View className="flex items-center mt-1">
              {isGrowthUp ? <TrendingUp size={12} color="#34D399" /> : <TrendingUp size={12} color="#F87171" />}
              <Text className="text-xs ml-1" style={{ color: isGrowthUp ? '#34D399' : '#F87171' }}>
                {isGrowthUp ? '+' : ''}{dayGrowth}%
              </Text>
            </View>
          </View>
          <View className="bg-white bg-opacity-10 rounded-xl p-3">
            <Text className="text-gray-400 text-xs">今日订单</Text>
            <Text className="text-white text-2xl font-bold">{sales.todayOrders}</Text>
            <Text className="text-gray-400 text-xs mt-1">本月{sales.monthOrders}</Text>
          </View>
          <View className="bg-white bg-opacity-10 rounded-xl p-3">
            <Text className="text-gray-400 text-xs">新增会员</Text>
            <Text className="text-white text-2xl font-bold">{sales.todayNewMembers}</Text>
            <Text className="text-gray-400 text-xs mt-1">本月{sales.monthNewMembers}</Text>
          </View>
        </View>
      </View>

      {/* 快捷操作栏 */}
      <View className="mx-4 -mt-3 bg-white rounded-xl shadow-sm p-4">
        <View className="grid grid-cols-5 gap-2">
          {[
            { icon: Package, label: '补货', color: '#3B82F6', action: 'production' },
            { icon: CalendarPlus, label: '上新活动', color: '#F59E0B', action: 'activity' },
            { icon: Users, label: '经销商', color: '#10B981', action: 'dealer' },
            { icon: Wallet, label: '财务', color: '#8B5CF6', action: 'finance' },
            { icon: Send, label: '推送', color: '#EF4444', action: 'push' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <View key={item.label} className="flex flex-col items-center" onClick={() => {
                if (item.action === 'production') setActiveTab('production')
                else if (item.action === 'activity') setActiveTab('activity')
                else Taro.showToast({ title: '开发中', icon: 'none' })
              }}>
                <View className="w-11 h-11 rounded-full flex items-center justify-center" style={{ backgroundColor: item.color + '15' }}>
                  <Icon size={20} color={item.color} />
                </View>
                <Text className="text-gray-600 text-xs mt-1">{item.label}</Text>
              </View>
            )
          })}
        </View>
      </View>

      {/* Tab切换 */}
      <View className="flex bg-white mt-3 border-b border-gray-100">
        {([
          { key: 'data', label: '数据', icon: BarChart3 },
          { key: 'production', label: '生产', icon: Package },
          { key: 'distribution', label: '配货', icon: Truck },
          { key: 'activity', label: '活动', icon: CalendarPlus },
        ] as { key: TabKey; label: string; icon: any }[]).map((tab) => {
          const Icon = tab.icon
          return (
            <View
              key={tab.key}
              className="flex-1 flex items-center justify-center py-3"
              style={{ borderBottom: activeTab === tab.key ? '2px solid #FBBF24' : '2px solid transparent' }}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={16} color={activeTab === tab.key ? '#FBBF24' : '#9CA3AF'} />
              <Text className={activeTab === tab.key ? 'text-yellow-600 text-sm font-medium ml-1' : 'text-gray-400 text-sm ml-1'}>
                {tab.label}
              </Text>
            </View>
          )
        })}
      </View>

      <View className="p-4">
        {/* ====== 数据Tab ====== */}
        {activeTab === 'data' && (
          <View>
            {/* 月度概览 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center justify-between mb-3">
                <Text className="text-gray-800 font-bold">本月经营概览</Text>
                <Text className="text-gray-400 text-xs">6月</Text>
              </View>
              <View className="grid grid-cols-2 gap-3">
                <View className="bg-yellow-50 rounded-lg p-3">
                  <Text className="text-yellow-700 text-xs">月营收</Text>
                  <Text className="text-yellow-800 text-xl font-bold">¥{(sales.monthSales / 10000).toFixed(1)}万</Text>
                </View>
                <View className="bg-green-50 rounded-lg p-3">
                  <Text className="text-green-700 text-xs">月利润({(sales.profitRate * 100).toFixed(0)}%)</Text>
                  <Text className="text-green-800 text-xl font-bold">¥{(sales.monthSales * sales.profitRate / 10000).toFixed(1)}万</Text>
                </View>
                <View className="bg-blue-50 rounded-lg p-3">
                  <Text className="text-blue-700 text-xs">总会员数</Text>
                  <Text className="text-blue-800 text-xl font-bold">856</Text>
                </View>
                <View className="bg-purple-50 rounded-lg p-3">
                  <Text className="text-purple-700 text-xs">活跃经销商</Text>
                  <Text className="text-purple-800 text-xl font-bold">{MOCK_DEALERS.filter(d => d.status === 'active').length}人</Text>
                </View>
              </View>
            </View>

            {/* 销量TOP5 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <Text className="text-gray-800 font-bold mb-3">销量排行</Text>
              {MOCK_PRODUCTS.filter(p => p.status === 'on_sale').sort((a, b) => b.weekSales - a.weekSales).slice(0, 5).map((p, i) => (
                <View key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <View className="flex items-center">
                    <Text className="text-yellow-600 font-bold w-6">{i + 1}</Text>
                    <View>
                      <Text className="text-gray-800 text-sm">{p.name} {p.spec}</Text>
                      <Text className="text-gray-400 text-xs">¥{p.price} · 周销{p.weekSales}瓶</Text>
                    </View>
                  </View>
                  <View className="flex items-center">
                    <Text className="text-gray-400 text-xs mr-2">库存{p.stock}</Text>
                    {p.stock < 30 ? (
                      <XCircle size={14} color="#EF4444" />
                    ) : p.stock < 80 ? (
                      <AlertTriangle size={14} color="#F59E0B" />
                    ) : (
                      <CheckCircle size={14} color="#10B981" />
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* 经销商业绩 */}
            <View className="bg-white rounded-xl p-4">
              <View className="flex items-center justify-between mb-3">
                <Text className="text-gray-800 font-bold">经销商业绩</Text>
                <Text className="text-yellow-600 text-xs">查看全部 →</Text>
              </View>
              {MOCK_DEALERS.filter(d => d.status === 'active').map((d) => (
                <View key={d.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <View>
                    <View className="flex items-center">
                      <Text className="text-gray-800 text-sm">{d.name}</Text>
                      <View className="ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: d.level === '黄金' ? '#FEF3C7' : d.level === '白银' ? '#F1F5F9' : '#FED7AA' }}>
                        <Text className="text-xs" style={{ color: d.level === '黄金' ? '#D97706' : d.level === '白银' ? '#64748B' : '#EA580C' }}>{d.level}</Text>
                      </View>
                    </View>
                    <Text className="text-gray-400 text-xs">推荐{d.referralCount}人 · 月销¥{d.monthSales.toLocaleString()}</Text>
                  </View>
                  <View className="text-right">
                    <Text className="text-yellow-600 text-sm font-bold">¥{d.withdrawable}</Text>
                    <Text className="text-gray-400 text-xs">可提现</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ====== 生产Tab ====== */}
        {activeTab === 'production' && (
          <View>
            {/* 紧急生产建议 */}
            {urgentProduce.length > 0 && (
              <View className="bg-red-50 rounded-xl p-4 mb-3 border border-red-200">
                <View className="flex items-center mb-2">
                  <AlertTriangle size={16} color="#EF4444" />
                  <Text className="text-red-700 font-bold ml-1">急需补货</Text>
                </View>
                {urgentProduce.map((p) => (
                  <View key={p.id} className="flex items-center justify-between py-2">
                    <View>
                      <Text className="text-gray-800 text-sm">{p.name} {p.spec}</Text>
                      <Text className="text-red-500 text-xs">
                        {p.stock < 30 ? `仅剩${p.stock}瓶！` : `周转率${p.velocity.toFixed(1)}，${Math.floor(p.stock / p.weekSales * 7)}天售罄`}
                      </Text>
                    </View>
                    <View className="flex items-center gap-2">
                      <Text className="text-gray-500 text-xs">周销{p.weekSales}</Text>
                      <View
                        className="px-3 py-1 bg-red-500 rounded-full"
                        onClick={() => Taro.showToast({ title: `建议${p.name}补货${Math.max(p.weekSales * 2 - p.stock, 50)}瓶`, icon: 'none', duration: 3000 })}
                      >
                        <Text className="text-white text-xs">一键补货</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* 生产建议列表 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center justify-between mb-3">
                <Text className="text-gray-800 font-bold">生产调配建议</Text>
                <Text className="text-gray-400 text-xs">按周转率排序</Text>
              </View>
              {productionAlerts.map((p) => {
                const suggestQty = Math.max(Math.ceil(p.weekSales * 2) - p.stock, 0)
                const daysLeft = p.weekSales > 0 ? Math.floor(p.stock / p.weekSales * 7) : 999
                return (
                  <View key={p.id} className="py-3 border-b border-gray-50">
                    <View className="flex items-center justify-between">
                      <View className="flex items-center">
                        <Text className="text-gray-800 text-sm font-medium">{p.name}</Text>
                        <View className="ml-2 px-2 py-0.5 rounded-full" style={{
                          backgroundColor: daysLeft < 7 ? '#FEE2E2' : daysLeft < 14 ? '#FEF3C7' : '#DCFCE7'
                        }}>
                          <Text className="text-xs" style={{
                            color: daysLeft < 7 ? '#DC2626' : daysLeft < 14 ? '#D97706' : '#16A34A'
                          }}>
                            {daysLeft < 999 ? `约${daysLeft}天售罄` : '暂无销量'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View className="flex items-center justify-between mt-1">
                      <Text className="text-gray-400 text-xs">库存{p.stock} · 周销{p.weekSales} · 周转率{p.velocity.toFixed(2)}</Text>
                      {suggestQty > 0 && (
                        <Text className="text-yellow-600 text-xs">建议生产{suggestQty}瓶</Text>
                      )}
                    </View>
                  </View>
                )
              })}
            </View>

            {/* 滞销品提醒 */}
            {slowProducts.length > 0 && (
              <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <View className="flex items-center mb-2">
                  <Clock size={16} color="#6B7280" />
                  <Text className="text-gray-600 font-bold ml-1">周转缓慢</Text>
                </View>
                {slowProducts.map((p) => (
                  <View key={p.id} className="flex items-center justify-between py-2">
                    <View>
                      <Text className="text-gray-600 text-sm">{p.name} {p.spec}</Text>
                      <Text className="text-gray-400 text-xs">库存{p.stock}，周销仅{p.weekSales}瓶</Text>
                    </View>
                    <View className="flex gap-2">
                      <View
                        className="px-2 py-1 bg-yellow-100 rounded-full"
                        onClick={() => Taro.showToast({ title: '可设为每周特价¥9.9促销', icon: 'none', duration: 2000 })}
                      >
                        <Text className="text-yellow-700 text-xs">促销</Text>
                      </View>
                      <View
                        className="px-2 py-1 bg-blue-100 rounded-full"
                        onClick={() => Taro.showToast({ title: '可推送1元小酒票引流', icon: 'none', duration: 2000 })}
                      >
                        <Text className="text-blue-700 text-xs">引流</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* ====== 配货Tab ====== */}
        {activeTab === 'distribution' && (
          <View>
            {/* 自提点状态 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center justify-between mb-3">
                <Text className="text-gray-800 font-bold">自提点状态</Text>
                <View className="px-2 py-1 bg-blue-50 rounded-full">
                  <Text className="text-blue-600 text-xs">+ 添加自提点</Text>
                </View>
              </View>
              {MOCK_PICKUP_POINTS.map((point) => (
                <View key={point.id} className="py-3 border-b border-gray-50">
                  <View className="flex items-center justify-between">
                    <View className="flex items-center">
                      <Store size={16} color={point.stockLow ? '#EF4444' : '#10B981'} />
                      <Text className="text-gray-800 text-sm font-medium ml-2">{point.name}</Text>
                      {point.stockLow && (
                        <View className="ml-2 px-2 py-0.5 bg-red-100 rounded-full">
                          <Text className="text-red-600 text-xs">库存不足</Text>
                        </View>
                      )}
                    </View>
                    <ChevronRight size={16} color="#D1D5DB" />
                  </View>
                  <Text className="text-gray-400 text-xs mt-1">{point.address}</Text>
                  <View className="flex items-center gap-4 mt-2">
                    <View className="flex items-center gap-1">
                      <ShoppingBag size={12} color="#3B82F6" />
                      <Text className="text-blue-600 text-xs">待取{point.pendingOrders}单</Text>
                    </View>
                    <View className="flex items-center gap-1">
                      <CheckCircle size={12} color="#10B981" />
                      <Text className="text-green-600 text-xs">今日核销{point.todayRedeemed}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* 配货建议 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <Text className="text-gray-800 font-bold mb-3">智能配货建议</Text>
              <View className="bg-yellow-50 rounded-lg p-3 mb-3">
                <View className="flex items-center">
                  <Target size={14} color="#D97706" />
                  <Text className="text-yellow-700 text-sm font-medium ml-1">东区店库存不足</Text>
                </View>
                <Text className="text-yellow-600 text-xs mt-1">建议从总仓调拨：桃心暗动20瓶、芭乐微醺10瓶</Text>
              </View>
              <View className="bg-blue-50 rounded-lg p-3">
                <View className="flex items-center">
                  <Truck size={14} color="#2563EB" />
                  <Text className="text-blue-700 text-sm font-medium ml-1">今日待配送订单</Text>
                </View>
                <Text className="text-blue-600 text-xs mt-1">同城配送8单（满50起送）· 邮寄3单（京东快递）</Text>
              </View>
            </View>

            {/* 经销商配货 */}
            <View className="bg-white rounded-xl p-4">
              <Text className="text-gray-800 font-bold mb-3">经销商自提订单</Text>
              {[
                { name: '张明辉', order: '桃心暗动×20 + 榴红心事×10', time: '今日14:00', status: '待备货' },
                { name: '李雅琪', order: '芭乐微醺×5 + 果汁礼盒×3', time: '今日16:00', status: '已备货' },
              ].map((item, i) => (
                <View key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <View>
                    <View className="flex items-center">
                      <Text className="text-gray-800 text-sm">{item.name}</Text>
                      <View className="ml-2 px-2 py-0.5 rounded-full" style={{
                        backgroundColor: item.status === '待备货' ? '#FEF3C7' : '#DCFCE7'
                      }}>
                        <Text className="text-xs" style={{
                          color: item.status === '待备货' ? '#D97706' : '#16A34A'
                        }}>{item.status}</Text>
                      </View>
                    </View>
                    <Text className="text-gray-400 text-xs">{item.order} · {item.time}</Text>
                  </View>
                  {item.status === '待备货' && (
                    <View className="px-3 py-1 bg-yellow-500 rounded-full" onClick={() => Taro.showToast({ title: '已标记为备货中', icon: 'success' })}>
                      <Text className="text-white text-xs">备货</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ====== 活动Tab ====== */}
        {activeTab === 'activity' && (
          <View>
            {/* 创建新活动 */}
            <View className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 mb-3" onClick={() => {
              Taro.showToast({ title: '活动创建页开发中', icon: 'none' })
            }}>
              <View className="flex items-center justify-between">
                <View className="flex items-center">
                  <Plus size={20} color="white" />
                  <View className="ml-2">
                    <Text className="text-white font-bold">创建新活动</Text>
                    <Text className="text-white text-opacity-80 text-xs">促销 / 拼团 / 上新 / 节日</Text>
                  </View>
                </View>
                <ArrowRight size={18} color="white" />
              </View>
            </View>

            {/* 活动模板 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <Text className="text-gray-800 font-bold mb-3">活动模板</Text>
              <View className="grid grid-cols-2 gap-3">
                {[
                  { icon: Gift, label: '限时折扣', desc: '指定商品限时特价', color: '#EF4444' },
                  { icon: Users, label: '拼团活动', desc: '2人/10人/20人拼团', color: '#3B82F6' },
                  { icon: CalendarPlus, label: '新品首发', desc: '新品上架首周优惠', color: '#10B981' },
                  { icon: Award, label: '节日大促', desc: '618/中秋/毕业季', color: '#F59E0B' },
                ].map((tpl) => {
                  const Icon = tpl.icon
                  return (
                    <View key={tpl.label} className="border border-gray-100 rounded-lg p-3" onClick={() => Taro.showToast({ title: `${tpl.label}创建开发中`, icon: 'none' })}>
                      <View className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: tpl.color + '15' }}>
                        <Icon size={16} color={tpl.color} />
                      </View>
                      <Text className="text-gray-800 text-sm font-medium mt-2">{tpl.label}</Text>
                      <Text className="text-gray-400 text-xs">{tpl.desc}</Text>
                    </View>
                  )
                })}
              </View>
            </View>

            {/* 进行中的活动 */}
            <View className="bg-white rounded-xl p-4">
              <Text className="text-gray-800 font-bold mb-3">进行中活动</Text>
              {MOCK_ACTIVITIES.filter(a => a.status === 'active').map((act) => {
                const typeMap = { promo: '促销', group: '拼团', new_product: '新品', holiday: '节日' }
                return (
                  <View key={act.id} className="py-3 border-b border-gray-50">
                    <View className="flex items-center justify-between">
                      <View className="flex items-center">
                        <View className="px-2 py-0.5 bg-green-100 rounded-full mr-2">
                          <Text className="text-green-700 text-xs">进行中</Text>
                        </View>
                        <Text className="text-gray-800 text-sm font-medium">{act.title}</Text>
                      </View>
                      <View className="px-2 py-0.5 bg-yellow-100 rounded-full">
                        <Text className="text-yellow-700 text-xs">{typeMap[act.type]}</Text>
                      </View>
                    </View>
                    <View className="flex items-center gap-4 mt-2">
                      <View className="flex items-center gap-1">
                        <Users size={12} color="#6B7280" />
                        <Text className="text-gray-500 text-xs">{act.participants}人参与</Text>
                      </View>
                      <View className="flex items-center gap-1">
                        <DollarSign size={12} color="#6B7280" />
                        <Text className="text-gray-500 text-xs">销售¥{act.sales.toLocaleString()}</Text>
                      </View>
                      <Text className="text-gray-400 text-xs">{act.startDate}起</Text>
                    </View>
                  </View>
                )
              })}
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
