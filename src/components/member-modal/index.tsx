import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useMemberStore } from '@/store/memberStore'

// 9.9创始会员权益
const benefits = [
  { icon: '🎁', text: '入会赠饮1瓶（老款果酒随机）' },
  { icon: '🎫', text: '每月1元小酒票（3种老款酒3选1）' },
  { icon: '⚡', text: '每周特价¥9.9（老款果酒）' },
  { icon: '💰', text: '全场果酒享8.5折（会员价实时计算）' },
]

export function MemberModal() {
  const { showMemberModal, setShowMemberModal, joinMember } = useMemberStore()
  const [loading, setLoading] = useState(false)

  if (!showMemberModal) return null

  const handleJoin = async () => {
    setLoading(true)
    // 模拟支付流程
    await new Promise(resolve => setTimeout(resolve, 1500))
    joinMember()
    setLoading(false)
  }

  const handleClose = () => {
    setShowMemberModal(false)
  }

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      {/* 点击遮罩关闭 */}
      <View className="absolute inset-0" onClick={handleClose} />

      {/* 卡片内容 */}
      <View className="relative w-11/12 max-w-sm rounded-3xl overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
        {/* 标题区域 */}
        <View className="pt-6 pb-4 px-5 text-center">
          <Text className="block text-2xl font-bold" style={{ color: '#FBBF24' }}>
            👑 9.9创始会员
          </Text>
          <Text className="block text-sm text-gray-400 mt-1">限时招募 · 有效期至2026.12.31</Text>
        </View>

        {/* 权益列表 */}
        <View className="px-5 pb-4">
          {benefits.map((item, index) => (
            <View key={index} className="flex items-center gap-3 py-2">
              <Text className="text-lg">{item.icon}</Text>
              <Text className="text-sm text-white flex-1">{item.text}</Text>
            </View>
          ))}
        </View>

        {/* 价格卡片 */}
        <View className="px-5 pb-4">
          <View
            className="rounded-xl p-4 text-center border-2"
            style={{
              borderColor: '#FBBF24',
              backgroundColor: 'rgba(251,191,36,0.1)'
            }}
          >
            <Text className="block text-sm font-medium" style={{ color: '#FBBF24' }}>创始会员</Text>
            <Text className="block text-3xl font-bold text-white mt-2">¥9.9</Text>
            <Text className="block text-xs text-gray-400 mt-1">一次购买 · 年底到期 · 无需续费</Text>
          </View>
        </View>

        {/* 底部按钮 */}
        <View className="p-5 pt-2">
          <View className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>
            <Button
              className="w-full border-0"
              style={{ background: 'transparent', boxShadow: 'none' }}
              onClick={handleJoin}
              disabled={loading}
            >
              <Text className="text-gray-900 font-semibold">
                {loading ? '支付中...' : '立即开通 ¥9.9'}
              </Text>
            </Button>
          </View>
          <View className="mt-3 text-center" onClick={handleClose}>
            <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>暂不开通</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
