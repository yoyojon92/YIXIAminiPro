import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCouponStore } from '@/store/couponStore'
import { Ticket, Calendar, ChevronRight } from 'lucide-react-taro'
import type { Coupon } from '@/data/coupons'

type TabType = 'all' | 'unused' | 'used' | 'expired'

export default function Coupons() {
  const [activeTab, setActiveTab] = useState<TabType>('all')
  const { coupons, selectCoupon } = useCouponStore()

  // 过滤不同状态的券
  const allCoupons = coupons
  const unusedCoupons = coupons.filter(c => !c.isUsed)
  const usedCoupons = coupons.filter(c => c.isUsed)
  const expiredCoupons = coupons.filter(c => !c.isUsed && (Date.now() - ((c as any).receivedAt || 0) > c.expireDays * 86400000))

  const getDisplayCoupons = (): Coupon[] => {
    switch (activeTab) {
      case 'unused': return unusedCoupons
      case 'used': return usedCoupons
      case 'expired': return expiredCoupons
      default: return allCoupons
    }
  }

  const displayCoupons = getDisplayCoupons()

  const handleUseCoupon = (coupon: Coupon) => {
    selectCoupon(coupon.id)
    Taro.showToast({ title: '已选中代券', icon: 'success' })
    setTimeout(() => {
      Taro.switchTab({ url: '/pages/cart/index' })
    }, 1000)
  }

  const goToShop = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  const getCouponTag = (coupon: Coupon) => {
    switch (coupon.type) {
      case 'new_user': return { text: '新人券', color: '#10B981' }
      case 'share': return { text: '分享券', color: '#3B82F6' }
      case 'first_order': return { text: '首单券', color: '#F59E0B' }
      case 'member_monthly': return { text: '会员券', color: '#8B5CF6' }
      default: return { text: '优惠券', color: '#6B7280' }
    }
  }

  const renderCouponCard = (coupon: Coupon, _index: number) => {
    const tag = getCouponTag(coupon)
    const isExpired = !coupon.isUsed && (Date.now() - ((coupon as any).receivedAt || 0) > coupon.expireDays * 86400000)
    const isDisabled = coupon.isUsed || isExpired

    return (
      <Card 
        key={coupon.id} 
        className={`mb-3 ${isDisabled ? 'opacity-60' : ''}`}
        style={isDisabled ? { backgroundColor: '#F9FAFB' } : {}}
      >
        <CardContent className="p-4">
          <View className="flex">
            {/* 左侧金额 */}
            <View className="w-24 py-2 flex flex-col items-center justify-center" style={{ borderRight: '1px dashed #E5E7EB' }}>
              <Text className="text-2xl font-bold" style={{ color: isDisabled ? '#9CA3AF' : '#8B5CF6' }}>
                ¥{coupon.discount}
              </Text>
              <Text className="text-xs text-gray-400 mt-1">满{coupon.minSpend}元可用</Text>
            </View>

            {/* 右侧信息 */}
            <View className="flex-1 pl-4">
              <View className="flex items-center justify-between">
                <View className="flex items-center gap-2">
                  <Text className="text-lg">{coupon.icon}</Text>
                  <Text className="font-medium text-gray-900">{coupon.name}</Text>
                </View>
                <Badge 
                  className="text-xs"
                  style={{ backgroundColor: tag.color + '20', color: tag.color }}
                >
                  {tag.text}
                </Badge>
              </View>

              <Text className="text-xs text-gray-500 mt-1">{coupon.description}</Text>

              <View className="flex items-center justify-between mt-3">
                <View className="flex items-center gap-1">
                  <Calendar size={12} color="#9CA3AF" />
                  <Text className="text-xs text-gray-400">
                    {isExpired ? '已过期' : coupon.isUsed ? '已使用' : `有效期${coupon.expireDays}天`}
                  </Text>
                </View>

                {!isDisabled && (
                  <View 
                    className="flex items-center"
                    onClick={() => handleUseCoupon(coupon)}
                  >
                    <Text className="text-sm font-medium" style={{ color: '#8B5CF6' }}>去使用</Text>
                    <ChevronRight size={16} color="#8B5CF6" />
                  </View>
                )}
                {coupon.isUsed && (
                  <Badge variant="secondary" className="text-xs">
                    <Ticket size={10} color="#9CA3AF" />
                    <Text className="ml-1">已使用</Text>
                  </Badge>
                )}
                {isExpired && !coupon.isUsed && (
                  <Badge variant="secondary" className="text-xs bg-gray-100">
                    <Text className="text-gray-400">已过期</Text>
                  </Badge>
                )}
              </View>
            </View>
          </View>
        </CardContent>
      </Card>
    )
  }

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'all', label: '全部', count: allCoupons.length },
    { key: 'unused', label: '未使用', count: unusedCoupons.length },
    { key: 'used', label: '已使用', count: usedCoupons.length },
    { key: 'expired', label: '已过期', count: expiredCoupons.length },
  ]

  return (
    <View className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <View className="bg-white px-4 py-3 sticky top-0 z-50">
        <Text className="text-lg font-semibold text-gray-900">我的优惠券</Text>
      </View>

      {/* Tab切换 */}
      <View className="bg-white px-4 border-b border-gray-100">
        <View className="flex">
          {tabs.map((tab) => (
            <View
              key={tab.key}
              className="flex-1 py-3 text-center relative"
              onClick={() => setActiveTab(tab.key)}
            >
              <Text 
                className={`text-sm font-medium ${
                  activeTab === tab.key ? 'text-primary' : 'text-gray-500'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <Text className={`ml-1 ${activeTab === tab.key ? 'text-primary' : 'text-gray-400'}`}>
                    ({tab.count})
                  </Text>
                )}
              </Text>
              {activeTab === tab.key && (
                <View className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* 优惠券列表 */}
      <View className="px-4 py-4">
        {displayCoupons.length > 0 ? (
          displayCoupons.map((coupon, index) => renderCouponCard(coupon, index))
        ) : (
          <View className="py-16 text-center">
            <Ticket size={48} color="#D1D5DB" className="mx-auto mb-4" />
            <Text className="block text-gray-400 mb-2">暂无优惠券</Text>
            <Text className="block text-gray-300 text-sm">去逛逛获取更多优惠</Text>
            <Button 
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 border-0"
              onClick={goToShop}
            >
              <Text className="text-white">去购物</Text>
            </Button>
          </View>
        )}
      </View>
    </View>
  )
}
