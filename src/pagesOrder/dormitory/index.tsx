import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Input } from '@/components/ui/input'
import { DORMITORY_ZONES, type DormitoryZone } from '@/data/dormitoryZones'
import { useCartStore } from '@/store/cartStore'
import { MapPin, Building, Hash, ChevronRight, Check, Clock } from 'lucide-react-taro'
import "./index.config"

export default function DormitoryPage() {
  const cartStore = useCartStore()
  
  // 步骤状态
  const [step, setStep] = useState(1)
  
  // 选择数据
  const [selectedZone, setSelectedZone] = useState<DormitoryZone | null>(
    cartStore.delivery.dormitoryAddress?.zoneId 
      ? DORMITORY_ZONES.find(z => z.id === cartStore.delivery.dormitoryAddress?.zoneId) || null
      : null
  )
  const [selectedBuilding, setSelectedBuilding] = useState(
    cartStore.delivery.dormitoryAddress?.building || ''
  )
  const [roomNumber, setRoomNumber] = useState(
    cartStore.delivery.dormitoryAddress?.roomNumber || ''
  )

  // 选择生活区
  const handleSelectZone = (zone: DormitoryZone) => {
    setSelectedZone(zone)
    setSelectedBuilding('')
    setRoomNumber('')
    setStep(2)
  }

  // 选择楼栋
  const handleSelectBuilding = (building: string) => {
    setSelectedBuilding(building)
    setRoomNumber('')
    setStep(3)
  }

  // 确认地址
  const handleConfirm = () => {
    if (!selectedZone || !selectedBuilding || !roomNumber.trim()) {
      Taro.showToast({ title: "请完善地址信息", icon: "none" })
      return
    }

    // 保存到购物车
    cartStore.setDormitoryAddress({
      zoneId: selectedZone.id,
      zoneName: selectedZone.name,
      building: selectedBuilding,
      roomNumber: roomNumber.trim()
    })

    // 埋点
    console.log("[埋点] 选择宿舍配送地址", {
      userId: "user_001",
      zoneId: selectedZone.id,
      building: selectedBuilding,
      roomNumber: roomNumber.trim(),
      action: "delivery_select",
      timestamp: Date.now()
    })

    Taro.showToast({ title: "地址已保存", icon: "success" })
    setTimeout(() => {
      Taro.navigateBack()
    }, 1000)
  }

  // 返回上一步
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      Taro.navigateBack()
    }
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-24">
      {/* 顶部标题 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100 flex items-center">
        <View onClick={handleBack} className="mr-3">
          <Text className="text-primary text-lg">‹</Text>
        </View>
        <Text className="text-lg font-semibold text-gray-900">选择宿舍地址</Text>
      </View>

      {/* 步骤指示器 */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex items-center justify-between">
          <View className="flex items-center gap-2">
            <View className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 1 ? <Check size={12} color="white" /> : '1'}
            </View>
            <Text className={`text-sm ${step >= 1 ? 'text-primary font-medium' : 'text-gray-400'}`}>选择生活区</Text>
          </View>
          <View className="flex-1 h-px bg-gray-200 mx-3" />
          <View className="flex items-center gap-2">
            <View className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step > 2 ? <Check size={12} color="white" /> : '2'}
            </View>
            <Text className={`text-sm ${step >= 2 ? 'text-primary font-medium' : 'text-gray-400'}`}>选择楼栋</Text>
          </View>
          <View className="flex-1 h-px bg-gray-200 mx-3" />
          <View className="flex items-center gap-2">
            <View className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </View>
            <Text className={`text-sm ${step >= 3 ? 'text-primary font-medium' : 'text-gray-400'}`}>填写房间号</Text>
          </View>
        </View>
      </View>

      {/* 步骤1：选择生活区 */}
      {step === 1 && (
        <View className="p-4 space-y-3">
          <Text className="text-sm font-medium text-gray-500 mb-2">请选择您所在的生活区</Text>
          {DORMITORY_ZONES.map((zone) => (
            <View
              key={zone.id}
              onClick={() => handleSelectZone(zone)}
              className="bg-white rounded-xl p-4 flex items-center justify-between"
            >
              <View className="flex items-center gap-3">
                <View className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                  <Building size={24} color="#8B5CF6" />
                </View>
                <View>
                  <Text className="text-base font-medium text-gray-900">{zone.name}</Text>
                  <Text className="text-xs text-gray-500 mt-1">{zone.buildings.length}栋宿舍楼</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </View>
          ))}
        </View>
      )}

      {/* 步骤2：选择楼栋 */}
      {step === 2 && selectedZone && (
        <View className="p-4 space-y-3">
          <View className="flex items-center justify-between mb-2">
            <Text className="text-sm font-medium text-gray-500">请选择楼栋</Text>
            <View className="flex items-center gap-1 text-xs text-primary">
              <MapPin size={12} color="#8B5CF6" />
              <Text>{selectedZone.name}</Text>
            </View>
          </View>
          <View className="grid grid-cols-3 gap-2">
            {selectedZone.buildings.map((building) => (
              <View
                key={building}
                onClick={() => handleSelectBuilding(building)}
                className={`py-3 rounded-lg text-center text-sm ${
                  selectedBuilding === building
                    ? 'bg-primary text-white font-medium'
                    : 'bg-white text-gray-700 border border-gray-100'
                }`}
              >
                <Text>{building}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 步骤3：填写房间号 */}
      {step === 3 && selectedZone && (
        <View className="p-4 space-y-4">
          <View className="bg-white rounded-xl p-4">
            <Text className="text-sm font-medium text-gray-500 mb-2">已选地址</Text>
            <View className="flex items-center gap-2 text-gray-700">
              <MapPin size={16} color="#8B5CF6" />
              <Text>{selectedZone.name}</Text>
              <Text>·</Text>
              <Text>{selectedBuilding}</Text>
            </View>
          </View>

          <View className="bg-white rounded-xl p-4">
            <Text className="text-sm font-medium text-gray-500 mb-3">请填写房间号</Text>
            <View className="flex items-center gap-3">
              <Hash size={20} color="#9CA3AF" />
              <Input
                className="flex-1 text-base"
                placeholder="如 302"
                value={roomNumber}
                onInput={(e) => setRoomNumber(e.detail.value)}
                maxlength={6}
              />
            </View>
          </View>

          <View className="bg-purple-50 rounded-xl p-4 flex items-center justify-between">
            <View className="flex items-center gap-2">
              <Clock size={16} color="#8B5CF6" />
              <Text className="text-sm text-gray-700">预计送达时间</Text>
            </View>
            <Text className="text-primary font-medium">{selectedZone.estimatedMinutes}分钟内</Text>
          </View>
        </View>
      )}

      {/* 底部配送信息 */}
      <View className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3">
        <View className="flex items-center justify-between mb-2">
          <View className="flex items-center gap-2">
            <Text className="text-sm text-gray-500">配送费</Text>
            <Text className="text-lg font-bold text-primary">¥1</Text>
          </View>
          <View className="text-xs text-gray-400">
            预计<Text className="text-primary">{selectedZone?.estimatedMinutes || '--'}分钟</Text>送达
          </View>
        </View>
        <View 
          onClick={handleConfirm}
          className={`py-3 rounded-xl text-center font-semibold ${
            step === 3 && selectedZone && selectedBuilding && roomNumber.trim()
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          <Text>确认地址</Text>
        </View>
      </View>
    </View>
  )
}
