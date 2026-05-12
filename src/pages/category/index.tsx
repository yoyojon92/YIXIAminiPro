import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Grid2x2, List } from 'lucide-react-taro'

const categories = [
  { id: 1, name: '全部', icon: '🏠' },
  { id: 2, name: '果酒', icon: '🍑' },
  { id: 3, name: '果汁', icon: '🫐' },
  { id: 4, name: '气泡酒', icon: '🍓' },
  { id: 5, name: '礼盒套装', icon: '🎁' },
  { id: 6, name: '限定款', icon: '✨' }
]

const products = [
  { id: 1, name: '蜜桃精灵果酒', price: 29.9, originalPrice: 49.9, image: 'https://picsum.photos/200/200?random=10', sales: 328, category: '果酒' },
  { id: 2, name: '蓝莓精灵果汁', price: 19.9, originalPrice: 35.9, image: 'https://picsum.photos/200/200?random=11', sales: 256, category: '果汁' },
  { id: 3, name: '草莓精灵气泡酒', price: 24.9, originalPrice: 39.9, image: 'https://picsum.photos/200/200?random=12', sales: 189, category: '气泡酒' },
  { id: 4, name: '柠檬精灵轻饮酒', price: 22.9, originalPrice: 38.9, image: 'https://picsum.photos/200/200?random=13', sales: 156, category: '果酒' },
  { id: 5, name: '葡萄精灵气泡水', price: 18.9, originalPrice: 28.9, image: 'https://picsum.photos/200/200?random=14', sales: 134, category: '果汁' },
  { id: 6, name: '苹果精灵果汁', price: 15.9, originalPrice: 25.9, image: 'https://picsum.photos/200/200?random=15', sales: 98, category: '果汁' },
  { id: 7, name: '限定礼盒套装', price: 99.9, originalPrice: 159.9, image: 'https://picsum.photos/200/200?random=16', sales: 67, category: '礼盒套装' },
  { id: 8, name: '芒果精灵果酒', price: 26.9, originalPrice: 42.9, image: 'https://picsum.photos/200/200?random=17', sales: 145, category: '果酒' }
]

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

  const filteredProducts = products.filter(product => {
    if (selectedCategory === 1) return true
    return product.category === categories.find(c => c.id === selectedCategory)?.name
  })

  const goToProduct = (id: number) => {
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
              onChange={(e: any) => setSearchValue(e.detail.value)}
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
                      销量 {product.sales}
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
                        <Text className="text-xs text-gray-500 mt-1">{product.category}</Text>
                      </View>
                      <View className="flex items-center justify-between">
                        <View className="flex items-baseline gap-1">
                          <Text className="text-primary font-bold text-lg">¥{product.price}</Text>
                          <Text className="text-xs text-gray-400 line-through">¥{product.originalPrice}</Text>
                        </View>
                        <Text className="text-xs text-gray-400">销量 {product.sales}</Text>
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
