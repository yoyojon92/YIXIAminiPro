import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, MapPin, Users, Gift, ChevronRight,
  Sparkles, PartyPopper, Ticket, TrendingUp
} from 'lucide-react-taro'

interface Activity {
  id: number
  title: string
  coverImage: string
  startTime: string
  endTime: string
  location: string
  participants: number
  maxParticipants: number
  status: 'upcoming' | 'ongoing' | 'ended'
  type: 'party' | 'tasting' | 'game' | 'reward'
  reward: string
  description: string
}

const activities: Activity[] = [
  {
    id: 1,
    title: '周末精灵派对',
    coverImage: 'https://picsum.photos/750/400?random=401',
    startTime: '2025-01-18 19:00',
    endTime: '2025-01-18 22:00',
    location: '青岛农业大学南门咖啡厅',
    participants: 45,
    maxParticipants: 60,
    status: 'upcoming',
    type: 'party',
    reward: '+5精灵碎片',
    description: '周末派对，和精灵一起放松！现场有抽奖、游戏互动，赢取限定周边。'
  },
  {
    id: 2,
    title: '新品品鉴会',
    coverImage: 'https://picsum.photos/750/400?random=402',
    startTime: '2025-01-15 14:00',
    endTime: '2025-01-15 17:00',
    location: '邑夏官方门店',
    participants: 30,
    maxParticipants: 30,
    status: 'ended',
    type: 'tasting',
    reward: '+3精灵碎片',
    description: '抢先品鉴即将上市的新品，参与即可获得专属品鉴徽章。'
  },
  {
    id: 3,
    title: '精灵知识问答',
    coverImage: 'https://picsum.photos/750/400?random=403',
    startTime: '2025-01-20 20:00',
    endTime: '2025-01-20 21:00',
    location: '线上活动群',
    participants: 128,
    maxParticipants: 200,
    status: 'ongoing',
    type: 'game',
    reward: '+8精灵碎片',
    description: '精灵知识大考验！答对题目即可获得碎片，前十名还有额外奖励。'
  },
  {
    id: 4,
    title: '老用户专属福利',
    coverImage: 'https://picsum.photos/750/400?random=404',
    startTime: '2025-01-10',
    endTime: '2025-01-31',
    location: '线上',
    participants: 568,
    maxParticipants: 1000,
    status: 'ongoing',
    type: 'reward',
    reward: '满100减20优惠券',
    description: '老用户回归专属福利，邀请好友下单双方都有优惠。'
  }
]

const statusConfig = {
  upcoming: { text: '即将开始', color: 'bg-blue-500', textColor: 'text-blue-500' },
  ongoing: { text: '进行中', color: 'bg-green-500', textColor: 'text-green-500' },
  ended: { text: '已结束', color: 'bg-gray-400', textColor: 'text-gray-400' }
}

const typeIcons = {
  party: PartyPopper,
  tasting: Sparkles,
  game: TrendingUp,
  reward: Gift
}

export default function Activity() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('all')

  const filteredActivities = activities.filter(activity => {
    if (activeTab === 'all') return true
    if (activeTab === 'ongoing') return activity.status === 'ongoing'
    if (activeTab === 'upcoming') return activity.status === 'upcoming'
    if (activeTab === 'ended') return activity.status === 'ended'
    return true
  })

  const goToDetail = (activityId: number) => {
    router.push({ url: `/pages/activity/index?id=${activityId}` })
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      {/* 顶部 */}
      <View className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-6">
        <Text className="text-white text-xl font-bold">社群活动</Text>
        <Text className="text-white text-opacity-80 text-sm mt-1">和精灵一起玩转校园生活</Text>
      </View>

      {/* 筛选标签 */}
      <View className="px-4 py-3 bg-white sticky top-0 z-50">
        <ScrollView scrollX showScrollbar={false}>
          <View className="flex gap-2">
            {[
              { key: 'all', label: '全部活动' },
              { key: 'ongoing', label: '进行中' },
              { key: 'upcoming', label: '即将开始' },
              { key: 'ended', label: '已结束' }
            ].map((tab) => (
              <View
                key={tab.key}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Text>{tab.label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 活动列表 */}
      <View className="px-4 py-4">
        {filteredActivities.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <Calendar size={48} className="text-gray-300 mb-4" />
            <Text className="text-gray-500 text-lg mb-2">暂无活动</Text>
            <Text className="text-gray-400 text-sm">敬请期待更多精彩活动</Text>
          </View>
        ) : (
          filteredActivities.map((activity) => {
            const config = statusConfig[activity.status]
            const TypeIcon = typeIcons[activity.type]
            const progress = (activity.participants / activity.maxParticipants) * 100
            
            return (
              <Card 
                key={activity.id} 
                className="mb-4 overflow-hidden"
                onClick={() => goToDetail(activity.id)}
              >
                <View className="relative">
                  <Image 
                    src={activity.coverImage} 
                    mode="aspectFill" 
                    className="w-full h-44"
                  />
                  <View className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs text-white ${config.color}`}>
                    <Text>{config.text}</Text>
                  </View>
                  <View className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow">
                    <TypeIcon size={20} className="text-primary" />
                  </View>
                </View>
                
                <CardContent className="p-4">
                  <Text className="text-base font-semibold text-gray-900">{activity.title}</Text>
                  <Text className="text-sm text-gray-600 mt-1 line-clamp-2">{activity.description}</Text>
                  
                  <View className="flex items-center gap-4 mt-3">
                    <View className="flex items-center gap-1">
                      <Calendar size={14} className="text-gray-400" />
                      <Text className="text-xs text-gray-500">{activity.startTime}</Text>
                    </View>
                    <View className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-400" />
                      <Text className="text-xs text-gray-500 truncate max-w-32">{activity.location}</Text>
                    </View>
                  </View>
                  
                  <View className="mt-3">
                    <View className="flex items-center justify-between text-xs mb-1">
                      <View className="flex items-center gap-1">
                        <Users size={14} className="text-gray-400" />
                        <Text className="text-gray-500">
                          {activity.participants}/{activity.maxParticipants}人
                        </Text>
                      </View>
                      <Text className={`${config.textColor}`}>{Math.round(progress)}%</Text>
                    </View>
                    <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <View 
                        className={`h-full rounded-full ${config.color}`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </View>
                  </View>
                  
                  <View className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700 border-0">
                      <Gift size={12} className="mr-1" />
                      {activity.reward}
                    </Badge>
                    <View className="flex items-center text-primary">
                      <Text className="text-sm">立即报名</Text>
                      <ChevronRight size={16} />
                    </View>
                  </View>
                </CardContent>
              </Card>
            )
          })
        )}
      </View>

      {/* 悬浮按钮 */}
      <View 
        className="fixed bottom-6 right-4 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
        onClick={() => {}}
      >
        <Ticket size={24} color="white" />
      </View>
    </View>
  )
}
