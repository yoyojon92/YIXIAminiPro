import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Grid2x2, List } from 'lucide-react-taro'
import { MOCK_PRODUCTS as products } from '@/mock/products'
import type { Product } from '@/mock/products'

const categories = [
  { id: 1, name: '全部', icon: '🏠', key: '' },
  { id: 2, name: '果酒', icon: '🍑', key: 'fruit_wine' },
  { id: 3, name: '果汁', icon: '🫐', key: 'nfc_juice' },
  { id: 4, name: '白酒', icon: '🥃', key: 'grain_wine' },
  { id: 5, name: '礼盒套装', icon: '🎁', key: 'gift' }
]

// 分类名称映射
const categoryMap: Record<string, string> = {
  'fruit_wine': '果酒',
  'grain_wine': '白酒',
  'nfc_juice': '果汁',
  'gift': '礼盒'
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchValue, setSearchValue] = useState('')

  const filteredProducts = products.filter((product: Product) => {
    const cat = categories.find(c => c.id === selectedCategory)
    if (!cat || !cat.key) return true
    return product.category === cat.key
  })

  const goToProduct = (id: string) => {
    Taro.navigateTo({ url: `/pages/product/index?id=${id}` })
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
          <View className="flex items-center gap-2">
            <View 
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid2x2 size={18} color={viewMode === 'grid' ? '#ffffff' : '#4b5563'} />
            </View>
            <View 
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={18} color={viewMode === 'list' ? '#ffffff' : '#4b5563'} />
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
        {viewMode === 'grid' ? (
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
        ) : (
          <View className="flex flex-col gap-3">
            {filteredProducts.map((product) => (
              <View key={product.id} onClick={() => goToProduct(product.id)}>
                <Card>
                  <CardContent className="p-3 flex gap-3">
                    <Image src={product.image} mode="widthFix" className="w-28 h-28 rounded-lg" />
                    <View className="flex-1 flex flex-col justify-between py-1">
                      <View>
                        <Text className="text-sm text-gray-900 font-medium line-clamp-2">{product.name}</Text>
                        <Text className="text-xs text-gray-500 mt-1">{getCategoryName(product.category)}</Text>
                      </View>
                      <View className="flex items-center justify-between">
                        <View className="flex items-baseline gap-1">
                          <Text className="text-primary font-bold text-lg">¥{product.price}</Text>
                          <Text className="text-xs text-gray-400 line-through">¥{product.originalPrice}</Text>
                        </View>
                      </View>
                    </View>
                  </CardContent>
                </Card>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}
