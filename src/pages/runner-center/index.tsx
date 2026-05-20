/**
 * 跑腿员中心 - 送酒员工作台
 * 功能：收益统计、接单开关、订单管理（待接单/配送中/已完成）、提现入口
 */
import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import {
  Wallet, Bell, Package, MapPin,
  Phone, ChevronRight, Check, CircleX,
  Truck, TrendingUp, ShoppingBag
} from 'lucide-react-taro'

// 订单状态
type RunnerOrderStatus = 'pending' | 'accepted' | 'delivering' | 'completed' | 'rejected'

interface RunnerOrder {
  id: string
  orderNo: string
  customerName: string
  customerPhone: string
  customerAvatar: string
  products: { name: string; quantity: number; price: number }[]
  totalAmount: number
  deliveryFee: number
  deliveryAddress: string
  note: string
  status: RunnerOrderStatus
  createdAt: string
  acceptedAt?: string
  completedAt?: string
  emotionTag?: string
}

// Mock订单数据
const MOCK_ORDERS: RunnerOrder[] = [
  {
    id: 'ro_001',
    orderNo: 'YX20260520001',
    customerName: '小美同学',
    customerPhone: '138****6789',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaomei',
    products: [
      { name: '楂香四溢·山楂果酒 330ml', quantity: 1, price: 29.9 },
      { name: '似水榴年·石榴果酒 330ml', quantity: 2, price: 35.9 }
    ],
    totalAmount: 101.7,
    deliveryFee: 3,
    deliveryAddress: '北区宿舍 7号楼 302室',
    note: '放门口就行，谢谢～',
    status: 'pending',
    createdAt: '2026-05-20 14:05',
    emotionTag: '🍒 怒·疏肝'
  },
  {
    id: 'ro_002',
    orderNo: 'YX20260520002',
    customerName: '阿杰',
    customerPhone: '159****4321',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ajie',
    products: [
      { name: '大吉大梨·雪梨果酒 500ml', quantity: 1, price: 49.9 }
    ],
    totalAmount: 49.9,
    deliveryFee: 3,
    deliveryAddress: '东区食堂旁 快递柜3号',
    note: '急！考试前想喝一杯解压',
    status: 'pending',
    createdAt: '2026-05-20 14:12',
    emotionTag: '🍐 悲·润肺'
  },
  {
    id: 'ro_003',
    orderNo: 'YX20260519003',
    customerName: '学妹小云',
    customerPhone: '177****5678',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoyun',
    products: [
      { name: '桃你欢心·蜜桃果酒 330ml', quantity: 3, price: 29.9 },
      { name: '葡写浪漫·葡萄果酒 330ml', quantity: 1, price: 32.9 }
    ],
    totalAmount: 122.6,
    deliveryFee: 3,
    deliveryAddress: '南区宿舍 12号楼 518室',
    note: '社团聚会用，麻烦快一点～',
    status: 'delivering',
    createdAt: '2026-05-20 13:30',
    acceptedAt: '2026-05-20 13:32',
    emotionTag: '🍑 思·养脾'
  },
  {
    id: 'ro_004',
    orderNo: 'YX20260519004',
    customerName: '夜猫子',
    customerPhone: '136****9999',
    customerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yemaozi',
    products: [
      { name: '葡写浪漫·葡萄果酒 500ml', quantity: 1, price: 49.9 }
    ],
    totalAmount: 49.9,
    deliveryFee: 3,
    deliveryAddress: '计算机楼 402实验室',
    note: '',
    status: 'completed',
    createdAt: '2026-05-19 23:10',
    acceptedAt: '2026-05-19 23:11',
    completedAt: '2026-05-19 23:45',
    emotionTag: '🍇 恐·补肾'
  }
]

const STATUS_TABS = [
  { key: 'pending', label: '待接单' },
  { key: 'delivering', label: '配送中' },
  { key: 'completed', label: '已完成' }
]

export default function RunnerCenter() {
  const [isOnline, setIsOnline] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'delivering' | 'completed'>('pending')
  const [orders, setOrders] = useState<RunnerOrder[]>(MOCK_ORDERS)

  // 统计数据
  const todayEarnings = orders
    .filter(o => o.status === 'completed' && o.completedAt?.includes('2026-05-20'))
    .reduce((sum, o) => sum + o.deliveryFee + 2, 0)
  const todayOrders = orders.filter(o => 
    o.status !== 'rejected' && o.createdAt.includes('2026-05-20')
  ).length
  const totalEarnings = 856.5

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'pending') return o.status === 'pending'
    if (activeTab === 'delivering') return o.status === 'delivering' || o.status === 'accepted'
    if (activeTab === 'completed') return o.status === 'completed'
    return true
  })

  const handleAccept = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: 'delivering' as RunnerOrderStatus, acceptedAt: new Date().toLocaleString('zh-CN') } 
        : o
    ))
  }

  const handleReject = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: 'rejected' as RunnerOrderStatus } 
        : o
    ))
  }

  const handleComplete = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status: 'completed' as RunnerOrderStatus, completedAt: new Date().toLocaleString('zh-CN') } 
        : o
    ))
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部个人信息区 - 紫粉渐变 */}
      <View className="bg-gradient-to-br from-purple-500 to-pink-500 px-4 pt-6 pb-8">
        {/* 标题栏 */}
        <View className="flex items-center justify-between mb-4">
          <Text className="text-white text-lg font-semibold">跑腿员中心</Text>
          <View className="flex items-center gap-3">
            <View 
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              onClick={() => Taro.navigateTo({ url: '/pages/withdraw/index' })}
            >
              <Wallet size={18} color="#fff" />
            </View>
            <View 
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Bell size={18} color="#fff" />
            </View>
          </View>
        </View>

        {/* 个人信息行 */}
        <View className="flex items-center gap-3">
          <View 
            className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            <Text className="text-2xl">🍒</Text>
          </View>
          <View className="flex-1">
            <View className="flex items-center gap-2">
              <Text className="text-white text-lg font-bold">张东方</Text>
              <Badge className="text-xs bg-white bg-opacity-20 text-white border-0">🍒 楂楂肝谋士</Badge>
            </View>
            <Text className="text-white text-sm" style={{ opacity: 0.7 }}>青岛农业大学</Text>
          </View>
          <ChevronRight size={18} color="rgba(255,255,255,0.5)" />
        </View>

        {/* 接单开关 */}
        <View 
          className="mt-4 flex items-center justify-between rounded-xl px-4 py-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          <View className="flex items-center gap-2">
            <View 
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400' : 'bg-gray-400'}`} 
            />
            <Text className="text-white text-sm">
              {isOnline ? '接单中' : '休息中'}
            </Text>
          </View>
          <Switch
            checked={isOnline}
            onCheckedChange={setIsOnline}
          />
        </View>
      </View>

      {/* 统计卡片 - 两个并排 */}
      <View className="px-4 -mt-4">
        <View className="flex gap-3">
          {/* 今日收益 */}
          <Card className="flex-1">
            <CardContent className="p-4">
              <View className="flex items-center gap-2 mb-2">
                <View className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <TrendingUp size={16} color="#f59e0b" />
                </View>
                <Text className="text-xs text-gray-500">今日收益</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">¥{todayEarnings.toFixed(1)}</Text>
              <Text className="text-xs text-gray-400 mt-1">累计 ¥{totalEarnings}</Text>
            </CardContent>
          </Card>
          {/* 今日订单 */}
          <Card className="flex-1">
            <CardContent className="p-4">
              <View className="flex items-center gap-2 mb-2">
                <View className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <ShoppingBag size={16} color="#9333ea" />
                </View>
                <Text className="text-xs text-gray-500">今日订单</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-900">{todayOrders}</Text>
              <Text className="text-xs text-gray-400 mt-1">好评率 98.5%</Text>
            </CardContent>
          </Card>
        </View>
      </View>

      {/* 订单区域 */}
      <View className="px-4 mt-4">
        {/* 标题行 */}
        <View className="flex items-center justify-between mb-3">
          <Text className="text-sm font-semibold text-gray-900">我的订单</Text>
        </View>

        {/* Tab 切换 */}
        <View className="flex bg-white rounded-xl mb-3 overflow-hidden">
          {STATUS_TABS.map(tab => (
            <View
              key={tab.key}
              className={`flex-1 py-2 text-center text-sm font-medium relative ${
                activeTab === tab.key ? 'text-purple-600' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab.key as 'pending' | 'delivering' | 'completed')}
            >
              <Text>{tab.label}</Text>
              {activeTab === tab.key && (
                <View className="absolute bottom-0 left-1/2 w-8 h-1 bg-purple-600 rounded-full" style={{ transform: 'translateX(-50%)' }} />
              )}
              {tab.key === 'pending' && orders.filter(o => o.status === 'pending').length > 0 && (
                <View className="absolute top-1 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Text className="text-white text-xs">{orders.filter(o => o.status === 'pending').length}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 订单列表 */}
        {filteredOrders.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-16">
            <View className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Package size={32} color="#d1d5db" />
            </View>
            <Text className="text-gray-400">暂无订单</Text>
          </View>
        ) : (
          filteredOrders.map(order => (
            <Card key={order.id} className="mb-3 overflow-hidden">
              <CardContent className="p-0">
                {/* 订单头部 */}
                <View className="flex items-center justify-between px-4 py-3 bg-gray-50">
                  <View className="flex items-center gap-2">
                    <Text className="text-xs text-gray-500">{order.orderNo}</Text>
                    {order.emotionTag && (
                      <Badge variant="secondary">{order.emotionTag}</Badge>
                    )}
                  </View>
                  <Text className="text-xs text-gray-400">{order.createdAt}</Text>
                </View>

                {/* 客户+商品信息 */}
                <View className="px-4 py-3">
                  <View className="flex items-center gap-2 mb-2">
                    <View className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Text className="text-sm">👤</Text>
                    </View>
                    <Text className="text-sm font-medium text-gray-900">{order.customerName}</Text>
                    <View className="ml-auto flex items-center gap-1 text-purple-600">
                      <Phone size={14} color="#9333ea" />
                      <Text className="text-xs">联系</Text>
                    </View>
                  </View>

                  {order.products.map((p, idx) => (
                    <View key={idx} className="flex items-center justify-between py-1">
                      <Text className="text-sm text-gray-700">{p.name}</Text>
                      <Text className="text-sm text-gray-500">x{p.quantity} ¥{p.price}</Text>
                    </View>
                  ))}

                  <Separator className="my-2" />

                  <View className="flex items-center justify-between">
                    <View className="flex items-center gap-1">
                      <MapPin size={12} color="#9ca3af" />
                      <Text className="text-xs text-gray-500">{order.deliveryAddress}</Text>
                    </View>
                    <Text className="text-sm font-bold text-gray-900">¥{order.totalAmount + order.deliveryFee}</Text>
                  </View>

                  {order.note && (
                    <View className="mt-2 px-2 py-1 bg-amber-50 rounded">
                      <Text className="text-xs text-amber-700">📝 {order.note}</Text>
                    </View>
                  )}
                </View>

                {/* 操作按钮 */}
                <View className="px-4 py-3 border-t border-gray-100 flex items-center justify-end gap-2">
                  {order.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleReject(order.id)}>
                        <CircleX size={14} color="#FF6B00" />
                        拒单
                      </Button>
                      <Button size="sm" onClick={() => handleAccept(order.id)}>
                        <Check size={14} color="#fff" />
                        接单
                      </Button>
                    </>
                  )}
                  {order.status === 'delivering' && (
                    <Button size="sm" onClick={() => handleComplete(order.id)}>
                      <Truck size={14} color="#fff" />
                      确认送达
                    </Button>
                  )}
                  {order.status === 'completed' && (
                    <View className="flex items-center gap-1 text-green-600">
                      <Check size={14} color="#22c55e" />
                      <Text className="text-xs">已送达</Text>
                    </View>
                  )}
                </View>
              </CardContent>
            </Card>
          ))
        )}
      </View>
    </View>
  )
}
