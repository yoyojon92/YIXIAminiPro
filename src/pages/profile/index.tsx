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
import { useUserStore } from '@/store/userStore'
import { useDealerStore } from '@/store/dealerStore'
import { MemberModal } from '@/components/member-modal'
import { RegisterModal } from '@/components/RegisterModal'
import { 
  Settings, Bell, Gift, CreditCard, 
  MapPinned, CircleQuestionMark, Share2, LogOut, ChevronRight,
  Package, Star, Ticket, Crown, Sparkles, RefreshCcw, Tag, Shield,
  Store, TrendingUp, Users, ShoppingCart
} from 'lucide-react-taro'

export default function Profile() {
  const [showRegister, setShowRegister] = useState(false)
  const [adminTapCount, setAdminTapCount] = useState(0)
  const [showAdminInput, setShowAdminInput] = useState(false)
  const [adminCode, setAdminCode] = useState('')
  
  const { isMember, memberLevel, memberExpire, setShowMemberModal, getRemainingDays, renewMember } = useMemberStore()
  const { getUnusedCoupons } = useCouponStore()
  const profileStore = useUserProfileStore()
  const pushStore = usePushStore()
  const userStore = useUserStore()
  const dealerStore = useDealerStore()
  
  const { nickname, school, college, isRegistered } = profileStore
  const { tags } = profileStore
  
  const isAdmin = userStore.userInfo?.role === 'super_admin'
  
  const handleAdminTap = () => {
    if (isAdmin) return
    const newCount = adminTapCount + 1
    setAdminTapCount(newCount)
    if (newCount >= 5) {
      setShowAdminInput(true)
      setAdminTapCount(0)
    }
  }

  const handleAdminActivate = () => {
    if (userStore.activateAdmin(adminCode)) {
      Taro.showToast({ title: '管理员已激活', icon: 'success' })
      setShowAdminInput(false)
      setAdminCode('')
    } else {
      Taro.showToast({ title: '口令错误', icon: 'error' })
    }
  }
  const { isDealer, dealerLevel, referralCount, availableCommission, getDealerLevelName } = dealerStore
  const { isAgent, todayCommission, todayOrderCount, getAgentLevelName } = dealerStore
  
  useEffect(() => {
    if (!isRegistered) {
      setShowRegister(true)
    }
  }, [isRegistered])
  
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
  
  const toolItems: Array<{ id: number; icon: React.ComponentType<any>; title: string; badge: string | null; path?: string; dynamicBadge?: () => number | null; action?: string }> = [
    { id: 1, icon: Bell, title: '消息通知', badge: null, dynamicBadge: () => unreadCount > 0 ? unreadCount : null, path: '/pagesSocial/notifications/index' },
    { id: 2, icon: Settings, title: '设置', badge: null, path: '/pagesOrder/orders/index?tab=settings' },
    { id: 3, icon: CircleQuestionMark, title: '帮助与反馈', badge: null, path: '/pagesOrder/orders/index?tab=help' },
    { id: 4, icon: CreditCard, title: '支付方式', badge: null, path: '/pagesOrder/payment/index' },
    { id: 5, icon: MapPinned, title: '收货地址', badge: null, path: '/pagesOrder/shipping-address/index' },
    { id: 6, icon: Shield, title: '隐私政策', badge: null, action: 'privacy' },
  ]
  
  const menuItems: Array<{ id: number; icon: React.ComponentType<any>; title: string; badge: string | null; path: string; dynamicBadge?: () => number | null; action?: string }> = [
    { id: 0, icon: Crown, title: '会员权益', badge: null, path: '/pagesMember/membership/index' },
    { id: 5, icon: Sparkles, title: '完善信息', badge: null, path: '/pagesMember/profile/index' },
    { id: 1, icon: Package, title: '我的订单', badge: '3', path: '/pagesOrder/orders/index' },
    { id: 2, icon: Ticket, title: '优惠券', badge: null, dynamicBadge: () => couponBadgeCount > 0 ? couponBadgeCount : null, path: '/pagesMember/coupons/index' },
    { id: 4, icon: Star, title: '我的收藏', badge: null, path: '/pagesSocial/wall/index?tab=favorite' },
    
  ]

  const navigateTo = (path: string) => {
    Taro.navigateTo({ url: path })
  }

  const levelText = memberLevel === 'founding' ? '创始会员' : '普通会员'
  const levelColor = isMember ? '#FBBF24' : '#9CA3AF'
  const remainingDays = getRemainingDays()

  return (
    <View className="min-h-screen bg-purple-50 pb-safe">
      {/* 会员模态框 */}
      <MemberModal />
      {/* 注册模态框 */}
      <RegisterModal visible={showRegister} onClose={() => setShowRegister(false)} />

      {/* 顶部个人信息 */}
      <View className="bg-gradient-to-br from-purple-500 to-pink-500 px-4 pt-8 pb-16">
        <View className="flex items-center justify-between mb-4">
          <Text className="text-white text-lg font-semibold">我的</Text>
          <View className="flex items-center gap-4">
            <View onClick={() => Taro.navigateTo({ url: '/pagesSocial/notifications/index' })}>
              <Bell size={22} color="white" />
            </View>
            <View onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
              <Settings size={22} color="white" />
            </View>
          </View>
        </View>

        <View className="flex items-center gap-4">
          <View className="w-16 h-16 rounded-full border-4 border-white overflow-hidden bg-purple-100">
            <Image src="😊" mode="aspectFill" className="w-full h-full" />
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
              <View className="flex flex-col items-center" onClick={() => navigateTo('/pagesOrder/orders/index?tab=pending')}>
                <Text className="text-xl font-bold text-gray-900">3</Text>
                <Text className="text-xs text-gray-500 mt-1">待付款</Text>
              </View>
              <Separator orientation="vertical" className="h-10" />
              <View className="flex flex-col items-center" onClick={() => navigateTo('/pagesOrder/orders/index?tab=shipped')}>
                <Text className="text-xl font-bold text-gray-900">2</Text>
                <Text className="text-xs text-gray-500 mt-1">待发货</Text>
              </View>
              <Separator orientation="vertical" className="h-10" />
              <View className="flex flex-col items-center" onClick={() => navigateTo('/pagesOrder/orders/index?tab=delivered')}>
                <Text className="text-xl font-bold text-gray-900">5</Text>
                <Text className="text-xs text-gray-500 mt-1">待收货</Text>
              </View>
              <Separator orientation="vertical" className="h-10" />
              <View className="flex flex-col items-center" onClick={() => navigateTo('/pagesOrder/orders/index?tab=completed')}>
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
                <Button size="sm" variant="outline" onClick={() => renewMember()}>
                  <RefreshCcw size={14} color="#8B5CF6" />
                  <Text className="ml-1">续费</Text>
                </Button>
              ) : (
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 border-0" onClick={() => setShowMemberModal(true)}>
                  <Text className="text-white">立即开通</Text>
                </Button>
              )}
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 经销商入口 */}
      <View className="px-4 mt-4">
        <View 
          className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-4 shadow-lg relative overflow-hidden border border-amber-500"
          onClick={() => {
            trackProfileAction('dealer_entry')
            Taro.navigateTo({ url: '/pagesDealer/dealer/index' })
          }}
        >
          <View className="absolute -top-4 -right-4 w-20 h-20 bg-amber-500 bg-opacity-10 rounded-full" />
          <View className="absolute -bottom-6 -left-6 w-24 h-24 bg-amber-500 bg-opacity-10 rounded-full" />
          
          <View className="flex items-center justify-between relative z-10">
            <View className="flex items-center gap-3">
              <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md">
                <Store size={32} color="white" />
              </View>
              <View>
                <Text className="text-white font-bold text-lg">经销商中心</Text>
                <Text className="text-amber-200 text-sm mt-1">
                  {isDealer ? `${getDealerLevelName()} · 推荐${referralCount}人` : '推荐20人解锁经销商赚返利'}
                </Text>
              </View>
            </View>
            <View className="flex items-center gap-1 bg-white rounded-full px-4 py-2 shadow-md">
              <Text className="text-orange-500 text-sm font-bold">{isDealer ? '¥' + availableCommission.toFixed(2) : '去推广'}</Text>
              <ChevronRight size={16} color="#EA580C" />
            </View>
          </View>
        </View>
      </View>

      {/* 代理商入口 */}
      <View className="px-4 mt-3">
        <View 
          className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl p-4 shadow-lg relative overflow-hidden border border-blue-600"
          onClick={() => {
            trackProfileAction('agent_entry')
            Taro.navigateTo({ url: '/pagesDealer/agent/index' })
          }}
        >
          <View className="absolute -top-4 -right-4 w-20 h-20 bg-blue-400 bg-opacity-10 rounded-full" />
          <View className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-400 bg-opacity-10 rounded-full" />
          
          <View className="flex items-center justify-between relative z-10">
            <View className="flex items-center gap-3">
              <View className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-400 flex items-center justify-center shadow-md">
                <TrendingUp size={32} color="white" />
              </View>
              <View>
                <Text className="text-white font-bold text-lg">代理商中心</Text>
                <Text className="text-blue-200 text-sm mt-1">
                  {isAgent ? `${getAgentLevelName()} · 今日¥${todayCommission.toFixed(2)}` : '替客户下单赚5%提成'}
                </Text>
              </View>
            </View>
            <View className="flex items-center gap-1 bg-white rounded-full px-4 py-2 shadow-md">
              <Text className="text-blue-600 text-sm font-bold">{isAgent ? `${todayOrderCount}单` : '去下单'}</Text>
              <ChevronRight size={16} color="#2563EB" />
            </View>
          </View>
        </View>
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
                    onClick={() => {
                      if (item.path) {
                        navigateTo(item.path)
                      }
                    }}
                  >
                    <View className="flex items-center gap-3">
                      <View className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
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
                    onClick={() => {
                      if (item.action === 'privacy') {
                        Taro.showModal({
                          title: '隐私政策',
                          content: '邑夏果酒小程序重视您的隐私保护。我们仅收集必要信息（昵称、学校、年龄）用于订单配送和年龄验证，不会向第三方分享您的个人信息。您可随时在"设置"中删除账户数据。',
                          showCancel: false,
                          confirmText: '我知道了'
                        })
                      } else if (item.path) {
                        navigateTo(item.path)
                      }
                    }}
                  >
                    <View className="flex items-center gap-3">
                      <View className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Icon size={20} color="#8B5CF6" />
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

      {/* 管理员入口 */}
      {isAdmin && (
        <View className="px-4 mt-4">
          <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0">
            <CardContent className="p-4">
              <View 
                className="flex items-center justify-between"
                onClick={() => Taro.navigateTo({ url: '/pagesAdmin/admin/index' })}
              >
                <View className="flex items-center gap-3">
                  <View className="w-12 h-12 rounded-xl bg-white bg-opacity-20 flex items-center justify-center">
                    <Shield size={24} color="white" />
                  </View>
                  <View>
                    <Text className="text-white font-bold text-lg">邑夏老板台</Text>
                    <Text className="text-white text-opacity-80 text-sm mt-1">数据看板 · 生产调配 · 配货管理 · 活动上新</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="white" />
              </View>
            </CardContent>
          </Card>
        </View>
      )}

      {/* 版本号-隐藏管理员入口 */}
      <View className="text-center mt-4 mb-2" onClick={handleAdminTap}>
        <Text className="text-xs text-gray-400">邑夏 V2.0</Text>
      </View>

      {/* 退出登录 */}
      <View className="px-4 mt-2 mb-6">
        <Button variant="outline" className="w-full text-gray-700 border-purple-200" onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
          <LogOut size={18} color="#6B7280" />
          <Text>退出登录</Text>
        </Button>
      </View>

      {/* 管理员口令弹窗 */}
      {showAdminInput && (
        <View className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View className="absolute inset-0" onClick={() => setShowAdminInput(false)} />
          <View className="relative w-4/5 bg-white rounded-2xl p-6">
            <Text className="text-lg font-bold text-gray-900 block text-center mb-4">管理员口令</Text>
            <View className="bg-purple-50 rounded-xl px-4 py-3 mb-4">
              <input
                type="text"
                placeholder="请输入管理员口令"
                value={adminCode}
                onInput={(e) => setAdminCode((e as any).detail.value || '')}
                className="w-full bg-transparent text-gray-900 text-sm outline-none"
              />
            </View>
            <View className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl py-3 text-center" onClick={handleAdminActivate}>
              <Text className="text-white font-bold">确认激活</Text>
            </View>
            <View className="text-center mt-3" onClick={() => setShowAdminInput(false)}>
              <Text className="text-sm text-gray-400">取消</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
