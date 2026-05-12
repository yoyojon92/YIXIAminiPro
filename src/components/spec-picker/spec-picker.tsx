import { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { X, Minus, Plus } from 'lucide-react-taro'
import { useCartStore } from '@/store/cartStore'
import './spec-picker.scss'

// 简化的产品规格接口
interface ProductSpec {
  id: string
  name: string
  price: number
}

interface ProductInfo {
  id: number
  name: string
  image: string
  category?: string
  specs?: ProductSpec[]
  price: number
}

interface SpecPickerProps {
  product: ProductInfo
  visible: boolean
  onClose: () => void
}

export function SpecPicker({ product, visible, onClose }: SpecPickerProps) {
  const addItem = useCartStore(state => state.addItem)
  const [selectedSpec, setSelectedSpec] = useState<ProductSpec | null>(null)
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [quantity, setQuantity] = useState(1)
  const [showFlavorPicker, setShowFlavorPicker] = useState(false)

  // 初始化默认选中第一个规格
  useEffect(() => {
    if (!selectedSpec && product.specs && product.specs.length > 0) {
      setSelectedSpec(product.specs[0])
    }
  }, [selectedSpec, product.specs])

  // 计算最大可选口味数
  const maxFlavors = selectedSpec?.name.includes('两瓶') ? 2 
    : selectedSpec?.name.includes('四瓶') ? 4 
    : 0

  // 口味选项（仅果酒显示）
  const flavorOptions = product.category === '果酒' ? [
    { id: '桃你欢心', emoji: '🍑', name: '桃你欢心' },
    { id: '楂香四溢', emoji: '🍒', name: '楂香四溢' },
    { id: '大吉大梨', emoji: '🍐', name: '大吉大梨' },
    { id: '似水榴年', emoji: '🍎', name: '似水榴年' },
    { id: '葡写浪漫', emoji: '🍇', name: '葡写浪漫' },
  ] : []

  const handleSpecSelect = (spec: ProductSpec) => {
    setSelectedSpec(spec)
    setSelectedFlavors([])
    setShowFlavorPicker(
      product.category === '果酒' && 
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

  const handleAddToCart = () => {
    if (!selectedSpec) return
    
    // 口味验证（如果有）
    if (showFlavorPicker && selectedFlavors.length < maxFlavors) {
      Taro.showToast({ title: `请选择${maxFlavors}种口味`, icon: 'none' })
      return
    }

    addItem({
      productId: product.id,
      name: product.name,
      spec: selectedSpec.name,
      flavors: selectedFlavors,
      quantity,
      price: selectedSpec.price,
      originalPrice: selectedSpec.price * 1.2,
      image: product.image,
      maxQuantity: 99,
    })

    Taro.showToast({ title: '已加入购物车', icon: 'success' })
    onClose()
    setSelectedSpec(product.specs && product.specs[0] || null)
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
            src={product.image} 
            mode="aspectFill"
          />
          <View className="spec-picker-info">
            <Text className="spec-picker-name">{product.name}</Text>
            <Text className="spec-picker-price">
              ¥{selectedSpec?.price || product.price}
            </Text>
          </View>
          <View className="spec-picker-close" onClick={onClose}>
            <X size={20} color="#666" />
          </View>
        </View>

        {/* 规格选择 */}
        <View className="spec-picker-section">
          <Text className="spec-picker-label">选择规格</Text>
          <View className="spec-picker-options">
            {product.specs?.map(spec => (
              <View 
                key={spec.id}
                className={`spec-option ${selectedSpec?.id === spec.id ? 'active' : ''}`}
                onClick={() => handleSpecSelect(spec)}
              >
                <Text>{spec.name}</Text>
                <Text className="spec-price">¥{spec.price}</Text>
              </View>
            ))}
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
            <Text className="price-value">
              ¥{((selectedSpec?.price || product.price) * quantity).toFixed(1)}
            </Text>
          </View>
          <View className="add-cart-btn" onClick={handleAddToCart}>
            <Text>加入购物车</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
