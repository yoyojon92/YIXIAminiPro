import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, MapPin, Truck } from 'lucide-react-taro'
import { useCartStore } from '@/store/cartStore'
import { calculateShipping, SHIPPING_ZONES } from '@/data/shippingZones'

export default function ShippingAddress() {
  const { items: cartItems, delivery, setShippingAddress } = useCartStore()
  const shippingAddress = delivery?.shippingAddress

  const [formData, setFormData] = useState({
    name: shippingAddress?.name || '',
    phone: shippingAddress?.phone || '',
    province: shippingAddress?.province || '',
    city: shippingAddress?.city || '',
    district: shippingAddress?.district || '',
    address: shippingAddress?.address || '',
    postalCode: shippingAddress?.postalCode || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const provinces = SHIPPING_ZONES.map((z) => z.name)

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const bottleCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const shippingInfo = formData.province
    ? calculateShipping(formData.province, bottleCount, totalAmount)
    : null

  const validatePhone = (phone: string) => /^1[3-9]\d{9}$/.test(phone)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = '请输入收件人姓名'
    if (!validatePhone(formData.phone)) newErrors.phone = '请输入正确的手机号'
    if (!formData.province) newErrors.province = '请选择省份'
    if (!formData.city.trim()) newErrors.city = '请输入城市'
    if (!formData.district.trim()) newErrors.district = '请输入区县'
    if (!formData.address.trim()) newErrors.address = '请输入详细地址'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleConfirm = () => {
    if (!validateForm()) return
    setShippingAddress(formData)
    Taro.showToast({ title: '地址已保存', icon: 'success' })
    setTimeout(() => Taro.navigateBack(), 1000)
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <View className="bg-white sticky top-0 z-50 flex items-center px-4 py-3 border-b border-gray-100">
        <View onClick={() => Taro.navigateBack()} className="p-1">
          <ChevronLeft size={24} color="#374151" />
        </View>
        <Text className="block text-lg font-semibold flex-1 text-center pr-8">填写收货地址</Text>
      </View>

      <View className="p-4 space-y-4">
        {/* 收件人 */}
        <Card>
          <CardContent className="p-4">
            <View className="space-y-4">
              <View>
                <Label className="text-sm text-gray-600 mb-1 block">收件人姓名</Label>
                <View className={`bg-gray-50 rounded-xl px-4 py-3 ${errors.name ? 'border border-red-400' : ''}`}>
                  <Input
                    className="w-full bg-transparent"
                    placeholder="请输入收件人姓名"
                    value={formData.name}
                    onInput={(e) => updateField('name', e.detail.value)}
                  />
                </View>
                {errors.name && <Text className="block text-xs text-red-500 mt-1">{errors.name}</Text>}
              </View>

              <View>
                <Label className="text-sm text-gray-600 mb-1 block">手机号</Label>
                <View className={`bg-gray-50 rounded-xl px-4 py-3 ${errors.phone ? 'border border-red-400' : ''}`}>
                  <Input
                    className="w-full bg-transparent"
                    placeholder="请输入11位手机号"
                    type="number"
                    maxlength={11}
                    value={formData.phone}
                    onInput={(e) => updateField('phone', e.detail.value)}
                  />
                </View>
                {errors.phone && <Text className="block text-xs text-red-500 mt-1">{errors.phone}</Text>}
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 地址 */}
        <Card>
          <CardContent className="p-4">
            <View className="space-y-4">
              <View className="grid grid-cols-2 gap-3">
                <View>
                  <Label className="text-sm text-gray-600 mb-1 block">省份</Label>
                  <View
                    className={`bg-gray-50 rounded-xl px-4 py-3 ${errors.province ? 'border border-red-400' : ''}`}
                    onClick={() => {
                      Taro.showActionSheet({
                        itemList: provinces,
                        success: (res) => {
                          updateField('province', provinces[res.tapIndex])
                        },
                      })
                    }}
                  >
                    <Text className={`text-sm ${formData.province ? 'text-gray-800' : 'text-gray-400'}`}>
                      {formData.province || '请选择省份'}
                    </Text>
                  </View>
                </View>
                <View>
                  <Label className="text-sm text-gray-600 mb-1 block">城市</Label>
                  <View className={`bg-gray-50 rounded-xl px-4 py-3 ${errors.city ? 'border border-red-400' : ''}`}>
                    <Input
                      className="w-full bg-transparent text-sm"
                      placeholder="如青岛市"
                      value={formData.city}
                      onInput={(e) => updateField('city', e.detail.value)}
                    />
                  </View>
                </View>
              </View>

              <View>
                <Label className="text-sm text-gray-600 mb-1 block">区/县</Label>
                <View className={`bg-gray-50 rounded-xl px-4 py-3 ${errors.district ? 'border border-red-400' : ''}`}>
                  <Input
                    className="w-full bg-transparent"
                    placeholder="如城阳区"
                    value={formData.district}
                    onInput={(e) => updateField('district', e.detail.value)}
                  />
                </View>
                {errors.district && <Text className="block text-xs text-red-500 mt-1">{errors.district}</Text>}
              </View>

              <View>
                <Label className="text-sm text-gray-600 mb-1 block">详细地址</Label>
                <View className={`bg-gray-50 rounded-xl px-4 py-3 ${errors.address ? 'border border-red-400' : ''}`}>
                  <Input
                    className="w-full bg-transparent"
                    placeholder="街道、门牌号等"
                    value={formData.address}
                    onInput={(e) => updateField('address', e.detail.value)}
                  />
                </View>
                {errors.address && <Text className="block text-xs text-red-500 mt-1">{errors.address}</Text>}
              </View>

              <View>
                <Label className="text-sm text-gray-600 mb-1 block">邮编（选填）</Label>
                <View className="bg-gray-50 rounded-xl px-4 py-3">
                  <Input
                    className="w-full bg-transparent"
                    placeholder="如266000"
                    type="number"
                    maxlength={6}
                    value={formData.postalCode}
                    onInput={(e) => updateField('postalCode', e.detail.value)}
                  />
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* 运费计算 */}
        {shippingInfo && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <View className="flex items-center gap-2 mb-2">
                <Truck size={18} color="#d97706" />
                <Text className="block text-sm font-medium text-amber-800">运费计算</Text>
              </View>
              <View className="space-y-1">
                <View className="flex justify-between text-sm">
                  <Text className="block text-gray-600">配送区域</Text>
                  <Text className="block text-gray-800">{shippingInfo.zone?.name}</Text>
                </View>
                <View className="flex justify-between text-sm">
                  <Text className="block text-gray-600">商品数量</Text>
                  <Text className="block text-gray-800">{bottleCount} 瓶</Text>
                </View>
                <View className="flex justify-between text-sm">
                  <Text className="block text-gray-600">订单金额</Text>
                  <Text className="block text-gray-800">¥{totalAmount.toFixed(2)}</Text>
                </View>
                <View className="flex justify-between text-sm">
                  <Text className="block text-gray-600">免运费门槛</Text>
                  <Text className="block text-gray-800">¥{shippingInfo.zone?.freeShippingThreshold}</Text>
                </View>
                <View className="border-t border-amber-200 mt-2 pt-2 flex justify-between">
                  <Text className="block font-medium text-amber-800">运费</Text>
                  {shippingInfo.isFreeShipping ? (
                    <Text className="block text-green-600 font-medium">免运费</Text>
                  ) : (
                    <Text className="block text-amber-700 font-medium">¥{shippingInfo.shippingFee}</Text>
                  )}
                </View>
                {shippingInfo.isFreeShipping && (
                  <Text className="block text-xs text-green-600 mt-1">
                    已满免运费门槛，实际支付0元运费
                  </Text>
                )}
              </View>
            </CardContent>
          </Card>
        )}

        {/* 提示 */}
        <View className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
          <MapPin size={16} color="#3b82f6" className="mt-1 flex-shrink-0" />
          <Text className="block text-xs text-blue-600">
            果酒类产品需年满18周岁方可购买，快递员配送时会验证身份
          </Text>
        </View>
      </View>

      {/* 底部确认按钮 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white" onClick={handleConfirm}>
          确认地址
        </Button>
      </View>
    </View>
  )
}
