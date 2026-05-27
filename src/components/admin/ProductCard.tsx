import { View, Text } from '@tarojs/components'
import {
  ChevronDown,
  ChevronUp,
  Star,
  StarOff,
  Pencil
} from 'lucide-react-taro'
import { AdminProduct, ProductStatus } from '@/store/adminStore'

interface ProductCardProps {
  product: AdminProduct
  isExpanded: boolean
  onToggleExpand: () => void
  onToggleStatus: () => void
  onToggleRecommend: () => void
  onEdit: () => void
}

export default function ProductCard({
  product,
  isExpanded,
  onToggleExpand,
  onToggleStatus,
  onToggleRecommend,
  onEdit
}: ProductCardProps) {
  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case 'on_sale':
        return { text: '在售', className: 'bg-green-100 text-green-600' }
      case 'off_sale':
        return { text: '下架', className: 'bg-gray-100 text-gray-500' }
      case 'pre_sale':
        return { text: '预售', className: 'bg-blue-100 text-blue-600' }
    }
  }
  
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'fruit_wine': return '果酒'
      case 'nfc_juice': return '原果汁'
      case 'gift_box': return '礼盒'
      default: return category
    }
  }
  
  return (
    <View className="bg-white rounded-xl mb-3 overflow-hidden">
      {/* 基本信息 */}
      <View
        className="p-3 flex items-center justify-between"
        onClick={onToggleExpand}
      >
        <View className="flex items-center flex-1">
          <Text className="text-2xl mr-3">{product.icon}</Text>
          <View className="flex-1">
            <View className="flex items-center">
              <Text className="text-gray-800 font-medium">{product.name}</Text>
              <Text className={`ml-2 px-2 py-1 rounded text-xs ${getStatusBadge(product.status).className}`}>
                {getStatusBadge(product.status).text}
              </Text>
            </View>
            <Text className="text-gray-400 text-xs">{getCategoryName(product.category)} · {product.spec}</Text>
          </View>
        </View>
        <View className="flex items-center">
          <View className="text-right mr-3">
            <Text className="text-violet-600 font-medium">¥{product.price}</Text>
            <Text className="text-gray-400 text-xs block">库存: {product.stock}</Text>
          </View>
          {isExpanded ? <ChevronUp size={20} color="#9ca3af" /> : <ChevronDown size={20} color="#9ca3af" />}
        </View>
      </View>
      
      {/* 展开操作区 */}
      {isExpanded && (
        <View className="border-t border-gray-100 p-3 bg-gray-50">
          {/* 库存预警 */}
          {product.stock < 50 && product.status === 'on_sale' && (
            <View className="bg-orange-50 rounded-lg p-2 mb-3">
              <Text className="text-orange-600 text-sm">⚠️ 库存不足50件，建议及时补货</Text>
            </View>
          )}
          
          {/* 统计信息 */}
          <View className="grid grid-cols-3 gap-2 mb-3">
            <View className="bg-white rounded-lg p-2 text-center">
              <Text className="text-gray-400 text-xs block">月销量</Text>
              <Text className="text-gray-700 font-medium">{product.sales}件</Text>
            </View>
            <View className="bg-white rounded-lg p-2 text-center">
              <Text className="text-gray-400 text-xs block">原价</Text>
              <Text className="text-gray-500 line-through">¥{product.originalPrice}</Text>
            </View>
            <View className="bg-white rounded-lg p-2 text-center">
              <Text className="text-gray-400 text-xs block">推荐</Text>
              <Text className={product.isRecommended ? 'text-yellow-500' : 'text-gray-400'}>
                {product.isRecommended ? `#${product.recommendOrder}` : '否'}
              </Text>
            </View>
          </View>
          
          {/* 操作按钮 */}
          <View className="flex flex-wrap gap-2">
            <View
              className={`flex-1 py-2 rounded-lg text-center ${product.status === 'on_sale' ? 'bg-gray-200' : 'bg-green-500'}`}
              onClick={onToggleStatus}
            >
              <Text className={product.status === 'on_sale' ? 'text-gray-600' : 'text-white'}>
                {product.status === 'on_sale' ? '下架' : '上架'}
              </Text>
            </View>
            
            <View
              className={`flex-1 py-2 rounded-lg text-center flex items-center justify-center ${product.isRecommended ? 'bg-yellow-500' : 'bg-gray-200'}`}
              onClick={onToggleRecommend}
            >
              {product.isRecommended ? <Star size={16} color="#fff" /> : <StarOff size={16} color="#6b7280" />}
              <Text className={product.isRecommended ? 'text-white ml-1' : 'text-gray-600 ml-1'}>
                {product.isRecommended ? '已推荐' : '推荐'}
              </Text>
            </View>
            
            <View
              className="py-2 px-4 rounded-lg bg-violet-500 text-center"
              onClick={onEdit}
            >
              <Pencil size={16} color="#fff" />
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
