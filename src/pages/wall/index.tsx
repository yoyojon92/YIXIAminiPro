import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Heart, MessageCircle, Share2, Camera, ImagePlus, 
  TrendingUp, Clock4, Star, Award
} from 'lucide-react-taro'

interface Post {
  id: number
  userName: string
  userAvatar: string
  content: string
  images: string[]
  likes: number
  comments: number
  isLiked: boolean
  isFollowed: boolean
  createTime: string
  tags: string[]
  featured: boolean
}

const posts: Post[] = [
  {
    id: 1,
    userName: '蜜桃少女',
    userAvatar: 'https://picsum.photos/50/50?random=301',
    content: '今天考试终于结束了！和室友一起开了瓶蜜桃精灵果酒庆祝，微醺的感觉刚刚好～精灵图案太可爱了，室友们都要收藏！',
    images: [
      'https://picsum.photos/400/400?random=311',
      'https://picsum.photos/400/400?random=312'
    ],
    likes: 328,
    comments: 45,
    isLiked: false,
    isFollowed: false,
    createTime: '2小时前',
    tags: ['#期末庆祝', '#精灵陪伴'],
    featured: true
  },
  {
    id: 2,
    userName: '果酒爱好者',
    userAvatar: 'https://picsum.photos/50/50?random=302',
    content: '第一次尝试青梅精灵，口感真的很清爽！推荐给喜欢低度酒的朋友们～',
    images: ['https://picsum.photos/400/400?random=313'],
    likes: 156,
    comments: 23,
    isLiked: true,
    isFollowed: true,
    createTime: '5小时前',
    tags: ['#青梅精灵', '#低度酒推荐'],
    featured: false
  },
  {
    id: 3,
    userName: '校园美食家',
    userAvatar: 'https://picsum.photos/50/50?random=303',
    content: '宿舍聚餐怎么能少了精灵果酒！蓝莓味超好喝，包装也很精美，拍照超好看！',
    images: [
      'https://picsum.photos/400/400?random=314',
      'https://picsum.photos/400/400?random=315',
      'https://picsum.photos/400/400?random=316'
    ],
    likes: 256,
    comments: 38,
    isLiked: false,
    isFollowed: false,
    createTime: '昨天',
    tags: ['#宿舍聚餐', '#蓝莓精灵'],
    featured: true
  }
]

const hotTags = ['#期末庆祝', '#精灵陪伴', '#低度酒推荐', '#宿舍必备', '#送礼佳品']

export default function Wall() {
  const [activeTab, setActiveTab] = useState('recommend')
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({})
  const [showSubmitModal, setShowSubmitModal] = useState(false)

  const handleLike = (postId: number) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }))
  }

  const handleShare = (post: Post) => {
    // TODO: 分享功能
  }

  const submitPost = () => {
    setShowSubmitModal(true)
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      {/* 顶部 */}
      <View className="bg-white px-4 py-3 sticky top-0 z-50">
        <View className="flex items-center justify-between mb-3">
          <Text className="text-lg font-bold text-gray-900">创意墙</Text>
          <Button size="sm" onClick={submitPost}>
            <Camera size={16} className="mr-1" />
            <Text>投稿</Text>
          </Button>
        </View>

        {/* 标签切换 */}
        <ScrollView scrollX showScrollbar={false}>
          <View className="flex gap-2">
            {[
              { key: 'recommend', label: '推荐', icon: TrendingUp },
              { key: 'latest', label: '最新', icon: Clock4 },
              { key: 'hot', label: '热门', icon: Star }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <View
                  key={tab.key}
                  className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm ${
                    activeTab === tab.key
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <Icon size={14} />
                  <Text>{tab.label}</Text>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>

      {/* 热门标签 */}
      <View className="px-4 py-3 bg-white mt-2">
        <ScrollView scrollX showScrollbar={false}>
          <View className="flex gap-2">
            {hotTags.map((tag) => (
              <View 
                key={tag}
                className="px-3 py-1 bg-purple-50 text-primary text-xs rounded-full"
              >
                <Text>{tag}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 精选内容 */}
      {activeTab === 'recommend' && (
        <View className="px-4 py-3">
          <View className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-amber-500" />
            <Text className="text-sm font-medium text-gray-900">精选内容</Text>
          </View>
          
          {posts.filter(p => p.featured).map((post) => (
            <Card key={post.id} className="mb-3 overflow-hidden">
              <CardContent className="p-0">
                {/* 用户信息 */}
                <View className="flex items-center justify-between px-4 py-3">
                  <View className="flex items-center gap-3">
                    <Image src={post.userAvatar} mode="aspectFill" className="w-10 h-10 rounded-full" />
                    <View>
                      <Text className="text-sm font-medium text-gray-900">{post.userName}</Text>
                      <Text className="text-xs text-gray-500">{post.createTime}</Text>
                    </View>
                  </View>
                  {!post.isFollowed && (
                    <Button size="sm" variant="outline" className="px-3 py-1">
                      <Text className="text-xs">关注</Text>
                    </Button>
                  )}
                </View>

                {/* 内容 */}
                <View className="px-4 pb-3">
                  <Text className="text-sm text-gray-700 leading-6">{post.content}</Text>
                  <View className="flex gap-2 mt-2">
                    {post.tags.map((tag) => (
                      <Text key={tag} className="text-xs text-primary">{tag}</Text>
                    ))}
                  </View>
                </View>

                {/* 图片 */}
                {post.images.length > 0 && (
                  <View className={`px-4 gap-2 ${post.images.length > 1 ? 'flex' : ''}`}>
                    {post.images.slice(0, 3).map((img, index) => (
                      <View key={index} className="relative flex-1">
                        <Image 
                          src={img} 
                          mode="aspectFill" 
                          className={`w-full rounded-lg ${post.images.length === 1 ? 'h-64' : 'h-32'}`}
                        />
                        {index === 2 && post.images.length > 3 && (
                          <View className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                            <Text className="text-white text-lg font-bold">+{post.images.length - 3}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {/* 互动栏 */}
                <View className="flex items-center justify-between px-4 py-3 border-t border-gray-100 mt-3">
                  <View 
                    className="flex items-center gap-1"
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart 
                      size={18} 
                      className={likedPosts[post.id] ? 'text-red-500' : 'text-gray-400'}
                      fill={likedPosts[post.id] ? '#EF4444' : 'none'}
                    />
                    <Text className={`text-sm ${likedPosts[post.id] ? 'text-red-500' : 'text-gray-500'}`}>
                      {post.likes + (likedPosts[post.id] ? 1 : 0)}
                    </Text>
                  </View>
                  
                  <View className="flex items-center gap-1">
                    <MessageCircle size={18} className="text-gray-400" />
                    <Text className="text-sm text-gray-500">{post.comments}</Text>
                  </View>
                  
                  <View 
                    className="flex items-center gap-1"
                    onClick={() => handleShare(post)}
                  >
                    <Share2 size={18} className="text-gray-400" />
                    <Text className="text-sm text-gray-500">分享</Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      )}

      {/* 最新/热门内容 */}
      {(activeTab === 'latest' || activeTab === 'hot') && (
        <View className="px-4 py-3">
          {posts.map((post) => (
            <Card key={post.id} className="mb-3">
              <CardContent className="p-4">
                <View className="flex gap-3">
                  <Image src={post.userAvatar} mode="aspectFill" className="w-12 h-12 rounded-full" />
                  <View className="flex-1">
                    <View className="flex items-center justify-between">
                      <Text className="text-sm font-medium text-gray-900">{post.userName}</Text>
                      <Text className="text-xs text-gray-400">{post.createTime}</Text>
                    </View>
                    <Text className="text-sm text-gray-700 mt-1 line-clamp-2">{post.content}</Text>
                    
                    {post.images.length > 0 && (
                      <ScrollView scrollX className="mt-2" showScrollbar={false}>
                        <View className="flex gap-2">
                          {post.images.map((img, index) => (
                            <Image 
                              key={index}
                              src={img} 
                              mode="aspectFill" 
                              className="w-24 h-24 rounded-lg flex-shrink-0"
                            />
                          ))}
                        </View>
                      </ScrollView>
                    )}
                    
                    <View className="flex items-center gap-4 mt-3">
                      <View 
                        className="flex items-center gap-1"
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart 
                          size={16} 
                          className={likedPosts[post.id] ? 'text-red-500' : 'text-gray-400'}
                          fill={likedPosts[post.id] ? '#EF4444' : 'none'}
                        />
                        <Text className={`text-xs ${likedPosts[post.id] ? 'text-red-500' : 'text-gray-500'}`}>
                          {post.likes}
                        </Text>
                      </View>
                      <View className="flex items-center gap-1">
                        <MessageCircle size={16} className="text-gray-400" />
                        <Text className="text-xs text-gray-500">{post.comments}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      )}

      {/* 投稿按钮 */}
      <View 
        className="fixed bottom-6 right-4 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg"
        onClick={submitPost}
      >
        <ImagePlus size={24} color="white" />
      </View>

      {/* 投稿弹窗 */}
      {showSubmitModal && (
        <View 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowSubmitModal(false)}
        >
          <View 
            className="w-11/12 bg-white rounded-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Text className="text-lg font-bold text-gray-900 mb-4">发布内容</Text>
            
            <View className="bg-gray-50 rounded-xl p-4 min-h-32">
              <Text className="text-sm text-gray-400">分享你的精灵故事...</Text>
            </View>
            
            <View className="flex gap-3 mt-4">
              <View className="flex-1 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                <View className="flex flex-col items-center">
                  <ImagePlus size={24} className="text-gray-400" />
                  <Text className="text-xs text-gray-500 mt-1">添加图片</Text>
                </View>
              </View>
              <View className="flex-1 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                <View className="flex flex-col items-center">
                  <Camera size={24} className="text-gray-400" />
                  <Text className="text-xs text-gray-500 mt-1">拍照</Text>
                </View>
              </View>
            </View>
            
            <View className="flex gap-2 mt-3 flex-wrap">
              {hotTags.slice(0, 3).map((tag) => (
                <View 
                  key={tag}
                  className="px-2 py-1 bg-purple-50 text-primary text-xs rounded-full"
                >
                  <Text>{tag}</Text>
                </View>
              ))}
            </View>
            
            <View className="flex gap-3 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowSubmitModal(false)}
              >
                <Text>取消</Text>
              </Button>
              <Button className="flex-1">
                <Text>发布</Text>
              </Button>
            </View>
            
            <Text className="text-xs text-gray-400 text-center mt-3">
              发布即表示同意《社区规范》，优质内容可获得精灵碎片奖励
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}
