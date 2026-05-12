import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, Share2, ShoppingCart, Truck, Store, Gift, Star, CircleAlert
} from 'lucide-react-taro'
import { SpecPicker } from '@/components/spec-picker/spec-picker'
import { OrganLordCard } from '@/components/organ-lord-card'
import { getOrganLordByProductId } from '@/data/organLords'
import type { Product } from '@/mock/products'
import { getProductById } from '@/mock/products'
import './index.scss'

const comments = [
  { id: 1, user: '大学生***', avatar: 'https://picsum.photos/50/50?random=20', rating: 5, content: '超级好喝！蜜桃味很浓，酒精度数刚刚好，很适合女生喝~', images: [], time: '2024-01-15' },
  { id: 2, user: '果酒***', avatar: 'https://picsum.photos/50/50?random=21', rating: 4, content: '包装很精美，送朋友很有面子。味道也不错，会回购的！', images: [], time: '2024-01-14' }
]

const deliveryInfo = {
  dormitory: { name: '送货到宿舍', fee: 3, time: '30-60分钟' },
  pickup: { name: '到店自提', fee: 0, time: '随时可取' }
}

export default function Product() {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSpec] = useState<Record<string, string>>({
    '规格': '单瓶'
  })
  const [activeTab, setActiveTab] = useState('detail')
  const [liked, setLiked] = useState(false)
  const [showSpecPicker, setShowSpecPicker] = useState(false)

  useEffect(() => {
    const { id } = router.params
    if (id) {
      const productData = getProductById(id)
      if (productData) {
        setProduct(productData)
      }
    }
  }, [router, router.params])

  // 监听路由参数变化（备用方案）
  useEffect(() => {
    const { id } = router.params
    if (id) {
      const productData = getProductById(id)
      if (productData) {
        setProduct(productData)
      }
    }
  }, [])

  const addToCart = () => {
    Taro.switchTab({ url: '/pages/cart/index' })
  }

  // 判断是否显示器官大人（仅果酒显示）
  const showOrganLord = product?.category === 'fruit_wine'

  if (!product) {
    return (
      <View className="flex items-center justify-center h-screen">
        <Text className="block text-gray-500">加载中...</Text>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-24">
      <ScrollView>
        {/* 商品图片轮播 */}
        <View className="relative">
          <View className="w-full aspect-square bg-gray-100">
            <Image src={product?.images[0]} mode="aspectFill" className="w-full h-full" />
          </View>
          <View className="absolute top-4 right-4 flex gap-2">
            <View className="w-10 h-10 bg-black bg-opacity-40 rounded-full flex items-center justify-center" onClick={() => setLiked(!liked)}>
              <Heart size={20} color={liked ? '#EF4444' : 'white'} />
            </View>
            <View className="w-10 h-10 bg-black bg-opacity-40 rounded-full flex items-center justify-center">
              <Share2 size={20} color="white" />
            </View>
          </View>
          <View className="absolute bottom-4 left-4 bg-black bg-opacity-40 text-white text-xs px-3 py-1 rounded-full">
            {product?.images.length}/3
          </View>
        </View>

        {/* 价格信息 */}
        <View className="bg-white px-4 py-4">
          <View className="flex items-baseline gap-2">
            <Text className="text-primary text-2xl font-bold">¥{product?.price}</Text>
            <Text className="text-gray-400 text-sm line-through">¥{product?.originalPrice}</Text>
            <Badge variant="destructive" className="text-xs">限时特惠</Badge>
          </View>
          <Text className="text-xl font-semibold text-gray-900 mt-2">{product?.name}</Text>
          <Text className="text-sm text-gray-500 mt-1">{product?.subtitle}</Text>
          
          <View className="flex items-center gap-4 mt-3">
            <View className="flex items-center gap-1">
              <Star size={14} color="#F59E0B" />
              <Text className="text-sm text-gray-700">{product?.rating}</Text>
            </View>
            <Text className="text-sm text-gray-500">销量 {product?.salesCount}</Text>
            <Text className="text-sm text-gray-500">库存 {product?.specs[0]?.stock}</Text>
          </View>

          <View className="flex gap-2 mt-3">
            {product?.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </View>
        </View>

        {/* 规格选择（内联版本，点击打开弹窗） */}
        <View className="bg-white px-4 py-4 mt-2" onClick={() => setShowSpecPicker(true)}>
          <View className="flex items-center justify-between">
            <Text className="text-sm font-medium text-gray-900">选择规格</Text>
            <View className="flex items-center gap-2">
              <Text className="text-sm text-gray-500">{selectedSpec['规格']}</Text>
              <Text className="text-primary text-sm">请选择 ▼</Text>
            </View>
          </View>
        </View>

        {/* 配送方式 */}
        <View className="bg-white px-4 py-4 mt-2">
          <Text className="text-sm font-medium text-gray-900 mb-3">配送方式</Text>
          <View className="flex gap-3">
            <View className={`flex-1 p-3 rounded-xl border-2 ${true ? 'border-primary bg-purple-50' : 'border-gray-200'}`}>
              <View className="flex items-center gap-2">
                <Truck size={16} color="#8B5CF6" />
                <Text className="text-sm font-medium text-primary">送货到宿舍</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">+{deliveryInfo.dormitory.fee}元 · {deliveryInfo.dormitory.time}</Text>
            </View>
            <View className={`flex-1 p-3 rounded-xl border-2 ${false ? 'border-primary bg-purple-50' : 'border-gray-200'}`}>
              <View className="flex items-center gap-2">
                <Store size={16} color="#9CA3AF" />
                <Text className="text-sm font-medium text-gray-700">到店自提</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">免配送费 · 随时可取</Text>
            </View>
          </View>
        </View>

        {/* 精灵故事 */}
        <View className="bg-white px-4 py-4 mt-2">
          <View className="flex items-center gap-2 mb-3">
            <Gift size={18} color="#8B5CF6" />
            <Text className="text-sm font-medium text-gray-900">精灵故事</Text>
            <Badge variant="secondary" className="text-xs">+2 碎片</Badge>
          </View>
          <Text className="text-sm text-gray-600 leading-6">{product?.story}</Text>
        </View>

        {/* 器官大人展示卡片（仅果酒显示） */}
        {showOrganLord && (() => {
          const lord = getOrganLordByProductId(product?.id)
          return lord ? (
            <View className="bg-gray-900 px-4 py-4 mt-2">
              <View className="flex items-center gap-2 mb-3">
                <Text className="text-amber-400 text-lg font-bold">🏛️ 器官大人说养生</Text>
              </View>
              <OrganLordCard lord={lord} productId={product?.id} />
            </View>
          ) : null
        })()}

        {/* Tab切换 */}
        <View className="bg-white mt-2">
          <View className="flex border-b border-gray-200">
            <View 
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'detail' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('detail')}
            >
              <Text>商品详情</Text>
            </View>
            <View 
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === 'comment' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('comment')}
            >
              <Text>评价 ({comments.length})</Text>
            </View>
          </View>

          {activeTab === 'detail' && (
            <View className="p-4">
              <Text className="text-sm text-gray-600 leading-6">
                邑夏蜜桃精灵果酒，选用新鲜蜜桃为原料，采用传统酿造工艺精心制作。酒体呈淡粉色，口感清爽甘甜，酒精度数仅为8%vol，非常适合年轻消费者群体。产品包装精美，是送礼和聚会的理想选择。
              </Text>
              <View className="mt-4">
                <Image src="https://picsum.photos/750/400?random=15" mode="aspectFill" className="w-full rounded-lg" />
              </View>
            </View>
          )}

          {activeTab === 'comment' && (
            <View className="p-4">
              {comments.map((comment) => (
                <View key={comment.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0">
                  <View className="flex items-center gap-3">
                    <Image src={comment.avatar} mode="aspectFill" className="w-10 h-10 rounded-full" />
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-900">{comment.user}</Text>
                      <View className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            size={12} 
                            color={star <= comment.rating ? '#F59E0B' : '#D1D5DB'} 
                          />
                        ))}
                      </View>
                    </View>
                    <Text className="text-xs text-gray-400">{comment.time}</Text>
                  </View>
                  <Text className="text-sm text-gray-600 mt-2">{comment.content}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-safe"
        style={{ zIndex: 100 }}
      >
        {/* 年龄验证提示 */}
        <View className="flex items-center gap-1 mb-2 text-xs text-orange-500">
          <CircleAlert size={12} color="#F59E0B" />
          <Text>购买果酒需年满18周岁</Text>
        </View>
        
        <View className="flex items-center gap-3">
          <View className="flex items-center gap-1">
            <View className="flex flex-col items-center px-3">
              <ShoppingCart size={22} color="#6B7280" />
              <Text className="text-xs text-gray-500 mt-1">购物车</Text>
            </View>
          </View>

          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => setShowSpecPicker(true)}
          >
            <Text className="text-sm">选规格</Text>
          </Button>
          <Button className="flex-1" onClick={addToCart}>
            <Text className="text-sm">加入购物车</Text>
          </Button>
        </View>
      </View>

      {/* 选规格弹窗 */}
      <SpecPicker 
        product={product}
        visible={showSpecPicker}
        onClose={() => setShowSpecPicker(false)}
      />
    </View>
  )
}
