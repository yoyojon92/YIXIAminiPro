/**
 * 送酒员详情页面
 */
import { View, Text } from '@tarojs/components'
import Taro, { useRouter, useDidShow } from '@tarojs/taro'
import { useState } from 'react'

interface RunnerDetail {
  id: string
  name: string
  avatar: string
  school: string
  studentId: string
  rating: number
  orderCount: number
  todayEarnings: number
  totalEarnings: number
  complaintCount: number
  registeredAt: string
  bio: string
}

export default function RunnerDetailPage() {
  const router = useRouter()
  const [runner, setRunner] = useState<RunnerDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useDidShow(() => {
    const runnerId = router.params.id
    if (runnerId) {
      // 模拟获取送酒员详情
      setRunner({
        id: runnerId,
        name: '小明',
        avatar: '',
        school: '邑夏大学',
        studentId: '2023****',
        rating: 4.9,
        orderCount: 128,
        todayEarnings: 86.5,
        totalEarnings: 2580.0,
        complaintCount: 0,
        registeredAt: '2024-01-15',
        bio: '专业送酒，风雨无阻！'
      })
    }
    setLoading(false)
  })

  const handleSelectRunner = () => {
    if (runner) {
      Taro.setStorageSync('selectedRunnerId', runner.id)
      Taro.setStorageSync('selectedRunnerName', runner.name)
      Taro.navigateBack()
    }
  }

  if (loading) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-gray-400">加载中...</Text>
      </View>
    )
  }

  if (!runner) {
    return (
      <View className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Text className="text-gray-400">送酒员不存在</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 头部信息 */}
      <View className="bg-white p-6 rounded-b-2xl shadow-sm">
        <View className="flex items-center">
          <View className="w-16 h-16 rounded-full bg-gray-200 mr-4 flex items-center justify-center">
            <Text className="text-3xl">{runner.avatar || '👤'}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold block">{runner.name}</Text>
            <Text className="text-gray-400 text-sm block">{runner.school}</Text>
            <View className="flex items-center mt-1">
              <Text className="text-yellow-500 mr-2">⭐ {runner.rating}</Text>
              <Text className="text-gray-400 text-sm">已接单 {runner.orderCount} 单</Text>
            </View>
          </View>
        </View>
        
        {runner.bio && (
          <View className="mt-4 p-3 bg-gray-50 rounded-lg">
            <Text className="text-gray-600 text-sm">{runner.bio}</Text>
          </View>
        )}
      </View>

      {/* 统计数据 */}
      <View className="bg-white mt-3 p-4">
        <Text className="text-lg font-bold block mb-3">数据统计</Text>
        <View className="grid grid-cols-3 gap-4">
          <View className="text-center">
            <Text className="text-2xl font-bold text-green-500 block">¥{runner.todayEarnings}</Text>
            <Text className="text-gray-400 text-sm block">今日收入</Text>
          </View>
          <View className="text-center">
            <Text className="text-2xl font-bold text-blue-500 block">¥{runner.totalEarnings}</Text>
            <Text className="text-gray-400 text-sm block">累计收入</Text>
          </View>
          <View className="text-center">
            <Text className="text-2xl font-bold text-gray-500 block">{runner.orderCount}</Text>
            <Text className="text-gray-400 text-sm block">总接单数</Text>
          </View>
        </View>
      </View>

      {/* 注册信息 */}
      <View className="bg-white mt-3 p-4">
        <Text className="text-lg font-bold block mb-3">注册信息</Text>
        <View className="space-y-2">
          <View className="flex justify-between">
            <Text className="text-gray-400">注册时间</Text>
            <Text className="text-gray-600">{runner.registeredAt}</Text>
          </View>
          <View className="flex justify-between">
            <Text className="text-gray-400">投诉次数</Text>
            <Text className="text-gray-600">{runner.complaintCount} 次</Text>
          </View>
        </View>
      </View>

      {/* 底部按钮 */}
      <View className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg">
        <View 
          className="bg-blue-500 text-white text-center py-3 rounded-lg font-medium active:bg-blue-600"
          onClick={handleSelectRunner}
        >
          <Text className="text-white">选择此送酒员</Text>
        </View>
      </View>
    </View>
  )
}
