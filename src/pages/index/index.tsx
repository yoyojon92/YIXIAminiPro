import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Clock, Gift, ChevronRight, Fire, Star, Users } from 'lucide-react-taro'

// 模拟数据
const bannerList = [
  { id: 1, image: 'https://picsum.photos/750/400?random=1', title: '新品上市' },
  { id: 2, image: 'https://picsum.photos/750/400?random=2', title: '限时拼团' },
  { id: 3, image: 'https://picsum.photos/750/400?random=3', title: '精灵收集' }
]

const flashSaleProducts = [
  { id: 1, name: '蜜桃精灵果酒', price: 29.9, originalPrice: 49.9, image: 'https://picsum.photos/200/200?random=10', sold: 328 },
  { id: 2, name: '蓝莓精灵果汁', price: 19.9, originalPrice: 35.9, image: 'https://picsum.photos/200/200?random=11', sold: 256 },
  { id: 3, name: '草莓精灵气泡酒', price: 24.9, originalPrice: 39.9, image: 'https://picsum.photos/200/200?random=12', sold: 189 }
]

const newProducts = [
  { id: 4, name: '柠檬精灵轻饮酒', price: 22.9, image: 'https://picsum.photos/200/200?random=13', isNew: true },
  { id: 5, name: '葡萄精灵气泡水', price: 18.9, image: 'https://picsum.photos/200/200?random=14', isNew: true },
  { id: 6, name: '苹果精灵果汁', price: 15.9, image: 'https://picsum.photos/200/200?random=15', isNew: true }
]

const spriteCharacters = [
  { id: 1, name: '蜜桃精灵', level: 1, image: 'https://picsum.photos/120/120?random=20', collected: true },
  { id: 2, name: '蓝莓精灵', level: 2, image: 'https://picsum.photos/120/120?random=21', collected: true },
  { id: 3, name: '草莓精灵', level: 3, image: 'https://picsum.photos/120/120?random=22', collected: true },
  { id: 4, name: '柠檬精灵', level: 4, image: 'https://picsum.photos/120/120?random=23', collected: false },
  { id: 5, name: '葡萄精灵', level: 5, image: 'https://picsum.photos/120/120?random=24', collected: false }
]

const categories = [
  { id: 1, name: '果酒', icon: '🍑', count: 12 },
  { id: 2, name: '果汁', icon: '🫐', count: 8 },
  { id: 3, name: '气泡酒', icon: '🍓', count: 6 },
  { id: 4, name: '礼盒套装', icon: '🎁', count: 4 }
]

export default function Index() {
  const router = useRouter()

  // 跳转到购物车
  const goToCart = () => {
    router.switchTab({ url: '/pages/cart/index' })
  }

  // 跳转到商品详情
  const goToProduct = (id: number) => {
    router.push({ url: `/pages/product/index?id=${id}` })
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      {/* 顶部搜索栏 */}
      <View className="bg-primary px-4 pt-4 pb-6">
        <View className="flex items-center gap-3">
          <View className="flex-1 bg-white rounded-full px-4 py-2 flex items-center" onClick={() => router.push({ url: '/pages/category/index' })}>
            <Text className="text-gray-400 text-sm">搜索果酒、果汁...</Text>
          </View>
          <View className="relative" onClick={goToCart}>
            <Badge variant="destructive" className="absolute -top-1 -right-1 z-10 w-4 h-4 flex items-center justify-center text-xs p-0">
              3
            </Badge>
            <View className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Text className="text-xl">🛒</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 轮播图 */}
      <View className="px-4 -mt-4">
        <Swiper className="h-44 rounded-xl overflow-hidden" autoplay circular indicatorDots>
          {bannerList.map((item) => (
            <SwiperItem key={item.id}>
              <View className="w-full h-full">
                <Image src={item.image} mode="aspectFill" className="w-full h-full" />
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      {/* 分类入口 */}
      <View className="px-4 mt-4">
        <View className="flex justify-between">
          {categories.map((cat) => (
            <View key={cat.id} className="flex flex-col items-center gap-2" onClick={() => router.push({ url: `/pages/category/index?category=${cat.id}` })}>
              <View className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <Text className="text-2xl">{cat.icon}</Text>
              </View>
              <Text className="text-xs text-gray-600">{cat.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 限时拼团 */}
      <View className="px-4 mt-6">
        <View className="flex items-center justify-between mb-3">
          <View className="flex items-center gap-2">
            <View className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <Clock size={14} color="white" />
            </View>
            <Text className="text-lg font-semibold text-gray-900">限时拼团</Text>
            <View className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">限时</View>
          </View>
          <View className="flex items-center gap-1 text-gray-500" onClick={() => router.push({ url: '/pages/category/index?type=group' })}>
            <Text className="text-sm">更多</Text>
            <ChevronRight size={16} />
          </View>
        </View>

        <View className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {flashSaleProducts.map((product) => (
            <View key={product.id} className="flex-shrink-0 w-36" onClick={() => goToProduct(product.id)}>
              <Card className="overflow-hidden">
                <View className="relative">
                  <Image src={product.image} mode="aspectSquare" className="w-full h-36" />
                  <View className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Fire size={10} />
                    <Text>拼团</Text>
                  </View>
                </View>
                <CardContent className="p-3">
                  <Text className="text-sm text-gray-900 font-medium line-clamp-1">{product.name}</Text>
                  <View className="flex items-baseline gap-1 mt-1">
                    <Text className="text-primary font-bold">¥{product.price}</Text>
                    <Text className="text-xs text-gray-400 line-through">¥{product.originalPrice}</Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">{product.sold}人已拼</Text>
                </CardContent>
              </Card>
            </View>
          ))}
        </View>
      </View>

      {/* 新品推荐 */}
      <View className="px-4 mt-6">
        <View className="flex items-center justify-between mb-3">
          <View className="flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" />
            <Text className="text-lg font-semibold text-gray-900">新品推荐</Text>
            <Badge variant="secondary" className="text-xs">NEW</Badge>
          </View>
          <View className="flex items-center gap-1 text-gray-500" onClick={() => router.push({ url: '/pages/category/index?type=new' })}>
            <Text className="text-sm">更多</Text>
            <ChevronRight size={16} />
          </View>
        </View>

        <View className="grid grid-cols-3 gap-3">
          {newProducts.map((product) => (
            <View key={product.id} onClick={() => goToProduct(product.id)}>
              <Card className="overflow-hidden">
                <View className="relative">
                  <Image src={product.image} mode="aspectSquare" className="w-full h-28" />
                  {product.isNew && (
                    <View className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                      新品
                    </View>
                  )}
                </View>
                <CardContent className="p-2">
                  <Text className="text-xs text-gray-900 font-medium line-clamp-1">{product.name}</Text>
                  <Text className="text-sm text-primary font-bold mt-1">¥{product.price}</Text>
                </CardContent>
              </Card>
            </View>
          ))}
        </View>
      </View>

      {/* 精灵图鉴入口 */}
      <View className="px-4 mt-6">
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 border-0 overflow-hidden">
          <CardContent className="p-4">
            <View className="flex items-center justify-between">
              <View className="flex-1">
                <View className="flex items-center gap-2">
                  <Gift size={20} color="white" />
                  <Text className="text-lg font-bold text-white">精灵图鉴</Text>
                </View>
                <Text className="text-white text-opacity-80 text-sm mt-1">收集精灵碎片，兑换限定礼品</Text>
                <View className="flex items-center gap-4 mt-3">
                  <View className="flex items-center gap-1">
                    <Star size={14} color="#FFD700" fill="#FFD700" />
                    <Text className="text-white text-sm">已收集 3/8</Text>
                  </View>
                  <View className="flex items-center gap-1">
                    <Users size={14} color="white" />
                    <Text className="text-white text-sm">1289人参与</Text>
                  </View>
                </View>
              </View>
              <View className="flex gap-1">
                {spriteCharacters.slice(0, 3).map((sprite) => (
                  <View key={sprite.id} className="w-12 h-12 rounded-full bg-white bg-opacity-20 overflow-hidden border-2 border-white">
                    <Image src={sprite.image} mode="aspectFill" className="w-full h-full" />
                  </View>
                ))}
                <View className="w-12 h-12 rounded-full bg-white bg-opacity-20 border-2 border-dashed border-white flex items-center justify-center">
                  <Text className="text-white text-lg">+</Text>
                </View>
              </View>
            </View>
            <Button 
              className="w-full mt-4 bg-white text-purple-600 hover:bg-white hover:text-purple-600" 
              onClick={() => router.push({ url: '/pages/sprites/index' })}
            >
              <Text className="text-sm font-medium">立即参与</Text>
            </Button>
          </CardContent>
        </Card>
      </View>

      {/* 活动入口 */}
      <View className="px-4 mt-6 mb-6">
        <View className="grid grid-cols-2 gap-3">
          <Card className="bg-orange-50 border-orange-100" onClick={() => router.push({ url: '/pages/wall/index' })}>
            <CardContent className="p-4 flex items-center gap-3">
              <Text className="text-3xl">🎨</Text>
              <View>
                <Text className="text-sm font-medium text-gray-900">创意墙</Text>
                <Text className="text-xs text-gray-500 mt-1">分享你的故事</Text>
              </View>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-100" onClick={() => router.push({ url: '/pages/activity/index' })}>
            <CardContent className="p-4 flex items-center gap-3">
              <Text className="text-3xl">🎉</Text>
              <View>
                <Text className="text-sm font-medium text-gray-900">社群活动</Text>
                <Text className="text-xs text-gray-500 mt-1">参与精彩活动</Text>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>
    </View>
  )
}
