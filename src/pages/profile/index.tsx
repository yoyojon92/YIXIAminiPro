import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useMemberStore } from '@/store/memberStore'
import { useCouponStore } from '@/store/couponStore'
import { MemberModal } from '@/components/member-modal'
import { 
  Settings, Bell, Gift, CreditCard, 
  MapPinned,   CircleQuestionMark, Share2, LogOut, ChevronRight,
  Package, Star, Ticket, Crown, Sparkles, RefreshCcw
} from 'lucide-react-taro'

const toolItems = [
  { id: 1, icon: MapPinned, title: '收货地址', path: '/pages/orders/index?tab=address' },
  { id: 2, icon: CreditCard, title: '支付方式', path: '/pages/orders/index?tab=payment' },
  { id: 3, icon: Bell, title: '消息通知', path: '/pages/orders/index?tab=notification' },
  { id: 4, icon:   CircleQuestionMark, title: '帮助与反馈', path: '/pages/orders/index?tab=help' },
  { id: 5, icon: Settings, title: '设置', path: '/pages/orders/index?tab=settings' }
]

export default function Profile() {
  const { isMember, memberLevel, memberExpire, setShowMemberModal, getRemainingDays, getMemberBenefits, renewMember } = useMemberStore()
  const { getUnusedCoupons } = useCouponStore()
  
  const couponBadgeCount = getUnusedCoupons().length
  
  const menuItems = [
    { id: 1, icon: Package, title: '我的订单', badge: '3', path: '/pages/orders/index' },
    { id: 2, icon: Ticket, title: '优惠券', badge: null, dynamicBadge: () => couponBadgeCount > 0 ? couponBadgeCount : null, path: '/pages/coupons/index' },
    { id: 3, icon: Star, title: '我的收藏', badge: null, path: '/pages/wall/index?tab=favorite' },
    { id: 4, icon: Gift, title: '精灵碎片', badge: '8', path: '/pages/sprites/index' }
  ]

  const navigateTo = (path: string) => {
    Taro.navigateTo({ url: path })
  }

  const levelText = memberLevel === 'annual' ? '年卡会员' : memberLevel === 'monthly' ? '月卡会员' : '普通会员'
  const levelColor = isMember ? (memberLevel === 'annual' ? '#FBBF24' : '#8B5CF6') : '#9CA3AF'
  const remainingDays = getRemainingDays()

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      {/* 会员模态框 */}
      <MemberModal />
      
      {/* 顶部个人信息 */}
      <View className="bg-gradient-to-br from-purple-500 to-pink-500 px-4 pt-8 pb-16">
        <View className="flex items-center justify-between mb-4">
          <Text className="text-white text-lg font-semibold">我的</Text>
          <View className="flex items-center gap-4">
            <Bell size={22} color="white" />
            <Settings size={22} color="white" />
          </View>
        </View>

        <View className="flex items-center gap-4">
          <View className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-purple-100">
            <Image src="https://picsum.photos/100/100?random=30" mode="aspectFill" className="w-full h-full" />
          </View>
          
          <View className="flex-1">
            <View className="flex items-center gap-2">
              <Text className="text-white text-xl font-bold">大学生用户</Text>
              <Badge 
                variant="secondary" 
                className="text-xs"
                style={{ backgroundColor: isMember ? levelColor : 'rgba(255,255,255,0.2)' }}
              >
                <Crown size={12} color={isMember ? '#fff' : '#fff'} />
                {levelText}
                {isMember && remainingDays > 0 && <Text className="text-white ml-1">·{remainingDays}天</Text>}
              </Badge>
            </View>
            <Text className="text-white text-opacity-80 text-sm mt-1">青岛农业大学 · 计算机学院</Text>
          </View>

          <Button 
            variant="ghost" 
            className="text-white text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => navigateTo('/pages/orders/index?tab=profile')}
          >
            编辑
          </Button>
        </View>
      </View>

      {/* 统计数据卡片 */}
      <View className="px-4 -mt-10">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <View className="flex justify-around">
              <View className="flex flex-col items-center" onClick={() => navigateTo('/pages/orders/index?tab=pending')}>
                <Text className="text-xl font-bold text-gray-900">3</Text>
                <Text className="text-xs text-gray-500 mt-1">待付款</Text>
              </View>
              <Separator orientation="vertical" className="h-10" />
              <View className="flex flex-col items-center" onClick={() => navigateTo('/pages/orders/index?tab=shipped')}>
                <Text className="text-xl font-bold text-gray-900">2</Text>
                <Text className="text-xs text-gray-500 mt-1">待发货</Text>
              </View>
              <Separator orientation="vertical" className="h-10" />
              <View className="flex flex-col items-center" onClick={() => navigateTo('/pages/orders/index?tab=delivered')}>
                <Text className="text-xl font-bold text-gray-900">5</Text>
                <Text className="text-xs text-gray-500 mt-1">待收货</Text>
              </View>
              <Separator orientation="vertical" className="h-10" />
              <View className="flex flex-col items-center" onClick={() => navigateTo('/pages/orders/index?tab=completed')}>
                <Text className="text-xl font-bold text-gray-900">12</Text>
                <Text className="text-xs text-gray-500 mt-1">已完成</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 会员状态卡片 */}
      <View className="px-4 mt-4">
        <Card className={isMember ? 'border-2' : ''} style={isMember ? { borderColor: levelColor } : {}}>
          <CardContent className="p-4">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-3">
                <View className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: isMember ? levelColor : '#E5E7EB' }}>
                  <Crown size={24} color={isMember ? 'white' : '#9CA3AF'} />
                </View>
                <View>
                  <Text className="text-lg font-semibold text-gray-900">
                    {isMember ? '👑 邑夏会员' : '普通会员'}
                  </Text>
                  {isMember && memberExpire && remainingDays > 0 && (
                    <Text className="text-xs text-gray-500 mt-1">
                      到期时间：{new Date(memberExpire).toLocaleDateString()} · 剩余{remainingDays}天
                    </Text>
                  )}
                  {!isMember && (
                    <Text className="text-xs text-gray-500 mt-1">开通会员享更多权益</Text>
                  )}
                </View>
              </View>
              {isMember ? (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    renewMember()
                  }}
                >
                  <RefreshCcw size={14} color="#8B5CF6" />
                  <Text className="ml-1">续费</Text>
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 border-0"
                  onClick={() => setShowMemberModal(true)}
                >
                  <Text className="text-white">立即开通</Text>
                </Button>
              )}
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 会员专属权益 */}
      <View className="px-4 mt-4">
        <Card className="overflow-hidden">
          <View className="p-4 bg-gradient-to-r from-purple-500 to-pink-500">
            <View className="flex items-center justify-between">
              <View className="flex items-center gap-2">
                <Crown size={18} color="white" />
                <Text className="text-white font-semibold">会员专属权益</Text>
              </View>
              {isMember ? (
                <Badge variant="secondary" className="text-xs" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Sparkles size={12} color="#FBBF24" />
                  <Text className="text-white ml-1">已开通</Text>
                </Badge>
              ) : (
                <Button 
                  size="sm" 
                  className="text-xs"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  onClick={() => setShowMemberModal(true)}
                >
                  <Text className="text-white">立即开通</Text>
                </Button>
              )}
            </View>
          </View>
          <CardContent className="p-0">
            {getMemberBenefits().map((benefit, index) => (
              <View key={index}>
                <View className="flex items-center gap-3 p-4">
                  <Sparkles size={16} color="#8B5CF6" />
                  <Text className="text-sm text-gray-700 flex-1">{benefit}</Text>
                </View>
                {index < getMemberBenefits().length - 1 && <Separator className="ml-14" />}
              </View>
            ))}
            {!isMember && (
              <View className="p-4 bg-purple-50">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-0"
                  onClick={() => setShowMemberModal(true)}
                >
                  <Crown size={16} color="white" />
                  <Text className="text-white ml-2">👑 9.9元/月 开通邑夏会员</Text>
                </Button>
              </View>
            )}
          </CardContent>
        </Card>
      </View>

      {/* 功能菜单 */}
      <View className="px-4 mt-4">
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const badge = item.dynamicBadge ? item.dynamicBadge() : item.badge
              return (
                <View key={item.id}>
                  <View 
                    className="flex items-center justify-between p-4"
                    onClick={() => navigateTo(item.path)}
                  >
                    <View className="flex items-center gap-3">
                      <View className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Icon size={20} color="#8B5CF6" />
                      </View>
                      <Text className="text-sm font-medium text-gray-900">{item.title}</Text>
                      {badge && (
                        <Badge variant="destructive" className="text-xs ml-1">
                          {badge}
                        </Badge>
                      )}
                    </View>
                    <ChevronRight size={18} color="#9CA3AF" />
                  </View>
                  {index < menuItems.length - 1 && <Separator className="ml-14" />}
                </View>
              )
            })}
          </CardContent>
        </Card>
      </View>

      {/* 工具菜单 */}
      <View className="px-4 mt-4">
        <Card>
          <CardContent className="p-0">
            {toolItems.map((item, index) => {
              const Icon = item.icon
              return (
                <View key={item.id}>
                  <View 
                    className="flex items-center justify-between p-4"
                    onClick={() => navigateTo(item.path)}
                  >
                    <View className="flex items-center gap-3">
                      <View className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Icon size={20} color="#6B7280" />
                      </View>
                      <Text className="text-sm font-medium text-gray-900">{item.title}</Text>
                    </View>
                    <ChevronRight size={18} color="#9CA3AF" />
                  </View>
                  {index < toolItems.length - 1 && <Separator className="ml-14" />}
                </View>
              )
            })}
          </CardContent>
        </Card>
      </View>

      {/* 退出登录 */}
      <View className="px-4 mt-6 mb-6">
        <Button variant="outline" className="w-full text-gray-600 border-gray-200">
          <LogOut size={18} color="#6B7280" />
          <Text>退出登录</Text>
        </Button>
      </View>

      {/* 分享入口 */}
      <View className="px-4 mb-6">
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
          <CardContent className="p-4 flex items-center justify-between">
            <View className="flex items-center gap-3">
              <Gift size={24} color="#FBBF24" />
              <View>
                <Text className="text-sm font-medium text-gray-900">分享邀请好友</Text>
                <Text className="text-xs text-gray-500 mt-1">邀请新用户可得优惠券</Text>
              </View>
            </View>
            <Button size="sm" variant="secondary" onClick={() => {}}>
              <Share2 size={14} color="#FBBF24" />
              <Text>分享</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
