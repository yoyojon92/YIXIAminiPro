import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import {
  ChartBarBig,
  Users,
  Gift,
  Bell,
  Lightbulb,
  TrendingUp
} from 'lucide-react-taro'
import { useAdminStore } from '@/store/adminStore'

export default function UserProfileManage() {
  const { userProfile } = useAdminStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'action'>('overview')
  
  return (
    <View className="min-h-screen bg-gray-50">
      {/* Tab切换 */}
      <View className="flex border-b border-gray-200 bg-white">
        {(['overview', 'action'] as const).map((tab) => (
          <View
            key={tab}
            className={`flex-1 py-3 text-center ${activeTab === tab ? 'border-b-2 border-violet-600' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <Text className={activeTab === tab ? 'text-violet-600 font-medium' : 'text-gray-500'}>
              {tab === 'overview' ? '画像概览' : '运营操作'}
            </Text>
          </View>
        ))}
      </View>
      
      <View className="p-4">
        {activeTab === 'overview' && (
          <>
            {/* 总览卡片 */}
            <View className="grid grid-cols-3 gap-3 mb-4">
              <View className="bg-white rounded-xl p-3 text-center">
                <Text className="text-violet-600 text-2xl font-bold block">{userProfile.totalUsers}</Text>
                <Text className="text-gray-500 text-xs">总用户</Text>
              </View>
              <View className="bg-white rounded-xl p-3 text-center">
                <Text className="text-green-600 text-2xl font-bold block">{userProfile.activeUsers}</Text>
                <Text className="text-gray-500 text-xs">活跃用户</Text>
              </View>
              <View className="bg-white rounded-xl p-3 text-center">
                <Text className="text-blue-600 text-2xl font-bold block">+{userProfile.newUsersThisMonth}</Text>
                <Text className="text-gray-500 text-xs">本月新增</Text>
              </View>
            </View>
            
            {/* 学校分布 */}
            <View className="bg-white rounded-xl p-3 mb-4">
              <Text className="text-gray-700 font-medium mb-3 block">学校分布</Text>
              {userProfile.schoolDistribution.map((item, index) => (
                <View key={index} className="mb-2">
                  <View className="flex justify-between mb-1">
                    <Text className="text-gray-600 text-sm">{item.name}</Text>
                    <Text className="text-gray-500 text-sm">{item.count}人 ({item.percent}%)</Text>
                  </View>
                  <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-violet-500 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </View>
                </View>
              ))}
            </View>
            
            {/* 口味偏好 */}
            <View className="bg-white rounded-xl p-3 mb-4">
              <Text className="text-gray-700 font-medium mb-3 block">口味偏好</Text>
              <View className="flex gap-2">
                {userProfile.tastePreference.map((item, index) => (
                  <View key={index} className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                    <Text className="text-gray-700 font-medium block">{item.name}</Text>
                    <Text className="text-violet-600">{item.percent}%</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* 消费层级 */}
            <View className="bg-white rounded-xl p-3">
              <Text className="text-gray-700 font-medium mb-3 block">消费层级</Text>
              {userProfile.consumptionLevel.map((item, index) => (
                <View key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <View className="flex items-center">
                    <View className={`w-3 h-3 rounded-full mr-2 ${
                      item.level === 'high' ? 'bg-yellow-500' : item.level === 'medium' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    />
                    <Text className="text-gray-600">{item.label}</Text>
                  </View>
                  <Text className="text-gray-500">{item.count}人 ({item.percent}%)</Text>
                </View>
              ))}
            </View>
          </>
        )}
        
        {activeTab === 'action' && (
          <>
            {/* 定向发券 */}
            <View className="bg-white rounded-xl p-3 mb-4">
              <View className="flex items-center mb-3">
                <Gift size={20} color="#8b5cf6" />
                <Text className="text-gray-700 font-medium ml-2">定向发券</Text>
              </View>
              <View className="space-y-2 mb-3">
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <Text className="text-gray-400 text-sm">选择目标用户群</Text>
                </View>
                <View className="flex gap-2">
                  <View className="px-3 py-1 bg-violet-100 rounded-full">
                    <Text className="text-violet-600 text-sm">高消费用户</Text>
                  </View>
                  <View className="px-3 py-1 bg-gray-100 rounded-full">
                    <Text className="text-gray-600 text-sm">本月新增</Text>
                  </View>
                  <View className="px-3 py-1 bg-gray-100 rounded-full">
                    <Text className="text-gray-600 text-sm">果酒爱好者</Text>
                  </View>
                </View>
              </View>
              <View
                className="py-2 bg-violet-600 rounded-lg text-center"
                onClick={() => Taro.showToast({ title: '优惠券已发放', icon: 'success' })}
              >
                <Text className="text-white">发放优惠券</Text>
              </View>
            </View>
            
            {/* 推送通知 */}
            <View className="bg-white rounded-xl p-3 mb-4">
              <View className="flex items-center mb-3">
                <Bell size={20} color="#f59e0b" />
                <Text className="text-gray-700 font-medium ml-2">推送通知</Text>
              </View>
              <View className="space-y-2 mb-3">
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <input type="text" placeholder="输入通知标题" className="bg-transparent w-full" />
                </View>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <textarea placeholder="输入通知内容" className="bg-transparent w-full" rows={2} />
                </View>
              </View>
              <View
                className="py-2 bg-orange-500 rounded-lg text-center"
                onClick={() => Taro.showToast({ title: '通知已推送', icon: 'success' })}
              >
                <Text className="text-white">推送通知</Text>
              </View>
            </View>
            
            {/* 智能建议 */}
            <View className="bg-white rounded-xl p-3">
              <View className="flex items-center mb-3">
                <Lightbulb size={20} color="#10b981" />
                <Text className="text-gray-700 font-medium ml-2">智能运营建议</Text>
              </View>
              <View className="space-y-2">
                <View className="bg-green-50 rounded-lg p-2 flex items-start">
                  <TrendingUp size={16} color="#10b981" className="mt-1" />
                  <Text className="text-green-700 text-sm ml-2">
                    高消费用户占比偏低(16%)，建议针对中消费用户推出升级福利
                  </Text>
                </View>
                <View className="bg-blue-50 rounded-lg p-2 flex items-start">
                  <Users size={16} color="#3b82f6" className="mt-1" />
                  <Text className="text-blue-700 text-sm ml-2">
                    本月新增用户活跃度较高，建议在7日内进行留存转化
                  </Text>
                </View>
                <View className="bg-purple-50 rounded-lg p-2 flex items-start">
                  <ChartBarBig size={16} color="#8b5cf6" className="mt-1" />
                  <Text className="text-purple-700 text-sm ml-2">
                    果酒系列占销售65%，建议加强粮食酒和果汁推广
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  )
}
