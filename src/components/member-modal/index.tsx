import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useMemberStore } from '@/store/memberStore'
import { trackMemberJoin, trackMemberModalView } from '@/store/couponStore'

// 月卡会员权益（精简版，只保留月卡会员）
const benefits = [
  { icon: '✏', text: '上传动漫OS作品（解锁创意墙投稿权限）' },
  { icon: '💰', text: '全场果酒享8.5折（会员价实时计算）' },
  { icon: '🗳', text: '社交拉票权（创意墙作品可发起拉票）' },
  { icon: '🏆', text: '月度冠军评选（专属会员荣誉标识）' },
  { icon: '🎁', text: '每月领3张代金券' },
]

export function MemberModal() {
  const { showMemberModal, setShowMemberModal, joinMember } = useMemberStore()
  const [loading, setLoading] = useState(false)

  // 埋点：弹窗展示
  useEffect(() => {
    if (showMemberModal) {
      trackMemberModalView()
    }
  }, [showMemberModal])

  if (!showMemberModal) return null

  const handleJoin = async () => {
    setLoading(true)
    // 模拟支付流程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 埋点：开通会员（固定为月卡）
    trackMemberJoin('monthly', 9.9)
    
    joinMember('monthly')
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
          <Text className="block text-2xl font-bold" style={{ color: '#8B5CF6' }}>
            👑 9.9元/月 开通邑夏会员
          </Text>
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

        {/* 月卡套餐（精简版，只显示月卡） */}
        <View className="px-5 pb-4">
          <View
            className="rounded-xl p-4 text-center border-2"
            style={{
              borderColor: '#8B5CF6',
              backgroundColor: 'rgba(139,92,246,0.1)'
            }}
          >
            <Text className="block text-sm font-medium" style={{ color: '#8B5CF6' }}>月卡会员</Text>
            <Text className="block text-2xl font-bold text-white mt-2">¥9.9/月</Text>
            <View className="mt-2 rounded-full py-1 px-3 inline-block" style={{ backgroundColor: '#8B5CF6' }}>
              <Text className="text-xs text-white">精选套餐</Text>
            </View>
          </View>
        </View>

        {/* 底部按钮 */}
        <View className="p-5 pt-2">
          <View className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }}>
            <Button
              className="w-full border-0"
              style={{ background: 'transparent', boxShadow: 'none' }}
              onClick={handleJoin}
              disabled={loading}
            >
              <Text className="text-white font-semibold">
                {loading ? '支付中...' : '立即开通'}
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
