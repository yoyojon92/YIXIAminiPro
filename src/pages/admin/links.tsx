import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import {
  Plus,
  Pencil,
  Power,
  Move,
  ExternalLink as ExternalLinkIcon
} from 'lucide-react-taro'
import { useAdminStore } from '@/store/adminStore'

export default function LinksManage() {
  const { externalLinks, toggleLinkActive, reorderLinks } = useAdminStore()
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'factory': return '厂家'
      case 'school': return '校方'
      case 'partner': return '合作伙伴'
      default: return category
    }
  }
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'factory': return 'bg-blue-100 text-blue-600'
      case 'school': return 'bg-green-100 text-green-600'
      case 'partner': return 'bg-purple-100 text-purple-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }
  
  const sortedLinks = [...externalLinks].sort((a, b) => a.sortOrder - b.sortOrder)
  
  const handleVisit = (url: string) => {
    Taro.setClipboardData({
      data: url,
      success: () => {
        Taro.showToast({ title: '链接已复制', icon: 'success' })
      }
    })
  }
  
  return (
    <View className="min-h-screen bg-gray-50">
      {/* 分类说明 */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex gap-2">
          <View className="flex items-center">
            <View className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
            <Text className="text-gray-500 text-xs">厂家入口</Text>
          </View>
          <View className="flex items-center">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-1" />
            <Text className="text-gray-500 text-xs">校方入口</Text>
          </View>
          <View className="flex items-center">
            <View className="w-2 h-2 rounded-full bg-purple-500 mr-1" />
            <Text className="text-gray-500 text-xs">合作伙伴</Text>
          </View>
        </View>
      </View>
      
      {/* 链接列表 */}
      <View className="p-4">
        {sortedLinks.map((link, index) => (
          <View key={link.id} className="bg-white rounded-xl mb-3 overflow-hidden">
            {/* 基本信息 */}
            <View className="p-3 flex items-center justify-between">
              <View className="flex items-center flex-1">
                <Text className="text-2xl mr-3">{link.icon}</Text>
                <View className="flex-1">
                  <View className="flex items-center">
                    <Text className="text-gray-800 font-medium">{link.title}</Text>
                    <Text className={`ml-2 px-2 py-1 rounded text-xs ${getCategoryColor(link.category)}`}>
                      {getCategoryName(link.category)}
                    </Text>
                    {!link.isActive && (
                      <Text className="ml-1 px-2 py-1 rounded text-xs bg-red-100 text-red-500">禁用</Text>
                    )}
                  </View>
                  <Text className="text-gray-400 text-xs truncate">{link.url}</Text>
                  <Text className="text-gray-400 text-xs">{link.description}</Text>
                </View>
              </View>
              <Text className="text-gray-300 text-xs">#{link.sortOrder}</Text>
            </View>
            
            {/* 操作按钮 */}
            <View className="border-t border-gray-100 p-3 bg-gray-50 flex gap-2">
              <View
                className="flex-1 py-2 rounded-lg bg-blue-500 text-center flex items-center justify-center"
                onClick={() => handleVisit(link.url)}
              >
                <ExternalLinkIcon size={16} color="#fff" />
                <Text className="text-white ml-1">访问</Text>
              </View>
              <View
                className="flex-1 py-2 rounded-lg bg-violet-500 text-center flex items-center justify-center"
                onClick={() => setEditingId(link.id)}
              >
                <Pencil size={16} color="#fff" />
                <Text className="text-white ml-1">编辑</Text>
              </View>
              <View
                className={`py-2 px-3 rounded-lg text-center flex items-center justify-center ${link.isActive ? 'bg-red-500' : 'bg-green-500'}`}
                onClick={() => {
                  toggleLinkActive(link.id)
                  Taro.showToast({ title: link.isActive ? '已禁用' : '已启用', icon: 'success' })
                }}
              >
                <Power size={16} color="#fff" />
              </View>
              <View
                className="py-2 px-3 rounded-lg bg-gray-300 text-center flex items-center justify-center"
                onClick={() => {
                  const newOrder = index === 0 ? sortedLinks.length : index
                  reorderLinks(link.id, newOrder)
                  Taro.showToast({ title: '顺序已调整', icon: 'success' })
                }}
              >
                <Move size={16} color="#fff" />
              </View>
            </View>
          </View>
        ))}
        
        {externalLinks.length === 0 && (
          <View className="text-center py-8">
            <Text className="text-gray-400">暂无链接数据</Text>
          </View>
        )}
      </View>
      
      {/* 新增链接按钮 */}
      <View
        className="fixed right-4 bottom-20 w-14 h-14 bg-violet-600 rounded-full flex items-center justify-center shadow-lg"
        onClick={() => setShowAddModal(true)}
      >
        <Plus size={24} color="#fff" />
      </View>
      
      {/* 新增链接弹窗 */}
      {showAddModal && (
        <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <View className="bg-white rounded-xl w-80 p-4" onClick={(e) => e.stopPropagation()}>
            <Text className="text-lg font-medium mb-4 block">新增外部链接</Text>
            <View className="space-y-3">
              <View>
                <Text className="text-gray-500 text-sm block mb-1">链接标题</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <input type="text" placeholder="如：邑夏酒厂官网" className="bg-transparent w-full" />
                </View>
              </View>
              <View>
                <Text className="text-gray-500 text-sm block mb-1">链接地址</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <input type="text" placeholder="https://..." className="bg-transparent w-full" />
                </View>
              </View>
              <View>
                <Text className="text-gray-500 text-sm block mb-1">分类</Text>
                <View className="flex gap-2">
                  {(['factory', 'school', 'partner'] as const).map((cat) => (
                    <View key={cat} className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-center">
                      <Text className="text-gray-600 text-sm">{getCategoryName(cat)}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View>
                <Text className="text-gray-500 text-sm block mb-1">描述</Text>
                <View className="bg-gray-50 rounded-lg px-3 py-2">
                  <input type="text" placeholder="链接描述" className="bg-transparent w-full" />
                </View>
              </View>
            </View>
            <View className="flex mt-4 gap-3">
              <View className="flex-1 py-2 rounded-lg bg-gray-200 text-center" onClick={() => setShowAddModal(false)}>
                <Text className="text-gray-600">取消</Text>
              </View>
              <View className="flex-1 py-2 rounded-lg bg-violet-600 text-center" onClick={() => {
                setShowAddModal(false)
                Taro.showToast({ title: '链接已添加', icon: 'success' })
              }}
              >
                <Text className="text-white">确认</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      
      {/* 编辑弹窗 */}
      {editingId && (
        <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setEditingId(null)}>
          <View className="bg-white rounded-xl w-80 p-4" onClick={(e) => e.stopPropagation()}>
            <Text className="text-lg font-medium mb-4 block">编辑链接</Text>
            {(() => {
              const link = externalLinks.find(l => l.id === editingId)
              if (!link) return null
              return (
                <View className="space-y-3">
                  <View>
                    <Text className="text-gray-500 text-sm block mb-1">链接标题</Text>
                    <View className="bg-gray-50 rounded-lg px-3 py-2">
                      <input type="text" value={link.title} className="bg-transparent w-full" />
                    </View>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-sm block mb-1">链接地址</Text>
                    <View className="bg-gray-50 rounded-lg px-3 py-2">
                      <input type="text" value={link.url} className="bg-transparent w-full" />
                    </View>
                  </View>
                </View>
              )
            })()}
            <View className="flex mt-4 gap-3">
              <View className="flex-1 py-2 rounded-lg bg-gray-200 text-center" onClick={() => setEditingId(null)}>
                <Text className="text-gray-600">取消</Text>
              </View>
              <View className="flex-1 py-2 rounded-lg bg-violet-600 text-center" onClick={() => {
                setEditingId(null)
                Taro.showToast({ title: '已保存', icon: 'success' })
              }}
              >
                <Text className="text-white">保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
