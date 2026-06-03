import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Search, Crown, Ticket, Sparkles, Gift, Zap, Plus } from 'lucide-react-taro'
import { useCartStore } from '@/store/cartStore'
import { usePushStore } from '@/store/pushStore'
import { useMemberStore } from '@/store/memberStore'
import { MOCK_PRODUCTS as products } from '@/mock/products'
import type { Product } from '@/mock/products'
import { MemberModal } from '@/components/member-modal'
import { TicketSelector } from '@/components/ticket-selector'
import { WelcomeGiftModal } from '@/components/welcome-gift'

/**
 * 外卖风格左侧导航分类页
 * 左侧：会员专区 / 新品尝鲜 / 微醺小果酒 / 情绪小露酒 / 养身小果汁 / 礼盒套装
 * 右侧：对应商品列表
 */

const CATEGORIES = [
  { id: 'member', name: '会员专区', icon: '👑' },
  { id: 'new', name: '新品尝鲜', icon: '✨' },
  { id: 'new_wine', name: '微醺小果酒', icon: '🍷' },
  { id: 'old_wine', name: '情绪小露酒', icon: '🥂' },
  { id: 'juice', name: '养身小果汁', icon: '🧃' },
  { id: 'gift', name: '礼盒套装', icon: '🎁' },
]

function filterProducts(catId: string): Product[] {
  switch (catId) {
    case 'new': return products.filter(p => p.isNew)
    case 'new_wine': return products.filter(p => p.category === 'fruit_wine' && p.isNew)
    case 'old_wine': return products.filter(p => p.category === 'fruit_wine' && !p.isNew)
    case 'juice': return products.filter(p => p.category === 'nfc_juice')
    case 'gift': return products.filter(p => p.category === 'gift_box')
    default: return []
  }
}

export default function Category() {
  const [selectedCategory, setSelectedCategory] = useState('new_wine')
  
  const cartCount = useCartStore(state => state.items.reduce((sum, item) => sum + item.quantity, 0))
  const cartStore = useCartStore()
  const { isMember, setShowMemberModal, setShowTicketModal, canClaimTicket, welcomeGiftClaimed, setShowWelcomeGiftModal } = useMemberStore()

  useDidShow(() => {
    const categoryFromStorage = Taro.getStorageSync('selectedCategory')
    const extraType = Taro.getStorageSync('categoryExtraType')
    if (extraType === 'new') {
      setSelectedCategory('new')
      Taro.removeStorageSync('categoryExtraType')
      return
    }
    if (categoryFromStorage) {
      const target = CATEGORIES.find(c => c.id === categoryFromStorage)
      if (target) setSelectedCategory(target.id)
      Taro.removeStorageSync('selectedCategory')
    }
  })

  const filteredProducts = filterProducts(selectedCategory)
  const currentCat = CATEGORIES.find(c => c.id === selectedCategory)

  const goToProduct = (id: string) => Taro.navigateTo({ url: `/pages/product/index?id=${id}` })
  const goToCart = () => Taro.switchTab({ url: '/pages/cart/index' })

  const handleAddToCart = (product: Product, e: any) => {
    e.stopPropagation()
    cartStore.addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      spec: product.capacity || '330ml',
      quantity: 1,
      image: product.images[0],
      maxQuantity: 99,
    })
    Taro.showToast({ title: '已加入购物车', icon: 'success', duration: 1000 })
  }

  return (
    <View className="min-h-screen bg-slate-900 flex flex-col pb-safe">
      {/* 顶部搜索栏 */}
      <View className="bg-slate-800 px-3 py-2 flex items-center gap-2">
        <View className="flex-1 bg-slate-700 rounded-full px-3 py-2 flex items-center">
          <Search size={14} color="#6B7280" />
          <Text className="text-xs text-gray-500 ml-2">搜索果酒、果汁...</Text>
        </View>
        <View className="relative" onClick={goToCart}>
          {cartCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 z-10 w-4 h-4 flex items-center justify-center text-xs p-0 bg-red-500">
              {cartCount > 99 ? '99+' : cartCount}
            </Badge>
          )}
          <View className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
            <ShoppingCart size={16} color="white" />
          </View>
        </View>
      </View>

      {/* 主体：左导航 + 右列表 */}
      <View className="flex flex-1" style={{ height: '600px' }}>
        {/* 左侧导航 - 固定宽度80px */}
        <ScrollView scrollY style={{ width: '80px', height: '600px' }} className="bg-slate-800">
          {CATEGORIES.map(cat => (
            <View
              key={cat.id}
              className={`py-3 px-2 flex flex-col items-center justify-center relative ${selectedCategory === cat.id ? 'bg-slate-900' : 'bg-slate-800'}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {selectedCategory === cat.id && (
                <View className="absolute left-0 top-2 bottom-2 w-1 bg-purple-500 rounded-r" />
              )}
              <Text className="text-lg mb-1">{cat.icon}</Text>
              <Text className={`text-xs text-center ${selectedCategory === cat.id ? 'text-white font-bold' : 'text-gray-400'}`}>{cat.name}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 右侧内容 - 填满剩余空间 */}
        <ScrollView scrollY style={{ flex: 1, height: '600px' }} className="bg-slate-900">
          {/* 会员专区 */}
          {selectedCategory === 'member' && (
            <View className="p-3">
              <View className="flex items-center gap-2 mb-4">
                <Crown size={20} color="#FBBF24" />
                <Text className="text-lg font-bold text-amber-400">会员福利专区</Text>
              </View>
              
              {!isMember ? (
                <View className="rounded-xl border-2 border-amber-500 p-5 text-center mb-4" style={{ backgroundColor: 'rgba(251,191,36,0.08)' }}>
                  <Text className="text-xl font-bold text-white">9.9创始会员</Text>
                  <Text className="text-sm text-gray-400 mt-2">入会赠饮1瓶+每月1元小酒票+生日9折</Text>
                  <View className="mt-4 rounded-xl py-3" style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }} onClick={() => setShowMemberModal(true)}>
                    <Text className="text-gray-900 font-bold text-center">立即开通 ¥9.9</Text>
                  </View>
                </View>
              ) : (
                <View>
                  {/* 入会赠饮 */}
                  <View className="rounded-xl bg-slate-800 p-4 flex items-center gap-3 mb-3"
                    onClick={() => { if (!welcomeGiftClaimed) setShowWelcomeGiftModal(true) }}>
                    <View className="w-10 h-10 rounded-lg bg-purple-500 bg-opacity-20 flex items-center justify-center"><Gift size={20} color="#A855F7" /></View>
                    <View className="flex-1">
                      <Text className="text-white font-medium">入会赠饮</Text>
                      <Text className="text-xs text-gray-400 mt-1">{welcomeGiftClaimed ? '已领取' : '未领取，点击领取'}</Text>
                    </View>
                    {!welcomeGiftClaimed && <View className="bg-red-500 text-white text-xs px-2 py-1 rounded">待领</View>}
                  </View>
                  {/* 1元小酒票 */}
                  <View className="rounded-xl bg-slate-800 p-4 flex items-center gap-3 mb-3"
                    onClick={() => { if (canClaimTicket()) setShowTicketModal(true) }}>
                    <View className="w-10 h-10 rounded-lg bg-amber-500 bg-opacity-20 flex items-center justify-center"><Ticket size={20} color="#FBBF24" /></View>
                    <View className="flex-1">
                      <Text className="text-white font-medium">1元小酒票</Text>
                      <Text className="text-xs text-gray-400 mt-1">{canClaimTicket() ? '本月未领取' : '本月已领取'}</Text>
                    </View>
                    {canClaimTicket() && <View className="bg-red-500 text-white text-xs px-2 py-1 rounded">待领</View>}
                  </View>
                  {/* 每周特价 */}
                  <View className="rounded-xl bg-slate-800 p-4 flex items-center gap-3 mb-3">
                    <View className="w-10 h-10 rounded-lg bg-red-500 bg-opacity-20 flex items-center justify-center"><Zap size={20} color="#F87171" /></View>
                    <View className="flex-1">
                      <Text className="text-white font-medium">每周特价¥9.9</Text>
                      <Text className="text-xs text-gray-400 mt-1">老款果酒限时特惠</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* 会员权益说明 */}
              <View className="rounded-xl bg-slate-800 p-4">
                <Text className="text-sm text-amber-400 font-medium mb-2">创始会员权益</Text>
                {['入会赠饮1瓶（老款3选1，自提免运费）', '每月1元小酒票（当月不领失效不累加）', '每周特价¥9.9（老款果酒）', '生日礼遇（全场9折可叠加）'].map((b, i) => (
                  <View key={i} className="flex items-center gap-2 mt-2">
                    <Text className="text-xs text-gray-500">•</Text>
                    <Text className="text-xs text-gray-300">{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 商品列表 - 非会员专区 */}
          {selectedCategory !== 'member' && (
            <View className="p-3">
              <View className="flex items-center gap-2 mb-3">
                <Text className="text-lg">{currentCat?.icon}</Text>
                <Text className="text-base font-bold text-white">{currentCat?.name}</Text>
                <Text className="text-xs text-gray-500">{filteredProducts.length}款</Text>
              </View>

              {filteredProducts.map((product) => (
                <View key={product.id}
                  className="flex gap-3 bg-slate-800 rounded-xl p-3 mb-3"
                  onClick={() => goToProduct(product.id)}>
                  <View className="flex-shrink-0 rounded-lg overflow-hidden bg-slate-700" style={{ width: '96px', height: '96px' }}>
                    <Image src={product.images[0]} style={{ width: '96px', height: '96px' }} mode="aspectFill" lazyLoad />
                  </View>
                  <View className="flex-1 flex flex-col justify-between">
                    <View>
                      <Text className="text-sm font-medium text-white">{product.name}</Text>
                      <Text className="text-xs text-gray-400 mt-1">{product.subtitle}</Text>
                      {product.capacity && <Text className="text-xs text-gray-500">{product.capacity}</Text>}
                    </View>
                    <View className="flex items-center justify-between mt-2">
                      <View className="flex items-baseline gap-1">
                        <Text className="text-lg font-bold text-violet-400">¥{product.price}</Text>
                        <Text className="text-xs text-gray-500 line-through">¥{product.originalPrice}</Text>
                      </View>
                      <View
                        className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center"
                        onClick={(e) => handleAddToCart(product, e)}
                      >
                        <Plus size={16} color="white" />
                      </View>
                    </View>
                  </View>
                </View>
              ))}

              {filteredProducts.length === 0 && (
                <View className="text-center py-8">
                  <Text className="text-gray-500 text-sm">暂无商品</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <MemberModal />
      <TicketSelector />
      <WelcomeGiftModal />
    </View>
  )
}
