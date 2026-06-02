import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Wine, GlassWater, Apple, Gift, Clock4, ChevronRight, 
  Flame, ShoppingCart, Sparkles, Search, Bell, Crown, Ticket, Zap
} from 'lucide-react-taro'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/mock/products'
import { organLords } from '@/data/organLords'
import { useUserProfileStore } from '@/store/userProfileStore'
import { usePushStore } from '@/store/pushStore'
import { useCartStore } from '@/store/cartStore'
import RunnerEntryCard from '@/components/RunnerEntryCard'
import { useDeliveryStore } from '@/store/deliveryStore'
import { useMemberStore } from '@/store/memberStore'
import { PICKUP_POINTS } from '@/mock/delivery'
import './index.scss'

// 果酒导航区产品图
const winePomegranate = '/assets/images/products/yixia-wine/01-liu-hong-xin-shi.png'
const wineGrape = '/assets/images/products/yixia-wine/02-pu-xiang-an-du.png'
const winePeach = '/assets/images/products/yixia-wine/03-tao-xin-an-dong.png'
const wineApple = '/assets/images/products/yixia-wine/04-qing-ping-wei-zui.png'
const wineGuava = '/assets/images/products/yixia-wine/05-fen-le-wu-qiong.png'
const wineRed = '/assets/images/products/yixia-wine/06-gan-hong-pu-tao-jiu.png'

/** 首页果酒导航区 - 6款果酒，每张图链到对应产品详情 */
const WINE_NAV_ITEMS = [
  { id: 'prod_pomegranate_new', name: '榴红心事', sub: '石榴·7°', price: '¥18.8', image: winePomegranate },
  { id: 'prod_grape_wine',      name: '葡香暗度', sub: '葡萄·7°', price: '¥18.8', image: wineGrape },
  { id: 'prod_peach_new',       name: '桃心暗动', sub: '黄桃·7°', price: '¥18.8', image: winePeach },
  { id: 'prod_apple_wine',      name: '青苹微醺', sub: '苹果·7°', price: '¥18.8', image: wineApple },
  { id: 'prod_guava_wine',      name: '粉乐雾琼', sub: '芭乐·5°', price: '¥39.9', image: wineGuava },
  { id: 'prod_red_wine',        name: '干红葡萄酒', sub: '干红·7°', price: '¥49.9', image: wineRed },
]

// 分类图标映射
const CategoryIcon = ({ icon, color }: { icon: string; color: string }) => {
  const iconColor = color === 'text-amber-400' ? '#FBBF24' : '#8B5CF6'
  const iconMap: Record<string, JSX.Element> = {
    'wine': <Wine size={24} className={color} color={iconColor} />,
    'glass-water': <GlassWater size={24} className={color} color={iconColor} />,
    'apple': <Apple size={24} className={color} color={iconColor} />,
    'gift': <Gift size={24} className={color} color={iconColor} />,
  }
  return iconMap[icon] || <Gift size={24} className={color} color={iconColor} />
}

// 新品推荐 - 筛选isNew=true
const newProducts = MOCK_PRODUCTS.filter(p => p.isNew).map(p => ({
  id: p.id,
  name: p.name,
  subtitle: p.subtitle,
  price: p.price,
  originalPrice: p.originalPrice,
  image: p.image,
  isAlcohol: p.isAlcohol,
  brand: p.brand,
  spriteAlias: p.spriteAlias
}))

// 会员福利项
const MEMBER_BENEFITS = [
  { id: 'ticket', icon: Ticket, title: '1元小酒票', sub: '每月免费领', color: 'text-amber-400', bgColor: 'bg-amber-500' },
  { id: 'special', icon: Zap, title: '每周特价¥9.9', sub: '限时抢购', color: 'text-red-400', bgColor: 'bg-red-500' },
  { id: 'gift', icon: Gift, title: '入会赠饮1瓶', sub: '开通即送', color: 'text-purple-400', bgColor: 'bg-purple-500' },
]


export default function Index() {
  const profileStore = useUserProfileStore()
  const { mode, selectedPickupPoint, setMode, setPickupPoint } = useDeliveryStore()
  const { isMember, setShowMemberModal, getRemainingDays } = useMemberStore()
  const [showPickupModal, setShowPickupModal] = useState(false)
  
  // ✅ 响应式读取 store 状态
  const unreadCount = usePushStore(state => state.unreadCount)
  const cartCount = useCartStore(state => state.items.reduce((sum, item) => sum + item.quantity, 0))
  const remainingDays = getRemainingDays()

  // 图片加载状态管理
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({})

  // 跳转到分类页（tabbar页面不能用navigateTo传参，用StorageSync）
  const goToCategory = (category: string) => {
    Taro.setStorageSync('selectedCategory', category)
    Taro.switchTab({ url: '/pages/category/index' })
  }

  // 跳转到购物车
  const goToCart = () => {
    Taro.switchTab({ url: '/pages/cart/index' })
  }

  // 跳转到商品详情
  const goToProduct = (id: string) => {
    Taro.navigateTo({ url: `/pages/product/index?id=${id}` })
  }

  // 图片加载完成
  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }))
  }

  // 图片加载失败
  const handleImageError = (id: string) => {
    console.log('图片加载失败:', id)
  }

  return (
    <View className="min-h-screen bg-slate-900 pb-safe">
      {/* 顶部导航栏 - 紫色渐变 */}
      <View className="bg-gradient-to-r from-purple-600 to-violet-600 px-4 pt-4 pb-5">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-2">
            <Text className="text-2xl font-bold text-white">邑夏</Text>
            <Badge variant="outline" className="text-xs text-white border-white border-opacity-30 bg-white bg-opacity-10">
              酒水·果汁
            </Badge>
          </View>
          <View className="flex items-center gap-3">
            {/* 通知铃铛 */}
            <View className="relative" onClick={() => Taro.navigateTo({ url: '/pagesSocial/notifications/index' })}>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 z-10 w-5 h-5 flex items-center justify-center text-xs p-0 bg-red-500">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
              <View className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Bell size={20} color="#6D28D9" />
              </View>
            </View>
            {/* 购物车 */}
            <View className="relative" onClick={goToCart}>
              {cartCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 z-10 w-5 h-5 flex items-center justify-center text-xs p-0 bg-red-500">
                  {cartCount > 99 ? '99+' : cartCount}
                </Badge>
              )}
              <View className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <ShoppingCart size={20} color="#6D28D9" />
              </View>
            </View>
          </View>
        </View>
        
        {/* 搜索栏 */}
        <View className="mt-3">
          <View 
            className="bg-white bg-opacity-20 backdrop-blur rounded-full px-4 py-3 flex items-center gap-2"
            onClick={() => Taro.switchTab({ url: '/pages/category/index' })}
          >
            <Search size={16} className="text-white" color="rgba(255,255,255,0.7)" />
            <Text className="text-white text-sm">搜索果酒、果汁、白酒...</Text>
          </View>
        </View>
      </View>

      {/* Slogan Banner - 轻量小图 */}
      <View className="px-4 -mt-3 relative">
        <Image
          src="https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@6911dae/src/assets/images/banner-slogan.png"
          className="w-full h-24 rounded-xl"
          mode="aspectFill"
          lazyLoad
          onLoad={() => handleImageLoad('slogan-banner')}
          onError={() => handleImageError('slogan-banner')}
        />
        {!loadedImages['slogan-banner'] && (
          <View className="absolute inset-0 bg-slate-700 rounded-xl animate-pulse flex items-center justify-center">
            <Text className="text-white text-lg font-bold">喝点小酒 微醺邑夏</Text>
          </View>
        )}
        <View className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Text className="text-white text-lg font-bold drop-shadow-lg">喝点小酒 微醺邑夏</Text>
        </View>
      </View>

      {/* 配送方式选择 - 移到搜索框下方 */}
      <View className="px-4 mt-4">
        <View className="delivery-mode-bar">
          <View className="delivery-mode-tabs">
            <View
              className={`delivery-tab ${mode === 'delivery' ? 'delivery-tab-active' : ''}`}
              onClick={() => setMode('delivery')}
            >
              <Text className={`delivery-tab-text ${mode === 'delivery' ? 'delivery-tab-text-active' : ''}`}>配送到门</Text>
            </View>
            <View
              className={`delivery-tab ${mode === 'pickup' ? 'delivery-tab-active' : ''}`}
              onClick={() => setMode('pickup')}
            >
              <Text className={`delivery-tab-text ${mode === 'pickup' ? 'delivery-tab-text-active' : ''}`}>到店自取</Text>
            </View>
            <View
              className={`delivery-tab ${mode === 'shipping' ? 'delivery-tab-active' : ''}`}
              onClick={() => setMode('shipping')}
            >
              <Text className={`delivery-tab-text ${mode === 'shipping' ? 'delivery-tab-text-active' : ''}`}>厂家邮寄</Text>
            </View>
          </View>
          {mode === 'delivery' && (
            <Text className="delivery-desc">同城满50起送</Text>
          )}
          {mode === 'pickup' && (
            <View className="pickup-info" onClick={() => setShowPickupModal(true)}>
              <Text className="pickup-name">{selectedPickupPoint.name}</Text>
              <Text className="pickup-distance">{selectedPickupPoint.distance}</Text>
              <Text className="pickup-arrow">›</Text>
            </View>
          )}
          {mode === 'shipping' && (
            <Text className="delivery-desc">满30包邮</Text>
          )}
        </View>
      </View>

      {/* ========== 会员福利专区 ========== */}
      <View className="px-4 mt-6">
        <View className="flex items-center justify-between mb-3">
          <View className="flex items-center gap-2">
            <Crown size={20} color="#FBBF24" />
            <Text className="text-white font-semibold">会员福利专区</Text>
          </View>
          {!isMember && (
            <View 
              className="flex items-center gap-1 text-amber-400"
              onClick={() => setShowMemberModal(true)}
            >
              <Text className="text-xs">开通9.9创始会员</Text>
              <ChevronRight size={14} color="#FBBF24" />
            </View>
          )}
          {isMember && (
            <View className="flex items-center gap-1 text-purple-400">
              <Badge className="text-xs bg-purple-500 text-white border-0">会员剩余{remainingDays}天</Badge>
            </View>
          )}
        </View>

        {/* 福利卡片 */}
        <View className="flex gap-3">
          {MEMBER_BENEFITS.map((benefit) => {
            const IconComponent = benefit.icon
            return (
              <View 
                key={benefit.id} 
                className="flex-1 bg-slate-800 rounded-xl p-3 border border-slate-700"
                onClick={() => {
                  if (!isMember) {
                    setShowMemberModal(true)
                  }
                }}
              >
                <View className={`w-10 h-10 ${benefit.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                  <IconComponent size={20} color="white" />
                </View>
                <Text className={`text-sm font-medium ${benefit.color}`}>{benefit.title}</Text>
                <Text className="text-xs text-slate-400 mt-1">{benefit.sub}</Text>
              </View>
            )
          })}
        </View>

        {/* 非会员引导按钮 */}
        {!isMember && (
          <View 
            className="mt-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl px-4 py-3 flex items-center justify-between"
            onClick={() => setShowMemberModal(true)}
          >
            <View className="flex items-center gap-2">
              <Crown size={18} color="white" />
              <Text className="text-white font-medium">开通9.9创始会员解锁权益</Text>
            </View>
            <View className="flex items-center gap-1">
              <Text className="text-white text-sm">立即开通</Text>
              <ChevronRight size={16} color="white" />
            </View>
          </View>
        )}
      </View>

      {/* ========== 果酒导航区 - 6款果酒横滑 ========== */}
      <View className="my-6 px-6">
        <View className="flex items-center justify-between mb-5">
          <View className="flex items-baseline gap-3">
            <Text className="text-3xl font-bold text-gray-800">邑夏果酒</Text>
            <Text className="text-xl text-gray-400">7度微醺 · 养生果酒</Text>
          </View>
        </View>
        <ScrollView scrollX className="w-full whitespace-nowrap" enhanced showScrollbar={false}>
          <View className="inline-flex gap-5 px-1">
            {WINE_NAV_ITEMS.map((item) => (
              <View
                key={item.id}
                className="inline-flex flex-col w-52 rounded-2xl bg-white shadow-lg overflow-hidden flex-shrink-0"
                onClick={() => goToProduct(item.id)}
              >
                <View className="w-52 h-52 overflow-hidden bg-slate-200 animate-pulse">
                  {loadedImages[item.id] !== false && (
                    <Image
                      src={item.image}
                      className="w-full h-full"
                      mode="aspectFill"
                      lazyLoad
                      onLoad={() => handleImageLoad(item.id)}
                      onError={() => handleImageError(item.id)}
                    />
                  )}
                </View>
                <View className="flex flex-col p-3 gap-1">
                  <Text className="text-lg font-semibold text-gray-800 truncate">{item.name}</Text>
                  <Text className="text-sm text-gray-400">{item.sub}</Text>
                  <Text className="text-xl font-bold text-violet-500 mt-1">{item.price}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 四大分类图标区 */}
      <View className="px-4 mt-5">
        <View className="flex justify-between">
          {MOCK_CATEGORIES.map((cat) => (
            <View 
              key={cat.id} 
              className="flex flex-col items-center gap-2 flex-1"
              onClick={() => goToCategory(cat.category)}
            >
              <View className={`w-14 h-14 ${cat.bgColor} rounded-2xl flex items-center justify-center border border-white border-opacity-10`}>
                <CategoryIcon icon={cat.icon} color={cat.color} />
              </View>
              <Text className="text-xs text-slate-300">{cat.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 新品推荐 */}
      <View className="px-4 mt-6">
        <View className="flex items-center justify-between mb-3">
          <View className="flex items-center gap-2">
            <Sparkles size={20} className="text-amber-400" color="#FBBF24" />
            <Text className="text-white font-semibold">新品推荐</Text>
            <Badge className="text-xs bg-amber-500 text-white border-0">NEW</Badge>
          </View>
          <View className="flex items-center gap-1 text-white" onClick={() => {
              Taro.setStorageSync('selectedCategory', '')
              Taro.setStorageSync('categoryExtraType', 'new')
              Taro.switchTab({ url: '/pages/category/index' })
            }}
          >
            <Text className="text-sm text-gray-300">更多</Text>
            <ChevronRight size={16} color="#ffffff" />
          </View>
        </View>

        <View className="grid grid-cols-2 gap-3">
          {newProducts.map((product) => (
            <View key={product.id} onClick={() => goToProduct(product.id)}>
              <Card className="bg-slate-800 border-slate-700 overflow-hidden">
                <View className="relative">
                  <View className="w-full h-32 bg-slate-200 animate-pulse">
                    <Image 
                      src={product.image} 
                      mode="aspectFill" 
                      className="w-full h-full"
                      lazyLoad
                      onLoad={() => handleImageLoad(product.id)}
                      onError={() => handleImageError(product.id)}
                    />
                  </View>
                  {/* 标签区 */}
                  <View className="absolute top-2 left-2 flex flex-col gap-1">
                    {/* 18+ 标识 */}
                    {product.isAlcohol && (
                      <View className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                        18+
                      </View>
                    )}
                    {/* NFC 标识 */}
                    {!product.isAlcohol && (
                      <View className="bg-emerald-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Text>NFC</Text>
                      </View>
                    )}
                  </View>
                  {/* 品牌标签 */}
                  <View className="absolute top-2 right-2 bg-purple-500 bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {product.brand}
                  </View>
                </View>
                <CardContent className="p-3">
                  <Text className="text-sm text-white font-medium line-clamp-1">{product.name}</Text>
                  <Text className="text-xs text-slate-400 mt-1 line-clamp-1">{product.subtitle}</Text>
                  {/* 精灵标签 */}
                  {product.spriteAlias && (
                    <View className="flex items-center gap-1 mt-2">
                      <View className="w-4 h-4 bg-amber-500 bg-opacity-20 rounded-full flex items-center justify-center">
                        <Text className="text-amber-400 text-xs">精</Text>
                      </View>
                      <Text className="text-xs text-amber-400">{product.spriteAlias}</Text>
                    </View>
                  )}
                  <View className="flex items-baseline gap-2 mt-2">
                    <Text className="text-purple-400 font-bold">¥{product.price}</Text>
                    {product.originalPrice && (
                      <Text className="text-xs text-slate-500 line-through">¥{product.originalPrice}</Text>
                    )}
                  </View>
                </CardContent>
              </Card>
            </View>
          ))}
        </View>
      </View>

      {/* 送酒员入口 */}
      <View className="px-4 mt-4">
        <RunnerEntryCard />
      </View>

      {/* 藏府君 */}
      <View className="px-4 mt-6">
        <Text className="text-sm font-medium text-white mb-3">🏛 藏府君</Text>
        <View className="flex justify-between">
            {Object.values(organLords).map((lord) => (
              <View 
                key={lord.id}
                className="flex flex-col items-center"
                onClick={() => {
                  // 埋点记录
                  profileStore.recordOrganLordClick(lord.id)
                  console.log('藏府君点击埋点:', {
                    userId: 'user_' + Date.now(),
                    organLordId: lord.id,
                    targetProductId: lord.productIds[0],
                    action: 'sprite_click',
                    timestamp: Date.now(),
                  })
                  Taro.navigateTo({ url: `/pages/product/index?id=${lord.productIds[0]}` })
                }}
              >
                <View 
                  className="w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center"
                  style={{ borderColor: lord.color, backgroundColor: lord.color + '20' }}
                >
                  <Image src={lord.image} className="w-full h-full" mode="aspectFill" lazyLoad />
                </View>
                <Text className="text-xs text-slate-300 mt-1">{lord.name}</Text>
              </View>
            ))}
          </View>
      </View>

      {/* 活动入口 */}
      <View className="px-4 mt-6 mb-6">
        <View className="grid grid-cols-2 gap-3">
          <Card className="bg-slate-800 border-slate-700" onClick={() => Taro.navigateTo({ url: '/pagesSocial/wall/index' })}>
            <CardContent className="p-4 flex items-center gap-3">
              <Text className="text-3xl">🎨</Text>
              <View>
                <Text className="text-sm font-medium text-white">创意墙</Text>
                <Text className="text-xs text-slate-400 mt-1">分享你的故事</Text>
              </View>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700" onClick={() => Taro.navigateTo({ url: '/pagesSocial/activity/index' })}>
            <CardContent className="p-4 flex items-center gap-3">
              <Text className="text-3xl">🎉</Text>
              <View>
                <Text className="text-sm font-medium text-white">社群活动</Text>
                <Text className="text-xs text-slate-400 mt-1">参与精彩活动</Text>
              </View>
            </CardContent>
          </Card>
        </View>
      </View>

      {/* 自提点选择弹窗 */}
      {showPickupModal && (
        <View className="pickup-modal-mask" onClick={() => setShowPickupModal(false)}>
          <View className="pickup-modal" onClick={(e) => e.stopPropagation()}>
            <View className="pickup-modal-header">
              <Text className="pickup-modal-title">选择自提点</Text>
              <View className="pickup-modal-close" onClick={() => setShowPickupModal(false)}>
                <Text>✕</Text>
              </View>
            </View>
            <View className="pickup-modal-list">
              {PICKUP_POINTS.map((point) => (
                <View
                  key={point.id}
                  className={`pickup-modal-item ${selectedPickupPoint.id === point.id ? 'pickup-modal-item-active' : ''}`}
                  onClick={() => {
                    setPickupPoint(point)
                    setShowPickupModal(false)
                  }}
                >
                  <View className="pickup-modal-item-info">
                    <View className="pickup-modal-item-name-row">
                      <Text className="pickup-modal-item-name">{point.name}</Text>
                      {point.isNearest && <Text className="pickup-nearest-tag">最近</Text>}
                      {point.tag && <Text className="pickup-rec-tag">{point.tag}</Text>}
                    </View>
                    <Text className="pickup-modal-item-addr">{point.address}</Text>
                    <Text className="pickup-modal-item-hours">营业时间: {point.businessHours}</Text>
                  </View>
                  <View className="pickup-modal-item-right">
                    <Text className="pickup-modal-item-dist">{point.distance}</Text>
                    {selectedPickupPoint.id === point.id && <Text className="pickup-check">✓</Text>}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
