import { View, Text, Image } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings, Bell, Gift, CreditCard, 
  MapPinned,   CircleQuestionMark, Share2, LogOut, ChevronRight,
  Package, Star, Ticket, Crown
} from 'lucide-react-taro'

const menuItems = [
  { id: 1, icon: Package, title: '我的订单', badge: '3', path: '/pages/orders/index' },
  { id: 2, icon: Ticket, title: '优惠券', badge: '5', path: '/pages/orders/index?tab=coupon' },
  { id: 3, icon: Star, title: '我的收藏', badge: null, path: '/pages/wall/index?tab=favorite' },
  { id: 4, icon: Gift, title: '精灵碎片', badge: '8', path: '/pages/sprites/index' }
]

const toolItems = [
  { id: 1, icon: MapPinned, title: '收货地址', path: '/pages/orders/index?tab=address' },
  { id: 2, icon: CreditCard, title: '支付方式', path: '/pages/orders/index?tab=payment' },
  { id: 3, icon: Bell, title: '消息通知', path: '/pages/orders/index?tab=notification' },
  { id: 4, icon:   CircleQuestionMark, title: '帮助与反馈', path: '/pages/orders/index?tab=help' },
  { id: 5, icon: Settings, title: '设置', path: '/pages/orders/index?tab=settings' }
]

export default function Profile() {
  const router = useRouter()

  const navigateTo = (path: string) => {
    router.push({ url: path })
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
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
              <Badge variant="secondary" className="text-xs bg-white bg-opacity-20 text-white border-0">
                <Crown size={12} className="mr-1" />
                普通会员
              </Badge>
            </View>
            <Text className="text-white text-opacity-80 text-sm mt-1">青岛农业大学 · 计算机学院</Text>
          </View>

          <Button 
            variant="ghost" 
            className="text-white text-sm bg-white bg-opacity-20"
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

      {/* 功能菜单 */}
      <View className="px-4 mt-4">
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <View key={item.id}>
                  <View 
                    className="flex items-center justify-between p-4"
                    onClick={() => navigateTo(item.path)}
                  >
                    <View className="flex items-center gap-3">
                      <View className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Icon size={20} className="text-primary" />
                      </View>
                      <Text className="text-sm font-medium text-gray-900">{item.title}</Text>
                      {item.badge && (
                        <Badge variant="destructive" className="text-xs ml-1">
                          {item.badge}
                        </Badge>
                      )}
                    </View>
                    <ChevronRight size={18} className="text-gray-400" />
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
                        <Icon size={20} className="text-gray-600" />
                      </View>
                      <Text className="text-sm font-medium text-gray-900">{item.title}</Text>
                    </View>
                    <ChevronRight size={18} className="text-gray-400" />
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
          <LogOut size={18} className="mr-2" />
          <Text>退出登录</Text>
        </Button>
      </View>

      {/* 分享入口 */}
      <View className="px-4 mb-6">
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100">
          <CardContent className="p-4 flex items-center justify-between">
            <View className="flex items-center gap-3">
              <Gift size={24} className="text-amber-500" />
              <View>
                <Text className="text-sm font-medium text-gray-900">分享邀请好友</Text>
                <Text className="text-xs text-gray-500 mt-1">邀请新用户可得优惠券</Text>
              </View>
            </View>
            <Button size="sm" variant="secondary" onClick={() => {}}>
              <Share2 size={14} className="mr-1" />
              <Text>分享</Text>
            </Button>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
