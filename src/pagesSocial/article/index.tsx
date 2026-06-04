import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Heart, Share2, Star, Clock4, Gift, ChevronLeft,
  MessageCircle, Sparkles
} from 'lucide-react-taro'

interface Article {
  id: number
  title: string
  content: string
  coverImage: string
  author: string
  authorAvatar: string
  readTime: string
  likes: number
  comments: number
  shares: number
  reward: number
  tags: string[]
  relatedProducts: {
    id: number
    name: string
    image: string
    price: number
  }[]
  createTime: string

}

const article: Article = {
  id: 1,
  title: '考试周的治愈小确幸',
  content: `期末考试周终于结束了！这段时间每天都在图书馆埋头苦读，压力山大。今天考完最后一门，和室友们决定好好犒劳一下自己。

我们买了几瓶邑夏的蜜桃心果酒，回到宿舍开了个小派对。打开瓶盖的瞬间，淡淡的蜜桃香气扑面而来，瞬间感觉所有的疲惫都被治愈了。

微醺的感觉刚刚好，不会太醉，但又能让人彻底放松下来。室友们一边喝一边聊天，聊聊考试的心得，聊聊暑假的计划，氛围特别好。

这款果酒的包装真的太好看，每喝完一瓶都有不同的心情，感觉喝酒都变得有意义起来。我们已经开始收集不同口味的体验了，希望每款都能试试！

姐妹们，考试周压力大的时候，不妨试试这种小确幸的治愈方式。果酒会陪你度过每一个需要放松的时刻~`,
  coverImage: '📖',
  author: '蜜桃少女',
  authorAvatar: '✍️',
  readTime: '3分钟',
  likes: 328,
  comments: 45,
  shares: 89,
  reward: 1,
  tags: ['#期末治愈', '#果酒陪伴', '#宿舍生活'],
  relatedProducts: [
    { id: 1, name: '蜜桃心果酒', image: '🍷', price: 29.9 },
    { id: 2, name: '蓝莓小果汁', image: '🧃', price: 19.9 }
  ],
  createTime: '2025-01-15',

}

export default function Article() {
  const [liked, setLiked] = useState(false)
  const [showReward, setShowReward] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
  }

  const goToProduct = (productId: number) => {
    Taro.navigateTo({ url: `/pages/product/index?id=${productId}` })
  }

  const generatePoster = () => {
    // TODO: 生成分享海报
    setShowShareModal(false)
  }

  const shareToFriend = () => {
    // TODO: 分享给好友
    setShowShareModal(false)
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-24">
      <ScrollView>
        {/* 顶部 */}
        <View className="relative">
          <Image src={article.coverImage} mode="aspectFill" className="w-full h-64" />
          <View className="absolute top-0 left-0 right-0 px-4 py-3 flex items-center justify-between">
            <View 
              className="w-10 h-10 bg-black bg-opacity-30 rounded-full flex items-center justify-center"
              onClick={() => Taro.navigateBack()}
            >
              <ChevronLeft size={24} color="white" />
            </View>
            <View className="flex gap-2">
              <View className="w-10 h-10 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                <Share2 size={18} color="white" onClick={() => setShowShareModal(true)} />
              </View>
              <View className="w-10 h-10 bg-black bg-opacity-30 rounded-full flex items-center justify-center">
                <Star size={18} color="white" />
              </View>
            </View>
          </View>
        </View>

        {/* 文章信息 */}
        <View className="px-4 py-4 bg-white">
          <Text className="text-xl font-bold text-gray-900 leading-7">{article.title}</Text>
          
          <View className="flex items-center gap-3 mt-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={article.authorAvatar} />
              <AvatarFallback>作者</AvatarFallback>
            </Avatar>
            <View className="flex-1">
              <Text className="text-sm font-medium text-gray-900">{article.author}</Text>
              <View className="flex items-center gap-2 mt-1">
                <Text className="text-xs text-gray-500">{article.createTime}</Text>
                <View className="flex items-center gap-1">
                  <Clock4 size={12} className="text-gray-400" color="#9ca3af" />
                  <Text className="text-xs text-gray-500">{article.readTime}</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="flex gap-2 mt-4">
            {article.tags.map((tag) => (
              <Text key={tag} className="text-xs text-primary bg-purple-50 px-2 py-1 rounded-full">
                {tag}
              </Text>
            ))}
          </View>
        </View>

        {/* 文章内容 */}
        <View className="px-4 py-4 bg-white mt-2">
          {article.content.split('\n\n').map((paragraph, index) => (
            <Text key={index} className="text-sm text-gray-700 leading-7 block mb-4">
              {paragraph}
            </Text>
          ))}
        </View>

        {/* 会员推荐 */}
        <View className="px-4 py-4 bg-white mt-2">
          <View className="flex items-center gap-2 mb-3">
            <Gift size={18} className="text-primary" color="#8B5CF6" />
            <Text className="text-sm font-medium text-gray-900">会员推荐</Text>
          </View>
          <View className="flex items-center gap-4 bg-purple-50 rounded-xl p-4">
            <View className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Sparkles size={32} color="white" />
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-900">9.9创始会员</Text>
              <Text className="text-xs text-gray-500 mt-1">开通即享1元小酒票+入会赠饮</Text>
            </View>
          </View>
        </View>

        {/* 相关产品 */}
        <View className="px-4 py-4 bg-white mt-2">
          <Text className="text-sm font-medium text-gray-900 mb-3">相关产品</Text>
          <View className="flex gap-3">
            {article.relatedProducts.map((product) => (
              <View 
                key={product.id} 
                className="flex-1"
                onClick={() => goToProduct(product.id)}
              >
                <Card className="overflow-hidden">
                  <Image src={product.image} mode="widthFix" className="w-full h-32" />
                  <CardContent className="p-2">
                    <Text className="text-xs text-gray-900 line-clamp-1">{product.name}</Text>
                    <View className="flex items-baseline gap-1 mt-1">
                      <Text className="text-sm text-primary font-bold">¥{product.price}</Text>
                    </View>
                  </CardContent>
                </Card>
              </View>
            ))}
          </View>
        </View>

        {/* 互动栏 */}
        <View className="px-4 py-4 bg-white mt-2">
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-6">
              <View 
                className="flex items-center gap-1"
                onClick={handleLike}
              >
                <Heart 
                  size={22} 
                  className={liked ? 'text-red-500' : 'text-gray-400'}
                  color={liked ? '#EF4444' : '#9ca3af'}
                />
                <Text className={`text-sm ${liked ? 'text-red-500' : 'text-gray-500'}`}>
                  {article.likes + (liked ? 1 : 0)}
                </Text>
              </View>
              <View className="flex items-center gap-1">
                <MessageCircle size={22} className="text-gray-400" color="#9ca3af" />
                <Text className="text-sm text-gray-500">{article.comments}</Text>
              </View>
              <View className="flex items-center gap-1">
                <Share2 size={22} className="text-gray-400" color="#9ca3af" />
                <Text className="text-sm text-gray-500">{article.shares}</Text>
              </View>
            </View>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-0">
              <Sparkles size={12} className="mr-1" color="#f59e0b" />
              阅读+{article.reward}积分
            </Badge>
          </View>
        </View>

        {/* 推荐阅读 */}
        <View className="px-4 py-4 mt-2">
          <Text className="text-sm font-medium text-gray-900 mb-3">推荐阅读</Text>
          <View className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <View key={i} className="flex-shrink-0 w-40">
                <Card className="overflow-hidden">
                  <Image 
                    src={['🎉', '☕', '🥂'][i-1]} 
                    mode="aspectFill" 
                    className="w-full h-24" 
                  />
                  <CardContent className="p-2">
                    <Text className="text-xs text-gray-900 line-clamp-2">
                      {['室友生日派对回顾', '一个人的下午茶', '和闺蜜的新年聚会'][i-1]}
                    </Text>
                    <View className="flex items-center gap-1 mt-2">
                      <Star size={10} className="text-amber-500" color="#f59e0b" />
                      <Text className="text-xs text-amber-500">+1碎片</Text>
                    </View>
                  </CardContent>
                </Card>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3"
        style={{ zIndex: 100 }}
      >
        <View className="flex items-center gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setShowShareModal(true)}>
            <Share2 size={16} className="mr-1" color="#8B5CF6" />
            <Text>分享</Text>
          </Button>
          <Button className="flex-1" onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>
            <Gift size={16} className="mr-1" color="#8B5CF6" />
            <Text>去看看产品</Text>
          </Button>
        </View>
      </View>

      {/* 分享弹窗 */}
      {showShareModal && (
        <View 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50"
          onClick={() => setShowShareModal(false)}
        >
          <View 
            className="w-full bg-white rounded-t-3xl p-6 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
            
            <Text className="text-lg font-bold text-gray-900 mb-6">分享到</Text>
            
            <View className="grid grid-cols-4 gap-6">
              <View className="flex flex-col items-center" onClick={shareToFriend}>
                <View className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <Text className="text-2xl">💬</Text>
                </View>
                <Text className="text-xs text-gray-600">微信好友</Text>
              </View>
              <View className="flex flex-col items-center">
                <View className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center mb-2">
                  <Text className="text-2xl">📱</Text>
                </View>
                <Text className="text-xs text-gray-600">朋友圈</Text>
              </View>
              <View className="flex flex-col items-center" onClick={generatePoster}>
                <View className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center mb-2">
                  <Text className="text-2xl">🖼️</Text>
                </View>
                <Text className="text-xs text-gray-600">生成海报</Text>
              </View>
              <View className="flex flex-col items-center">
                <View className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <Text className="text-2xl">🔗</Text>
                </View>
                <Text className="text-xs text-gray-600">复制链接</Text>
              </View>
            </View>
            
            <Button 
              variant="outline" 
              className="w-full mt-6"
              onClick={() => setShowShareModal(false)}
            >
              <Text>取消</Text>
            </Button>
          </View>
        </View>
      )}

      {/* 阅读奖励提示 */}
      {showReward && (
        <View 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowReward(false)}
        >
          <View 
            className="bg-white rounded-2xl p-6 mx-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <View className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={40} className="text-amber-500" color="#f59e0b" />
            </View>
            <Text className="text-lg font-bold text-gray-900 mb-2">恭喜获得阅读积分！</Text>
            <Text className="text-sm text-gray-500 mb-4">阅读《{article.title}》获得 {article.reward} 个积分</Text>
            <Button onClick={() => setShowReward(false)}>
              <Text>知道了</Text>
            </Button>
          </View>
        </View>
      )}
    </View>
  )
}
