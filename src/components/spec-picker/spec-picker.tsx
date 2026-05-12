import { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { X, Minus, Plus } from 'lucide-react-taro'
import { useCartStore } from '@/store/cartStore'
import { useUserStore } from '@/store/userStore'
import { ageVerify } from '@/utils/ageVerify'
import type { Product } from '@/mock/products'
import './spec-picker.scss'

interface SpecPickerProps {
  product: Product | null
  visible: boolean
  onClose: () => void
}

export function SpecPicker({ product, visible, onClose }: SpecPickerProps) {
  const addItem = useCartStore(state => state.addItem)
  const isMember = useUserStore(state => state.isMember)
  const [selectedSpec, setSelectedSpec] = useState<Product['specs'][0] | null>(null)
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [showFlavorPicker, setShowFlavorPicker] = useState(false)

  // 计算会员价（原价 * 0.85）
  const getMemberPrice = (price: number) => {
    return Math.round(price * 0.85 * 100) / 100
  }

  // 当前选中规格的单价
  const currentPrice = selectedSpec?.price || product?.specs?.[0]?.price || 0
  const finalPrice = isMember ? getMemberPrice(currentPrice) : currentPrice
  const totalPrice = Math.round(finalPrice * quantity * 100) / 100

  // 初始化默认选中第一个规格
  useEffect(() => {
    if (!selectedSpec && product?.specs && product?.specs.length > 0) {
      setSelectedSpec(product?.specs[0])
    }
  }, [selectedSpec, product?.specs])

  // 计算最大可选口味数
  const maxFlavors = selectedSpec?.name.includes('两瓶') ? 2 
    : selectedSpec?.name.includes('四瓶') ? 4 
    : 0

  // 口味选项（仅果酒显示）
  const isFruitWine = product?.category === 'fruit_wine'
  const flavorOptions = isFruitWine ? [
    { id: '桃你欢心', emoji: '🍑', name: '桃你欢心' },
    { id: '楂香四溢', emoji: '🍒', name: '楂香四溢' },
    { id: '大吉大梨', emoji: '🍐', name: '大吉大梨' },
    { id: '似水榴年', emoji: '🍎', name: '似水榴年' },
    { id: '葡写浪漫', emoji: '🍇', name: '葡写浪漫' },
  ] : []

  const handleSpecSelect = (spec: Product['specs'][0]) => {
    setSelectedSpec(spec)
    setSelectedFlavors([])
    setShowFlavorPicker(
      isFruitWine && 
      (spec.name.includes('两瓶') || spec.name.includes('四瓶'))
    )
  }

  const handleFlavorToggle = (flavorId: string) => {
    if (selectedFlavors.includes(flavorId)) {
      setSelectedFlavors(prev => prev.filter(id => id !== flavorId))
    } else if (selectedFlavors.length < maxFlavors) {
      setSelectedFlavors(prev => [...prev, flavorId])
    }
  }

  const handleAddToCart = async () => {
    if (!selectedSpec) return
    
    // 口味验证（如果有）
    if (showFlavorPicker && selectedFlavors.length < maxFlavors) {
      Taro.showToast({ title: `请选择${maxFlavors}种口味`, icon: 'none' })
      return
    }

    // 酒精类商品需要年龄验证
    if (product?.isAlcohol) {
      const verified = await ageVerify()
      if (!verified) {
        Taro.showToast({ title: '需要年满18岁', icon: 'none' })
        return
      }
    }

    addItem({
      productId: product?.id || '',
      name: product?.name || '',
      spec: selectedSpec.name,
      flavors: selectedFlavors,
      quantity,
      price: selectedSpec.price,
      originalPrice: selectedSpec.price * 1.2,
      image: product?.image || '',
      maxQuantity: 99,
    })

    Taro.showToast({ title: '已加入购物车', icon: 'success' })
    onClose()
    setSelectedSpec(product?.specs?.[0] || null)
    setSelectedFlavors([])
    setQuantity(1)
  }

  if (!visible) return null

  return (
    <View className="spec-picker-overlay" onClick={onClose}>
      <View className="spec-picker-sheet" onClick={e => e.stopPropagation()}>
        {/* 头部：产品信息 */}
        <View className="spec-picker-header">
          <Image 
            className="spec-picker-image" 
            src={product?.image || ''} 
            mode="aspectFill"
          />
          <View className="spec-picker-info">
            <Text className="spec-picker-name">{product?.name || ''}</Text>
            {isMember ? (
              <View className="flex items-center gap-2">
                <Text className="spec-picker-price text-purple-500">¥{finalPrice}</Text>
                <Text className="text-gray-400 line-through text-sm">¥{currentPrice}</Text>
              </View>
            ) : (
              <Text className="spec-picker-price">
                ¥{currentPrice}
              </Text>
            )}
          </View>
          <View className="spec-picker-close" onClick={onClose}>
            <X size={20} color="#666" />
          </View>
        </View>

        {/* 规格选择 */}
        <View className="spec-picker-section">
          <Text className="spec-picker-label">选择规格</Text>
          <View className="spec-picker-options">
            {product?.specs?.map(spec => {
              const memberPrice = getMemberPrice(spec.price)
              return (
                <View 
                  key={spec.id}
                  className={`spec-option ${selectedSpec?.id === spec.id ? 'active' : ''}`}
                  onClick={() => handleSpecSelect(spec)}
                >
                  <Text>{spec.name}</Text>
                  <Text className="spec-price">¥{isMember ? memberPrice : spec.price}</Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* 口味选择（仅两瓶/四瓶显示） */}
        {showFlavorPicker && (
          <View className="spec-picker-section">
            <Text className="spec-picker-label">
              选择口味（可选{maxFlavors}种）
            </Text>
            <View className="spec-picker-options">
              {flavorOptions.map(flavor => (
                <View 
                  key={flavor.id}
                  className={`flavor-option ${selectedFlavors.includes(flavor.id) ? 'active' : ''}`}
                  onClick={() => handleFlavorToggle(flavor.id)}
                >
                  <Text className="flavor-emoji">{flavor.emoji}</Text>
                  <Text>{flavor.name}</Text>
                  {selectedFlavors.includes(flavor.id) && (
                    <Text className="flavor-check">✓</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 数量选择 */}
        <View className="spec-picker-section">
          <Text className="spec-picker-label">数量</Text>
          <View className="quantity-selector">
            <View 
              className={`qty-btn ${quantity <= 1 ? 'disabled' : ''}`}
              onClick={() => quantity > 1 && setQuantity(q => q - 1)}
            >
              <Minus size={16} color="#666" />
            </View>
            <Text className="qty-value">{quantity}</Text>
            <View 
              className="qty-btn"
              onClick={() => setQuantity(q => q + 1)}
            >
              <Plus size={16} color="#666" />
            </View>
          </View>
        </View>

        {/* 底部：总价+加购按钮 */}
        <View className="spec-picker-footer">
          <View className="total-price">
            <Text className="price-label">合计</Text>
            <Text className="price-value">¥{totalPrice}</Text>
          </View>
          <View className="add-cart-btn" onClick={handleAddToCart}>
            <Text>加入购物车</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
