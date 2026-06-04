import { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Star, ChevronRight, Sparkles, Heart,
  Clock4, BookOpen, TrendingUp
} from 'lucide-react-taro'

interface Diary {
  id: number
  title: string
  summary: string
  coverImage: string
  author: string
  authorAvatar: string
  readTime: string
  likes: number
  reward: number
  tags: string[]
  isLiked: boolean
  createDate: string
}

const diaries: Diary[] = [
  {
    id: 1,
    title: '考试周的治愈小确幸',
    summary: '期末考试压力大？让果酒陪你度过这个冬天。每一口都是来自桃花源的甜蜜治愈，微醺的感觉刚刚好～',
    coverImage: '📖',
    author: '蜜桃少女',
    authorAvatar: '😊',
    readTime: '3分钟',
    likes: 328,
    reward: 1,
    tags: ['#期末治愈', '#果酒陪伴'],
    isLiked: false,
    createDate: '2025-01-15'
  },
  {
    id: 2,
    title: '室友生日派对回顾',
    summary: '给室友庆祝生日，我们开了一瓶青梅心果酒。温馨的氛围，美好的夜晚，这就是青春该有的样子吧～',
    coverImage: '📝',
    author: '果酒爱好者',
    authorAvatar: '😊',
    readTime: '2分钟',
    likes: 256,
    reward: 1,
    tags: ['#宿舍生活', '#生日派对'],
    isLiked: true,
    createDate: '2025-01-14'
  },
  {
    id: 3,
    title: '一个人的周末下午茶',
    summary: '阳光正好，一本书，一杯蓝莓小果汁，享受独处的美好时光。简单的生活也可以很幸福。',
    coverImage: '📚',
    author: '校园生活家',
    authorAvatar: '😊',
    readTime: '4分钟',
    likes: 189,
    reward: 2,
    tags: ['#独处时光', '#下午茶'],
    isLiked: false,
    createDate: '2025-01-13'
  },
  {
    id: 4,
    title: '和闺蜜的新年第一聚',
    summary: '新年第一天，和好久不见的闺蜜重逢。我们点了草莓气泡果酒，聊了一整个下午，满满的幸福感～',
    coverImage: '✨',
    author: '青春纪念册',
    authorAvatar: '😊',
    readTime: '3分钟',
    likes: 412,
    reward: 1,
    tags: ['#闺蜜时光', '#新年'],
    isLiked: false,
    createDate: '2025-01-12'
  }
]

export default function Diary() {
  const [likedDiaries, setLikedDiaries] = useState<Record<number, boolean>>({})

  const handleLike = (diaryId: number) => {
    setLikedDiaries(prev => ({
      ...prev,
      [diaryId]: !prev[diaryId]
    }))
  }

  const goToDetail = (diaryId: number) => {
    Taro.navigateTo({ url: `/pages/article/index?id=${diaryId}` })
  }

  const totalReward = diaries.reduce((sum, d) => sum + d.reward, 0)

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      {/* 顶部 */}
      <View className="bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-6">
        <View className="flex items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-gray-900">每日日记</Text>
            <Text className="text-sm text-gray-500 mt-1">阅读赚积分，精选内容每日更新</Text>
          </View>
          <View className="flex items-center gap-1 bg-amber-500 text-white px-3 py-2 rounded-full">
            <Sparkles size={14} color="#ffffff" />
            <Text className="text-sm font-medium">{totalReward}积分待领</Text>
          </View>
        </View>
      </View>

      {/* 今日推荐 */}
      <View className="px-4 py-4">
        <View className="flex items-center justify-between mb-3">
          <View className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary" color="#8B5CF6" />
            <Text className="text-base font-semibold text-gray-900">今日推荐</Text>
          </View>
          <View className="flex items-center text-gray-500">
            <Text className="text-sm">更多</Text>
            <ChevronRight size={16} color="#6b7280" />
          </View>
        </View>

        {diaries.slice(0, 1).map((diary) => (
          <Card 
            key={diary.id} 
            className="overflow-hidden"
            onClick={() => goToDetail(diary.id)}
          >
            <View className="relative">
              <Image 
                src={diary.coverImage} 
                mode="aspectFill" 
                className="w-full h-48"
              />
              <View className="absolute inset-0 bg-gradient-to-t from-black bg-opacity-60 to-transparent flex items-end p-4">
                <View className="flex-1">
                  <Badge variant="secondary" className="bg-amber-500 text-white border-0 mb-2">
                    今日必读
                  </Badge>
                  <Text className="text-white text-lg font-bold">{diary.title}</Text>
                  <Text className="text-white text-opacity-80 text-sm mt-1 line-clamp-2">{diary.summary}</Text>
                </View>
              </View>
            </View>
            <CardContent className="p-4">
              <View className="flex items-center justify-between">
                <View className="flex items-center gap-2">
                  <Image src={diary.authorAvatar} mode="aspectFill" className="w-8 h-8 rounded-full" />
                  <Text className="text-sm text-gray-600">{diary.author}</Text>
                </View>
                <View className="flex items-center gap-4">
                  <View className="flex items-center gap-1">
                    <Clock4 size={14} className="text-gray-400" color="#9ca3af" />
                    <Text className="text-xs text-gray-500">{diary.readTime}</Text>
                  </View>
                  <View className="flex items-center gap-1">
                    <Star size={14} className="text-amber-500" color="#F59E0B" />
                    <Text className="text-xs text-amber-500">+{diary.reward}积分</Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* 精选日记列表 */}
      <View className="px-4 pb-4">
        <View className="flex items-center justify-between mb-3">
          <View className="flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" color="#8B5CF6" />
            <Text className="text-base font-semibold text-gray-900">精选内容</Text>
          </View>
        </View>

        {diaries.slice(1).map((diary) => (
          <Card 
            key={diary.id} 
            className="mb-3"
            onClick={() => goToDetail(diary.id)}
          >
            <CardContent className="p-0">
              <View className="flex gap-3 p-3">
                <Image 
                  src={diary.coverImage} 
                  mode="aspectFill" 
                  className="w-24 h-24 rounded-lg"
                />
                <View className="flex-1 flex flex-col justify-between py-1">
                  <View>
                    <Text className="text-sm font-medium text-gray-900 line-clamp-1">{diary.title}</Text>
                    <Text className="text-xs text-gray-500 mt-1 line-clamp-2">{diary.summary}</Text>
                  </View>
                  <View className="flex items-center justify-between">
                    <View className="flex items-center gap-1">
                      <Image src={diary.authorAvatar} mode="aspectFill" className="w-5 h-5 rounded-full" />
                      <Text className="text-xs text-gray-500">{diary.author}</Text>
                    </View>
                    <View className="flex items-center gap-3">
                      <View className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500" color="#F59E0B" />
                        <Text className="text-xs text-amber-500">+{diary.reward}</Text>
                      </View>
                      <View 
                        className="flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(diary.id)
                        }}
                      >
                        <Heart 
                          size={14} 
                          className={likedDiaries[diary.id] ? 'text-red-500' : 'text-gray-400'}
                          color={likedDiaries[diary.id] ? '#EF4444' : '#9ca3af'}
                        />
                        <Text className="text-xs text-gray-500">{diary.likes}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* 底部提示 */}
      <View className="px-4 pb-6">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <View className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Sparkles size={24} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900">阅读赚积分</Text>
              <Text className="text-xs text-gray-500 mt-1">每阅读一篇日记即可获得积分奖励</Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
