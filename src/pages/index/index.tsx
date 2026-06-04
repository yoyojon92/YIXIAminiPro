import { View, Text, ScrollView, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { 
  Wine, GlassWater, Apple, Gift, ChevronRight, 
  ShoppingCart, Sparkles, Search, Bell, Crown, Ticket, Zap,
  MapPin, Truck, Store, Send, Plus
} from 'lucide-react-taro'
import { MOCK_PRODUCTS } from '@/mock/products'
import { organLords } from '@/data/organLords'
import { useUserProfileStore } from '@/store/userProfileStore'
import { usePushStore } from '@/store/pushStore'
import { useCartStore } from '@/store/cartStore'
import { useDeliveryStore } from '@/store/deliveryStore'
import { useMemberStore } from '@/store/memberStore'
import { PICKUP_POINTS } from '@/mock/delivery'
import { MemberModal } from '@/components/member-modal'
import { TicketSelector } from '@/components/ticket-selector'
import { WelcomeGiftModal } from '@/components/welcome-gift'
import './index.scss'

const CDN = 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@1fc4e93/src/assets/images/products'

const BOSS_PICK = [
  { id: 'prod_pomegranate_new', name: '榴红心事', sub: '石榴·7°', price: '¥18.8', image: `${CDN}/yixia-wine/01-liu-hong-xin-shi.webp` },
  { id: 'prod_peach_new',       name: '桃心暗动', sub: '黄桃·7°', price: '¥18.8', image: `${CDN}/yixia-wine/03-tao-xin-an-dong.webp` },
  { id: 'prod_red_wine',        name: '红葡萄果酒', sub: '红葡萄·7°', price: '¥49.9', image: `${CDN}/yixia-wine/06-hong-pu-tao-guo-jiu.webp` },
]

const CLASSIC_WINES = [
  { id: 'prod_pomelo_old',          name: '柚见微醺', sub: '柚子酒', price: '¥16.8', image: `${CDN}/yixia-old/01-you-zi-jiu.webp` },
  { id: 'prod_hawthorn_old',        name: '沂蒙山楂酒', sub: '山楂酒', price: '¥16.8', image: `${CDN}/yixia-old/02-yi-meng-shan-zha-jiu.webp` },
  { id: 'prod_hawthorn_oolong_old', name: '山楂乌龙酒', sub: '山楂乌龙', price: '¥16.8', image: `${CDN}/yixia-old/03-shan-zha-wu-long-jiu.webp` },
]

export default function Index() {
  const profileStore = useUserProfileStore()
  const { mode, selectedPickupPoint, setMode, setPickupPoint } = useDeliveryStore()
  const { isMember, setShowMemberModal, getRemainingDays, setShowTicketModal, canClaimTicket, welcomeGiftClaimed, setShowWelcomeGiftModal } = useMemberStore()
  const [showPickupModal, setShowPickupModal] = useState(false)
  
  const unreadCount = usePushStore(state => state.unreadCount)
  const cartCount = useCartStore(state => state.items.reduce((sum, item) => sum + item.quantity, 0))
  const remainingDays = getRemainingDays()

  const goToProduct = (id: string) => Taro.navigateTo({ url: `/pages/product/index?id=${id}` })
  const goToCart = () => Taro.switchTab({ url: '/pages/cart/index' })

  return (
    <View className="min-h-screen bg-purple-50 pb-safe">
      {/* ====== 顶部导航 ====== */}
      <View className="bg-gradient-to-r from-purple-600 to-violet-600 px-4 pt-4 pb-5">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-2">
            <Text className="text-2xl font-bold text-white">邑夏</Text>
            <Badge variant="outline" className="text-xs text-white border-white border-opacity-30 bg-white bg-opacity-10">
              喝点小酒 微醺邑夏
            </Badge>
          </View>
          <View className="flex items-center gap-3">
            <View className="relative" onClick={() => Taro.navigateTo({ url: '/pagesSocial/notifications/index' })}>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 z-10 w-5 h-5 flex items-center justify-center text-xs p-0 bg-red-500">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
              <View className="w-10 h-10 bg-white rounded-full flex items-center justify-center"><Bell size={20} color="#6D28D9" /></View>
            </View>
            <View className="relative" onClick={goToCart}>
              {cartCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 z-10 w-5 h-5 flex items-center justify-center text-xs p-0 bg-red-500">
                  {cartCount > 99 ? '99+' : cartCount}
                </Badge>
              )}
              <View className="w-10 h-10 bg-white rounded-full flex items-center justify-center"><ShoppingCart size={20} color="#6D28D9" /></View>
            </View>
          </View>
        </View>
      </View>

      {/* ====== 配送方式 ====== */}
      <View className="px-4 -mt-3 relative">
        <View className="bg-white rounded-xl p-3 flex items-center gap-2 shadow-sm">
          <View className={`flex-1 py-2 rounded-lg text-center ${mode !== 'mail' && mode !== 'self_pickup' ? 'bg-purple-600' : 'bg-purple-50'}`} onClick={() => setMode('dormitory')}>
            <Text className={`text-xs ${mode !== 'mail' && mode !== 'self_pickup' ? 'text-white' : 'text-gray-700'}`}>
              <Truck size={14} color={mode !== 'mail' && mode !== 'self_pickup' ? 'white' : '#9CA3AF'} /> 送货上门
            </Text>
            <Text className={`text-xs mt-0.5 ${mode !== 'mail' && mode !== 'self_pickup' ? 'text-white' : 'text-gray-700'}`}>满50免配送费</Text>
          </View>
          <View className={`flex-1 py-2 rounded-lg text-center ${mode === 'self_pickup' ? 'bg-purple-600' : 'bg-purple-50'}`} onClick={() => { setMode('self_pickup'); setShowPickupModal(true) }}>
            <Text className={`text-xs ${mode === 'self_pickup' ? 'text-white' : 'text-gray-700'}`}>
              <Store size={14} color={mode === 'self_pickup' ? 'white' : '#9CA3AF'} /> 到店自取
            </Text>
            <Text className={`text-xs mt-0.5 ${mode === 'self_pickup' ? 'text-white' : 'text-gray-700'}`}>免配送费</Text>
          </View>
          <View className={`flex-1 py-2 rounded-lg text-center ${mode === 'mail' ? 'bg-purple-600' : 'bg-purple-50'}`} onClick={() => setMode('mail')}>
            <Text className={`text-xs ${mode === 'mail' ? 'text-white' : 'text-gray-700'}`}>
              <Send size={14} color={mode === 'mail' ? 'white' : '#9CA3AF'} /> 厂家邮寄
            </Text>
            <Text className={`text-xs mt-0.5 ${mode === 'mail' ? 'text-white' : 'text-gray-700'}`}>满30包邮</Text>
          </View>
        </View>
      </View>

      {/* ====== 会员福利区 ====== */}
      <View className="px-4 mt-4">
        <View className="flex items-center justify-between mb-3">
          <View className="flex items-center gap-2">
            <Crown size={18} color="#FBBF24" />
            <Text className="text-sm font-bold text-amber-400">会员福利专区</Text>
          </View>
          {isMember ? (
            <View className="bg-purple-600 text-white text-xs px-2 py-1 rounded">会员剩余{remainingDays}天</View>
          ) : (
            <View className="bg-amber-500 text-gray-900 text-xs px-2 py-1 rounded font-bold" onClick={() => setShowMemberModal(true)}>
              注册9.9创始会员
            </View>
          )}
        </View>
        <View className="flex gap-2">
          <View className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm"
            onClick={() => { if (isMember) setShowTicketModal(true); else setShowMemberModal(true) }}>
            <View className="w-8 h-8 bg-amber-500 bg-opacity-20 rounded-lg mx-auto flex items-center justify-center mb-1">
              <Ticket size={16} color="#FBBF24" />
            </View>
            <Text className="text-xs font-medium text-amber-400">1元小酒票</Text>
            <Text className="text-xs text-gray-500">每月领</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm"
            onClick={() => { if (isMember) setShowMemberModal(true); else setShowMemberModal(true) }}>
            <View className="w-8 h-8 bg-red-500 bg-opacity-20 rounded-lg mx-auto flex items-center justify-center mb-1">
              <Zap size={16} color="#F87171" />
            </View>
            <Text className="text-xs font-medium text-red-400">每周特价¥9.9</Text>
            <Text className="text-xs text-gray-500">限时抢</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-3 text-center shadow-sm"
            onClick={() => { if (isMember) setShowWelcomeGiftModal(true); else setShowMemberModal(true) }}>
            <View className="w-8 h-8 bg-purple-500 bg-opacity-20 rounded-lg mx-auto flex items-center justify-center mb-1">
              <Gift size={16} color="#A855F7" />
            </View>
            <Text className="text-xs font-medium text-purple-400">入会赠饮1瓶</Text>
            <Text className="text-xs text-gray-500">开通送</Text>
          </View>
        </View>
      </View>

      {/* ====== 会员提醒 ====== */}
      {isMember && !welcomeGiftClaimed && (
        <View className="mx-4 mt-3 p-3 rounded-xl border-2 border-purple-400 bg-purple-900 bg-opacity-30 flex items-center gap-3"
          onClick={() => setShowWelcomeGiftModal(true)}>
          <View className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0"><Gift size={20} color="white" /></View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-purple-300">你的入会赠饮未领取</Text>
            <Text className="text-xs text-purple-400 mt-1">选1瓶老款果酒，自提免运费</Text>
          </View>
          <ChevronRight size={18} color="#A855F7" />
        </View>
      )}
      {isMember && canClaimTicket() && (
        <View className="mx-4 mt-3 p-3 rounded-xl border-2 border-amber-400 bg-amber-900 bg-opacity-30 flex items-center gap-3"
          onClick={() => setShowTicketModal(true)}>
          <View className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0"><Ticket size={20} color="white" /></View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-amber-300">你的1元小酒票未领取</Text>
            <Text className="text-xs text-amber-400 mt-1">点击领取，3种老款酒3选1</Text>
          </View>
          <ChevronRight size={18} color="#FBBF24" />
        </View>
      )}

      {/* ====== 厂长推荐 ====== */}
      <View className="mt-6 px-4">
        <View className="flex items-center justify-between mb-4">
          <View className="flex items-center gap-2">
            <Sparkles size={20} color="#FBBF24" />
            <Text className="text-xl font-bold text-gray-900">厂长推荐</Text>
            <Badge className="text-xs bg-amber-500 text-white border-0">⭐ 招牌</Badge>
          </View>
          <View className="flex items-center gap-1" onClick={() => {
            Taro.setStorageSync('selectedCategory', 'new')
            Taro.switchTab({ url: '/pages/category/index' })
          }}>
            <Text className="text-sm text-purple-500">更多</Text>
            <ChevronRight size={16} color="#9CA3AF" />
          </View>
        </View>
        <View className="grid grid-cols-3 gap-2">
          {BOSS_PICK.map((wine) => (
            <View key={wine.id} className="rounded-2xl bg-white overflow-hidden shadow-sm" onClick={() => goToProduct(wine.id)}>
              <View className="w-full h-32 bg-purple-50 overflow-hidden">
                <Image src={wine.image} className="w-full h-full" mode="aspectFill" lazyLoad />
              </View>
              <View className="p-2">
                <Text className="text-xs font-semibold text-gray-900">{wine.name}</Text>
                <Text className="text-xs text-gray-500">{wine.sub}</Text>
                <Text className="text-sm font-bold text-purple-600 mt-1">{wine.price}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ====== 经典特调 ====== */}
      <View className="mt-4 px-4">
        <View className="flex items-center justify-between mb-4">
          <View className="flex items-center gap-2">
            <GlassWater size={20} color="#8B5CF6" />
            <Text className="text-xl font-bold text-gray-900">经典特调</Text>
            <Badge className="text-xs bg-purple-500 text-white border-0">🍸 经典</Badge>
          </View>
          <View className="flex items-center gap-1" onClick={() => {
            Taro.setStorageSync('selectedCategory', 'old_wine')
            Taro.switchTab({ url: '/pages/category/index' })
          }}>
            <Text className="text-sm text-purple-500">更多</Text>
            <ChevronRight size={16} color="#9CA3AF" />
          </View>
        </View>
        <View className="bg-white rounded-2xl p-3 shadow-sm">
          <View className="grid grid-cols-3 gap-3">
            {CLASSIC_WINES.map((wine) => (
              <View key={wine.id} className="flex flex-col items-center" onClick={() => goToProduct(wine.id)}>
                <View className="w-20 h-20 bg-purple-50 rounded-xl overflow-hidden">
                  <Image src={wine.image} className="w-full h-full" mode="aspectFill" lazyLoad />
                </View>
                <Text className="text-xs font-semibold text-gray-900 mt-2">{wine.name}</Text>
                <Text className="text-xs text-gray-500">{wine.sub}</Text>
                <Text className="text-sm font-bold text-purple-600 mt-1">{wine.price}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ====== 藏府君 ====== */}
      <View className="px-4 mt-6 mb-6">
        <Text className="text-sm font-medium text-gray-900 mb-3">🏛 藏府君 · 养生果酒CP</Text>
        <View className="flex justify-between">
          {Object.values(organLords).map((lord) => (
            <View key={lord.id} className="flex flex-col items-center"
              onClick={() => {
                profileStore.recordOrganLordClick(lord.id)
                Taro.navigateTo({ url: `/pages/product/index?id=${lord.productIds[0]}` })
              }}>
              <View className="w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center"
                style={{ borderColor: lord.color, backgroundColor: lord.color + '20' }}>
                <Image src={lord.image} className="w-full h-full" mode="aspectFill" lazyLoad />
              </View>
              <Text className="text-xs text-gray-600 mt-1">{lord.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ====== 自提点弹窗 ====== */}
      {showPickupModal && (
        <View className="pickup-modal-mask" onClick={() => setShowPickupModal(false)}>
          <View className="pickup-modal" onClick={(e) => e.stopPropagation()}>
            <View className="pickup-modal-header">
              <Text className="pickup-modal-title">选择自提点</Text>
              <View className="pickup-modal-close" onClick={() => setShowPickupModal(false)}><Text>✕</Text></View>
            </View>
            <View className="pickup-modal-list">
              {PICKUP_POINTS.map((point) => (
                <View key={point.id}
                  className={`pickup-modal-item ${selectedPickupPoint.id === point.id ? 'pickup-modal-item-active' : ''}`}
                  onClick={() => { setPickupPoint(point); setShowPickupModal(false) }}>
                  <View className="pickup-modal-item-info">
                    <View className="pickup-modal-item-name-row">
                      <Text className="pickup-modal-item-name">{point.name}</Text>
                      {point.isNearest && <Text className="pickup-nearest-tag">最近</Text>}
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

      <MemberModal />
      <TicketSelector />
      <WelcomeGiftModal />
    </View>
  )
}
