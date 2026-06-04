import { View, Text, Map } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import {
  ChartBar, Package, Truck, CalendarPlus, Users, Wallet,
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
  { id: '6', name: '红葡萄果酒', spec: '500ml', price: 49.9, stock: 45, weekSales: 23, status: 'on_sale', velocity: 0.51 },
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

type TabKey = 'data' | 'production' | 'distribution' | 'activity' | 'inspect'

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
          { key: 'data', label: '数据', icon: ChartBar },
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
        {/* ====== 巡检中心Tab ====== */}
        {activeTab === 'inspect' && (
          <View>
            {/* 第一层：供货保障体系 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center mb-3">
                <Package size={16} color="#3B82F6" />
                <Text className="text-gray-800 font-bold ml-1">第一层·供货保障</Text>
              </View>
              
              {/* 缺货预警 */}
              <View className="bg-red-50 rounded-lg p-3 mb-3">
                <View className="flex items-center mb-2">
                  <AlertTriangle size={14} color="#DC2626" />
                  <Text className="text-red-700 text-sm font-bold ml-1">缺货预警</Text>
                </View>
                {MOCK_PRODUCTS.filter(p => p.stock < 30 && p.status === 'on_sale').map(p => (
                  <View key={p.id} className="flex items-center justify-between py-2 border-b border-red-100">
                    <View>
                      <Text className="text-red-800 text-sm font-medium">{p.name} {p.spec}</Text>
                      <Text className="text-red-600 text-xs">库存仅{p.stock}瓶 · 周销{p.weekSales}瓶</Text>
                    </View>
                    <View className="px-3 py-1 bg-red-500 rounded-full" onClick={() => Taro.showToast({ title: '已发送补货通知', icon: 'success' })}>
                      <Text className="text-white text-xs">紧急补货</Text>
                    </View>
                  </View>
                ))}
                {MOCK_PRODUCTS.filter(p => p.stock < 30 && p.status === 'on_sale').length === 0 && (
                  <Text className="text-red-500 text-xs">暂无缺货预警</Text>
                )}
              </View>

              {/* 发货提醒 */}
              <View className="bg-blue-50 rounded-lg p-3 mb-3">
                <View className="flex items-center mb-2">
                  <Truck size={14} color="#2563EB" />
                  <Text className="text-blue-700 text-sm font-bold ml-1">发货提醒</Text>
                </View>
                <View className="flex items-center justify-between py-1">
                  <Text className="text-blue-600 text-sm">同城配送待发：8单</Text>
                  <Text className="text-blue-600 text-sm">邮寄待发：3单</Text>
                </View>
                <View className="flex items-center justify-between py-1">
                  <Text className="text-blue-600 text-sm">代理自提待备货：2单</Text>
                  <View className="px-3 py-1 bg-blue-500 rounded-full" onClick={() => Taro.showToast({ title: '已批量标记备货', icon: 'success' })}>
                    <Text className="text-white text-xs">一键备货</Text>
                  </View>
                </View>
              </View>

              {/* 单品日销量 */}
              <View className="bg-green-50 rounded-lg p-3">
                <View className="flex items-center mb-2">
                  <TrendingUp size={14} color="#059669" />
                  <Text className="text-green-700 text-sm font-bold ml-1">今日单品销量（调整生产策略）</Text>
                </View>
                {MOCK_PRODUCTS.filter(p => p.status === 'on_sale').sort((a, b) => b.weekSales - a.weekSales).map((p, i) => {
                  const dailyQty = Math.round(p.weekSales / 7)
                  const dailyRev = Math.round(dailyQty * p.price)
                  return (
                    <View key={p.id} className="flex items-center justify-between py-2 border-b border-green-100">
                      <View className="flex items-center">
                        <Text className="text-green-800 text-sm font-medium">{p.name}</Text>
                        {i < 3 && <View className="ml-2 px-2 py-0.5 bg-green-500 rounded-full"><Text className="text-white text-xs">TOP{i + 1}</Text></View>}
                      </View>
                      <View className="flex items-center gap-3">
                        <Text className="text-green-600 text-xs">日销{dailyQty}瓶</Text>
                        <Text className="text-green-700 text-xs font-bold">¥{dailyRev}</Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>

            {/* ====== 第二层：代理服务跟进 + 销售热点地图 + 配货路线 ====== */}

            {/* 2A. 升级代理服务跟进 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center mb-3">
                <Award size={16} color="#F59E0B" />
                <Text className="text-gray-800 font-bold ml-1">升级代理服务跟进</Text>
                <View className="ml-auto px-2 py-0.5 bg-yellow-50 rounded-full">
                  <Text className="text-yellow-600 text-xs">实时巡店</Text>
                </View>
              </View>

              {/* 代理升级进度列表 */}
              {[
                { name: '张明辉', level: 'bronze', totalSales: 1800, target: 2000, daysLeft: 42, canCross: true, salesVelocity: 43, lastRestock: '2026-06-03', phone: '138****5521' },
                { name: '李雅琪', level: 'silver', totalSales: 3200, target: 5000, daysLeft: 128, canCross: true, salesVelocity: 67, lastRestock: '2026-06-04', phone: '159****8832' },
                { name: '王浩然', level: 'bronze', totalSales: 600, target: 2000, daysLeft: 60, canCross: true, salesVelocity: 15, lastRestock: '2026-06-01', phone: '177****3301' },
              ].map((agent, i) => {
                const progress = Math.min(100, Math.round(agent.totalSales / agent.target * 100))
                const levelName = agent.level === 'bronze' ? '铜牌' : agent.level === 'silver' ? '银牌' : '金牌'
                const levelEmoji = agent.level === 'bronze' ? '🥉' : '🥈'
                const levelColor = agent.level === 'bronze' ? '#F59E0B' : '#9CA3AF'
                const crossDeposit = agent.level === 'bronze' ? 8000 : 5000
                const estDaysToUpgrade = agent.salesVelocity > 0 ? Math.ceil((agent.target - agent.totalSales) / agent.salesVelocity) : 999
                const isFastest = i === 0 // 模拟排名

                return (
                  <View key={i} className="py-3 border-b border-gray-50">
                    <View className="flex items-center justify-between">
                      <View className="flex items-center">
                        <View className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: levelColor + '20' }}>
                          <Text className="text-sm">{levelEmoji}</Text>
                        </View>
                        <View className="ml-2">
                          <View className="flex items-center">
                            <Text className="text-gray-800 text-sm font-medium">{agent.name}</Text>
                            {isFastest && <View className="ml-2 px-2 py-0.5 bg-orange-500 rounded-full"><Text className="text-white text-xs">最快达标</Text></View>}
                          </View>
                          <Text className="text-gray-500 text-xs">{levelName}代理 · 剩余{agent.daysLeft}天 · 日均¥{agent.salesVelocity}</Text>
                        </View>
                      </View>
                      <View className="px-2 py-1 rounded-full" style={{ backgroundColor: progress >= 80 ? '#DCFCE7' : progress >= 50 ? '#FEF3C7' : '#FEE2E2' }}>
                        <Text className="text-xs font-bold" style={{ color: progress >= 80 ? '#16A34A' : progress >= 50 ? '#D97706' : '#DC2626' }}>
                          {progress}%
                        </Text>
                      </View>
                    </View>

                    {/* 进度条 */}
                    <View className="mt-2 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <View className="h-full rounded-full" style={{ width: progress + '%', backgroundColor: progress >= 80 ? '#16A34A' : progress >= 50 ? '#F59E0B' : '#EF4444' }} />
                    </View>

                    <View className="flex items-center justify-between mt-2">
                      <Text className="text-gray-500 text-xs">销售¥{agent.totalSales}/{agent.target}</Text>
                      <Text className="text-gray-400 text-xs">预计{estDaysToUpgrade < 999 ? estDaysToUpgrade + '天达标' : '待加速'}</Text>
                    </View>

                    {/* 操作按钮区 */}
                    <View className="flex items-center gap-2 mt-2">
                      {/* 跨层级升级 */}
                      {agent.canCross && (
                        <View className="px-2 py-1 bg-purple-100 rounded-full" onClick={() => Taro.showModal({
                          title: '跨层级升级',
                          content: `${agent.name}可直接补¥${crossDeposit}升级为金牌代理，无需逐级升级。是否推送升级提示？`,
                          confirmText: '推送提示',
                          confirmColor: '#7C3AED',
                          success: (res) => { if (res.confirm) Taro.showToast({ title: '升级提示已推送', icon: 'success' }) }
                        })}>
                          <Text className="text-purple-600 text-xs font-bold">跨级升级→金牌¥{crossDeposit}</Text>
                        </View>
                      )}
                      {/* 电话跟进 */}
                      <View className="px-2 py-1 bg-blue-100 rounded-full" onClick={() => Taro.makePhoneCall({ phoneNumber: '13800005521' })}>
                        <Text className="text-blue-600 text-xs">电话跟进</Text>
                      </View>
                      {/* 催促囤货 */}
                      {progress >= 50 && (
                        <View className="px-2 py-1 bg-yellow-100 rounded-full" onClick={() => Taro.showToast({ title: '催促消息已发送', icon: 'success' })}>
                          <Text className="text-yellow-700 text-xs">催促囤货</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )
              })}

              {/* 跨层级升级规则 */}
              <View className="mt-3 bg-purple-50 rounded-lg p-3">
                <Text className="text-purple-700 text-sm font-bold">跨层级升级规则</Text>
                <Text className="text-purple-600 text-xs mt-1" style={{ lineHeight: '18px' }}>
                  · 铜牌代理可直接补¥8000升级金牌（跳过银牌）{'\n'}
                  · 银牌代理可直接补¥5000升级金牌{'\n'}
                  · 按达成速度排名，最快者优先获升级权提示{'\n'}
                  · 例：铜牌¥2000不够卖，3个月内充¥8000直接拿金牌
                </Text>
              </View>
            </View>

            {/* 2B. 代理补货服务跟进 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center mb-3">
                <RefreshCcw size={16} color="#059669" />
                <Text className="text-gray-800 font-bold ml-1">代理补货服务跟进</Text>
              </View>

              {/* 补货需求列表 */}
              {[
                { name: '张明辉', level: '铜牌', items: '榴红心事×15+桃心微醺×10', urgency: 'high', stockDays: 5, lastRestock: '6月3日', suggestion: '青苹微醉周转快，建议补20瓶' },
                { name: '李雅琪', level: '银牌', items: '芭乐×8+红葡萄×5', urgency: 'medium', stockDays: 12, lastRestock: '6月4日', suggestion: '经典特调三款库存充裕' },
                { name: '王浩然', level: '铜牌', items: '全品类补货', urgency: 'low', stockDays: 28, lastRestock: '6月1日', suggestion: '销售偏慢，建议先推1元小酒票引流' },
              ].map((item, i) => {
                const urgColor = item.urgency === 'high' ? '#DC2626' : item.urgency === 'medium' ? '#D97706' : '#16A34A'
                const urgBg = item.urgency === 'high' ? '#FEE2E2' : item.urgency === 'medium' ? '#FEF3C7' : '#DCFCE7'
                const urgText = item.urgency === 'high' ? '紧急' : item.urgency === 'medium' ? '一般' : '充足'
                return (
                  <View key={i} className="py-3 border-b border-gray-50">
                    <View className="flex items-center justify-between">
                      <View className="flex items-center">
                        <Text className="text-gray-800 text-sm font-medium">{item.name}</Text>
                        <View className="ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: urgBg }}>
                          <Text className="text-xs" style={{ color: urgColor }}>{urgText}</Text>
                        </View>
                      </View>
                      <Text className="text-gray-400 text-xs">库存可售{item.stockDays}天</Text>
                    </View>
                    <Text className="text-gray-600 text-xs mt-1">需补：{item.items}</Text>
                    <Text className="text-green-600 text-xs mt-1">💡 {item.suggestion}</Text>
                    <View className="flex items-center gap-2 mt-2">
                      <View className="px-3 py-1 bg-green-500 rounded-full" onClick={() => Taro.showToast({ title: '补货单已生成', icon: 'success' })}>
                        <Text className="text-white text-xs">生成补货单</Text>
                      </View>
                      <View className="px-3 py-1 bg-blue-500 rounded-full" onClick={() => Taro.makePhoneCall({ phoneNumber: '13800005521' })}>
                        <Text className="text-white text-xs">电话确认</Text>
                      </View>
                    </View>
                  </View>
                )
              })}
            </View>

            {/* 2C. 销售热点地图看板 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center justify-between mb-3">
                <View className="flex items-center">
                  <PieChart size={16} color="#EF4444" />
                  <Text className="text-gray-800 font-bold ml-1">销售热点地图</Text>
                </View>
                <View className="flex items-center gap-2">
                  <View className="px-2 py-0.5 bg-red-100 rounded-full"><Text className="text-red-600 text-xs">高</Text></View>
                  <View className="px-2 py-0.5 bg-yellow-100 rounded-full"><Text className="text-yellow-600 text-xs">中</Text></View>
                  <View className="px-2 py-0.5 bg-green-100 rounded-full"><Text className="text-green-600 text-xs">低</Text></View>
                </View>
              </View>

              {/* 腾讯地图组件 - 青岛城阳区为中心（自提点集中区） */}
              <View className="rounded-xl overflow-hidden mb-3" style={{ height: '220px' }}>
                <Map
                  style={{ width: '100%', height: '220px' }}
                  latitude={36.307}
                  longitude={120.397}
                  scale={13}
                  markers={[
                    { id: 1, latitude: 36.307, longitude: 120.397, title: '南门店', iconPath: '', width: 20, height: 20, callout: { content: '南门店 日销¥860', color: '#fff', bgColor: '#DC2626', fontSize: 11, borderRadius: 8, padding: 4, display: 'ALWAYS' } },
                    { id: 2, latitude: 36.312, longitude: 120.403, title: '东区店', iconPath: '', width: 20, height: 20, callout: { content: '东区店 日销¥520', color: '#fff', bgColor: '#D97706', fontSize: 11, borderRadius: 8, padding: 4, display: 'ALWAYS' } },
                    { id: 3, latitude: 36.302, longitude: 120.392, title: '北苑店', iconPath: '', width: 20, height: 20, callout: { content: '北苑店 日销¥380', color: '#fff', bgColor: '#16A34A', fontSize: 11, borderRadius: 8, padding: 4, display: 'ALWAYS' } },
                  ]}
                  showLocation={false}
                  enableZoom={true}
                />
              </View>

              {/* 热点排名 */}
              <View className="bg-gray-50 rounded-lg p-3 mb-3">
                <Text className="text-gray-700 text-sm font-bold mb-2">自提点日销排名</Text>
                {[
                  { name: '南门店', sales: 860, orders: 11, trend: '+15%', color: '#DC2626' },
                  { name: '东区店', sales: 520, orders: 7, trend: '+8%', color: '#D97706' },
                  { name: '北苑店', sales: 380, orders: 5, trend: '-3%', color: '#16A34A' },
                ].map((point, i) => (
                  <View key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <View className="flex items-center">
                      <View className="w-6 h-6 rounded-full flex items-center justify-center mr-2" style={{ backgroundColor: point.color + '20' }}>
                        <Text className="text-xs font-bold" style={{ color: point.color }}>{i + 1}</Text>
                      </View>
                      <View>
                        <Text className="text-gray-800 text-sm">{point.name}</Text>
                        <Text className="text-gray-400 text-xs">{point.orders}单/日</Text>
                      </View>
                    </View>
                    <View className="flex items-center gap-2">
                      <Text className="text-gray-800 text-sm font-bold">¥{point.sales}</Text>
                      <Text className="text-xs" style={{ color: point.trend.startsWith('+') ? '#16A34A' : '#DC2626' }}>{point.trend}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* 地图数据源说明 */}
              <View className="bg-blue-50 rounded-lg p-2">
                <Text className="text-blue-600 text-xs">📍 地图数据对接：腾讯地图(默认) / 百度地图 / 高德地图（可切换）</Text>
              </View>
            </View>

            {/* 2D. 配货成本计算 + 统一配货路线规划 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center mb-3">
                <Truck size={16} color="#3B82F6" />
                <Text className="text-gray-800 font-bold ml-1">配货路线规划</Text>
              </View>

              {/* 配货成本概览 */}
              <View className="grid grid-cols-3 gap-2 mb-3">
                <View className="bg-blue-50 rounded-lg p-2 text-center">
                  <Text className="text-blue-500 text-xs">今日配货量</Text>
                  <Text className="text-blue-800 text-lg font-bold">186瓶</Text>
                </View>
                <View className="bg-green-50 rounded-lg p-2 text-center">
                  <Text className="text-green-500 text-xs">预估成本</Text>
                  <Text className="text-green-800 text-lg font-bold">¥128</Text>
                </View>
                <View className="bg-purple-50 rounded-lg p-2 text-center">
                  <Text className="text-purple-500 text-xs">配送点数</Text>
                  <Text className="text-purple-800 text-lg font-bold">3站</Text>
                </View>
              </View>

              {/* 最优路线 */}
              <View className="bg-gray-50 rounded-lg p-3 mb-3">
                <View className="flex items-center justify-between mb-2">
                  <Text className="text-gray-700 text-sm font-bold">📍 最优路线（TSP算法）</Text>
                  <View className="px-2 py-0.5 bg-blue-500 rounded-full" onClick={() => Taro.showToast({ title: '路线已刷新', icon: 'success' })}>
                    <Text className="text-white text-xs">重新计算</Text>
                  </View>
                </View>
                
                {/* 路线可视化 */}
                <View className="flex items-center mb-3" style={{ overflowX: 'auto' }}>
                  <View className="flex items-center">
                    <View className="px-3 py-2 bg-blue-500 rounded-lg">
                      <Text className="text-white text-xs font-bold">🏭 总仓</Text>
                    </View>
                    <Text className="text-gray-400 text-lg mx-1">→</Text>
                    <View className="px-3 py-2 bg-red-100 rounded-lg">
                      <Text className="text-red-700 text-xs font-bold">①南门店</Text>
                      <Text className="text-red-500 text-xs">68瓶·3.2km</Text>
                    </View>
                    <Text className="text-gray-400 text-lg mx-1">→</Text>
                    <View className="px-3 py-2 bg-yellow-100 rounded-lg">
                      <Text className="text-yellow-700 text-xs font-bold">②东区店</Text>
                      <Text className="text-yellow-600 text-xs">52瓶·1.8km</Text>
                    </View>
                    <Text className="text-gray-400 text-lg mx-1">→</Text>
                    <View className="px-3 py-2 bg-green-100 rounded-lg">
                      <Text className="text-green-700 text-xs font-bold">③北苑店</Text>
                      <Text className="text-green-600 text-xs">66瓶·2.5km</Text>
                    </View>
                  </View>
                </View>

                {/* 成本明细 */}
                <View className="bg-white rounded-lg p-2">
                  <View className="flex items-center justify-between py-1">
                    <Text className="text-gray-500 text-xs">总里程</Text>
                    <Text className="text-gray-800 text-xs">7.5km</Text>
                  </View>
                  <View className="flex items-center justify-between py-1">
                    <Text className="text-gray-500 text-xs">油费/运费</Text>
                    <Text className="text-gray-800 text-xs">¥45 (¥6/km)</Text>
                  </View>
                  <View className="flex items-center justify-between py-1">
                    <Text className="text-gray-500 text-xs">人工费</Text>
                    <Text className="text-gray-800 text-xs">¥80 (1趟·2小时)</Text>
                  </View>
                  <View className="flex items-center justify-between py-1">
                    <Text className="text-gray-500 text-xs">包装耗材</Text>
                    <Text className="text-gray-800 text-xs">¥3</Text>
                  </View>
                  <View className="flex items-center justify-between py-1 border-t border-gray-100 mt-1">
                    <Text className="text-gray-700 text-xs font-bold">总成本</Text>
                    <Text className="text-blue-600 text-sm font-bold">¥128</Text>
                  </View>
                  <View className="flex items-center justify-between py-1">
                    <Text className="text-gray-500 text-xs">单瓶成本</Text>
                    <Text className="text-gray-600 text-xs">¥0.69/瓶</Text>
                  </View>
                </View>
              </View>

              {/* 配货操作 */}
              <View className="flex items-center gap-3">
                <View className="flex-1 py-2 bg-blue-500 rounded-xl text-center" onClick={() => Taro.showToast({ title: '配货单已下发', icon: 'success' })}>
                  <Text className="text-white text-sm font-bold">下发配货单</Text>
                </View>
                <View className="flex-1 py-2 bg-gray-100 rounded-xl text-center" onClick={() => Taro.showToast({ title: '路线已导出至导航', icon: 'success' })}>
                  <Text className="text-gray-700 text-sm font-bold">导出导航</Text>
                </View>
              </View>
            </View>

            {/* ====== 第三层：品牌暴露服务·产销用零距离 ====== */}

            {/* 3A. 月度销冠 & 客户榜 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center justify-between mb-3">
                <View className="flex items-center">
                  <Award size={16} color="#F59E0B" />
                  <Text className="text-gray-800 font-bold ml-1">月度销冠 & 客户榜</Text>
                </View>
                <View className="px-2 py-0.5 bg-yellow-50 rounded-full">
                  <Text className="text-yellow-600 text-xs">6月</Text>
                </View>
              </View>

              {/* 月度销冠 */}
              <View className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 mb-3">
                <View className="flex items-center justify-between">
                  <View className="flex items-center">
                    <View className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                      <Text className="text-white text-lg">🏆</Text>
                    </View>
                    <View className="ml-3">
                      <Text className="text-gray-800 text-sm font-bold">销冠代理：张明辉</Text>
                      <Text className="text-gray-500 text-xs">铜牌·本月¥12850 · 推荐112人</Text>
                    </View>
                  </View>
                  <View className="px-3 py-1 bg-yellow-500 rounded-full" onClick={() => Taro.showToast({ title: '已通知销冠并安排走访', icon: 'success' })}>
                    <Text className="text-white text-xs font-bold">安排走访</Text>
                  </View>
                </View>
              </View>

              {/* 代理排行 */}
              <View className="mb-3">
                <Text className="text-gray-700 text-sm font-bold mb-2">代理销售榜</Text>
                {[
                  { name: '张明辉', sales: 12850, orders: 168, badge: '🥇' },
                  { name: '李雅琪', sales: 8960, orders: 112, badge: '🥈' },
                  { name: '王浩然', sales: 4580, orders: 56, badge: '🥉' },
                ].map((a, i) => (
                  <View key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <View className="flex items-center">
                      <Text className="text-lg mr-2">{a.badge}</Text>
                      <View><Text className="text-gray-800 text-sm font-medium">{a.name}</Text><Text className="text-gray-400 text-xs">{a.orders}单</Text></View>
                    </View>
                    <Text className="text-gray-800 text-sm font-bold">¥{a.sales.toLocaleString()}</Text>
                  </View>
                ))}
              </View>

              {/* 用户消费榜 */}
              <View>
                <Text className="text-gray-700 text-sm font-bold mb-2">用户消费榜（高频核心用户）</Text>
                {[
                  { name: '陈小花', consume: 680, freq: 12, fav: '榴红心事', tag: '超级复购' },
                  { name: '刘大壮', consume: 520, freq: 8, fav: '芭乐金银花', tag: '品质种草' },
                  { name: '赵甜心', consume: 380, freq: 7, fav: '桃心微醺', tag: '社交达人' },
                  { name: '周同学', consume: 290, freq: 5, fav: '柚见倾心', tag: '潜力用户' },
                  { name: '吴小姐', consume: 260, freq: 5, fav: '红葡萄果酒', tag: '新品尝鲜' },
                ].map((u, i) => {
                  const tc = ['超级复购','品质种草','社交达人','潜力用户','新品尝鲜'][i]
                  const colors = ['#7C3AED','#D97706','#DC2626','#059669','#3B82F6']
                  return (
                    <View key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <View className="flex items-center">
                        <Text className="text-gray-500 text-sm w-5">{i+1}</Text>
                        <View className="ml-1">
                          <View className="flex items-center">
                            <Text className="text-gray-800 text-sm">{u.name}</Text>
                            <View className="ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: colors[i] + '15' }}>
                              <Text className="text-xs" style={{ color: colors[i] }}>{u.tag}</Text>
                            </View>
                          </View>
                          <Text className="text-gray-400 text-xs">消费{u.freq}次 · 最爱{u.fav}</Text>
                        </View>
                      </View>
                      <Text className="text-gray-800 text-sm font-bold">¥{u.consume}</Text>
                    </View>
                  )
                })}
              </View>
            </View>

            {/* 3B. 核心用户筛选 & 价值回馈 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center mb-3">
                <Users size={16} color="#7C3AED" />
                <Text className="text-gray-800 font-bold ml-1">核心用户筛选 & 价值回馈</Text>
              </View>

              <View className="grid grid-cols-3 gap-2 mb-3">
                <View className="bg-purple-50 rounded-lg p-3 text-center">
                  <Text className="text-purple-500 text-xs">超级用户</Text>
                  <Text className="text-purple-800 text-xl font-bold">23</Text>
                  <Text className="text-purple-500 text-xs">月消费≥3次</Text>
                </View>
                <View className="bg-blue-50 rounded-lg p-3 text-center">
                  <Text className="text-blue-500 text-xs">活跃用户</Text>
                  <Text className="text-blue-800 text-xl font-bold">89</Text>
                  <Text className="text-blue-500 text-xs">月消费1-2次</Text>
                </View>
                <View className="bg-gray-50 rounded-lg p-3 text-center">
                  <Text className="text-gray-500 text-xs">沉默用户</Text>
                  <Text className="text-gray-800 text-xl font-bold">156</Text>
                  <Text className="text-gray-400 text-xs">30天未消费</Text>
                </View>
              </View>

              {/* 超级用户详情 */}
              <View className="bg-purple-50 rounded-lg p-3 mb-3">
                <View className="flex items-center justify-between mb-2">
                  <Text className="text-purple-700 text-sm font-bold">🔥 超级用户甄选</Text>
                  <View className="px-2 py-0.5 bg-purple-500 rounded-full" onClick={() => Taro.showToast({ title: '已导出核心用户名单', icon: 'success' })}>
                    <Text className="text-white text-xs">导出名单</Text>
                  </View>
                </View>
                {[
                  { name: '陈小花', freq: 12, feedback: '榴红心事回购5次，朋友都种草了', action: '邀请品鉴' },
                  { name: '刘大壮', freq: 8, feedback: '芭乐口感独特，夏天冰一下绝了', action: '赠送新品' },
                  { name: '赵甜心', freq: 7, feedback: '送闺蜜很有面子', action: '小红书合作' },
                ].map((u, i) => (
                  <View key={i} className="flex items-center justify-between py-2 border-b border-purple-100">
                    <View>
                      <Text className="text-purple-800 text-sm font-medium">{u.name} · {u.freq}次/月</Text>
                      <Text className="text-purple-600 text-xs">💬 "{u.feedback}"</Text>
                    </View>
                    <View className="px-2 py-1 bg-purple-500 rounded-full" onClick={() => Taro.showToast({ title: '已安排：' + u.action, icon: 'success', duration: 2000 })}>
                      <Text className="text-white text-xs">{u.action}</Text>
                    </View>
                  </View>
                ))}
              </View>

              {/* 沉默用户唤醒 */}
              <View className="bg-gray-50 rounded-lg p-3">
                <View className="flex items-center justify-between mb-2">
                  <Text className="text-gray-700 text-sm font-bold">💤 沉默用户唤醒</Text>
                  <Text className="text-gray-400 text-xs">156人30天未消费</Text>
                </View>
                <View className="flex items-center gap-2">
                  <View className="flex-1 py-2 bg-yellow-500 rounded-lg text-center" onClick={() => Taro.showToast({ title: '1元小酒票已批量推送', icon: 'success' })}>
                    <Text className="text-white text-xs font-bold">推1元小酒票</Text>
                  </View>
                  <View className="flex-1 py-2 bg-red-500 rounded-lg text-center" onClick={() => Taro.showToast({ title: '生日9折已批量推送', icon: 'success' })}>
                    <Text className="text-white text-xs font-bold">推生日9折</Text>
                  </View>
                  <View className="flex-1 py-2 bg-blue-500 rounded-lg text-center" onClick={() => Taro.showToast({ title: '新品品鉴邀请已发送', icon: 'success' })}>
                    <Text className="text-white text-xs font-bold">新品品鉴</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* 3C. 真实反馈收集 & 营销素材库 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center mb-3">
                <Gift size={16} color="#DC2626" />
                <Text className="text-gray-800 font-bold ml-1">真实反馈收集 & 营销素材库</Text>
              </View>

              {/* 反馈入口：核销后自动触发 + 主动收集 */}
              <View className="bg-red-50 rounded-lg p-3 mb-3">
                <Text className="text-red-700 text-sm font-bold mb-1">📬 反馈收集机制</Text>
                <Text className="text-red-600 text-xs" style={{ lineHeight: '18px' }}>
                  · 核销后24h自动推送评价提醒（1元小酒票激励）{'\n'}
                  · 会员生日使用9折后自动收集体验反馈{'\n'}
                  · 核心用户每月1次深度访谈（电话/微信）{'\n'}
                  · 代理补货时同步收集终端客户口碑
                </Text>
              </View>

              {/* 真实反馈流 */}
              <View className="mb-3">
                <View className="flex items-center justify-between mb-2">
                  <Text className="text-gray-700 text-sm font-bold">💬 真实用户反馈</Text>
                  <View className="px-2 py-0.5 bg-red-50 rounded-full"><Text className="text-red-600 text-xs">本月+38条</Text></View>
                </View>
                {[
                  { user: '陈小花', text: '榴红心事太好喝了！第5次回购，朋友都被我种草了', product: '榴红心事', source: '核销后评价', time: '2小时前', hot: true, imgs: 2 },
                  { user: '刘大壮', text: '芭乐金银花口感独特，夏天冰一下绝了，准备整箱囤', product: '芭乐金银花', source: '订单备注', time: '5小时前', hot: true, imgs: 1 },
                  { user: '赵甜心', text: '桃心微醺送闺蜜很有面子，包装也好看，拍照超上镜', product: '桃心微醺', source: '朋友圈截图', time: '昨天', hot: false, imgs: 3 },
                  { user: '周同学', text: '9.9会员太值了，首单免费喝了一瓶柚见，现在每周回购', product: '柚见倾心', source: '核销后评价', time: '2天前', hot: false, imgs: 0 },
                  { user: '吴小姐', text: '红葡萄果酒比干红好入口，不喝酒的朋友也能接受', product: '红葡萄果酒', source: '微信私聊', time: '3天前', hot: true, imgs: 1 },
                ].map((fb, i) => (
                  <View key={i} className="py-2 border-b border-gray-50">
                    <View className="flex items-center justify-between">
                      <View className="flex items-center">
                        <Text className="text-gray-800 text-sm font-medium">{fb.user}</Text>
                        {fb.hot && <View className="ml-2 px-2 py-0.5 bg-red-100 rounded-full"><Text className="text-red-600 text-xs">🔥爆款口碑</Text></View>}
                      </View>
                      <Text className="text-gray-400 text-xs">{fb.time}</Text>
                    </View>
                    <Text className="text-gray-600 text-xs mt-1" style={{ lineHeight: '16px' }}>"{fb.text}"</Text>
                    <View className="flex items-center justify-between mt-1">
                      <View className="flex items-center gap-2">
                        <Text className="text-gray-400 text-xs">🎁 {fb.product}</Text>
                        <Text className="text-gray-400 text-xs">📎 {fb.source}</Text>
                        {fb.imgs > 0 && <Text className="text-blue-500 text-xs">🖼 {fb.imgs}张图</Text>}
                      </View>
                      <View className="flex items-center gap-2">
                        <View className="px-2 py-0.5 bg-red-100 rounded-full" onClick={() => Taro.showToast({ title: '已收录至营销素材库', icon: 'success' })}>
                          <Text className="text-red-600 text-xs">收录素材</Text>
                        </View>
                        <View className="px-2 py-0.5 bg-blue-100 rounded-full" onClick={() => Taro.showToast({ title: '已推送至小红书素材库', icon: 'success' })}>
                          <Text className="text-blue-600 text-xs">推小红书</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* 厂家走访 */}
              <View className="bg-orange-50 rounded-lg p-3 mb-3">
                <View className="flex items-center justify-between mb-2">
                  <Text className="text-orange-700 text-sm font-bold">🏭 厂家走访计划</Text>
                  <View className="px-2 py-0.5 bg-orange-500 rounded-full" onClick={() => Taro.showToast({ title: '走访日程已创建', icon: 'success' })}>
                    <Text className="text-white text-xs">+新建走访</Text>
                  </View>
                </View>
                {[
                  { target: '张明辉·南门店', date: '6月8日', purpose: '销冠走访·录使用体验视频', status: '待执行' },
                  { target: '李雅琪·东区店', date: '6月12日', purpose: '补货跟进·收集客户反馈', status: '待执行' },
                  { target: '核心用户茶话会', date: '6月15日', purpose: '新品品鉴·抖音直播素材采集', status: '筹备中' },
                ].map((p, i) => (
                  <View key={i} className="flex items-center justify-between py-2 border-b border-orange-100">
                    <View>
                      <Text className="text-orange-800 text-sm">{p.target}</Text>
                      <Text className="text-orange-600 text-xs">{p.purpose}</Text>
                    </View>
                    <View className="flex items-center gap-1">
                      <Text className="text-orange-500 text-xs">{p.date}</Text>
                      <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: p.status === '待执行' ? '#FEF3C7' : '#DBEAFE' }}>
                        <Text className="text-xs" style={{ color: p.status === '待执行' ? '#D97706' : '#2563EB' }}>{p.status}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* 线上营销矩阵 */}
              <View className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-3">
                <Text className="text-red-700 text-sm font-bold mb-2">📱 线上营销矩阵对接</Text>
                <View className="grid grid-cols-3 gap-2">
                  <View className="bg-white rounded-lg p-2 text-center" onClick={() => Taro.showToast({ title: '抖音素材库：12条待发布', icon: 'none', duration: 2000 })}>
                    <Text className="text-2xl">🎵</Text>
                    <Text className="text-gray-700 text-xs font-bold">抖音</Text>
                    <Text className="text-gray-400 text-xs">12条素材</Text>
                  </View>
                  <View className="bg-white rounded-lg p-2 text-center" onClick={() => Taro.showToast({ title: '小红书素材库：8篇待发布', icon: 'none', duration: 2000 })}>
                    <Text className="text-2xl">📕</Text>
                    <Text className="text-gray-700 text-xs font-bold">小红书</Text>
                    <Text className="text-gray-400 text-xs">8篇素材</Text>
                  </View>
                  <View className="bg-white rounded-lg p-2 text-center" onClick={() => Taro.showToast({ title: '微信私域：3条群发待执行', icon: 'none', duration: 2000 })}>
                    <Text className="text-2xl">💬</Text>
                    <Text className="text-gray-700 text-xs font-bold">微信私域</Text>
                    <Text className="text-gray-400 text-xs">3条待发</Text>
                  </View>
                </View>
                <Text className="text-red-500 text-xs mt-2" style={{ lineHeight: '16px' }}>
                  💡 素材来源：用户真实反馈 + 销冠走访视频 + 核心用户种草截图 + 新品品鉴会实录
                </Text>
              </View>
            </View>

            {/* 3D. 品牌复购率看板 */}
            <View className="bg-white rounded-xl p-4 mb-3">
              <View className="flex items-center mb-3">
                <TrendingUp size={16} color="#059669" />
                <Text className="text-gray-800 font-bold ml-1">品牌复购率看板</Text>
              </View>
              <View className="grid grid-cols-2 gap-3 mb-3">
                <View className="bg-green-50 rounded-lg p-3 text-center">
                  <Text className="text-green-500 text-xs">月复购率</Text>
                  <Text className="text-green-800 text-2xl font-bold">38.6%</Text>
                  <Text className="text-green-600 text-xs">↑5.2% 较上月</Text>
                </View>
                <View className="bg-blue-50 rounded-lg p-3 text-center">
                  <Text className="text-blue-500 text-xs">用户NPS</Text>
                  <Text className="text-blue-800 text-2xl font-bold">72</Text>
                  <Text className="text-blue-600 text-xs">净推荐值·优秀</Text>
                </View>
                <View className="bg-purple-50 rounded-lg p-3 text-center">
                  <Text className="text-purple-500 text-xs">核心用户占比</Text>
                  <Text className="text-purple-800 text-2xl font-bold">8.9%</Text>
                  <Text className="text-purple-600 text-xs">23/268人</Text>
                </View>
                <View className="bg-yellow-50 rounded-lg p-3 text-center">
                  <Text className="text-yellow-500 text-xs">正反馈率</Text>
                  <Text className="text-yellow-800 text-2xl font-bold">91%</Text>
                  <Text className="text-yellow-600 text-xs">38/42条好评</Text>
                </View>
              </View>
              <View className="bg-green-50 rounded-lg p-3">
                <Text className="text-green-700 text-sm font-bold mb-1">📈 复购提升建议</Text>
                <Text className="text-green-600 text-xs" style={{ lineHeight: '18px' }}>
                  · 沉默用户156人→推送1元小酒票唤醒，预计召回15%{'\n'}
                  · 核心用户23人→每月新品品鉴+专属折扣锁定{'\n'}
                  · 销冠代理走访→采集真实使用场景视频→抖音/小红书{'\n'}
                  · 核销后24h自动推送评价→1元小酒票激励反馈{'\n'}
                  · 目标：下月复购率突破45%
                </Text>
              </View>
            </View>

          </View>
        )}
      </View>
    </View>
  )
}
