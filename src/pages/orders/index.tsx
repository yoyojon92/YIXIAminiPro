import { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Alert } from '@/components/ui/alert'
import { useCartStore } from '@/store/cartStore'
import { useUserProfileStore } from '@/store/userProfileStore'
import { generatePickupCode, formatPickupCode } from '@/utils/pickupCode'
import { getShopById } from '@/data/pickupShops'
import {
  Clock4, Truck, Package, CircleCheck, CircleX,
  Star, CircleAlert, Store, MapPin, Clock, Check
} from 'lucide-react-taro'

type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refund_pending' | 'refunded'

type DisputeReason = 'damaged' | 'wrong_item' | 'not_received' | 'other'

interface DisputeRecord {
  orderId: string
  reason: DisputeReason
  amount: number
  applyTime: string
  status: 'pending' | 'processed'
}

interface Order {
  id: string
  status: OrderStatus
  statusText: string
  shopName: string
  items: {
    name: string
    image: string
    price: number
    quantity: number
    specs: string
  }[]
  totalPrice: number
  deliveryFee: number
  createTime: string
  fragmentCount: number
  deliveryTime?: string
  dispute?: {
    reason: DisputeReason
    applyTime: string
  }
}

const orders: Order[] = [
  {
    id: 'ORD20240115001',
    status: 'pending',
    statusText: '待付款',
    shopName: '邑夏官方旗舰店',
    items: [
      { name: '蜜桃精灵果酒 330ml', image: '🍑', price: 29.9, quantity: 1, specs: '蜜桃味' }
    ],
    totalPrice: 29.9,
    deliveryFee: 3,
    createTime: '2024-01-15 14:30',
    fragmentCount: 2
  },
  {
    id: 'ORD20240114002',
    status: 'shipped',
    statusText: '待收货',
    shopName: '邑夏官方旗舰店',
    items: [
      { name: '蓝莓精灵果汁 250ml', image: '🫐', price: 19.9, quantity: 2, specs: '蓝莓味' }
    ],
    totalPrice: 39.8,
    deliveryFee: 0,
    createTime: '2024-01-14 10:20',
    fragmentCount: 1
  },
  {
    id: 'ORD20240113003',
    status: 'completed',
    statusText: '已完成',
    shopName: '邑夏官方旗舰店',
    items: [
      { name: '草莓精灵气泡酒 280ml', image: '🍓', price: 24.9, quantity: 1, specs: '草莓味' },
      { name: '柠檬精灵轻饮酒 250ml', image: '🍋', price: 22.9, quantity: 1, specs: '柠檬味' }
    ],
    totalPrice: 47.8,
    deliveryFee: 3,
    createTime: '2024-01-13 16:45',
    fragmentCount: 3
  }
]

const statusConfig: Record<OrderStatus, { text: string; color: string; icon: any }> = {
  pending: { text: '待付款', color: 'text-amber-500', icon: Clock4 },
  paid: { text: '待发货', color: 'text-blue-500', icon: Package },
  shipped: { text: '待收货', color: 'text-purple-500', icon: Truck },
  delivered: { text: '已发货', color: 'text-purple-500', icon: Truck },
  completed: { text: '已完成', color: 'text-green-500', icon: CircleCheck },
  cancelled: { text: '已取消', color: 'text-gray-400', icon: CircleX },
  refund_pending: { text: '退款中', color: 'text-orange-500', icon: CircleAlert },
  refunded: { text: '已退款', color: 'text-red-500', icon: CircleX }
}

const tabList = [
  { key: 'all', title: '全部' },
  { key: 'pending', title: '待付款' },
  { key: 'shipped', title: '待收货' },
  { key: 'completed', title: '已完成' }
]

// 用户退款记录（防恶意退款，每月3次）
const userRefundRecords: DisputeRecord[] = []
const MAX_REFUND_PER_MONTH = 3

export default function Orders() {
  const [activeTab, setActiveTab] = useState('all')
  const [isCheckout, setIsCheckout] = useState(false)
  const [pickupCode, setPickupCode] = useState<string | null>(null)
  const [showDisputeModal, setShowDisputeModal] = useState(false)
  const [selectedDisputeOrder, setSelectedDisputeOrder] = useState<Order | null>(null)
  const [selectedReason, setSelectedReason] = useState<DisputeReason | null>(null)
  
  const cartStore = useCartStore()
  const profileStore = useUserProfileStore()
  const { items, totalAmount, delivery, selectedCoupon, finalAmount } = cartStore
  
  // 从URL参数判断是否是结算模式
  useDidShow(() => {
    const pages = Taro.getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const type = (currentPage as any)?.options?.type
    if (type === 'checkout') {
      setIsCheckout(true)
    }
  })

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => {
        if (activeTab === 'pending') return order.status === 'pending' || order.status === 'paid'
        if (activeTab === 'shipped') return order.status === 'shipped' || order.status === 'delivered'
        if (activeTab === 'completed') return order.status === 'completed'
        return true
      })

  const getStatusConfig = (status: OrderStatus) => statusConfig[status]

  // 检查本月退款次数
  const getThisMonthRefundCount = () => {
    const now = new Date()
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return userRefundRecords.filter(r => r.applyTime.startsWith(thisMonth)).length
  }

  // 申请退款
  const applyRefund = (order: Order, reason: DisputeReason) => {
    // 检查是否超过24小时（简化：直接允许，实际应检查 deliveryTime）
    const refundCount = getThisMonthRefundCount()
    if (refundCount >= MAX_REFUND_PER_MONTH) {
      Taro.showModal({
        title: '已达上限',
        content: `本月已申请${refundCount}次退款，超过每月3次上限，需人工审核`,
        showCancel: false
      })
      return
    }

    // 人工处理的情况
    if (reason === 'not_received') {
      Taro.showModal({
        title: '人工处理中',
        content: '您的申请已提交，客服将在24小时内联系您确认',
        showCancel: false
      })
      setShowDisputeModal(false)
      return
    }

    // 其他原因自动退款
    const refundAmount = order.totalPrice // 只退商品款，不退配送费
    userRefundRecords.push({
      orderId: order.id,
      reason,
      amount: refundAmount,
      applyTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'processed'
    })

    // 更新订单状态
    const orderIndex = orders.findIndex(o => o.id === order.id)
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'refund_pending'
      orders[orderIndex].statusText = '退款中'
      orders[orderIndex].dispute = {
        reason,
        applyTime: new Date().toISOString().slice(0, 16).replace('T', ' ')
      }
    }

    setShowDisputeModal(false)
    Taro.showToast({ title: '退款申请已提交', icon: 'success' })
  }

  // 确认收货
  const confirmReceive = (order: Order) => {
    const orderIndex = orders.findIndex(o => o.id === order.id)
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'completed'
      orders[orderIndex].statusText = '已完成'
      orders[orderIndex].deliveryTime = new Date().toISOString().slice(0, 16).replace('T', ' ')
    }
    Taro.showToast({ title: '确认收货成功', icon: 'success' })
  }

  // 打开纠纷处理弹窗
  const openDisputeModal = (order: Order) => {
    setSelectedDisputeOrder(order)
    setSelectedReason(null)
    setShowDisputeModal(true)
  }

  // 结算模式 - 确认订单
  const handleCheckoutConfirm = () => {
    // 生成取餐码
    const code = generatePickupCode()
    setPickupCode(code)
    
    // 埋点：取餐码已生成
    profileStore.recordPageView?.('pickup_code_generated')
    console.log('[埋点] 取餐码生成', {
      userId: 'user_001',
      pickupCode: code,
      deliveryType: delivery.type,
      shopId: delivery.pickupShopId,
      amount: finalAmount(),
      action: 'pickup_code_generated',
      timestamp: Date.now()
    })
  }

  // 结算模式 - 确认取餐
  const handlePickupConfirm = () => {
    // 埋点：用户确认取餐
    console.log('[埋点] 用户确认取餐', {
      userId: 'user_001',
      pickupCode,
      action: 'pickup_confirmed',
      timestamp: Date.now()
    })
    
    Taro.showToast({ title: '取餐码已生成', icon: 'success' })
  }

  // 获取自提点信息
  const pickupShop = delivery.pickupShopId ? getShopById(delivery.pickupShopId) : null

  // 结算模式UI
  if (isCheckout) {
    const couponDiscount = selectedCoupon ? selectedCoupon.discount : 0
    const deliveryFee = delivery.type === 'dormitory' ? 3 : 0
    const totalPrice = totalAmount()
    const payAmount = Math.max(0, totalPrice + deliveryFee - couponDiscount)
    
    return (
      <View className="min-h-screen bg-gray-50 pb-32">
        {/* 头部 */}
        <View className="bg-white px-4 py-3 border-b border-gray-100">
          <Text className="text-lg font-semibold text-gray-900">确认订单</Text>
        </View>

        {/* 自提信息（自提模式） */}
        {delivery.type === 'self_pickup' && (
          <View className="px-4 py-4 bg-white mt-2">
            <View className="flex items-center gap-2 mb-3">
              <Store size={18} color="#8B5CF6" />
              <Text className="text-sm font-medium text-gray-700">自提信息</Text>
            </View>
            <Card>
              <CardContent className="p-3">
                <Text className="block text-sm font-medium text-gray-900">{pickupShop?.name}</Text>
                <View className="flex items-start gap-1 mt-1">
                  <MapPin size={12} color="#9CA3AF" />
                  <Text className="text-xs text-gray-500">{pickupShop?.address}</Text>
                </View>
                <View className="flex items-center gap-3 mt-2">
                  <View className="flex items-center gap-1">
                    <Clock size={12} color="#8B5CF6" />
                    <Text className="text-xs text-primary">{pickupShop?.hours}</Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        )}

        {/* 商品列表 */}
        <View className="px-4 py-4 bg-white mt-2">
          <Text className="text-sm font-medium text-gray-700 mb-3">商品清单</Text>
          {items.map((item) => (
            <View key={item.id} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
              <Image src={item.image} mode="aspectFit" className="w-16 h-16 rounded-lg" />
              <View className="flex-1">
                <Text className="text-sm text-gray-900 line-clamp-1">{item.name}</Text>
                <Text className="text-xs text-gray-500 mt-1">{item.spec}</Text>
                <View className="flex items-center justify-between mt-1">
                  <Text className="text-sm text-primary font-medium">¥{item.price}</Text>
                  <Text className="text-xs text-gray-500">x{item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 费用明细 */}
        <View className="px-4 py-4 bg-white mt-2">
          <View className="space-y-2">
            <View className="flex justify-between text-sm">
              <Text className="text-gray-500">商品总价</Text>
              <Text className="text-gray-900">¥{totalPrice.toFixed(2)}</Text>
            </View>
            <View className="flex justify-between text-sm">
              <Text className="text-gray-500">配送费</Text>
              <Text className="text-gray-900">{deliveryFee > 0 ? `+¥${deliveryFee.toFixed(2)}` : '免配送费'}</Text>
            </View>
            {selectedCoupon && (
              <View className="flex justify-between text-sm">
                <Text className="text-primary">代券抵扣</Text>
                <Text className="text-primary">-¥{couponDiscount.toFixed(2)}</Text>
              </View>
            )}
            <Separator />
            <View className="flex justify-between">
              <Text className="text-gray-900 font-medium">实付金额</Text>
              <Text className="text-primary font-bold text-lg">¥{payAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* 取餐码展示（已生成） */}
        {pickupCode && delivery.type === 'self_pickup' && (
          <View className="px-4 py-4 bg-white mt-2">
            <Alert variant="default" className="bg-green-50 border-green-200 mb-4">
              <View className="flex items-center gap-2">
                <Check size={18} color="#10B981" />
                <Text className="text-sm text-green-700">订单已确认，请凭取餐码到店取货</Text>
              </View>
            </Alert>
            
            <View className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-center">
              <Text className="text-white text-sm mb-2">取餐码</Text>
              <Text className="text-white text-4xl font-bold tracking-widest">
                {formatPickupCode(pickupCode)}
              </Text>
              <Text className="text-white text-opacity-80 text-xs mt-4">
                取餐时请出示此码
              </Text>
            </View>
            
            <Button 
              className="w-full mt-4" 
              onClick={handlePickupConfirm}
            >
              <Text>我已知晓</Text>
            </Button>
          </View>
        )}

        {/* 底部结算按钮 */}
        {!pickupCode && (
          <View 
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 pb-safe"
            style={{ zIndex: 100 }}
          >
            <View className="flex items-center gap-4 mb-3">
              <View className="flex-1 text-right">
                <Text className="text-sm text-gray-500">合计：</Text>
                <View className="flex items-baseline justify-end gap-1">
                  <Text className="text-primary font-bold text-xl">¥{payAmount.toFixed(2)}</Text>
                </View>
              </View>
            </View>
            
            <Button 
              className="w-full" 
              size="lg"
              disabled={delivery.type === 'self_pickup' && !delivery.pickupShopId}
              onClick={handleCheckoutConfirm}
            >
              <Text>确认订单</Text>
            </Button>
          </View>
        )}
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-gray-50 pb-safe">
      {/* Tab切换 */}
      <View className="bg-white sticky top-0 z-50">
        <View className="flex">
          {tabList.map((tab) => (
            <View
              key={tab.key}
              className={`flex-1 py-3 text-center text-sm font-medium border-b-2 ${
                activeTab === tab.key
                  ? 'text-primary border-primary'
                  : 'text-gray-500 border-transparent'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text>{tab.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 订单列表 */}
      <View className="px-4 py-4">
        {filteredOrders.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-20">
            <CircleAlert size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mb-2">暂无订单</Text>
            <Text className="text-gray-400 text-sm mb-6">快去选购心仪的商品吧</Text>
            <Button onClick={() => Taro.switchTab({ url: '/pages/index/index' })}>
              <Text>去购物</Text>
            </Button>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const config = getStatusConfig(order.status)
            const StatusIcon = config.icon
            return (
              <Card key={order.id} className="mb-4">
                <CardContent className="p-0">
                  {/* 订单头部 */}
                  <View className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <Text className="text-sm text-gray-500">{order.shopName}</Text>
                    <View className={`flex items-center gap-1 ${config.color}`}>
                      <StatusIcon size={14} color="#8B5CF6" />
                      <Text className="text-sm font-medium">{config.text}</Text>
                    </View>
                  </View>

                  {/* 商品列表 */}
                  <View className="p-4">
                    {order.items.map((item, index) => (
                      <View key={index} className="flex gap-3 mb-3 last:mb-0">
                        <Image src={item.image} mode="aspectFit" className="w-20 h-20 rounded-lg" />
                        <View className="flex-1">
                          <Text className="text-sm text-gray-900 font-medium line-clamp-1">{item.name}</Text>
                          <Text className="text-xs text-gray-500 mt-1">{item.specs}</Text>
                          <View className="flex items-center justify-between mt-2">
                            <Text className="text-sm text-gray-900">¥{item.price}</Text>
                            <Text className="text-sm text-gray-500">x{item.quantity}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* 精灵碎片 */}
                  {order.fragmentCount > 0 && (
                    <View className="px-4 py-2 bg-purple-50 mx-4 mb-3 rounded-lg flex items-center gap-2">
                      <Star size={14} color="#8B5CF6" />
                      <Text className="text-xs text-primary">获得 {order.fragmentCount} 精灵碎片</Text>
                    </View>
                  )}

                  <Separator />

                  {/* 订单底部 */}
                  <View className="px-4 py-3 flex items-center justify-between">
                    <View className="text-right">
                      <Text className="text-xs text-gray-500">共 {order.items.reduce((sum, item) => sum + item.quantity, 0)} 件</Text>
                      <View className="flex items-baseline gap-1 mt-1">
                        <Text className="text-sm text-gray-500">实付款：</Text>
                        <Text className="text-lg font-bold text-gray-900">¥{(order.totalPrice + order.deliveryFee).toFixed(2)}</Text>
                      </View>
                    </View>
                    
                    <View className="flex gap-2">
                      {order.status === 'pending' && (
                        <>
                          <Button variant="outline" size="sm" className="px-4">
                            <Text className="text-xs">取消</Text>
                          </Button>
                          <Button size="sm" className="px-4">
                            <Text className="text-xs">去付款</Text>
                          </Button>
                        </>
                      )}
                      {order.status === 'shipped' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="px-4"
                            onClick={() => Taro.navigateTo({ url: '/pages/tracking/index' })}
                          >
                            <Text className="text-xs">查看物流</Text>
                          </Button>
                          <Button size="sm" className="px-4">
                            <Text className="text-xs" onClick={() => confirmReceive(order)}>确认收货</Text>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-orange-500 px-2"
                            onClick={() => openDisputeModal(order)}
                          >
                            <Text className="text-xs">有问题？</Text>
                          </Button>
                        </>
                      )}
                      {order.status === 'completed' && (
                        <>
                          <Button variant="outline" size="sm" className="px-4">
                            <Text className="text-xs">再次购买</Text>
                          </Button>
                          <Button variant="secondary" size="sm" className="px-4">
                            <Star size={12} className="mr-1" color="#8B5CF6" />
                            <Text className="text-xs">评价</Text>
                          </Button>
                        </>
                      )}
                    </View>
                  </View>
                </CardContent>
              </Card>
            )
          })
        )}
      </View>

      {/* 纠纷处理弹窗 */}
      {showDisputeModal && selectedDisputeOrder && (
        <View className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <View className="bg-white rounded-2xl w-full max-w-sm p-4">
            <Text className="block text-lg font-bold text-center mb-4">遇到问题？</Text>
            
            <View className="space-y-2 mb-4">
              <Text className="block text-sm text-gray-600 mb-2">请选择遇到的问题：</Text>
              
              <View 
                className={`p-3 rounded-lg border ${selectedReason === 'damaged' ? 'border-primary bg-primary-50' : 'border-gray-200'}`}
                onClick={() => setSelectedReason('damaged')}
              >
                <Text className={`block text-sm ${selectedReason === 'damaged' ? 'text-primary font-medium' : 'text-gray-700'}`}>
                  商品破损/洒漏（自动退款）
                </Text>
                <Text className="block text-xs text-gray-400 mt-1">
                  退款金额：¥{selectedDisputeOrder.totalPrice.toFixed(2)}（不含配送费）
                </Text>
              </View>
              
              <View 
                className={`p-3 rounded-lg border ${selectedReason === 'wrong_item' ? 'border-primary bg-primary-50' : 'border-gray-200'}`}
                onClick={() => setSelectedReason('wrong_item')}
              >
                <Text className={`block text-sm ${selectedReason === 'wrong_item' ? 'text-primary font-medium' : 'text-gray-700'}`}>
                  送错商品（自动退款）
                </Text>
              </View>
              
              <View 
                className={`p-3 rounded-lg border ${selectedReason === 'not_received' ? 'border-primary bg-primary-50' : 'border-gray-200'}`}
                onClick={() => setSelectedReason('not_received')}
              >
                <Text className={`block text-sm ${selectedReason === 'not_received' ? 'text-primary font-medium' : 'text-gray-700'}`}>
                  未收到商品（人工处理）
                </Text>
                <Text className="block text-xs text-gray-400 mt-1">
                  客服将在24小时内联系您
                </Text>
              </View>
              
              <View 
                className={`p-3 rounded-lg border ${selectedReason === 'other' ? 'border-primary bg-primary-50' : 'border-gray-200'}`}
                onClick={() => setSelectedReason('other')}
              >
                <Text className={`block text-sm ${selectedReason === 'other' ? 'text-primary font-medium' : 'text-gray-700'}`}>
                  其他问题
                </Text>
                <Text className="block text-xs text-gray-400 mt-1">
                  联系客服处理
                </Text>
              </View>
            </View>

            <View className="flex gap-3">
              <View className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowDisputeModal(false)}
                >
                  <Text className="text-sm">取消</Text>
                </Button>
              </View>
              <View className="flex-1">
                <Button 
                  className="w-full"
                  disabled={!selectedReason}
                  onClick={() => selectedReason && applyRefund(selectedDisputeOrder, selectedReason)}
                >
                  <Text className="text-sm">提交</Text>
                </Button>
              </View>
            </View>

            <Text className="block text-xs text-gray-400 text-center mt-3">
              每月最多3次自动退款，超出需人工审核
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}
