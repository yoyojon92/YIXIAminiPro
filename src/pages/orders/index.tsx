import { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Clock4, Truck, Package, CircleCheck, CircleX, 
  Star, CircleAlert
} from 'lucide-react-taro'

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled'

interface Order {
  id: string
  status: OrderStatus
  statusText: string
  shopName: string
  items: {
    name: string
    image: string
    price: number
    quantity: number
    specs: string
  }[]
  totalPrice: number
  deliveryFee: number
  createTime: string
  fragmentCount: number
}

const orders: Order[] = [
  {
    id: 'ORD20240115001',
    status: 'pending',
    statusText: '待付款',
    shopName: '邑夏官方旗舰店',
    items: [
      { name: '蜜桃精灵果酒 330ml', image: 'https://picsum.photos/100/100?random=10', price: 29.9, quantity: 1, specs: '蜜桃味' }
    ],
    totalPrice: 29.9,
    deliveryFee: 3,
    createTime: '2024-01-15 14:30',
    fragmentCount: 2
  },
  {
    id: 'ORD20240114002',
    status: 'shipped',
    statusText: '待收货',
    shopName: '邑夏官方旗舰店',
    items: [
      { name: '蓝莓精灵果汁 250ml', image: 'https://picsum.photos/100/100?random=11', price: 19.9, quantity: 2, specs: '蓝莓味' }
    ],
    totalPrice: 39.8,
    deliveryFee: 0,
    createTime: '2024-01-14 10:20',
    fragmentCount: 1
  },
  {
    id: 'ORD20240113003',
    status: 'completed',
    statusText: '已完成',
    shopName: '邑夏官方旗舰店',
    items: [
      { name: '草莓精灵气泡酒 280ml', image: 'https://picsum.photos/100/100?random=12', price: 24.9, quantity: 1, specs: '草莓味' },
      { name: '柠檬精灵轻饮酒 250ml', image: 'https://picsum.photos/100/100?random=13', price: 22.9, quantity: 1, specs: '柠檬味' }
    ],
    totalPrice: 47.8,
    deliveryFee: 3,
    createTime: '2024-01-13 16:45',
    fragmentCount: 3
  }
]

const statusConfig: Record<OrderStatus, { text: string; color: string; icon: any }> = {
  pending: { text: '待付款', color: 'text-amber-500', icon: Clock4 },
  paid: { text: '待发货', color: 'text-blue-500', icon: Package },
  shipped: { text: '待收货', color: 'text-purple-500', icon: Truck },
  delivered: { text: '已发货', color: 'text-purple-500', icon: Truck },
  completed: { text: '已完成', color: 'text-green-500', icon: CircleCheck },
  cancelled: { text: '已取消', color: 'text-gray-400', icon: CircleX }
}

const tabList = [
  { key: 'all', title: '全部' },
  { key: 'pending', title: '待付款' },
  { key: 'shipped', title: '待收货' },
  { key: 'completed', title: '已完成' }
]

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => {
        if (activeTab === 'pending') return order.status === 'pending' || order.status === 'paid'
        if (activeTab === 'shipped') return order.status === 'shipped' || order.status === 'delivered'
        if (activeTab === 'completed') return order.status === 'completed'
        return true
      })

  const getStatusConfig = (status: OrderStatus) => statusConfig[status]

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      {/* Tab切换 */}
      <View className="bg-white sticky top-0 z-50">
        <View className="flex">
          {tabList.map((tab) => (
            <View
              key={tab.key}
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${
                activeTab === tab.key
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text>{tab.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 订单列表 */}
      <View className="px-4 py-4">
        {filteredOrders.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <CircleAlert size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mb-2">暂无订单</Text>
            <Text className="text-gray-400 text-sm mb-6">快去选购心仪的商品吧</Text>
            <Button onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>
              <Text>去购物</Text>
            </Button>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const config = getStatusConfig(order.status)
            const StatusIcon = config.icon
            return (
              <Card key={order.id} className="mb-4">
                <CardContent className="p-0">
                  {/* 订单头部 */}
                  <View className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <Text className="text-sm text-gray-500">{order.shopName}</Text>
                    <View className={`flex items-center gap-1 ${config.color}`}>
                      <StatusIcon size={14} color="#8B5CF6" />
                      <Text className="text-sm font-medium">{config.text}</Text>
                    </View>
                  </View>

                  {/* 商品列表 */}
                  <View className="p-4">
                    {order.items.map((item, index) => (
                      <View key={index} className="flex gap-3 mb-3 last:mb-0">
                        <Image src={item.image} mode="aspectFit" className="w-20 h-20 rounded-lg" />
                        <View className="flex-1">
                          <Text className="text-sm text-gray-900 font-medium line-clamp-1">{item.name}</Text>
                          <Text className="text-xs text-gray-500 mt-1">{item.specs}</Text>
                          <View className="flex items-center justify-between mt-2">
                            <Text className="text-sm text-gray-900">¥{item.price}</Text>
                            <Text className="text-sm text-gray-500">x{item.quantity}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* 精灵碎片 */}
                  {order.fragmentCount > 0 && (
                    <View className="px-4 py-2 bg-purple-50 mx-4 mb-3 rounded-lg flex items-center gap-2">
                      <Star size={14} color="#8B5CF6" />
                      <Text className="text-xs text-primary">获得 {order.fragmentCount} 精灵碎片</Text>
                    </View>
                  )}

                  <Separator />

                  {/* 订单底部 */}
                  <View className="px-4 py-3 flex items-center justify-between">
                    <View className="text-right">
                      <Text className="text-xs text-gray-500">共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件</Text>
                      <View className="flex items-baseline gap-1 mt-1">
                        <Text className="text-sm text-gray-500">实付款：</Text>
                        <Text className="text-lg font-bold text-gray-900">¥{(order.totalPrice + order.deliveryFee).toFixed(2)}</Text>
                      </View>
                    </View>
                    
                    <View className="flex gap-2">
                      {order.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" className="px-4">
                            <Text className="text-xs">取消</Text>
                          </Button>
                          <Button size="sm" className="px-4">
                            <Text className="text-xs">去付款</Text>
                          </Button>
                        </>
                      )}
                      {order.status === 'shipped' && (
                        <>
                          <Button variant="outline" size="sm" className="px-4">
                            <Text className="text-xs">查看物流</Text>
                          </Button>
                          <Button size="sm" className="px-4">
                            <Text className="text-xs">确认收货</Text>
                          </Button>
                        </>
                      )}
                      {order.status === 'completed' && (
                        <>
                          <Button variant="outline" size="sm" className="px-4">
                            <Text className="text-xs">再次购买</Text>
                          </Button>
                          <Button variant="secondary" size="sm" className="px-4">
                            <Star size={12} className="mr-1" color="#8B5CF6" />
                            <Text className="text-xs">评价</Text>
                          </Button>
                        </>
                      )}
                    </View>
                  </View>
                </CardContent>
              </Card>
            )
          })
        )}
      </View>
    </View>
  )
}
