import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Crown, Sparkles, Truck, Tag, Gift, ChevronRight } from 'lucide-react-taro'
import { useMemberStore } from '@/store/memberStore'

const MONTHLY_BENEFITS = [
  { icon: Truck, title: '免配送费', desc: '每月4次校内配送免运费' },
  { icon: Tag, title: '9折优惠', desc: '全场商品会员价' },
  { icon: Sparkles, title: '精灵碎片双倍', desc: '购买即享双倍碎片' },
  { icon: Gift, title: '生日礼遇', desc: '专属生日礼包' },
]

export default function Membership() {
  const { isMember, memberExpire, setShowMemberModal, getRemainingDays } = useMemberStore()
  const remainingDays = getRemainingDays()

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      <View className="bg-gradient-to-br from-purple-500 to-pink-500 px-4 pt-6 pb-12">
        <View className="flex items-center justify-center mb-4">
          <View className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <Crown size={40} color="#FBBF24" />
          </View>
        </View>
        <Text className="text-white text-2xl font-bold text-center block">邑夏月卡会员</Text>
        <Text className="text-white text-opacity-70 text-sm text-center block mt-2">
          {isMember ? `剩余${remainingDays}天 · 到期${memberExpire ? new Date(memberExpire).toLocaleDateString() : ''}` : '9.9元/月 · 轻松开通'}
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
              <Text className="text-lg font-semibold text-gray-900">月卡会员权益</Text>
            </View>
            {MONTHLY_BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <View key={index}>
                  <View className="flex items-center gap-4 p-4">
                    <View className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                      <Icon size={20} color="#8B5CF6" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-900">{benefit.title}</Text>
                      <Text className="text-xs text-gray-500 mt-1">{benefit.desc}</Text>
                    </View>
                    <ChevronRight size={16} color="#D1D5DB" />
                  </View>
                  {index < MONTHLY_BENEFITS.length - 1 && <Separator className="ml-14" />}
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
            <Text className="text-xs text-gray-500 block">· 月卡会员有效期为30天，到期后自动失效</Text>
            <Text className="text-xs text-gray-500 block">· 免配送费权益每月4次，次月重置</Text>
            <Text className="text-xs text-gray-500 block">· 9折优惠与优惠券不可叠加使用</Text>
            <Text className="text-xs text-gray-500 block">· 会员权益仅限本人使用，不可转让</Text>
          </CardContent>
        </Card>
      </View>

      {!isMember && (
        <View className="px-4 mt-6 mb-6">
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-0 h-12" onClick={() => { setShowMemberModal(true); Taro.navigateBack() }}>
            <Crown size={18} color="white" />
            <Text className="text-white ml-2 font-bold">9.9元/月 开通邑夏会员</Text>
          </Button>
        </View>
      )}
      {isMember && (
        <View className="px-4 mt-6 mb-6">
          <Button variant="outline" className="w-full h-12" onClick={() => { setShowMemberModal(true); Taro.navigateBack() }}>
            <Text>续费会员</Text>
          </Button>
        </View>
      )}
    </View>
  )
}
