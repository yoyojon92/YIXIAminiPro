import { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Heart, Share2, ShoppingCart, Gift, Star, CircleAlert, Crown
} from 'lucide-react-taro'
import { SpecPicker } from '@/components/spec-picker/spec-picker'
import { OrganLordCard } from '@/components/organ-lord-card'
import { getOrganLordByProduct } from '@/data/organLords'
import type { Product } from '@/mock/products'
import { getProductById } from '@/mock/products'
import { useCartStore } from '@/store/cartStore'
import { useMemberStore } from '@/store/memberStore'
import { useUserProfileStore } from '@/store/userProfileStore'
import { MemberModal } from '@/components/member-modal'
import { ageVerify } from '@/utils/ageVerify'
import { trackProfileAction } from '@/store/profileStore'
import './index.scss'

const comments = [
  { id: 1, user: '大学生***', avatar: '😊', rating: 5, content: '超级好喝！蜜桃味很浓，酒精度数刚刚好，很适合女生喝~', images: [], time: '2024-01-15' },
  { id: 2, user: '果酒***', avatar: '😊', rating: 4, content: '包装很精美，送朋友很有面子。味道也不错，会回购的！', images: [], time: '2024-01-14' }
]



// 藏府君对话数据（微信对话气泡风格）
const COMIC_DIALOGUES: Record<string, {
  spiritLine: string  // 用户发言
  lordLine: string    // 藏府君回复
  lordName: string    // 藏府君名字
}> = {
  'prod_pomegranate_new': {
    spiritLine: '他跟我表白了啊啊啊啊！',
    lordLine: '心主喜，开心就好！但别喜极伤心哦…来杯榴红心事，让喜悦慢慢沉淀。',
    lordName: '心君',
  },
  'prod_grape_wine': {
    spiritLine: '最近老是熬夜刷手机…',
    lordLine: '肝主目，累眼就是累肝。来杯葡香暗度，让眼睛和肝一起休息。',
    lordName: '肝谋士',
  },
  'prod_peach_new': {
    spiritLine: '压力大的时候就想吃甜的…',
    lordLine: '脾主思，思虑过度伤脾。来杯桃心暗动，甜而不腻，温润养脾。',
    lordName: '脾将军',
  },
  'prod_apple_wine': {
    spiritLine: '天一凉就想哭…看落叶都觉得难过…',
    lordLine: '悲伤肺，哭多了我会疼的。来杯青苹微醺润一润，眼泪流完了，心就轻了。',
    lordName: '肺丞相',
  },
  'prod_guava_wine': {
    spiritLine: '最近总是心神不宁的…',
    lordLine: '心主神明，安神才能定心。来杯粉乐雾琼，芭乐微甜，静心养神。',
    lordName: '心君',
  },
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

  // 识别拼团入口
  const isPintuan = router.params.pintuan === 'true'
  const pintuanPrice = 39.9
  const originalPrice = 49.9

  // 会员状态
  const { isMember, setShowMemberModal } = useMemberStore()
  
  // 计算会员价（果酒享8.5折）
  const memberPrice = product && product.category === 'fruit_wine' 
    ? Number((product.price * 0.85).toFixed(1))
    : product?.price || 0
  const savedAmount = product && product.category === 'fruit_wine'
    ? Number((product.price - memberPrice).toFixed(1))
    : 0

  // 页面显示时获取产品数据
  useEffect(() => {
    const id = router.params.id
    if (id) {
      const productData = getProductById(id)
      if (productData) {
        setProduct(productData)
      }
    }
  }, [])

  const cartStore = useCartStore()
  const profileStore = useUserProfileStore()

  const addToCart = async () => {
    console.log('[addToCart] 开始执行')
    
    // 重新获取最新产品数据
    const productId = router.params.id
    console.log('[addToCart] productId:', productId)
    
    if (!productId) {
      Taro.showToast({ title: '产品信息加载中', icon: 'none' })
      return
    }
    const currentProduct = getProductById(productId)
    console.log('[addToCart] currentProduct:', currentProduct?.name)
    
    if (!currentProduct) {
      Taro.showToast({ title: '产品信息获取失败', icon: 'none' })
      return
    }

    // 酒精产品需要年龄验证
    if (currentProduct.isAlcohol) {
      const userAge = profileStore.age
      console.log('[addToCart] 用户年龄:', userAge, '产品类型: 果酒')
      
      if (userAge !== null && userAge < 18) {
        // 已注册但年龄不足18岁
        Taro.showModal({
          title: '年龄限制',
          content: '根据法律法规，购买果酒需年满18周岁',
          showCancel: false,
          confirmText: '我知道了'
        })
        return
      }
      if (userAge === null) {
        // 未注册，需要弹窗确认年龄
        console.log('[addToCart] 用户未注册，弹出年龄验证')
        const verified = await ageVerify()
        if (!verified) return
      }
      // userAge >= 18，直接通过验证，不弹窗
    }

    // 添加到购物车
    console.log('[addToCart] 开始添加到购物车')
    await cartStore.addItem({
      productId: currentProduct.id,
      name: currentProduct.name,
      price: currentProduct.price,
      originalPrice: currentProduct.originalPrice || currentProduct.price,
      quantity: 1,
      image: currentProduct.images[0],
      spec: '单瓶装',
      maxQuantity: 99
    })

    console.log('[addToCart] 添加成功')
    Taro.showToast({ title: '已加入购物车', icon: 'success' })
    
    // 记录加购行为（用于用户画像）
    profileStore.recordCartAdd(currentProduct.id)
    
    // 记录购买行为（用于用户画像）
    trackProfileAction('purchase', {
      productId: currentProduct.id,
      productName: currentProduct.name,
      category: currentProduct.category,
      price: currentProduct.price
    })
  }

  // 拼团发起逻辑
  const handlePintuan = () => {
    Taro.showModal({
      title: '邀请好友拼团',
      content: '分享给好友，2人成团即可享受¥15.8拼团价（原价¥18.8，省¥3）',
      confirmText: '去分享',
      success: (res) => {
        if (res.confirm) {
          // 触发微信分享
          Taro.showShareMenu({
            withShareTicket: true
          })
        }
      }
    })
  }

  // 配置分享
  Taro.useShareAppMessage(() => {
    return {
      title: `邑夏${product?.name || '果酒'}拼团，2人成团仅¥15.8，省¥3！`,
      path: `/pages/product/index?id=${product?.id}&pintuan=true`,
      imageUrl: product?.images[0] || ''
    }
  })

  // 判断是否显示藏府君（仅果酒显示）
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
            {/* 购物车图标 */}
            <View 
              className="w-10 h-10 bg-black bg-opacity-40 rounded-full flex items-center justify-center relative"
              onClick={() => Taro.switchTab({ url: '/pages/cart/index' })}
            >
              <ShoppingCart size={20} color="white" />
              {cartStore.totalQuantity() > 0 && (
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <Text className="text-white text-xs">{cartStore.totalQuantity() > 99 ? '99+' : cartStore.totalQuantity()}</Text>
                </View>
              )}
            </View>
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
          {/* 会员开通入口 */}
          {!isMember && (
            <View 
              className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-3 py-2 mb-3"
              onClick={() => setShowMemberModal(true)}
            >
              <View className="flex items-center gap-2">
                <Crown size={16} color="#8B5CF6" />
                <Text className="text-sm" style={{ color: '#8B5CF6' }}>开通会员享果酒8.5折</Text>
              </View>
              <View className="flex items-center gap-1">
                <Text className="text-xs" style={{ color: '#8B5CF6' }}>立即开通</Text>
                <Text style={{ color: '#8B5CF6' }}>›</Text>
              </View>
            </View>
          )}
          
          <View className="flex items-baseline gap-2">
            {isPintuan ? (
              // 拼团价格展示
              <>
                <Text className="pintuan-price">¥{pintuanPrice}</Text>
                <Text className="original-price-line">¥{originalPrice}</Text>
                <View className="pintuan-badge">2人拼团价</View>
              </>
            ) : isMember && product?.category === 'fruit_wine' ? (
              <>
                <Text className="text-primary text-2xl font-bold">¥{memberPrice}</Text>
                <Text className="text-gray-400 text-sm line-through">¥{product?.price}</Text>
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-600">
                  <Crown size={10} color="#8B5CF6" />
                  <Text className="ml-1">会员价 · 已省¥{savedAmount}</Text>
                </Badge>
              </>
            ) : (
              <>
                <Text className="text-primary text-2xl font-bold">¥{product?.price}</Text>
                <Text className="text-gray-400 text-sm line-through">¥{product?.originalPrice}</Text>
                <Badge variant="destructive" className="text-xs">限时特惠</Badge>
              </>
            )}
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

        {/* 精灵故事 */}
        <View className="bg-white px-4 py-4 mt-2">
          <View className="flex items-center gap-2 mb-3">
            <Gift size={18} color="#8B5CF6" />
            <Text className="text-sm font-medium text-gray-900">精灵故事</Text>
            <Badge variant="secondary" className="text-xs">+2 碎片</Badge>
          </View>
          <Text className="text-sm text-gray-600 leading-6">{product?.story}</Text>
        </View>

        {/* 藏府君展示卡片（仅果酒显示） */}
        {showOrganLord && (() => {
          const lord = getOrganLordByProduct(product?.id)
          return lord ? (
            <View className="bg-gray-900 px-4 py-4 mt-2">
              <View className="flex items-center gap-2 mb-3">
                <Text className="text-amber-400 text-lg font-bold">🏛️ 藏府君说养生</Text>
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
              {/* 藏府君对话区（微信对话气泡风格，仅果酒显示） */}
              {product?.category === 'fruit_wine' && COMIC_DIALOGUES[product.id] && (() => {
                const comic = COMIC_DIALOGUES[product.id]
                return (
                  <View className="mb-4">
                    <View className="bg-gray-50 rounded-2xl p-4">
                      {/* 标题 */}
                      <View className="mb-4 pb-3 border-b border-gray-200">
                        <Text className="text-base font-bold text-gray-900">藏府君</Text>
                      </View>
                      {/* 用户发言气泡（左对齐，白色背景） */}
                      <View className="inline-block max-w-[85%] mb-3 bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                        <Text className="text-sm text-gray-700 leading-relaxed">{comic.spiritLine}</Text>
                      </View>
                      {/* 藏府君回复气泡（右对齐，紫色背景） */}
                      <View className="flex flex-col items-end mb-2">
                        <View className="inline-block max-w-[85%] bg-purple-500 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                          <Text className="text-sm text-white leading-relaxed">{comic.lordLine}</Text>
                        </View>
                        <Text className="text-xs text-gray-400 mt-1 mr-1">{'· ' + comic.lordName}</Text>
                      </View>
                    </View>
                  </View>
                )
              })()}
              
              {/* 产品描述 */}
              <Text className="text-sm text-gray-600 leading-6">
                {product?.description || `邑夏${product?.name}，选用优质原料精心制作。酒体色泽纯净，口感独特回味悠长，非常适合年轻人品鉴。产品包装精美，是送礼和聚会的理想选择。`}
              </Text>
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
        {/* 年龄验证提示（仅酒精类产品显示） */}
        {product?.isAlcohol && (
          <View className="flex items-center gap-1 mb-2 text-xs text-orange-500">
            <CircleAlert size={12} color="#F59E0B" />
            <Text>购买果酒需年满18周岁</Text>
          </View>
        )}
        
        {isPintuan ? (
          // 拼团操作栏
          <View className="pintuan-action-bar">
            <View className="pintuan-btn" onClick={handlePintuan}>
              <Text className="pintuan-btn-text">邀请好友拼团</Text>
              <Text className="pintuan-btn-sub">2人成团·¥{pintuanPrice}/人</Text>
            </View>
          </View>
        ) : (
          // 原有操作栏
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
        )}
      </View>

      {/* 选规格弹窗 */}
      <SpecPicker 
        product={product}
        visible={showSpecPicker}
        onClose={() => setShowSpecPicker(false)}
      />

      {/* 会员开通弹窗 */}
      <MemberModal />
    </View>
  )
}
