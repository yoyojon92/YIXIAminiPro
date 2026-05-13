import { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { useRunnerStore } from '@/store/runnerStore'
import { 
  User, MapPin, Package, CircleCheck, 
  TrendingUp, Wallet, RefreshCw, LogOut,
  Bell, X
} from 'lucide-react-taro'
import "./home.config"

type TabType = 'pending' | 'delivering' | 'completed'

export default function RunnerHome() {
  const runnerStore = useRunnerStore()
  const { runnerInfo, orders, isRegistered, isAvailable, acceptOrder, completeOrder, addMockOrder, logout, getTodayEarnings, setAvailable, newOrderNotification, dismissNotification } = runnerStore
  
  const [activeTab, setActiveTab] = useState<TabType>('pending')

  // 未注册跳转注册页
  useEffect(() => {
    if (!isRegistered) {
      Taro.redirectTo({ url: '/pages/runner/register' })
    }
  }, [isRegistered])

  if (!isRegistered || !runnerInfo) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-gray-500">加载中...</Text>
      </View>
    )
  }

  // 过滤订单
  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'pending') return order.status === 'pending'
    if (activeTab === 'delivering') return order.status === 'delivering'
    if (activeTab === 'completed') return order.status === 'completed'
    return true
  })

  // Tab配置
  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'pending', label: '待接单', count: orders.filter(o => o.status === 'pending').length },
    { key: 'delivering', label: '配送中', count: orders.filter(o => o.status === 'delivering').length },
    { key: 'completed', label: '已完成', count: orders.filter(o => o.status === 'completed').length },
  ]

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      {/* 新订单通知弹窗 */}
      {newOrderNotification && (
        <View className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
          <View className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl">
            <View className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center justify-between">
              <View className="flex items-center gap-2">
                <Bell size={20} color="white" />
                <Text className="text-white font-semibold">新订单提醒</Text>
              </View>
              <View onClick={dismissNotification}>
                <X size={20} color="white" />
              </View>
            </View>
            <View className="p-4">
              <View className="flex items-start gap-3 mb-4">
                <View className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Package size={20} color="#F59E0B" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-xs">订单号: {newOrderNotification.orderNo}</Text>
                  <Text className="text-lg font-semibold text-gray-900 mt-1">有新的配送订单</Text>
                </View>
              </View>
              
              <View className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
                <View className="flex items-center gap-2">
                  <MapPin size={14} color="#8B5CF6" />
                  <Text className="text-xs text-gray-500">取货点</Text>
                  <Text className="text-sm text-gray-900">{newOrderNotification.pickupLocation}</Text>
                </View>
                <View className="flex items-center gap-2">
                  <MapPin size={14} color="#10B981" />
                  <Text className="text-xs text-gray-500">送货地址</Text>
                  <Text className="text-sm text-gray-900">{newOrderNotification.deliveryAddress}</Text>
                </View>
              </View>
              
              <View className="flex items-center justify-between mb-4">
                <Text className="text-gray-500">配送费</Text>
                <Text className="text-2xl font-bold text-amber-500">¥{newOrderNotification.deliveryFee}</Text>
              </View>
              
              <Button 
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500" 
                onClick={() => {
                  acceptOrder(newOrderNotification.id)
                  dismissNotification()
                  setActiveTab('delivering')
                }}
              >
                <Text className="text-white font-semibold">立即接单</Text>
              </Button>
            </View>
          </View>
        </View>
      )}

      {/* 顶部跑腿员信息 */}
      <View className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-5">
        <View className="flex items-center justify-between mb-4">
          <View className="flex items-center gap-3">
            <View className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
              <User size={28} color="#8B5CF6" />
            </View>
            <View>
              <Text className="text-white text-lg font-semibold">{runnerInfo.name}</Text>
              <Text className="text-white text-opacity-80 text-xs mt-1">{runnerInfo.school}</Text>
            </View>
          </View>
          <View 
            onClick={logout}
            className="p-2"
          >
            <LogOut size={20} color="white" />
          </View>
        </View>

        {/* 接单开关 */}
        <View className="bg-white bg-opacity-20 rounded-xl p-3 mb-4">
          <View className="flex items-center justify-between">
            <View>
              <Text className="text-white font-medium">接单状态</Text>
              <Text className="text-white text-opacity-80 text-xs mt-1">
                {isAvailable ? '正在接收新订单' : '休息中，暂不接单'}
              </Text>
            </View>
            <Switch 
              checked={isAvailable} 
              onCheckedChange={(checked) => setAvailable(checked)}
              className="scale-125"
            />
          </View>
        </View>

        {/* 收入统计 */}
        <View className="flex gap-4">
          <View className="flex-1 bg-white bg-opacity-20 rounded-xl p-3">
            <View className="flex items-center gap-1">
              <Wallet size={14} color="white" />
              <Text className="text-white text-opacity-80 text-xs">今日收入</Text>
            </View>
            <Text className="text-white text-2xl font-bold mt-1">¥{getTodayEarnings()}</Text>
          </View>
          <View className="flex-1 bg-white bg-opacity-20 rounded-xl p-3">
            <View className="flex items-center gap-1">
              <TrendingUp size={14} color="white" />
              <Text className="text-white text-opacity-80 text-xs">累计收入</Text>
            </View>
            <Text className="text-white text-2xl font-bold mt-1">¥{runnerInfo.totalEarnings}</Text>
          </View>
        </View>
      </View>

      {/* 快速添加订单（调试用） */}
      <View className="px-4 py-3 bg-white border-b border-gray-100">
        <View className="flex items-center justify-between">
          <Text className="text-sm text-gray-500">我的订单</Text>
          <View 
            onClick={addMockOrder}
            className="flex items-center gap-1 text-primary text-sm"
          >
            <RefreshCw size={14} color="#8B5CF6" />
            <Text>添加测试订单</Text>
          </View>
        </View>
      </View>

      {/* Tab切换 */}
      <View className="bg-white">
        <View className="flex">
          {tabs.map((tab) => (
            <View
              key={tab.key}
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${
                activeTab === tab.key
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <View className="flex items-center justify-center gap-1">
                <Text>{tab.label}</Text>
                {tab.count > 0 && (
                  <Badge variant="destructive" className="text-xs px-2 py-1">
                    {tab.count}
                  </Badge>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 订单列表 */}
      <ScrollView scrollY className="h-screen pb-32">
        <View className="px-4 py-4 space-y-3">
          {filteredOrders.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-16">
              <Package size={48} color="#D1D5DB" />
              <Text className="text-gray-400 mt-3">暂无订单</Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  {/* 订单状态 */}
                  <View className="flex items-center justify-between mb-3">
                    <Text className="text-xs text-gray-500">订单号: {order.orderNo}</Text>
                    <Badge 
                      variant={
                        order.status === 'pending' ? 'secondary' : 
                        order.status === 'delivering' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {order.status === 'pending' ? '待接单' : 
                       order.status === 'delivering' ? '配送中' : '已完成'}
                    </Badge>
                  </View>

                  {/* 取货点 */}
                  <View className="flex items-start gap-2 mb-2">
                    <MapPin size={14} color="#8B5CF6" className="mt-1" />
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500">取货点</Text>
                      <Text className="text-sm text-gray-900">{order.pickupLocation}</Text>
                    </View>
                  </View>

                  {/* 送货地址 */}
                  <View className="flex items-start gap-2 mb-3">
                    <MapPin size={14} color="#10B981" className="mt-1" />
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500">送货地址</Text>
                      <Text className="text-sm text-gray-900">{order.deliveryAddress}</Text>
                    </View>
                  </View>

                  {/* 配送费和操作 */}
                  <View className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <View className="flex items-center gap-1">
                      <Text className="text-xs text-gray-500">配送费</Text>
                      <Text className="text-lg font-bold text-primary">¥{order.deliveryFee}</Text>
                    </View>

                    {order.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => acceptOrder(order.id)}
                      >
                        <Text className="text-sm">接单</Text>
                      </Button>
                    )}

                    {order.status === 'delivering' && (
                      <Button 
                        size="sm" 
                        className="bg-green-500"
                        onClick={() => completeOrder(order.id)}
                      >
                        <CircleCheck size={14} color="white" />
                        <Text className="text-sm ml-1">确认送达</Text>
                      </Button>
                    )}

                    {order.status === 'completed' && (
                      <View className="flex items-center gap-1 text-green-500">
                        <CircleCheck size={14} color="#22C55E" />
                        <Text className="text-sm">已完成</Text>
                      </View>
                    )}
                  </View>
                </CardContent>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  )
}
