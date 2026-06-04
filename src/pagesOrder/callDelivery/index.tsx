import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Truck, Phone, ExternalLink, MapPin, Clock, Shield } from 'lucide-react-taro'
import { PICKUP_POINTS } from '@/mock/delivery'

/** 配送平台配置 */
const DELIVERY_PLATFORMS = [
  {
    id: 'meituan',
    name: '美团配送',
    icon: '🟡',
    desc: '覆盖广 · 约30分钟送达',
    phone: '10109777',
    miniAppId: '', // 待接入
    url: 'https://page.peisongdashi.com/',
    color: '#FFD100',
    bgColor: 'rgba(255,209,0,0.1)',
    borderColor: '#FFD100',
  },
  {
    id: 'eleme',
    name: '饿了么配送',
    icon: '🔵',
    desc: '蜂鸟即配 · 约25分钟送达',
    phone: '10105757',
    miniAppId: '',
    url: 'https://www.ele.me/',
    color: '#0097FF',
    bgColor: 'rgba(0,151,255,0.1)',
    borderColor: '#0097FF',
  },
  {
    id: 'shansong',
    name: '闪送',
    icon: '🔴',
    desc: '专人直送 · 约15分钟送达',
    phone: '400-890-8900',
    miniAppId: '',
    url: 'https://www.ishansong.com/',
    color: '#FF4D4F',
    bgColor: 'rgba(255,77,79,0.1)',
    borderColor: '#FF4D4F',
  },
  {
    id: 'didi',
    name: '滴滴配送',
    icon: '🟠',
    desc: '橙心配送 · 约30分钟送达',
    phone: '400-000-1999',
    miniAppId: '',
    url: 'https://mai.didi.cn/',
    color: '#FF7D00',
    bgColor: 'rgba(255,125,0,0.1)',
    borderColor: '#FF7D00',
  },
]

export default function CallDeliveryPage() {
  const handleCall = (phone: string) => {
    Taro.makePhoneCall({ phoneNumber: phone })
  }

  const handleOpenLink = (url: string) => {
    Taro.setClipboardData({
      data: url,
      success: () => {
        Taro.showToast({ title: '链接已复制，请在浏览器打开', icon: 'none' })
      }
    })
  }

  return (
    <View className="min-h-screen bg-purple-50">
      {/* 顶部 */}
      <View className="bg-gradient-to-r from-purple-600 to-violet-600 px-4 pt-4 pb-6">
        <View className="flex items-center gap-2">
          <Truck size={24} color="white" />
          <Text className="text-xl font-bold text-white">呼叫配送</Text>
        </View>
        <Text className="text-sm text-white mt-1">同城配送平台 · 一键呼叫骑手</Text>
      </View>

      <View className="px-4 pt-4">
        {/* 自提点信息 */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <View className="flex items-center gap-2 mb-3">
            <MapPin size={16} color="#A855F7" />
            <Text className="text-sm text-purple-400 font-medium">发货地址</Text>
          </View>
          {PICKUP_POINTS.slice(0, 1).map(point => (
            <View key={point.id}>
              <Text className="text-white font-medium">{point.name}</Text>
              <Text className="text-xs text-gray-400 mt-1">{point.address}</Text>
              <View className="flex items-center gap-1 mt-1">
                <Clock size={12} color="#9CA3AF" />
                <Text className="text-xs text-gray-400">{point.businessHours}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 配送平台列表 */}
        <Text className="text-sm text-gray-400 mb-3">选择配送平台</Text>
        <View className="">
          {DELIVERY_PLATFORMS.map(platform => (
            <View
              key={platform.id}
              className="rounded-2xl border-2 p-4"
              style={{
                borderColor: platform.borderColor,
                backgroundColor: platform.bgColor,
              }}
            >
              <View className="flex items-center gap-3 mb-3">
                <Text className="text-2xl">{platform.icon}</Text>
                <View className="flex-1">
                  <Text className="text-white font-medium">{platform.name}</Text>
                  <Text className="text-xs text-gray-400 mt-1">{platform.desc}</Text>
                </View>
              </View>
              <View className="flex gap-2">
                <View
                  className="flex-1 rounded-xl py-2 flex items-center justify-center gap-1"
                  style={{ backgroundColor: platform.color + '20' }}
                  onClick={() => handleCall(platform.phone)}
                >
                  <Phone size={14} color={platform.color} />
                  <Text className="text-sm" style={{ color: platform.color }}>电话呼叫</Text>
                </View>
                <View
                  className="flex-1 rounded-xl py-2 flex items-center justify-center gap-1"
                  style={{ backgroundColor: platform.color + '20' }}
                  onClick={() => handleOpenLink(platform.url)}
                >
                  <ExternalLink size={14} color={platform.color} />
                  <Text className="text-sm" style={{ color: platform.color }}>打开平台</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 提示 */}
        <View className="mt-4 mb-6 bg-white rounded-xl p-3">
          <View className="flex items-start gap-2">
            <Shield size={14} color="#9CA3AF" />
            <Text className="text-xs text-gray-400">提示：呼叫配送员后，将酒水交给骑手并告知收货地址。配送费由客户承担，具体费用以平台实际报价为准。</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
