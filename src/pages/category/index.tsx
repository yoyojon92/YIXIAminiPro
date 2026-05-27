import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Bell, ShoppingCart } from 'lucide-react-taro'
import { useCartStore } from '@/store/cartStore'
import { usePushStore } from '@/store/pushStore'
import { MOCK_PRODUCTS as products } from '@/mock/products'
import type { Product, UnifiedCategoryId } from '@/mock/products'

// 使用统一分类体系
const categories = [
  { id: 1, name: '全部', icon: '🏠', key: '' as UnifiedCategoryId | '' },
  { id: 2, name: '果酒系列', icon: '🍷', key: 'fruit_wine' as UnifiedCategoryId },
  { id: 3, name: '露酒系列', icon: '🥃', key: 'grain_wine' as UnifiedCategoryId },
  { id: 4, name: '原果汁', icon: '🧃', key: 'nfc_juice' as UnifiedCategoryId },
  { id: 5, name: '礼盒套装', icon: '🎁', key: 'gift_box' as UnifiedCategoryId }
]

// 分类名称映射
const categoryMap: Record<string, string> = {
  'fruit_wine': '果酒',
  'grain_wine': '露酒',
  'nfc_juice': '原果汁',
  'gift_box': '礼盒'
}

const getCategoryName = (category: string): string => {
  return categoryMap[category] || category
}

// 从 products.ts 导入真实产品数据
const sortOptions = [
  { id: 'default', name: '综合' },
  { id: 'sales', name: '销量' },
  { id: 'price_asc', name: '价格↑' },
  { id: 'price_desc', name: '价格↓' }
]

export default function Category() {
  const [selectedCategory, setSelectedCategory] = useState(1)
  const [selectedSort, setSelectedSort] = useState('default')
  const [searchValue, setSearchValue] = useState('')
  
  // 响应式读取 store 状态
  const cartCount = useCartStore(state => state.items.reduce((sum, item) => sum + item.quantity, 0))
  const unreadCount = usePushStore(state => state.unreadCount)

  // 从 StorageSync 读取首页传来的分类参数（switchTab 不能传 URL 参数）
  useDidShow(() => {
    const categoryFromStorage = Taro.getStorageSync('selectedCategory')
    const extraType = Taro.getStorageSync('categoryExtraType')

    if (extraType === 'group' || extraType === 'new') {
      // 拼团/新品特殊类型，暂时不切换分类，后续可扩展
      Taro.removeStorageSync('categoryExtraType')
      return
    }

    if (categoryFromStorage) {
      // 根据 category key 找到对应的分类 id
      const targetCat = categories.find(c => c.key === categoryFromStorage)
      if (targetCat) {
        setSelectedCategory(targetCat.id)
      }
      // 读取后清空，避免下次进入还残留
      Taro.removeStorageSync('selectedCategory')
    }
  })

  const filteredProducts = products.filter((product: Product) => {
    const cat = categories.find(c => c.id === selectedCategory)
    if (!cat || !cat.key) return true
    return product.category === cat.key
  })

  const goToProduct = (id: string) => {
    Taro.navigateTo({ url: `/pages/product/index?id=${id}` })
  }

  const goToCart = () => {
    Taro.switchTab({ url: '/pages/cart/index' })
  }

  const goToNotifications = () => {
    Taro.navigateTo({ url: '/pages/notifications/index' })
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      {/* 搜索栏 */}
      <View className="bg-white px-4 py-3 sticky top-0 z-50">
        <View className="flex items-center gap-3">
          <View className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
            <Search size={16} className="text-gray-400 mr-2" color="#9ca3af" />
            <Input 
              className="flex-1 bg-transparent border-0 p-0 text-sm"
              placeholder="搜索果酒、果汁..."
              value={searchValue}
              onInput={(e: any) => setSearchValue(e.detail.value)}
            />
          </View>
          <View className="flex items-center gap-1">
            {/* 通知铃铛 */}
            <View className="relative" onClick={goToNotifications}>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 z-10 w-5 h-5 flex items-center justify-center text-xs p-0 bg-red-500">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
              <View className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
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
              <View className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart size={20} color="#6D28D9" />
              </View>
            </View>
          </View>
        </View>

        {/* 分类标签 */}
        <ScrollView className="mt-3" scrollX showScrollbar={false}>
          <View className="flex gap-2">
            {categories.map((cat) => (
              <View 
                key={cat.id}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === cat.id 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <Text>{cat.icon} {cat.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* 排序选项 */}
        <View className="flex items-center justify-between mt-3">
          {sortOptions.map((sort) => (
            <View 
              key={sort.id}
              className={`text-sm px-2 py-1 ${
                selectedSort === sort.id ? 'text-primary font-medium' : 'text-gray-500'
              }`}
              onClick={() => setSelectedSort(sort.id)}
            >
              <Text>{sort.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 商品列表 */}
      <View className="px-4 py-4">
        <View className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <View key={product.id} onClick={() => goToProduct(product.id)}>
              <Card className="overflow-hidden">
                <View className="relative">
                  <Image src={product.image} mode="widthFix" className="w-full h-40" />
                  <Badge variant="destructive" className="absolute top-2 left-2">
                    {getCategoryName(product.category)}
                  </Badge>
                </View>
                <CardContent className="p-3">
                  <Text className="text-sm text-gray-900 font-medium line-clamp-2">{product.name}</Text>
                  <View className="flex items-baseline gap-1 mt-2">
                    <Text className="text-primary font-bold text-lg">¥{product.price}</Text>
                    <Text className="text-xs text-gray-400 line-through">¥{product.originalPrice}</Text>
                  </View>
                </CardContent>
              </Card>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}
