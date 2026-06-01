import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import {
  Search,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Award,
  Gift
} from 'lucide-react-taro'
import { useAdminStore, CounselorTier } from '@/store/adminStore'

export default function CounselorManage() {
  const { counselors, updateCounselorTier, toggleCounselorStatus } = useAdminStore()
  const [searchText, setSearchText] = useState('')
  const [tierFilter, setTierFilter] = useState<CounselorTier | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  
  const filteredCounselors = counselors.filter(c => {
    const matchSearch = c.name.includes(searchText) || c.counselorCode.includes(searchText)
    const matchTier = tierFilter === 'all' || c.tier === tierFilter
    return matchSearch && matchTier
  })
  
  const getTierBadge = (tier: CounselorTier) => {
    switch (tier) {
      case 'gold':
        return { text: '金牌', className: 'bg-yellow-100 text-yellow-600', icon: '🥇' }
      case 'senior':
        return { text: '高级', className: 'bg-purple-100 text-purple-600', icon: '🥈' }
      case 'junior':
        return { text: '初级', className: 'bg-blue-100 text-blue-600', icon: '🥉' }
    }
  }
  
  const handleTierUpgrade = (id: string, currentTier: CounselorTier) => {
    const tiers: CounselorTier[] = ['junior', 'senior', 'gold']
    const currentIndex = tiers.indexOf(currentTier)
    if (currentIndex < tiers.length - 1) {
      updateCounselorTier(id, tiers[currentIndex + 1])
      Taro.showToast({ title: '升级成功', icon: 'success' })
    }
  }
  
  return (
    <View className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} color="#9ca3af" />
          <View className="flex-1 ml-2">
            <input
              type="text"
              placeholder="搜索辅导员姓名/推广码"
              value={searchText}
              onInput={(e) => setSearchText((e as any).detail.value)}
              className="bg-transparent w-full text-sm"
            />
          </View>
        </View>
      </View>
      
      {/* 筛选栏 */}
      <View className="flex bg-white border-b border-gray-200 px-4 py-2">
        {(['all', 'gold', 'senior', 'junior'] as const).map((tier) => (
          <View
            key={tier}
            className={`px-3 py-1 rounded-full mr-2 ${tierFilter === tier ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setTierFilter(tier)}
          >
            <Text className="text-sm">{tier === 'all' ? '全部' : tier === 'gold' ? '金牌' : tier === 'senior' ? '高级' : '初级'}</Text>
          </View>
        ))}
      </View>
      
      {/* 辅导员列表 */}
      <View className="p-4">
        {filteredCounselors.map((counselor) => (
          <View key={counselor.id} className="bg-white rounded-xl mb-3 overflow-hidden">
            {/* 基本信息 */}
            <View
              className="p-3 flex items-center justify-between"
              onClick={() => setExpandedId(expandedId === counselor.id ? null : counselor.id)}
            >
              <View className="flex items-center flex-1">
                <View className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                  <Text className="text-lg">{getTierBadge(counselor.tier).icon}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex items-center">
                    <Text className="text-gray-800 font-medium">{counselor.name}</Text>
                    <Text className={`ml-2 px-2 py-1 rounded text-xs ${getTierBadge(counselor.tier).className}`}>
                      {getTierBadge(counselor.tier).text}
                    </Text>
                    {counselor.status === 'inactive' && (
                      <Text className="ml-1 px-2 py-1 rounded text-xs bg-red-100 text-red-500">禁用</Text>
                    )}
                  </View>
                  <Text className="text-gray-400 text-xs">推广码: {counselor.counselorCode}</Text>
                </View>
              </View>
              <View className="flex items-center">
                <View className="text-right mr-3">
                  <Text className="text-violet-600 font-medium">¥{counselor.monthlySales.toLocaleString()}</Text>
                  <Text className="text-gray-400 text-xs block">本月销售额</Text>
                </View>
                {expandedId === counselor.id ? <ChevronUp size={20} color="#9ca3af" /> : <ChevronDown size={20} color="#9ca3af" />}
              </View>
            </View>
            
            {/* 展开操作区 */}
            {expandedId === counselor.id && (
              <View className="border-t border-gray-100 p-3 bg-gray-50">
                {/* 统计信息 */}
                <View className="grid grid-cols-4 gap-2 mb-3">
                  <View className="bg-white rounded-lg p-2 text-center">
                    <Text className="text-gray-400 text-xs block">注册学生</Text>
                    <Text className="text-gray-700 font-medium">{counselor.registeredStudents}</Text>
                  </View>
                  <View className="bg-white rounded-lg p-2 text-center">
                    <Text className="text-gray-400 text-xs block">本月提成</Text>
                    <Text className="text-green-600 font-medium">¥{counselor.monthlyCommission}</Text>
                  </View>
                  <View className="bg-white rounded-lg p-2 text-center">
                    <Text className="text-gray-400 text-xs block">累计提成</Text>
                    <Text className="text-gray-700 font-medium">¥{counselor.totalCommission}</Text>
                  </View>
                  <View className="bg-white rounded-lg p-2 text-center">
                    <Text className="text-gray-400 text-xs block">线下活动</Text>
                    <Text className="text-gray-700 font-medium">{counselor.offlineEvents}场</Text>
                  </View>
                </View>
                
                {/* 提成率 */}
                <View className="bg-white rounded-lg p-3 mb-3">
                  <Text className="text-gray-500 text-sm mb-2 block">提成比例</Text>
                  <View className="flex justify-between">
                    <View className="text-center">
                      <Text className="text-gray-400 text-xs block">线上提成</Text>
                      <Text className="text-violet-600 font-medium">{(counselor.onlineRate * 100).toFixed(0)}%</Text>
                    </View>
                    <View className="text-center">
                      <Text className="text-gray-400 text-xs block">线下提成</Text>
                      <Text className="text-violet-600 font-medium">{(counselor.offlineRate * 100).toFixed(0)}%</Text>
                    </View>
                  </View>
                </View>
                
                {/* 操作按钮 */}
                <View className="flex flex-wrap gap-2">
                  {/* 提成调整 */}
                  <View
                    className="flex-1 py-2 rounded-lg bg-blue-500 text-center flex items-center justify-center"
                    onClick={() => {
                      Taro.showToast({ title: '请在后台调整提成率', icon: 'none' })
                    }}
                  >
                    <TrendingUp size={16} color="#fff" />
                    <Text className="text-white ml-1">调提成</Text>
                  </View>
                  
                  {/* 层级升级 */}
                  {counselor.tier !== 'gold' && (
                    <View
                      className="flex-1 py-2 rounded-lg bg-yellow-500 text-center flex items-center justify-center"
                      onClick={() => handleTierUpgrade(counselor.id, counselor.tier)}
                    >
                      <Award size={16} color="#fff" />
                      <Text className="text-white ml-1">升级</Text>
                    </View>
                  )}
                  
                  {/* 发券 */}
                  <View
                    className="flex-1 py-2 rounded-lg bg-green-500 text-center flex items-center justify-center"
                    onClick={() => {
                      Taro.showToast({ title: '优惠券已发放', icon: 'success' })
                    }}
                  >
                    <Gift size={16} color="#fff" />
                    <Text className="text-white ml-1">发券</Text>
                  </View>
                  
                  {/* 启用/禁用 */}
                  <View
                    className={`py-2 px-4 rounded-lg text-center ${counselor.status === 'active' ? 'bg-red-500' : 'bg-gray-500'}`}
                    onClick={() => {
                      toggleCounselorStatus(counselor.id)
                      Taro.showToast({ title: counselor.status === 'active' ? '已禁用' : '已启用', icon: 'success' })
                    }}
                  >
                    <Text className="text-white">{counselor.status === 'active' ? '禁用' : '启用'}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
        
        {filteredCounselors.length === 0 && (
          <View className="text-center py-8">
            <Text className="text-gray-400">暂无辅导员数据</Text>
          </View>
        )}
      </View>
    </View>
  )
}
