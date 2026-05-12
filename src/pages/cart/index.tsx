import { useState } from 'react'
import { View, Text, Image, Checkbox } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPinned, Store, Truck, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react-taro'
import { useCartStore } from '@/store/cartStore'

const deliveryOptions = [
  { id: 'dormitory', name: '送货到宿舍', icon: Truck, desc: '预计30-60分钟送达', extra: '+3元配送费' },
  { id: 'pickup', name: '到店自提', icon: Store, desc: '到附近自提点取货', extra: '免配送费' }
]

export default function Cart() {
  const { items, updateQuantity, removeItem } = useCartStore()
  const [selectedDelivery, setSelectedDelivery] = useState<'dormitory' | 'pickup'>('dormitory')

  const allSelected = items.length > 0 && items.every(() => true) // 简化，全选逻辑
  const selectedItems = items.filter(item => item.quantity > 0)
  
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const originalTotal = selectedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
  const discount = originalTotal - totalPrice
  const deliveryFee = selectedDelivery === 'dormitory' ? 3 : 0
  const finalPrice = totalPrice + deliveryFee

  const handleQuantityChange = (id: string, delta: number) => {
    const item = items.find(i => i.id === id)
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta)
      updateQuantity(id, newQuantity)
    }
  }

  const goToCheckout = () => {
    if (selectedItems.length === 0) {
      Taro.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    Taro.navigateTo({ url: '/pages/orders/index?type=checkout' })
  }

  if (items.length === 0) {
    return (
      <View className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pb-safe">
        <View className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag size={48} className="text-gray-300" color="#d1d5db" />
        </View>
        <Text className="text-gray-500 text-lg mb-2">购物车是空的</Text>
        <Text className="text-gray-400 text-sm mb-6">快去挑选心仪的商品吧</Text>
        <Button onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>
          <Text>去逛逛</Text>
        </Button>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-32">
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
            return (
              <View 
                key={option.id}
                className={`flex-1 p-3 rounded-xl border-2 ${
                  isSelected ? 'border-primary bg-purple-50' : 'border-gray-200 bg-gray-50'
                }`}
                onClick={() => setSelectedDelivery(option.id as 'dormitory' | 'pickup')}
              >
                <View className="flex items-center gap-2">
                  <Icon size={18} className={isSelected ? 'text-primary' : 'text-gray-500'} color={isSelected ? '#8B5CF6' : '#9ca3af'} />
                  <Text className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-gray-700'}`}>
                    {option.name}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500 mt-1">{option.desc}</Text>
                <Text className={`text-xs mt-1 ${isSelected ? 'text-primary' : 'text-gray-400'}`}>
                  {option.extra}
                </Text>
              </View>
            )
          })}
        </View>
      </View>

      {/* 自提点信息 */}
      {selectedDelivery === 'pickup' && (
        <View className="px-4 py-3 bg-white mt-2 flex items-center gap-3">
          <View className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
            <MapPinned size={18} className="text-primary" color="#8B5CF6" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-900">青岛农业大学南门自提点</Text>
            <Text className="text-xs text-gray-500 mt-1">距您约500米 | 营业时间 9:00-22:00</Text>
          </View>
          <Text className="text-primary text-sm">切换</Text>
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
                          <Minus size={14} className="text-gray-500" color="#6b7280" />
                        </View>
                        <Text className="text-sm text-gray-900 w-8 text-center">{item.quantity}</Text>
                        <View 
                          className="w-7 h-7 flex items-center justify-center"
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          <Plus size={14} className="text-gray-500" color="#6b7280" />
                        </View>
                      </View>
                      <View 
                        className="p-2"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} className="text-gray-400" color="#9ca3af" />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}
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
              {discount > 0 && (
                <Text className="text-xs text-gray-400 line-through">¥{originalTotal.toFixed(2)}</Text>
              )}
            </View>
          </View>
        </View>
        
        <Button 
          className="w-full" 
          size="lg"
          disabled={selectedItems.length === 0}
          onClick={goToCheckout}
        >
          <Text>去结算 ({selectedItems.length})</Text>
        </Button>
      </View>
    </View>
  )
}
