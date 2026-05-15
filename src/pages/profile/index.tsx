import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useMemberStore } from '@/store/memberStore'
import { useCouponStore } from '@/store/couponStore'
import { useUserProfileStore } from '@/store/userProfileStore'
import { trackProfileAction } from '@/store/profileStore'
import { usePushStore } from '@/store/pushStore'
import { useRunnerStore } from '@/store/runnerStore'
import { MemberModal } from '@/components/member-modal'
import { RegisterModal } from '@/components/RegisterModal'
import { 
  Settings, Bell, Gift, CreditCard, 
  MapPinned, CircleQuestionMark, Share2, LogOut, ChevronRight,
  Package, Star, Ticket, Crown, Sparkles, RefreshCcw, Tag, Scooter
} from 'lucide-react-taro'

export default function Profile() {
  const [showRegister, setShowRegister] = useState(false)
  
  const { isMember, memberLevel, memberExpire, setShowMemberModal, getRemainingDays, getMemberBenefits, renewMember } = useMemberStore()
  const { getUnusedCoupons } = useCouponStore()
  const profileStore = useUserProfileStore()
  const pushStore = usePushStore()
  
  // 从userStore读取用户信息
  const { nickname, school, college, isRegistered } = profileStore
  const { tags } = profileStore
  const runnerStore = useRunnerStore()
  
  // 检查是否需要显示注册弹窗
  useEffect(() => {
    if (!isRegistered) {
      setShowRegister(true)
    }
  }, [isRegistered])
  
  // 初始化推送检查和会员状态同步（只在挂载时执行一次）
  useEffect(() => {
    pushStore.checkAndGeneratePushes(tags, {
      lastPurchaseDays: profileStore.purchases.length > 0
        ? Math.floor((Date.now() - (profileStore.purchases[profileStore.purchases.length - 1]?.timestamp || Date.now())) / 86400000)
        : 999,
      couponCount: profileStore.couponUses.length,
      memberDaysLeft: isMember && memberExpire ? Math.floor((memberExpire - Date.now()) / 86400000) : 999,
      hasUGCWork: profileStore.ugcWorks.length > 0,
    })
    profileStore.setMemberStatus(isMember)
  }, [])
  
  const unreadCount = pushStore.unreadCount
  
  const couponBadgeCount = getUnusedCoupons().length
  
  const toolItems = [
    { id: 1, icon: Bell, title: '消息通知', badge: null, dynamicBadge: () => unreadCount > 0 ? unreadCount : null, path: '/pages/notifications/index' },
    { id: 2, icon: Settings, title: '设置', badge: null, path: '/pages/orders/index?tab=settings' },
    { id: 3, icon: CircleQuestionMark, title: '帮助与反馈', badge: null, path: '/pages/orders/index?tab=help' },
    { id: 4, icon: CreditCard, title: '支付方式', badge: null, path: '/pages/orders/index?tab=payment' },
    { id: 5, icon: MapPinned, title: '收货地址', badge: null, path: '/pages/orders/index?tab=address' },
  ]
  
  const menuItems = [
    { id: 1, icon: Package, title: '我的订单', badge: '3', path: '/pages/orders/index' },
    { id: 2, icon: Ticket, title: '优惠券', badge: null, dynamicBadge: () => couponBadgeCount > 0 ? couponBadgeCount : null, path: '/pages/coupons/index' },
    { id: 3, icon: Tag, title: '我的画像', badge: null, path: '/pages/profile/user-profile/index' },
    { id: 4, icon: Star, title: '我的收藏', badge: null, path: '/pages/wall/index?tab=favorite' },
    { id: 5, icon: Gift, title: '精灵碎片', badge: '8', path: '/pages/sprites/index' }
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
      {/* 注册模态框 */}
      <RegisterModal visible={showRegister} onClose={() => setShowRegister(false)} />

      {/* 顶部个人信息 */}
      <View className="bg-gradient-to-br from-purple-500 to-pink-500 px-4 pt-8 pb-16">
        <View className="flex items-center justify-between mb-4">
          <Text className="text-white text-lg font-semibold">我的</Text>
          <View className="flex items-center gap-4">
            <View onClick={() => Taro.navigateTo({ url: '/pages/notifications/index' })}>
              <Bell size={22} color="white" />
            </View>
            <View onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
              <Settings size={22} color="white" />
            </View>
          </View>
        </View>

        <View className="flex items-center gap-4">
          <View className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-purple-100">
            <Image src="https://picsum.photos/100/100?random=30" mode="aspectFill" className="w-full h-full" />
          </View>
          
          <View className="flex-1">
            <View className="flex items-center gap-2">
              <Text className="text-white text-xl font-bold">{nickname || '大学生用户'}</Text>
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
            <Text className="text-white text-opacity-80 text-sm mt-1">
              {school || '请选择学校'} {college ? '· ' + college : ''}
            </Text>
          </View>

          <Button 
            variant="ghost" 
            className="text-white text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            onClick={() => setShowRegister(true)}
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

      {/* 送酒赚钱入口 */}
      <View className="px-4 mt-4">
        <View 
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 shadow-lg relative overflow-hidden border border-gray-700"
          onClick={() => {
            // 埋点
            trackProfileAction('runner_entry')
            // 未注册跳注册页，已注册跳主页
            const path = runnerStore.isRegistered ? '/pages/runner/home' : '/pages/runner/register'
            Taro.navigateTo({ url: path })
          }}
        >
          {/* 装饰性光斑 */}
          <View className="absolute -top-4 -right-4 w-20 h-20 bg-amber-500 bg-opacity-10 rounded-full" />
          <View className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-500 bg-opacity-10 rounded-full" />
          
          <View className="flex items-center justify-between relative z-10">
            <View className="flex items-center gap-3">
              <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                <Scooter size={32} color="white" />
              </View>
              <View>
                <Text className="text-white font-bold text-lg">送酒赚钱</Text>
                <Text className="text-gray-300 text-sm mt-1">
                  {runnerStore.isRegistered ? '今日收入 ¥' + runnerStore.getTodayEarnings() : '成为跑腿员，轻松赚零花钱'}
                </Text>
              </View>
            </View>
            <View className="flex items-center gap-1 bg-white rounded-full px-4 py-2 shadow-md">
              <Text className="text-orange-500 text-sm font-bold">立即加入</Text>
              <ChevronRight size={16} color="#EA580C" />
            </View>
          </View>
        </View>
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
                  <Text className="text-sm text-gray-800 font-medium flex-1">{benefit}</Text>
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
                    onClick={() => item.path && navigateTo(item.path)}
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
                    onClick={() => item.path && navigateTo(item.path)}
                  >
                    <View className="flex items-center gap-3">
                      <View className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Icon size={20} color="#6B7280" />
                      </View>
                      <Text className="text-sm font-medium text-gray-900">{item.title}</Text>
                      {item.dynamicBadge && item.dynamicBadge() && (
                        <Badge variant="destructive" className="ml-1">{item.dynamicBadge!()}</Badge>
                      )}
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
        <Button 
          variant="outline" 
          className="w-full text-gray-600 border-gray-200"
          onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
        >
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
            <Button size="sm" variant="secondary" onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
              <Share2 size={14} color="#FBBF24" />
              <Text>分享</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
