/**
 * 送酒员列表页面
 */
import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'

export default function RunnerListPage() {
  const [loading, setLoading] = useState(true)

  useDidShow(() => {
    setLoading(false)
  })

  const handleSelectRunner = (runnerId: string) => {
    // 选择送酒员后返回上一页
    Taro.setStorageSync('selectedRunnerId', runnerId)
    Taro.navigateBack()
  }

  // 模拟送酒员列表数据
  const mockRunners = [
    {
      id: 'runner_001',
      name: '小明',
      avatar: '',
      school: '邑夏大学',
      rating: 4.9,
      orderCount: 128,
      todayEarnings: 86.5
    },
    {
      id: 'runner_002', 
      name: '小红',
      avatar: '',
      school: '邑夏大学',
      rating: 4.8,
      orderCount: 96,
      todayEarnings: 72.0
    },
    {
      id: 'runner_003',
      name: '小刚',
      avatar: '',
      school: '邑夏大学',
      rating: 4.7,
      orderCount: 85,
      todayEarnings: 65.5
    }
  ]

  return (
    <View className="min-h-screen bg-gray-50 p-4">
      <View className="mb-4">
        <Text className="text-lg font-bold">选择送酒员</Text>
      </View>

      {loading ? (
        <View className="text-center py-8">
          <Text className="text-gray-400">加载中...</Text>
        </View>
      ) : (
        <View className="space-y-3">
          {mockRunners.map(runner => (
            <View 
              key={runner.id}
              className="bg-white rounded-lg p-4 shadow-sm active:bg-gray-100"
              onClick={() => handleSelectRunner(runner.id)}
            >
              <View className="flex items-center">
                <View className="w-12 h-12 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                  <Text className="text-xl">{runner.avatar || '👤'}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex items-center justify-between">
                    <Text className="font-medium">{runner.name}</Text>
                    <Text className="text-yellow-500 text-sm">⭐ {runner.rating}</Text>
                  </View>
                  <Text className="text-gray-400 text-sm">{runner.school}</Text>
                  <View className="flex items-center justify-between mt-1">
                    <Text className="text-gray-400 text-xs">已接单 {runner.orderCount} 单</Text>
                    <Text className="text-green-500 text-xs">今日 ¥{runner.todayEarnings}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
