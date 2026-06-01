import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { PICKUP_SHOPS, type PickupShop } from '@/data/pickupShops'
import { useCartStore } from '@/store/cartStore'
import { useUserProfileStore } from '@/store/userProfileStore'
import { MapPin, Phone, Clock, Check } from 'lucide-react-taro'
import "./index.config"

export default function PickupPage() {
  const [selectedId, setSelectedId] = useState<string>(
    useCartStore.getState().delivery.pickupShopId || ''
  )
  const cartStore = useCartStore()
  const profileStore = useUserProfileStore.getState()

  const handleSelect = (shop: PickupShop) => {
    setSelectedId(shop.id)
  }

  const handleConfirm = () => {
    const shop = PICKUP_SHOPS.find(s => s.id === selectedId)
    if (!shop) {
      Taro.showToast({ title: "请选择自提点", icon: "none" })
      return
    }
    
    // 设置自提点信息到购物车
    cartStore.setPickupShop(shop.id, shop.name)
    
    // 埋点
    profileStore.recordPageView?.("pickup")
    console.log("[埋点] 选择自提点", {
      userId: "user_001",
      shopId: shop.id,
      shopName: shop.name,
      action: "pickup_select",
      timestamp: Date.now()
    })
    
    Taro.showToast({ title: "已选择自提点", icon: "success" })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  const handleCall = (phone: string) => {
    Taro.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        Taro.showToast({ title: "拨打失败", icon: "none" })
      }
    })
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* 标题 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <Text className="text-lg font-semibold text-gray-900">选择自提点</Text>
      </View>

      {/* 自提点列表 */}
      <View className="p-4 space-y-3">
        {PICKUP_SHOPS.map((shop) => (
          <View
            key={shop.id}
            onClick={() => handleSelect(shop)}
            className={`bg-white rounded-xl p-4 flex items-start gap-3 ${
              selectedId === shop.id 
                ? "border-2 border-purple-500 shadow-sm" 
                : "border border-gray-100"
            }`}
          >
            {/* 左侧单选 */}
            <View className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 flex-shrink-0 ${
              selectedId === shop.id 
                ? "bg-purple-500" 
                : "border-2 border-gray-300"
            }`}
            >
              {selectedId === shop.id && (
                <Check size={12} color="#fff" strokeWidth={3} />
              )}
            </View>

            {/* 右侧信息 */}
            <View className="flex-1">
              <Text className="block text-base font-semibold text-gray-900 mb-1">
                {shop.name}
              </Text>
              
              <View className="flex items-start gap-1 mb-1">
                <MapPin size={14} color="#9CA3AF" className="mt-1 flex-shrink-0" />
                <Text className="text-sm text-gray-500">{shop.address}</Text>
              </View>
              
              <View className="flex items-center gap-4 mt-2">
                <View className="flex items-center gap-1">
                  <Clock size={14} color="#8B5CF6" />
                  <Text className="text-xs text-purple-600">{shop.hours}</Text>
                </View>
                <View 
                  onClick={(e) => { e.stopPropagation(); handleCall(shop.phone) }}
                  className="flex items-center gap-1"
                >
                  <Phone size={14} color="#9CA3AF" />
                  <Text className="text-xs text-blue-500">{shop.phone}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 底部确认按钮 */}
      <View className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <View 
          onClick={handleConfirm}
          className={`py-3 rounded-xl text-center font-semibold ${
            selectedId 
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" 
              : "bg-gray-200 text-gray-400"
          }`}
        >
          <Text className="text-base">确认选择</Text>
        </View>
      </View>
    </View>
  )
}
