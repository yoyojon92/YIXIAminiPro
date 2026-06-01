import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import {
  Calendar,
  Plus,
  MapPin,
  Users,
  Clock,
  QrCode,
  CircleCheck,
  CircleX
} from 'lucide-react-taro'
import { useAdminStore, ActivityStatus } from '@/store/adminStore'

export default function ActivityManage() {
  const { activities, updateActivityStatus, checkInActivity } = useAdminStore()
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | 'all'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  const filteredActivities = activities.filter(a => {
    return statusFilter === 'all' || a.status === statusFilter
  })
  
  const getStatusBadge = (status: ActivityStatus) => {
    switch (status) {
      case 'draft':
        return { text: '草稿', className: 'bg-gray-100 text-gray-500' }
      case 'published':
        return { text: '已发布', className: 'bg-blue-100 text-blue-600' }
      case 'ongoing':
        return { text: '进行中', className: 'bg-green-100 text-green-600' }
      case 'completed':
        return { text: '已完成', className: 'bg-purple-100 text-purple-600' }
      case 'cancelled':
        return { text: '已取消', className: 'bg-red-100 text-red-500' }
    }
  }
  
  const handleStatusChange = (id: string, status: ActivityStatus) => {
    updateActivityStatus(id, status)
    Taro.showToast({ title: '状态已更新', icon: 'success' })
  }
  
  return (
    <View className="min-h-screen bg-gray-50">
      {/* 筛选栏 */}
      <View className="flex bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto">
        {(['all', 'published', 'ongoing', 'completed', 'cancelled'] as const).map((status) => (
          <View
            key={status}
            className={`px-3 py-1 rounded-full mr-2 whitespace-nowrap ${statusFilter === status ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setStatusFilter(status)}
          >
            <Text className="text-sm">{status === 'all' ? '全部' : status === 'published' ? '已发布' : status === 'ongoing' ? '进行中' : status === 'completed' ? '已完成' : '已取消'}</Text>
          </View>
        ))}
      </View>
      
      {/* 活动列表 */}
      <View className="p-4">
        {filteredActivities.map((activity) => (
          <View key={activity.id} className="bg-white rounded-xl mb-3 overflow-hidden">
            {/* 基本信息 */}
            <View className="p-3">
              <View className="flex items-center justify-between mb-2">
                <Text className="text-gray-800 font-medium text-lg">{activity.title}</Text>
                <Text className={`px-2 py-1 rounded text-xs ${getStatusBadge(activity.status).className}`}>
                  {getStatusBadge(activity.status).text}
                </Text>
              </View>
              
              <View className="space-y-1 text-sm">
                <View className="flex items-center">
                  <Calendar size={14} color="#9ca3af" />
                  <Text className="text-gray-500 ml-1">{activity.date}</Text>
                  <Clock size={14} color="#9ca3af" className="ml-3" />
                  <Text className="text-gray-500 ml-1">{activity.time}</Text>
                </View>
                <View className="flex items-center">
                  <MapPin size={14} color="#9ca3af" />
                  <Text className="text-gray-500 ml-1">{activity.location}</Text>
                </View>
                <View className="flex items-center">
                  <Users size={14} color="#9ca3af" />
                  <Text className="text-gray-500 ml-1">
                    负责人: {activity.counselorName} | 
                    报名: {activity.registeredCount}/{activity.maxAttendees}
                  </Text>
                </View>
              </View>
              
              {/* 进度条 */}
              <View className="mt-3">
                <View className="flex justify-between text-xs text-gray-400 mb-1">
                  <Text>报名进度</Text>
                  <Text>{Math.round(activity.registeredCount / activity.maxAttendees * 100)}%</Text>
                </View>
                <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${Math.min(activity.registeredCount / activity.maxAttendees * 100, 100)}%` }}
                  />
                </View>
              </View>
            </View>
            
            {/* 统计数据（已完成活动显示） */}
            {activity.status === 'completed' && (
              <View className="border-t border-gray-100 p-3 bg-gray-50">
                <View className="grid grid-cols-3 gap-2">
                  <View className="bg-white rounded-lg p-2 text-center">
                    <Text className="text-gray-400 text-xs block">核销人数</Text>
                    <Text className="text-gray-700 font-medium">{activity.checkedInCount}</Text>
                  </View>
                  <View className="bg-white rounded-lg p-2 text-center">
                    <Text className="text-gray-400 text-xs block">现场销售</Text>
                    <Text className="text-green-600 font-medium">¥{activity.onSiteSales.toLocaleString()}</Text>
                  </View>
                  <View className="bg-white rounded-lg p-2 text-center">
                    <Text className="text-gray-400 text-xs block">订单数</Text>
                    <Text className="text-gray-700 font-medium">{activity.onSiteOrders}单</Text>
                  </View>
                </View>
              </View>
            )}
            
            {/* 操作按钮 */}
            <View className="border-t border-gray-100 p-3 bg-gray-50 flex flex-wrap gap-2">
              {activity.status === 'published' && (
                <>
                  <View
                    className="flex-1 py-2 rounded-lg bg-green-500 text-center"
                    onClick={() => handleStatusChange(activity.id, 'ongoing')}
                  >
                    <Text className="text-white">开始活动</Text>
                  </View>
                  <View
                    className="flex-1 py-2 rounded-lg bg-violet-500 text-center flex items-center justify-center"
                    onClick={() => {
                      Taro.showModal({
                        title: '核销码',
                        content: `核销码: ${activity.checkInCode}`,
                        showCancel: false
                      })
                    }}
                  >
                    <QrCode size={16} color="#fff" />
                    <Text className="text-white ml-1">核销码</Text>
                  </View>
                </>
              )}
              {activity.status === 'ongoing' && (
                <>
                  <View
                    className="flex-1 py-2 rounded-lg bg-purple-500 text-center"
                    onClick={() => handleStatusChange(activity.id, 'completed')}
                  >
                    <CircleCheck size={16} color="#fff" className="inline" />
                    <Text className="text-white ml-1">结束活动</Text>
                  </View>
                  <View
                    className="flex-1 py-2 rounded-lg bg-blue-500 text-center"
                    onClick={() => {
                      checkInActivity(activity.id)
                      Taro.showToast({ title: '已核销+1', icon: 'success' })
                    }}
                  >
                    <Text className="text-white">手动核销</Text>
                  </View>
                </>
              )}
              {activity.status === 'published' && (
                <View
                  className="py-2 px-4 rounded-lg bg-red-500 text-center"
                  onClick={() => handleStatusChange(activity.id, 'cancelled')}
                >
                  <CircleX size={16} color="#fff" className="inline" />
                  <Text className="text-white ml-1">取消</Text>
                </View>
              )}
            </View>
          </View>
        ))}
        
        {filteredActivities.length === 0 && (
          <View className="text-center py-8">
            <Text className="text-gray-400">暂无活动数据</Text>
          </View>
        )}
      </View>
      
      {/* 新增活动按钮 */}
      <View
        className="fixed right-4 bottom-20 w-14 h-14 bg-violet-600 rounded-full flex items-center justify-center shadow-lg"
        onClick={() => setShowCreateModal(true)}
      >
        <Plus size={24} color="#fff" />
      </View>
      
      {/* 创建活动弹窗 */}
      {showCreateModal && (
        <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <View className="bg-white rounded-xl w-80 p-4" onClick={(e) => e.stopPropagation()}>
            <Text className="text-lg font-medium mb-4 block">创建线下活动</Text>
            <View className="space-y-3">
              <View>
                <Text className="text-gray-500 text-sm block mb-1">活动标题</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <input type="text" placeholder="如：618品酒会" className="bg-transparent w-full" />
                </View>
              </View>
              <View>
                <Text className="text-gray-500 text-sm block mb-1">活动日期</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <input type="text" placeholder="如：2026-06-18" className="bg-transparent w-full" />
                </View>
              </View>
              <View>
                <Text className="text-gray-500 text-sm block mb-1">活动地点</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <input type="text" placeholder="如：青岛农业大学东区操场" className="bg-transparent w-full" />
                </View>
              </View>
              <View>
                <Text className="text-gray-500 text-sm block mb-1">最大人数</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <input type="number" placeholder="如：100" className="bg-transparent w-full" />
                </View>
              </View>
            </View>
            <View className="flex mt-4 gap-3">
              <View className="flex-1 py-2 rounded-lg bg-gray-200 text-center" onClick={() => setShowCreateModal(false)}>
                <Text className="text-gray-600">取消</Text>
              </View>
              <View className="flex-1 py-2 rounded-lg bg-violet-600 text-center" onClick={() => {
                setShowCreateModal(false)
                Taro.showToast({ title: '活动已创建', icon: 'success' })
              }}
              >
                <Text className="text-white">创建</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
