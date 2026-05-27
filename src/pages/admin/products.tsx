import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import {
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Star,
  StarOff,
  Pencil
} from 'lucide-react-taro'
import { useAdminStore, ProductStatus } from '@/store/adminStore'

export default function ProductManage() {
  const { products, toggleProductStatus, toggleProductRecommend } = useAdminStore()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.includes(searchText)
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })
  
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
    <View className="min-h-screen bg-gray-50">
      {/* 顶部搜索栏 */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search size={18} color="#9ca3af" />
          <View className="flex-1 ml-2">
            <input
              type="text"
              placeholder="搜索产品名称"
              value={searchText}
              onInput={(e) => setSearchText((e as any).detail.value)}
              className="bg-transparent w-full text-sm"
            />
          </View>
        </View>
      </View>
      
      {/* 筛选栏 */}
      <View className="flex bg-white border-b border-gray-200 px-4 py-2">
        {(['all', 'on_sale', 'off_sale', 'pre_sale'] as const).map((status) => (
          <View
            key={status}
            className={`px-3 py-1 rounded-full mr-2 ${statusFilter === status ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setStatusFilter(status)}
          >
            <Text className="text-sm">{status === 'all' ? '全部' : status === 'on_sale' ? '在售' : status === 'off_sale' ? '下架' : '预售'}</Text>
          </View>
        ))}
      </View>
      
      {/* 产品列表 */}
      <View className="p-4">
        {filteredProducts.map((product) => (
          <View key={product.id} className="bg-white rounded-xl mb-3 overflow-hidden">
            {/* 基本信息 */}
            <View
              className="p-3 flex items-center justify-between"
              onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
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
                {expandedId === product.id ? <ChevronUp size={20} color="#9ca3af" /> : <ChevronDown size={20} color="#9ca3af" />}
              </View>
            </View>
            
            {/* 展开操作区 */}
            {expandedId === product.id && (
              <View className="border-t border-gray-100 p-3 bg-gray-50">
                {/* 库存预警 */}
                {product.stock < 50 && product.status === 'on_sale' && (
                  <View className="bg-orange-50 rounded-lg p-2 mb-3 flex items-center">
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
                    <Text className="text-gray-400 text-xs block">更新时间</Text>
                    <Text className="text-gray-500 text-xs">{product.lastStockUpdate.split(' ')[0]}</Text>
                  </View>
                </View>
                
                {/* 操作按钮 */}
                <View className="flex flex-wrap gap-2">
                  {/* 上下架 */}
                  <View
                    className={`flex-1 py-2 rounded-lg text-center ${product.status === 'on_sale' ? 'bg-gray-200' : 'bg-green-500'}`}
                    onClick={() => toggleProductStatus(product.id)}
                  >
                    <Text className={product.status === 'on_sale' ? 'text-gray-600' : 'text-white'}>
                      {product.status === 'on_sale' ? '下架' : '上架'}
                    </Text>
                  </View>
                  
                  {/* 库存修改 */}
                  <View
                    className="flex-1 py-2 rounded-lg bg-blue-500 text-center"
                    onClick={() => {
                      Taro.showToast({ title: '请在后台修改库存', icon: 'none' })
                    }}
                  >
                    <Text className="text-white">修改库存</Text>
                  </View>
                  
                  {/* 新品推荐 */}
                  <View
                    className={`flex-1 py-2 rounded-lg text-center flex items-center justify-center ${product.isRecommended ? 'bg-yellow-500' : 'bg-gray-200'}`}
                    onClick={() => toggleProductRecommend(product.id)}
                  >
                    {product.isRecommended ? <Star size={16} color="#fff" /> : <StarOff size={16} color="#6b7280" />}
                    <Text className={product.isRecommended ? 'text-white ml-1' : 'text-gray-600 ml-1'}>
                      {product.isRecommended ? '已推荐' : '推荐'}
                    </Text>
                  </View>
                  
                  {/* 编辑 */}
                  <View
                    className="py-2 px-4 rounded-lg bg-violet-500 text-center"
                    onClick={() => {
                      Taro.showToast({ title: '编辑功能开发中', icon: 'none' })
                    }}
                  >
                    <Pencil size={16} color="#fff" />
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
        
        {filteredProducts.length === 0 && (
          <View className="text-center py-8">
            <Text className="text-gray-400">暂无产品数据</Text>
          </View>
        )}
      </View>
      
      {/* 新增产品按钮 */}
      <View
        className="fixed right-4 bottom-20 w-14 h-14 bg-violet-600 rounded-full flex items-center justify-center shadow-lg"
        onClick={() => setShowAddModal(true)}
      >
        <Plus size={24} color="#fff" />
      </View>
      
      {/* 新增产品弹窗 */}
      {showAddModal && (
        <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <View className="bg-white rounded-xl w-80 p-4" onClick={(e) => e.stopPropagation()}>
            <Text className="text-lg font-medium mb-4 block">新增产品</Text>
            <View className="space-y-3">
              <View>
                <Text className="text-gray-500 text-sm block mb-1">产品名称</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <input type="text" placeholder="请输入产品名称" className="bg-transparent w-full" />
                </View>
              </View>
              <View>
                <Text className="text-gray-500 text-sm block mb-1">分类</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <Text className="text-gray-400">请选择分类</Text>
                </View>
              </View>
              <View>
                <Text className="text-gray-500 text-sm block mb-1">价格</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <input type="number" placeholder="请输入价格" className="bg-transparent w-full" />
                </View>
              </View>
            </View>
            <View className="flex mt-4 gap-3">
              <View className="flex-1 py-2 rounded-lg bg-gray-200 text-center" onClick={() => setShowAddModal(false)}>
                <Text className="text-gray-600">取消</Text>
              </View>
              <View className="flex-1 py-2 rounded-lg bg-violet-600 text-center" onClick={() => {
                setShowAddModal(false)
                Taro.showToast({ title: '产品已添加', icon: 'success' })
              }}
              >
                <Text className="text-white">确认</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
