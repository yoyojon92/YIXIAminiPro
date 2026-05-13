import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Package, Truck, MapPin, CircleCheck, Copy } from 'lucide-react-taro'

interface TrackingEvent {
  time: string
  status: string
  description: string
  icon: 'check' | 'truck' | 'package'
  color: 'green' | 'blue' | 'gray'
}

export default function Tracking() {
  const [orderNo] = useState('SF1089234567890')
  const [tracking] = useState<TrackingEvent[]>([
    {
      time: '2024-01-15 14:32',
      status: '已签收',
      description: '快件已由【城阳大学城菜鸟驿站】代收，感谢使用顺丰速运',
      icon: 'check',
      color: 'green',
    },
    {
      time: '2024-01-15 10:15',
      status: '派送中',
      description: '【青岛城阳区】您的订单正在派送中，快递员正在为您配送',
      icon: 'truck',
      color: 'blue',
    },
    {
      time: '2024-01-14 22:30',
      status: '运输中',
      description: '【青岛转运中心】快件已装车，正在发往目的城市',
      icon: 'package',
      color: 'blue',
    },
    {
      time: '2024-01-13 18:45',
      status: '运输中',
      description: '【潍坊中转场】快件到达中转场，准备发往下一站',
      icon: 'package',
      color: 'gray',
    },
    {
      time: '2024-01-13 08:20',
      status: '已发货',
      description: '【青岛城阳区营业部】卖家已发货，快件发出',
      icon: 'package',
      color: 'gray',
    },
  ])

  const getIcon = (icon: string, color: string) => {
    const iconColor = color === 'green' ? '#22c55e' : color === 'blue' ? '#3b82f6' : '#9ca3af'
    switch (icon) {
      case 'check':
        return <CircleCheck size={24} className="flex-shrink-0" color={iconColor} />
      case 'truck':
        return <Truck size={24} className="flex-shrink-0" color={iconColor} />
      default:
        return <Package size={24} className="flex-shrink-0" color={iconColor} />
    }
  }

  const getDotColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500'
      case 'blue':
        return 'bg-blue-500'
      default:
        return 'bg-gray-300'
    }
  }

  const handleCopy = () => {
    Taro.setClipboardData({
      data: orderNo,
      success: () => {
        Taro.showToast({ title: '运单号已复制', icon: 'success' })
      },
    })
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-4">
      {/* Header */}
      <View className="bg-white sticky top-0 z-50 flex items-center px-4 py-3 border-b border-gray-100">
        <View onClick={() => Taro.navigateBack()} className="p-1">
          <ChevronLeft size={24} color="#374151" />
        </View>
        <Text className="block text-lg font-semibold flex-1 text-center pr-8">物流追踪</Text>
      </View>

      <View className="p-4 space-y-4">
        {/* 快递信息卡片 */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <View className="flex items-center gap-3">
              <View className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Truck size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className="block text-white text-opacity-90 text-sm">顺丰速运</Text>
                <Text className="block text-white text-lg font-semibold mt-1">{orderNo}</Text>
              </View>
              <Button
                size="sm"
                variant="ghost"
                className="text-white border border-white border-opacity-50 bg-white bg-opacity-20"
                onClick={handleCopy}
              >
                <Copy size={14} className="mr-1" color="white" />
                <Text className="block text-sm text-white">复制</Text>
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* 物流时间线 */}
        <Card>
          <CardContent className="p-4">
            <View className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <MapPin size={18} color="#3b82f6" />
              <Text className="block text-base font-semibold">物流动态</Text>
            </View>

            <View className="space-y-0">
              {tracking.map((event, index) => (
                <View key={index} className="flex gap-3">
                  {/* 时间线 */}
                  <View className="flex flex-col items-center">
                    <View className={`w-6 h-6 rounded-full ${getDotColor(event.color)} flex items-center justify-center`}>
                      {getIcon(event.icon, event.color)}
                    </View>
                    {index < tracking.length - 1 && <View className="w-1 flex-1 bg-gray-200 my-1" />}
                  </View>

                  {/* 内容 */}
                  <View className="flex-1 pb-6">
                    <View className="flex items-center gap-2">
                      <Text className={`block text-sm font-medium ${event.color === 'green' ? 'text-green-600' : event.color === 'blue' ? 'text-blue-600' : 'text-gray-500'}`}>
                        {event.status}
                      </Text>
                    </View>
                    <Text className="block text-sm text-gray-600 mt-1 leading-relaxed">{event.description}</Text>
                    <Text className="block text-xs text-gray-400 mt-2">{event.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>

        {/* 收货信息 */}
        <Card>
          <CardContent className="p-4">
            <Text className="block text-sm font-medium text-gray-700 mb-3">收货信息</Text>
            <View className="space-y-2 text-sm">
              <View className="flex">
                <Text className="block text-gray-500 w-16">收件人</Text>
                <Text className="block text-gray-800">张同学</Text>
              </View>
              <View className="flex">
                <Text className="block text-gray-500 w-16">手机号</Text>
                <Text className="block text-gray-800">138****6789</Text>
              </View>
              <View className="flex">
                <Text className="block text-gray-500 w-16">收货地</Text>
                <Text className="block text-gray-800 flex-1">山东省青岛市城阳区xxx街道xxx小区</Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 温馨提示 */}
        <View className="bg-amber-50 rounded-xl p-4">
          <Text className="block text-sm text-amber-700 font-medium mb-2">温馨提示</Text>
          <Text className="block text-xs text-amber-600 leading-relaxed">
            1. 物流信息实时更新，如有疑问请联系客服{'\n'}
            2. 签收时请检查包裹是否完好{'\n'}
            3. 如有问题请在24小时内联系客服处理
          </Text>
        </View>
      </View>
    </View>
  )
}
