import { View, Text } from '@tarojs/components'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useMemberStore } from '@/store/memberStore'
import { trackMemberJoin, trackMemberModalView } from '@/store/couponStore'

const benefits = [
  { icon: '✏', text: '上传动漫OS作品（解锁创意墙投稿权限）' },
  { icon: '💰', text: '全场果酒享8.5折（会员价实时计算）' },
  { icon: '🗳', text: '社交拉票权（创意墙作品可发起拉票）' },
  { icon: '🏆', text: '月度冠军评选（专属会员荣誉标识）' },
  { icon: '🎁', text: '每月领3张代金券（第6批联动）' },
]

export function MemberModal() {
  const { showMemberModal, setShowMemberModal, joinMember } = useMemberStore()
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly')
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
    
    // 埋点：开通会员
    const price = selectedPlan === 'monthly' ? 9.9 : 88
    trackMemberJoin(selectedPlan, price)
    
    joinMember(selectedPlan)
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

        {/* 套餐选择 */}
        <View className="px-5 pb-4">
          <View className="flex gap-3">
            {/* 月卡 */}
            <View
              className="flex-1 rounded-xl p-3 text-center cursor-pointer border-2"
              style={{
                borderColor: selectedPlan === 'monthly' ? '#8B5CF6' : '#334155',
                backgroundColor: selectedPlan === 'monthly' ? 'rgba(139,92,246,0.1)' : 'transparent'
              }}
              onClick={() => setSelectedPlan('monthly')}
            >
              <Text className="block text-sm font-medium" style={{ color: selectedPlan === 'monthly' ? '#8B5CF6' : '#94A3B8' }}>月卡</Text>
              <Text className="block text-lg font-bold text-white mt-1">¥9.9/月</Text>
              {selectedPlan === 'monthly' && (
                <View className="mt-2 rounded-full py-1 px-3 inline-block" style={{ backgroundColor: '#8B5CF6' }}>
                  <Text className="text-xs text-white">默认选中</Text>
                </View>
              )}
            </View>

            {/* 年卡 */}
            <View
              className="flex-1 rounded-xl p-3 text-center cursor-pointer border-2"
              style={{
                borderColor: selectedPlan === 'annual' ? '#FBBF24' : '#334155',
                backgroundColor: selectedPlan === 'annual' ? 'rgba(251,191,36,0.1)' : 'transparent'
              }}
              onClick={() => setSelectedPlan('annual')}
            >
              <Text className="block text-sm font-medium" style={{ color: selectedPlan === 'annual' ? '#FBBF24' : '#94A3B8' }}>年卡</Text>
              <Text className="block text-lg font-bold text-white mt-1">¥88/年</Text>
              <Text className="block text-xs mt-1" style={{ color: '#10B981' }}>省¥30.8</Text>
              {selectedPlan === 'annual' && (
                <View className="mt-2 rounded-full py-1 px-3 inline-block" style={{ backgroundColor: '#FBBF24' }}>
                  <Text className="text-xs text-gray-900">默认选中</Text>
                </View>
              )}
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
