import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import {
  Pencil,
  Power
} from 'lucide-react-taro'
import { useAdminStore, IPCharacter } from '@/store/adminStore'

export default function IPManage() {
  const { ipCharacters, toggleIPActive } = useAdminStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const handleEdit = (ip: IPCharacter) => {
    setEditingId(ip.id)
  }
  
  const handleSave = () => {
    setEditingId(null)
    Taro.showToast({ title: '已保存', icon: 'success' })
  }
  
  return (
    <View className="min-h-screen bg-gray-50 p-4">
      <Text className="text-gray-500 text-sm mb-3 block">官方IP角色管理 - 器官大人形象</Text>
      
      {/* IP角色列表 */}
      <View className="space-y-3">
        {ipCharacters.map((ip) => (
          <View key={ip.id} className="bg-white rounded-xl overflow-hidden">
            {/* 头部 */}
            <View className="p-3 flex items-center justify-between" style={{ backgroundColor: ip.color + '20' }}>
              <View className="flex items-center">
                <Text className="text-3xl mr-3">{ip.emoji}</Text>
                <View>
                  <Text className="text-gray-800 font-medium text-lg block">{ip.name}</Text>
                  <Text className="text-gray-500 text-xs">{ip.emotion}</Text>
                </View>
              </View>
              <View className="flex items-center">
                <View
                  className={`px-2 py-1 rounded text-xs ${ip.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}
                >
                  {ip.isActive ? '启用中' : '已停用'}
                </View>
              </View>
            </View>
            
            {/* 内容 */}
            <View className="p-3">
              <View className="grid grid-cols-2 gap-2 mb-3">
                <View className="bg-gray-50 rounded-lg p-2">
                  <Text className="text-gray-400 text-xs block">关联酒款</Text>
                  <Text className="text-gray-700">{ip.wine}</Text>
                </View>
                <View className="bg-gray-50 rounded-lg p-2">
                  <Text className="text-gray-400 text-xs block">器官角色</Text>
                  <Text className="text-gray-700">{ip.organRole}</Text>
                </View>
              </View>
              
              <View className="bg-gray-50 rounded-lg p-2 mb-3">
                <Text className="text-gray-400 text-xs block">口头禅</Text>
                <Text className="text-gray-700 italic">&ldquo;{ip.catchphrase}&rdquo;</Text>
              </View>
              
              <View className="bg-gray-50 rounded-lg p-2 mb-3">
                <Text className="text-gray-400 text-xs block">角色描述</Text>
                <Text className="text-gray-600 text-sm">{ip.description}</Text>
              </View>
              
              <Text className="text-gray-400 text-xs block mb-3">最后更新: {ip.lastUpdated}</Text>
            </View>
            
            {/* 操作按钮 */}
            <View className="border-t border-gray-100 p-3 bg-gray-50 flex gap-2">
              <View
                className="flex-1 py-2 rounded-lg bg-violet-500 text-center flex items-center justify-center"
                onClick={() => handleEdit(ip)}
              >
                <Pencil size={16} color="#fff" />
                <Text className="text-white ml-1">编辑</Text>
              </View>
              <View
                className={`flex-1 py-2 rounded-lg text-center flex items-center justify-center ${ip.isActive ? 'bg-red-500' : 'bg-green-500'}`}
                onClick={() => {
                  toggleIPActive(ip.id)
                  Taro.showToast({ title: ip.isActive ? '已停用' : '已启用', icon: 'success' })
                }}
              >
                <Power size={16} color="#fff" />
                <Text className="text-white ml-1">{ip.isActive ? '停用' : '启用'}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      
      {/* 编辑弹窗 */}
      {editingId && (
        <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setEditingId(null)}>
          <View className="bg-white rounded-xl w-80 p-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Text className="text-lg font-medium mb-4 block">编辑IP角色</Text>
            {(() => {
              const ip = ipCharacters.find(i => i.id === editingId)
              if (!ip) return null
              return (
                <View className="space-y-3">
                  <View>
                    <Text className="text-gray-500 text-sm block mb-1">角色名称</Text>
                    <View className="bg-gray-50 rounded-lg px-3 py-2">
                      <input type="text" value={ip.name} className="bg-transparent w-full" />
                    </View>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-sm block mb-1">情绪标签</Text>
                    <View className="bg-gray-50 rounded-lg px-3 py-2">
                      <input type="text" value={ip.emotion} className="bg-transparent w-full" />
                    </View>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-sm block mb-1">口头禅</Text>
                    <View className="bg-gray-50 rounded-lg px-3 py-2">
                      <input type="text" value={ip.catchphrase} className="bg-transparent w-full" />
                    </View>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-sm block mb-1">角色描述</Text>
                    <View className="bg-gray-50 rounded-lg px-3 py-2">
                      <textarea value={ip.description} className="bg-transparent w-full" rows={3} />
                    </View>
                  </View>
                </View>
              )
            })()}
            <View className="flex mt-4 gap-3">
              <View className="flex-1 py-2 rounded-lg bg-gray-200 text-center" onClick={() => setEditingId(null)}>
                <Text className="text-gray-600">取消</Text>
              </View>
              <View className="flex-1 py-2 rounded-lg bg-violet-600 text-center" onClick={() => handleSave()}>
                <Text className="text-white">保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
