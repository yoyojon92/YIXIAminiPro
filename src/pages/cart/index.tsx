import { useState, useEffect } from 'react'
import { View, Text, Image, Checkbox, ScrollView, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Store, Truck, Trash2, Minus, Plus, ShoppingBag, Ticket, X, ChevronRight, MapPin, Building, Send, Crown, Clock } from 'lucide-react-taro'
import { useCartStore } from '@/store/cartStore'
import { useCouponStore } from '@/store/couponStore'
import { useUserProfileStore } from '@/store/userProfileStore'
import { useMemberStore, TICKET_WINE_NAMES } from '@/store/memberStore'
import { calculateShipping } from '@/data/shippingZones'
import { calcDiscount, calcNextDiscount, canUseTicket } from '@/utils/discount'
import { PICKUP_POINTS } from '@/mock/delivery'
import type { Coupon } from '@/data/coupons'

const deliveryOptions = [
  { id: 'dormitory', name: '送货到宿舍', icon: Truck, desc: '预计15-30分钟送达', extra: '¥1跑腿费' },
  { id: 'pickup', name: '到店自提', icon: Store, desc: '到附近自提点取货', extra: '免配送费' },
  { id: 'mail', name: '厂家直邮', icon: Send, desc: '全国范围配送到家', extra: '按地区计费' }
]

// 自提时间段
const PICKUP_TIME_SLOTS = [
  '09:00-12:00',
  '12:00-15:00',
  '15:00-18:00',
  '18:00-21:00',
]

// 自提日期选项
const PICKUP_DATE_OPTIONS = [
  { value: 'today', label: '今天' },
  { value: 'tomorrow', label: '明天' },
]

export default function Cart() {
  const cartStore = useCartStore()
  const { items, updateQuantity, removeItem, totalAmount, delivery, setDelivery } = cartStore
  const { 
    selectedCoupon, 
    selectCoupon, 
    getAvailableCoupons,
    checkNewUserCoupon,
    coupons 
  } = useCouponStore()
  const profileStore = useUserProfileStore()
  const { isMember, ticketClaimedMonth, ticketSelectedWine, setShowTicketModal } = useMemberStore()
  const [selectedDelivery, setSelectedDelivery] = useState<'dormitory' | 'pickup' | 'mail'>(
    delivery.type === 'self_pickup' ? 'pickup' : delivery.type === 'mail' ? 'mail' : 'dormitory'
  )
  const [showCouponSheet, setShowCouponSheet] = useState(false)
  
  // 自提预约
  const [pickupDate, setPickupDate] = useState<'today' | 'tomorrow'>('today')
  const [pickupTime, setPickupTime] = useState(0) // Picker index
  
  // 1元小酒票加购
  const [ticketAdded, setTicketAdded] = useState(false)
  
  // 新用户自动发券
  useEffect(() => {
    checkNewUserCoupon()
  }, [])

  const allSelected = items.length > 0 && items.every(() => true)
  const selectedItems = items.filter(item => item.quantity > 0)
  
  const totalPrice = totalAmount()
  const bottleCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0)
  
  // 满减计算
  const { discount: fullReduction, label: fullReductionLabel } = calcDiscount(totalPrice)
  const nextDiscount = calcNextDiscount(totalPrice)
  
  // 1元小酒票是否可在当前配送模式使用
  const ticketAvailable = isMember && ticketClaimedMonth && ticketSelectedWine && canUseTicket(selectedDelivery, totalPrice)
  
  // 计算运费
  let deliveryFee = 0
  let shippingInfo: { zone: any; shippingFee: number; isFreeShipping: boolean } | null = null
  if (selectedDelivery === 'dormitory') {
    deliveryFee = 1
  } else if (selectedDelivery === 'mail' && delivery.shippingAddress?.province) {
    shippingInfo = calculateShipping(delivery.shippingAddress.province, bottleCount, totalPrice)
    deliveryFee = shippingInfo.shippingFee
  }
  
  const couponDiscount = selectedCoupon ? selectedCoupon.discount : 0
  const ticketAmount = ticketAdded ? 1 : 0 // 1元小酒票加购金额
  const finalPrice = Math.max(0, totalPrice + deliveryFee - fullReduction - couponDiscount + ticketAmount)
  
  const availableCoupons = getAvailableCoupons(totalPrice)
  const unusedCouponCount = coupons.filter(c => !c.isUsed).length

  const handleQuantityChange = (id: string, delta: number) => {
    const item = items.find(i => i.id === id)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta)
      updateQuantity(id, newQuantity)
    }
  }

  const handleSelectCoupon = (coupon: Coupon) => {
    selectCoupon(coupon.id)
    setShowCouponSheet(false)
    Taro.showToast({ title: `已选中${coupon.name}`, icon: 'success' })
  }

  const handleRemoveCoupon = () => {
    selectCoupon('' as any)
    Taro.showToast({ title: '已取消代券', icon: 'none' })
  }

  const goToCheckout = () => {
    if (selectedItems.length === 0) {
      Taro.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    // 检查送货到宿舍是否已填地址
    if (selectedDelivery === 'dormitory' && !delivery.dormitoryAddress) {
      Taro.showToast({ title: '请先填写宿舍地址', icon: 'none' })
      return
    }
    // 检查自提是否已选自提点
    if (selectedDelivery === 'pickup' && !delivery.pickupShopId) {
      Taro.showToast({ title: '请先选择自提点', icon: 'none' })
      return
    }
    // 检查厂家直邮是否已填地址
    if (selectedDelivery === 'mail' && !delivery.shippingAddress) {
      Taro.showToast({ title: '请先填写收货地址', icon: 'none' })
      return
    }
    // 记录代券使用行为（用于用户画像）
    if (selectedCoupon) {
      profileStore.recordCouponUse(selectedCoupon.id, selectedCoupon.discount)
    }
    Taro.navigateTo({ url: '/pagesOrder/orders/index?type=checkout' })
  }

  // 检查是否可以结算
  const canCheckout = selectedItems.length > 0 && 
    (selectedDelivery === 'pickup' ? true : selectedDelivery === 'mail' ? !!delivery.shippingAddress : !!delivery.dormitoryAddress)

  if (items.length === 0) {
    return (
      <View className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pb-safe">
        <View className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag size={48} className="text-gray-300" color="#d1d5db" />
        </View>
        <Text className="block text-gray-500 text-lg mb-2">购物车是空的</Text>
        <Text className="block text-gray-400 text-sm mb-6">快去挑选心仪的商品吧</Text>
        <Button onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>
          <Text>去逛逛</Text>
        </Button>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-32">
      {/* 代券选择面板 */}
      {showCouponSheet && (
        <View className="fixed inset-0 z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-screen overflow-hidden" style={{ maxHeight: '70vh' }}>
            <View className="p-4 border-b border-gray-100 flex items-center justify-between">
              <Text className="text-lg font-semibold text-gray-900">选择代券</Text>
              <View onClick={() => setShowCouponSheet(false)}>
                <X size={22} color="#9CA3AF" />
              </View>
            </View>
            
            <ScrollView scrollY className="max-h-96">
              <View className="p-4">
                {/* 不使用代券 */}
                <View 
                  className="mb-3 p-4 rounded-xl border-2 border-dashed border-gray-200"
                  onClick={() => { selectCoupon('' as any); setShowCouponSheet(false); }}
                >
                  <View className="flex items-center justify-between">
                    <Text className="text-sm text-gray-500">不使用代券</Text>
                    {!selectedCoupon && (
                      <View className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                        <View className="w-3 h-3 rounded-full bg-primary" />
                      </View>
                    )}
                  </View>
                </View>
                
                {/* 可用代券列表 */}
                {availableCoupons.map((coupon) => (
                  <View 
                    key={coupon.id}
                    className={`mb-3 p-4 rounded-xl border-2 ${
                      selectedCoupon?.id === coupon.id ? 'border-primary bg-purple-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleSelectCoupon(coupon)}
                  >
                    <View className="flex items-center justify-between">
                      <View className="flex items-center gap-3">
                        <Text className="text-2xl">{coupon.icon}</Text>
                        <View>
                          <Text className="text-sm font-medium text-gray-900">{coupon.name}</Text>
                          <Text className="text-xs text-gray-500">满{coupon.minSpend}元可用 · {coupon.description}</Text>
                        </View>
                      </View>
                      <View className="flex items-center gap-2">
                        <Text className="text-lg font-bold text-primary">-¥{coupon.discount}</Text>
                        {selectedCoupon?.id === coupon.id && (
                          <View className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Text className="text-white text-xs">✓</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
                
                {availableCoupons.length === 0 && (
                  <View className="py-8 text-center">
                    <Text className="block text-gray-400">暂无可用代券</Text>
                    <Text className="block text-gray-300 text-sm mt-1">满{Math.min(totalPrice + 1, 20)}元即可使用代券</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* 头部 */}
      <View className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <Text className="text-lg font-semibold text-gray-900">购物车</Text>
        <Text className="text-sm text-gray-500">{items.length}件商品</Text>
      </View>

      {/* 配送方式选择 */}
      <View className="px-4 py-3 bg-white mt-2">
        <Text className="text-sm font-medium text-gray-700 mb-3">配送方式</Text>
        <View className="flex gap-3">
          {deliveryOptions.map((option) => {
            const Icon = option.icon
            const isSelected = selectedDelivery === option.id
            const isDormitory = option.id === 'dormitory'
            return (
              <View 
                key={option.id}
                className={`flex-1 p-3 rounded-xl border-2 ${
                  isSelected 
                    ? isDormitory 
                      ? 'border-amber-500 bg-amber-50' 
                      : 'border-primary bg-purple-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedDelivery(option.id as 'dormitory' | 'pickup' | 'mail')
                  if (option.id === 'pickup') {
                    setDelivery({ type: 'self_pickup' })
                  } else {
                    setDelivery({ type: 'dormitory', pickupShopId: undefined, pickupShopName: undefined })
                  }
                }}
              >
                {isDormitory && !isSelected && (
                  <View className="bg-amber-500 rounded text-white text-xs px-2 py-1 mb-2 text-center">
                    热门
                  </View>
                )}
                <View className="flex items-center gap-2">
                  <Icon size={18} color={isSelected ? (isDormitory ? '#F59E0B' : '#8B5CF6') : '#9ca3af'} />
                  <Text className={`text-sm font-medium ${isSelected ? (isDormitory ? 'text-amber-600' : 'text-primary') : 'text-gray-700'}`}>
                    {option.name}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500 mt-1">{option.desc}</Text>
                <Text className={`text-xs mt-1 ${isSelected ? (isDormitory ? 'text-amber-600' : 'text-primary') : 'text-gray-400'}`}>
                  {option.extra}
                </Text>
              </View>
            )
          })}
        </View>
      </View>

      {/* 宿舍地址选择（仅送货到宿舍模式显示） */}
      {selectedDelivery === 'dormitory' && (
        <View 
          className="px-4 py-3 bg-white mt-2"
          onClick={() => Taro.navigateTo({ url: '/pagesOrder/dormitory/index' })}
        >
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-2">
              <Building size={18} color="#8B5CF6" />
              <Text className="text-sm font-medium text-gray-700">宿舍地址</Text>
            </View>
            <View className="flex items-center gap-2">
              {delivery.dormitoryAddress ? (
                <Text className="text-sm text-primary">
                  {delivery.dormitoryAddress.zoneName} {delivery.dormitoryAddress.building} {delivery.dormitoryAddress.roomNumber}
                </Text>
              ) : (
                <Text className="text-sm text-gray-400">请选择</Text>
              )}
              <ChevronRight size={18} color="#9CA3AF" />
            </View>
          </View>
        </View>
      )}

      {/* 自提点选择（仅自提模式显示）- 简化版：选自提点+预约时间 */}
      {selectedDelivery === 'pickup' && (
        <View className="px-4 py-3 bg-white mt-2">
          {/* 自提点选择 */}
          <View className="flex items-center justify-between mb-3">
            <View className="flex items-center gap-2">
              <MapPin size={18} color="#8B5CF6" />
              <Text className="text-sm font-medium text-gray-700">自提点</Text>
            </View>
            <Picker
              mode="selector"
              range={PICKUP_POINTS.map(p => p.name)}
              onChange={(e) => {
                const idx = e.detail.value
                setDelivery({ type: 'self_pickup', pickupShopId: PICKUP_POINTS[idx].id, pickupShopName: PICKUP_POINTS[idx].name })
              }}
            >
              <View className="flex items-center gap-2">
                {delivery.pickupShopName ? (
                  <Text className="text-sm text-primary">{delivery.pickupShopName}</Text>
                ) : (
                  <Text className="text-sm text-gray-400">请选择</Text>
                )}
                <ChevronRight size={18} color="#9CA3AF" />
              </View>
            </Picker>
          </View>
          {/* 自提点地址 */}
          {delivery.pickupShopId && (() => {
            const point = PICKUP_POINTS.find(p => p.id === delivery.pickupShopId)
            return point ? (
              <Text className="text-xs text-gray-400 mb-3 block">{point.address} · {point.businessHours}</Text>
            ) : null
          })()}
          {/* 预约到店时间 */}
          <View className="flex items-center justify-between mb-3">
            <View className="flex items-center gap-2">
              <Clock size={18} color="#8B5CF6" />
              <Text className="text-sm font-medium text-gray-700">预约到店</Text>
            </View>
            <View className="flex items-center gap-2">
              {PICKUP_DATE_OPTIONS.map(opt => (
                <View
                  key={opt.value}
                  className={`px-3 py-1 rounded-full text-xs ${
                    pickupDate === opt.value ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                  onClick={() => setPickupDate(opt.value as 'today' | 'tomorrow')}
                >
                  <Text>{opt.label}</Text>
                </View>
              ))}
              <Picker mode="selector" range={PICKUP_TIME_SLOTS} onChange={(e) => setPickupTime(Number(e.detail.value))}>
                <View className="px-3 py-1 rounded-full bg-purple-50 text-xs">
                  <Text className="text-primary">{PICKUP_TIME_SLOTS[pickupTime]}</Text>
                </View>
              </Picker>
            </View>
          </View>
        </View>
      )}

      {/* 邮寄地址选择（仅厂家直邮模式显示） */}
      {selectedDelivery === 'mail' && (
        <View 
          className="px-4 py-3 bg-white mt-2"
          onClick={() => Taro.navigateTo({ url: '/pagesOrder/shipping-address/index' })}
        >
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-2">
              <Send size={18} color="#3B82F6" />
              <Text className="text-sm font-medium text-gray-700">收货地址</Text>
            </View>
            <View className="flex items-center gap-2">
              {delivery.shippingAddress ? (
                <Text className="text-sm text-primary max-w-48 truncate">
                  {delivery.shippingAddress.province} {delivery.shippingAddress.city}
                </Text>
              ) : (
                <Text className="text-sm text-gray-400">请填写</Text>
              )}
              <ChevronRight size={18} color="#9CA3AF" />
            </View>
          </View>
          {shippingInfo && (
            <View className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
              <View className="flex items-center gap-1">
                <Text className="text-xs text-gray-500">运费：</Text>
                {shippingInfo.isFreeShipping ? (
                  <Text className="text-xs text-green-600 font-medium">免运费</Text>
                ) : (
                  <Text className="text-xs text-amber-600 font-medium">¥{shippingInfo.shippingFee}</Text>
                )}
              </View>
              <Text className="text-xs text-gray-400">{shippingInfo.zone?.name}</Text>
            </View>
          )}
        </View>
      )}

      {/* 代券选择 */}
      <View 
        className="px-4 py-3 bg-white mt-2 flex items-center justify-between"
        onClick={() => setShowCouponSheet(true)}
      >
        <View className="flex items-center gap-2">
          <Ticket size={18} color="#8B5CF6" />
          <Text className="text-sm font-medium text-gray-700">代券</Text>
          {unusedCouponCount > 0 && (
            <Badge variant="destructive" className="text-xs ml-1">
              {unusedCouponCount}
            </Badge>
          )}
        </View>
        <View className="flex items-center gap-2">
          {selectedCoupon ? (
            <View className="flex items-center gap-1">
              <Text className="text-sm text-primary">-{selectedCoupon.icon} {selectedCoupon.name}</Text>
              <View onClick={(e) => { e.stopPropagation(); handleRemoveCoupon(); }}>
                <X size={16} color="#9CA3AF" />
              </View>
            </View>
          ) : (
            <Text className="text-sm text-gray-400">请选择</Text>
          )}
          <ChevronRight size={18} color="#9CA3AF" />
        </View>
      </View>

      {/* 1元小酒票加购（会员已领小酒票且订单达标时显示） */}
      {ticketAvailable && (
        <View className="px-4 py-3 bg-white mt-2">
          <View 
            className={`p-3 rounded-xl border-2 flex items-center gap-3 ${
              ticketAdded ? 'border-green-500 bg-green-50' : 'border-amber-300 bg-amber-50'
            }`}
            onClick={() => setTicketAdded(!ticketAdded)}
          >
            <View className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <Crown size={20} color="white" />
            </View>
            <View className="flex-1">
              <View className="flex items-center gap-2">
                <Text className="text-sm font-medium text-gray-900">1元加购</Text>
                <Text className="text-sm font-medium text-amber-600">{TICKET_WINE_NAMES[ticketSelectedWine!]}</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                {selectedDelivery === 'pickup' ? '自提无门槛可用' : selectedDelivery === 'dormitory' ? '同城满50元可用' : '邮寄满30元可用'}
              </Text>
            </View>
            <View className="flex items-center gap-2">
              <Text className="text-lg font-bold text-green-600">¥1</Text>
              {ticketAdded ? (
                <View className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Text className="text-white text-xs">✓</Text>
                </View>
              ) : (
                <View className="w-6 h-6 rounded-full border-2 border-gray-300" />
              )}
            </View>
          </View>
        </View>
      )}

      {/* 会员未领小酒票提示 */}
      {isMember && !ticketClaimedMonth && (
        <View 
          className="px-4 py-3 bg-white mt-2"
          onClick={() => setShowTicketModal(true)}
        >
          <View className="p-3 rounded-xl border-2 border-amber-300 bg-amber-50 flex items-center gap-3">
            <View className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <Ticket size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-amber-700">本月1元小酒票未领取</Text>
              <Text className="text-xs text-gray-500 mt-1">点击领取，3种老款酒3选1</Text>
            </View>
            <ChevronRight size={18} color="#D97706" />
          </View>
        </View>
      )}

      {/* 满减提示 */}
      {fullReduction > 0 && (
        <View className="px-4 py-2 bg-white mt-2">
          <View className="p-2 rounded-lg bg-red-50 flex items-center gap-2">
            <Text className="text-xs text-red-500 font-medium">🎉 {fullReductionLabel}</Text>
            <Text className="text-xs text-red-400">-¥{fullReduction}</Text>
          </View>
        </View>
      )}
      {fullReduction === 0 && nextDiscount.label && (
        <View className="px-4 py-2 bg-white mt-2">
          <View className="p-2 rounded-lg bg-gray-50 flex items-center gap-2">
            <Text className="text-xs text-gray-500">{nextDiscount.label}</Text>
          </View>
        </View>
      )}

      {/* 购物车列表 */}
      <View className="px-4 mt-2">
        {items.map((item) => (
          <Card key={item.id} className="mb-3">
            <CardContent className="p-4">
              <View className="flex gap-3">
                <View className="flex items-center justify-center">
                  <Checkbox value={String(item.id)} checked />
                </View>
                
                <Image src={item.image} mode="widthFix" className="w-20 h-20 rounded-lg" />
                
                <View className="flex-1 flex flex-col justify-between">
                  <View>
                    <Text className="text-sm text-gray-900 font-medium line-clamp-1">{item.name}</Text>
                    <Text className="text-xs text-gray-500 mt-1">{item.spec}</Text>
                  </View>
                  
                  <View className="flex items-center justify-between mt-2">
                    <View className="flex items-baseline gap-1">
                      <Text className="text-primary font-bold">¥{item.price}</Text>
                      <Text className="text-xs text-gray-400 line-through">¥{item.originalPrice}</Text>
                    </View>
                    
                    <View className="flex items-center gap-2">
                      <View className="flex items-center border border-gray-200 rounded-lg">
                        <View 
                          className="w-7 h-7 flex items-center justify-center"
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          <Minus size={14} color="#6b7280" />
                        </View>
                        <Text className="text-sm text-gray-900 w-8 text-center">{item.quantity}</Text>
                        <View 
                          className="w-7 h-7 flex items-center justify-center"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus size={14} color="#6b7280" />
                        </View>
                      </View>

                      <View 
                        className="p-2"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} color="#9ca3af" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* 订单摘要 */}
      <View className="px-4 mt-2">
        <Card>
          <CardContent className="p-4">
            <Text className="text-sm font-medium text-gray-700 mb-3">订单摘要</Text>
            <View className="space-y-2">
              <View className="flex justify-between text-sm">
                <Text className="text-gray-500">商品总价</Text>
                <Text className="text-gray-900">¥{totalPrice.toFixed(2)}</Text>
              </View>
              {ticketAdded && (
                <View className="flex justify-between text-sm">
                  <Text className="text-amber-600">1元小酒票加购</Text>
                  <Text className="text-amber-600">+¥1.00</Text>
                </View>
              )}
              <View className="flex justify-between text-sm">
                <Text className="text-gray-500">配送费</Text>
                <Text className="text-gray-900">+¥{deliveryFee.toFixed(2)}</Text>
              </View>
              {fullReduction > 0 && (
                <View className="flex justify-between text-sm">
                  <Text className="text-red-500">{fullReductionLabel}</Text>
                  <Text className="text-red-500">-¥{fullReduction.toFixed(2)}</Text>
                </View>
              )}
              {selectedCoupon && (
                <View className="flex justify-between text-sm">
                  <Text className="text-primary">代券抵扣</Text>
                  <Text className="text-primary">-¥{couponDiscount.toFixed(2)}</Text>
                </View>
              )}
              <View className="flex justify-between text-sm pt-2 border-t border-gray-100">
                <Text className="text-gray-900 font-medium">实付金额</Text>
                <Text className="text-primary font-bold text-lg">¥{finalPrice.toFixed(2)}</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 底部结算栏 */}
      <View 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-safe"
        style={{ zIndex: 100 }}
      >
        <View className="flex items-center gap-4 mb-3">
          <View className="flex items-center gap-2">
            <Checkbox value="selectAll" checked={allSelected} />
            <Text className="text-sm text-gray-700">全选</Text>
          </View>
          <View className="flex-1 text-right">
            <Text className="text-sm text-gray-500">合计：</Text>
            <View className="flex items-baseline justify-end gap-1">
              <Text className="text-primary font-bold text-xl">¥{finalPrice.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
        <Button 
          className="w-full" 
          size="lg"
          disabled={!canCheckout}
          onClick={goToCheckout}
        >
          <Text>{canCheckout ? `去结算 (${selectedItems.length})` : '请完善配送信息'}</Text>
        </Button>
      </View>
    </View>
  )
}


