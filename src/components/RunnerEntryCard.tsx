/**
 * 送酒员入口卡片组件
 */
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'

interface RunnerEntryCardProps {
  title?: string
  subtitle?: string
  showStats?: boolean
}

export default function RunnerEntryCard({ 
  title = '送酒员服务',
  subtitle = '专业配送，风雨无阻',
  showStats = true
}: RunnerEntryCardProps) {
  const handleTap = () => {
    Taro.navigateTo({ url: '/pages/runner/home' })
  }

  const handleBeRunner = () => {
    Taro.navigateTo({ url: '/pages/runner/register' })
  }

  return (
    <View className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl p-4 shadow-lg">
      {/* 主入口 */}
      <View className="flex items-center justify-between" onClick={handleTap}>
        <View className="flex-1">
          <Text className="text-white text-lg font-bold block">{title}</Text>
          <Text className="text-orange-100 text-sm mt-1 block">{subtitle}</Text>
        </View>
        <View className="w-12 h-12 bg-orange-300 rounded-full flex items-center justify-center">
          <Text className="text-2xl">🍺</Text>
        </View>
      </View>

      {/* 统计数据 */}
      {showStats && (
        <View className="mt-4 pt-3 border-t border-orange-300">
          <View className="grid grid-cols-3 gap-2">
            <View className="text-center">
              <Text className="text-white text-lg font-bold block">128</Text>
              <Text className="text-orange-100 text-xs block">今日配送</Text>
            </View>
            <View className="text-center">
              <Text className="text-white text-lg font-bold block">4.9</Text>
              <Text className="text-orange-100 text-xs block">平均评分</Text>
            </View>
            <View className="text-center">
              <Text className="text-white text-lg font-bold block">30分</Text>
              <Text className="text-orange-100 text-xs block">平均送达</Text>
            </View>
          </View>
        </View>
      )}

      {/* 成为送酒员 */}
      <View 
        className="mt-3 bg-orange-300 rounded-lg py-2 text-center active:bg-orange-200"
        onClick={handleBeRunner}
      >
        <Text className="text-white text-sm">加入送酒员，轻松赚零花钱 →</Text>
      </View>
    </View>
  )
}
