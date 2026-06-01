/**
 * 选择送酒员弹窗组件
 */
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'

interface Runner {
  id: string
  name: string
  avatar: string
  school: string
  rating: number
  orderCount: number
}

interface SelectRunnerModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (runnerId: string, runnerName: string) => void
}

export default function SelectRunnerModal({ visible, onClose, onSelect }: SelectRunnerModalProps) {
  const [runners, setRunners] = useState<Runner[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      fetchRunners()
    }
  }, [visible])

  const fetchRunners = async () => {
    setLoading(true)
    try {
      // 模拟获取送酒员列表
      setRunners([
        { id: 'runner_001', name: '小明', avatar: '', school: '邑夏大学', rating: 4.9, orderCount: 128 },
        { id: 'runner_002', name: '小红', avatar: '', school: '邑夏大学', rating: 4.8, orderCount: 96 },
        { id: 'runner_003', name: '小刚', avatar: '', school: '邑夏大学', rating: 4.7, orderCount: 85 }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (runner: Runner) => {
    onSelect(runner.id, runner.name)
    onClose()
  }

  const handleViewAll = () => {
    Taro.navigateTo({ url: '/pagesRunner/runner-list/index' })
    onClose()
  }

  if (!visible) return null

  return (
    <View className="fixed inset-0 z-50" onClick={onClose}>
      {/* 遮罩 */}
      <View className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* 弹窗内容 */}
      <View 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-96"
        onClick={(e) => e.stopPropagation()}
      >
        <View className="flex justify-between items-center mb-4">
          <Text className="text-lg font-bold">选择送酒员</Text>
          <Text className="text-blue-500 text-sm" onClick={handleViewAll}>查看全部</Text>
        </View>

        {loading ? (
          <View className="text-center py-8">
            <Text className="text-gray-400">加载中...</Text>
          </View>
        ) : (
          <View className="space-y-3">
            {runners.map(runner => (
              <View 
                key={runner.id}
                className="flex items-center p-3 bg-gray-50 rounded-lg active:bg-gray-100"
                onClick={() => handleSelect(runner)}
              >
                <View className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                  <Text>{runner.avatar || '👤'}</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-medium block">{runner.name}</Text>
                  <View className="flex items-center">
                    <Text className="text-yellow-500 text-sm mr-2">⭐ {runner.rating}</Text>
                    <Text className="text-gray-400 text-sm">已接单 {runner.orderCount} 单</Text>
                  </View>
                </View>
                <Text className="text-blue-500">选择</Text>
              </View>
            ))}
          </View>
        )}

        {/* 不选择送酒员 */}
        <View 
          className="mt-4 text-center py-3 border-t border-gray-100"
          onClick={() => handleSelect({ id: '', name: '系统分配', avatar: '', school: '', rating: 0, orderCount: 0 })}
        >
          <Text className="text-gray-500">不指定，由系统分配</Text>
        </View>
      </View>
    </View>
  )
}
