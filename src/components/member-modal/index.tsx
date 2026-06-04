import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useMemberStore, TICKET_WINE_NAMES } from '@/store/memberStore'

export function MemberModal() {
  const {
    showMemberModal, setShowMemberModal, joinMember,
    isMember, welcomeGiftClaimed, welcomeGiftRedeemed,
    welcomeGiftWineId, welcomeGiftRedeemCode,
    ticketClaimedMonth, ticketSelectedWine, canClaimTicket,
    claimTicket, setShowTicketModal
  } = useMemberStore()
  const [loading, setLoading] = useState(false)

  if (!showMemberModal) return null

  const handleJoin = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    joinMember()
    setLoading(false)
  }

  // 当前年月
  const now = new Date()
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const ticketUsedThisMonth = ticketClaimedMonth === currentMonth

  // 赠饮状态文案
  const giftStatusText = !welcomeGiftClaimed
    ? '待领取'
    : welcomeGiftRedeemed
      ? '已核销'
      : welcomeGiftRedeemCode
        ? `核销码: ${welcomeGiftRedeemCode}`
        : '已领取'

  const giftStatusColor = !welcomeGiftClaimed
    ? '#FBBF24'
    : welcomeGiftRedeemed
      ? '#6B7280'
      : '#22C55E'

  // 小酒票状态
  const ticketStatusText = !isMember
    ? '开通会员后可用'
    : ticketUsedThisMonth
      ? ticketSelectedWine ? `已选: ${TICKET_WINE_NAMES[ticketSelectedWine] || ''}` : '本月已领'
      : '可领取'

  const ticketStatusColor = !isMember
    ? '#6B7280'
    : ticketUsedThisMonth
      ? '#6B7280'
      : '#FBBF24'

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <View className="absolute inset-0" onClick={() => setShowMemberModal(false)} />
      <View className="relative w-11/12 max-w-sm rounded-3xl overflow-hidden" style={{ backgroundColor: '#FAF5FF' }}>
        {/* 头部 */}
        <View className="pt-6 pb-4 px-5 text-center">
          <Text className="block text-2xl font-bold" style={{ color: '#FBBF24' }}>👑 9.9创始会员</Text>
          <Text className="block text-sm text-gray-400 mt-1">限时招募 · 有效期至2026.12.31</Text>
        </View>

        {/* 权益列表 */}
        <View className="px-5 pb-4">
          {/* 首单0元送酒 */}
          <View style={{ backgroundColor: 'rgba(251,191,36,0.08)', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' }}>
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <View style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Text style={{ fontSize: '16px' }}>🎁</Text>
                  <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#1F2937' }}>首单0元送酒</Text>
                </View>
                <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px', display: 'block' }}>
                  老款果酒3选1，自提核销或配送
                </Text>
              </View>
              <View style={{ backgroundColor: welcomeGiftClaimed ? 'rgba(107,114,128,0.2)' : 'rgba(251,191,36,0.15)', borderRadius: '8px', padding: '4px 10px' }}>
                <Text style={{ fontSize: '12px', color: giftStatusColor, fontWeight: 'bold' }}>
                  {giftStatusText}
                </Text>
              </View>
            </View>
          </View>

          {/* 每月1元加购 */}
          <View style={{ backgroundColor: 'rgba(251,191,36,0.08)', borderRadius: '12px', padding: '14px 16px', marginBottom: '10px' }}>
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <View style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Text style={{ fontSize: '16px' }}>🎫</Text>
                  <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#1F2937' }}>每月1元加购</Text>
                </View>
                <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px', display: 'block' }}>
                  三种特价老款酒3选1，当月不领失效
                </Text>
              </View>
              <View style={{ backgroundColor: ticketUsedThisMonth || !isMember ? 'rgba(107,114,128,0.2)' : 'rgba(251,191,36,0.15)', borderRadius: '8px', padding: '4px 10px' }}>
                <Text style={{ fontSize: '12px', color: ticketStatusColor, fontWeight: 'bold' }}>
                  {ticketStatusText}
                </Text>
              </View>
            </View>
            {/* 可选酒列表 */}
            {isMember && !ticketUsedThisMonth && (
              <View style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                {Object.entries(TICKET_WINE_NAMES).map(([id, name]) => (
                  <View
                    key={id}
                    onClick={() => {
                      claimTicket(id)
                      setShowTicketModal(true)
                    }}
                    style={{
                      flex: 1, backgroundColor: 'rgba(139,92,246,0.15)', borderRadius: '8px',
                      padding: '8px 0', textAlign: 'center'
                    }}
                  >
                    <Text style={{ fontSize: '11px', color: '#C4B5FD', display: 'block' }}>{name}</Text>
                    <Text style={{ fontSize: '13px', color: '#FBBF24', fontWeight: 'bold', display: 'block' }}>¥1</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* 生日礼遇 */}
          <View style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px' }}>
            <Text style={{ fontSize: '16px' }}>🎂</Text>
            <Text style={{ fontSize: '14px', color: '#1F2937', flex: 1 }}>生日全场9折（全年1次·需完善信息）</Text>
          </View>
        </View>

        {/* 价格+按钮 */}
        <View className="px-5 pb-4">
          <View className="rounded-xl p-4 text-center border-2" style={{ borderColor: '#FBBF24', backgroundColor: 'rgba(251,191,36,0.1)' }}>
            <Text className="block text-sm font-medium" style={{ color: '#FBBF24' }}>创始会员</Text>
            <Text className="block text-3xl font-bold text-white mt-2">¥9.9</Text>
            <Text className="block text-xs text-gray-400 mt-1">一次购买 · 年底到期 · 无需续费</Text>
          </View>
        </View>

        <View className="p-5 pt-2">
          <View className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }}>
            <Button className="w-full border-0" style={{ background: 'transparent', boxShadow: 'none' }} onClick={handleJoin} disabled={loading || isMember}>
              <Text className="text-gray-900 font-semibold">
                {isMember ? '已是创始会员' : loading ? '支付中...' : '立即开通 ¥9.9'}
              </Text>
            </Button>
          </View>
          <View className="mt-3 text-center" onClick={() => setShowMemberModal(false)}>
            <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>暂不开通</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
