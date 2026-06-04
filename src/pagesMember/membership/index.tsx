import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Crown, Sparkles, Tag, Gift, ChevronRight } from 'lucide-react-taro'
import { useMemberStore } from '@/store/memberStore'

// Status is now computed dynamically in the component
const BENEFIT_CONFIG = [
  { icon: Gift, title: '首单0元送酒', action: 'welcome' },
  { icon: Tag, title: '每月1元加购', action: 'ticket' },
  { icon: Gift, title: '生日礼遇', action: 'birthday' },
]

export default function Membership() {
  const { isMember, memberExpire, setShowMemberModal, getRemainingDays, welcomeGiftClaimed, welcomeGiftRedeemed, canClaimTicket, setShowWelcomeGiftModal, setShowTicketModal } = useMemberStore()
  const remainingDays = getRemainingDays()

  return (
    <View className="min-h-screen bg-purple-50 pb-safe">
      <View className="bg-gradient-to-br from-purple-500 to-pink-500 px-4 pt-6 pb-12">
        <View className="flex items-center justify-center mb-4">
          <View className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Crown size={40} color="#FBBF24" />
          </View>
        </View>
        <Text className="text-white text-2xl font-bold text-center block">邑夏创始会员</Text>
        <Text className="text-white text-opacity-70 text-sm text-center block mt-2">
          {isMember ? `有效期至2026.12.31` : '¥9.9 · 有效期至2026.12.31'}
        </Text>
        {!isMember && (
          <View className="flex justify-center mt-4">
            <Button className="bg-white border-0" onClick={() => { setShowMemberModal(true); Taro.navigateBack() }}>
              <Crown size={16} color="#8B5CF6" />
              <Text className="text-purple-600 ml-2 font-bold">立即开通</Text>
            </Button>
          </View>
        )}
        {isMember && (
          <View className="flex justify-center mt-4">
            <Badge className="text-sm bg-white bg-opacity-20 text-white border-0 px-4 py-1">
              <Sparkles size={14} color="#FBBF24" />
              <Text className="ml-1">已开通</Text>
            </Badge>
          </View>
        )}
      </View>

      <View className="px-4 -mt-6">
        <Card>
          <CardContent className="p-0">
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-900">创始会员权益</Text>
            </View>
            {BENEFIT_CONFIG.map((benefit, index) => {
              const Icon = benefit.icon
              const statusText = benefit.action === 'welcome'
                ? (!welcomeGiftClaimed ? '点击领取' : welcomeGiftRedeemed ? '已核销✓' : '已领取')
                : benefit.action === 'ticket'
                ? (canClaimTicket() ? '点击领取' : '本月已领✓')
                : '全年1次'
              const statusColor = statusText.includes('点击') ? '#FBBF24' : '#6B7280'
              const descText = benefit.action === 'welcome'
                ? '经典款果酒3选1，自提核销'
                : benefit.action === 'ticket'
                ? '经典款果酒3选1仅¥1，当月不领失效'
                : '全场9折，需完善个人信息'
              return (
                <View key={index}>
                  <View className="flex items-center gap-4 p-4" onClick={() => {
                    if (benefit.action === 'welcome') {
                      setShowWelcomeGiftModal(true)
                    } else if (benefit.action === 'ticket') {
                      setShowTicketModal(true)
                    } else if (benefit.action === 'birthday') {
                      Taro.navigateTo({ url: '/pagesMember/profile/index' })
                    }
                  }}>
                    <View className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Icon size={20} color="#8B5CF6" />
                    </View>
                    <View className="flex-1">
                      <View className="flex items-center gap-2">
                        <Text className="text-sm font-medium text-gray-900">{benefit.title}</Text>
                        <Text className="text-xs font-bold" style={{ color: statusColor }}>{statusText}</Text>
                      </View>
                      <Text className="text-xs text-gray-500 mt-1">{descText}</Text>
                    </View>
                    <ChevronRight size={16} color="#D1D5DB" />
                  </View>
                  {index < BENEFIT_CONFIG.length - 1 && <Separator className="ml-14" />}
                </View>
              )
            })}
          </CardContent>
        </Card>
      </View>

      <View className="px-4 mt-4">
        <Card>
          <CardContent className="p-4">
            <Text className="text-sm font-medium text-gray-900 block mb-2">会员须知</Text>
            <Text className="text-xs text-gray-500 block">· 创始会员有效期至2026年12月31日</Text>
            <Text className="text-xs text-gray-500 block">· 首单0元送酒（经典款果酒3选1），一次性权益</Text>
            <Text className="text-xs text-gray-500 block">· 每月1元小酒票（经典款果酒3选1仅¥1），当月不领失效</Text>
            <Text className="text-xs text-gray-500 block">· 生日9折全年仅1次，需完善个人信息后解锁</Text>
            <Text className="text-xs text-gray-500 block">· 会员权益仅限本人使用，不可转让</Text>
          </CardContent>
        </Card>
      </View>

      {!isMember && (
        <View className="px-4 mt-6 mb-6">
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-0 h-12" onClick={() => { setShowMemberModal(true); Taro.navigateBack() }}>
            <Crown size={18} color="white" />
            <Text className="text-white ml-2 font-bold">¥9.9 开通创始会员</Text>
          </Button>
        </View>
      )}
      {isMember && (
        <View className="px-4 mt-6 mb-6">
          <Button variant="outline" className="w-full h-12" onClick={() => { setShowMemberModal(true); Taro.navigateBack() }}>
            <Text>查看会员权益</Text>
          </Button>
        </View>
      )}
    
      {/* 弹窗组件 */}
      <WelcomeGiftModal />
      <TicketSelector />
    </View>
  )
}
