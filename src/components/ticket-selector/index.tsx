import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import { useMemberStore, TICKET_WINE_NAMES, TICKET_WINE_IDS } from '@/store/memberStore'
import { useCartStore } from '@/store/cartStore'
import { getProductById } from '@/mock/products'
import { Crown, ShoppingCart } from 'lucide-react-taro'
import Taro from '@tarojs/taro'

export function TicketSelector() {
  const {
    showTicketModal,
    setShowTicketModal,
    canClaimTicket,
    claimTicket,
    ticketSelectedWine,
  } = useMemberStore()
  const cartStore = useCartStore()
  const [selectedWineId, setSelectedWineId] = useState<string | null>(null)

  if (!showTicketModal) return null

  const wines = TICKET_WINE_IDS.map(id => ({
    id,
    name: TICKET_WINE_NAMES[id],
    product: getProductById(id),
  }))

  /** 确认领取 - 1元加到购物车 */
  const handleConfirm = () => {
    if (!selectedWineId) { Taro.showToast({ title: '请选择一款酒', icon: 'none' }); return }
    const wine = wines.find(w => w.id === selectedWineId)
    if (wine && wine.product) {
      claimTicket(selectedWineId)
      // 将1元小酒票商品加入购物车
      cartStore.addItem({
        id: `ticket_${wine.id}`,
        productId: wine.id,
        name: `${wine.name}（1元小酒票）`,
        price: 1,
        originalPrice: wine.product.price || 16.8,
        spec: wine.product.specs?.[0]?.name || '330ml',
        quantity: 1,
        image: wine.product.images[0],
        maxQuantity: 1,
        isGift: false,
        isTicket: true,
      })
      setShowTicketModal(false)
      Taro.showToast({ title: '已加入购物车', icon: 'success' })
    }
  }

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <View className="absolute inset-0" onClick={() => setShowTicketModal(false)} />
      <View className="relative w-11/12 max-w-sm rounded-3xl overflow-hidden" style={{ backgroundColor: '#FAF5FF' }}>
        {/* 标题 */}
        <View className="pt-6 pb-4 px-5 text-center">
          <View className="flex items-center justify-center gap-2 mb-2">
            <Crown size={22} color="#FBBF24" />
            <Text className="block text-xl font-bold text-white">你的1元小酒票</Text>
          </View>
          <Text className="text-sm text-gray-400">本月已领：{ticketSelectedWine ? TICKET_WINE_NAMES[ticketSelectedWine] : '未领取'}</Text>
          <Text className="text-xs text-gray-500 mt-1">自提无门槛 | 同城满50 | 非同城满30</Text>
        </View>

        {/* 老款酒选择 */}
        <View className="px-5 pb-4">
          <Text className="text-sm text-gray-600 mb-3">选一款老款酒（330ml）：</Text>
          <View className="">
            {wines.map((wine) => {
              const isSelected = selectedWineId === wine.id
              const isClaimed = ticketSelectedWine === wine.id
              return (
                <View
                  key={wine.id}
                  className={`p-3 rounded-xl border-2 flex items-center gap-3 ${
                    isSelected ? 'border-purple-500 bg-purple-500 bg-opacity-10'
                    : isClaimed ? 'border-green-500 bg-green-500 bg-opacity-10'
                    : 'border-purple-200 bg-white'
                  }`}
                  onClick={() => !isClaimed && setSelectedWineId(wine.id)}
                >
                  {wine.product && <Image src={wine.product.images[0]} className="w-14 h-14 rounded-lg" mode="aspectFill" />}
                  <View className="flex-1">
                    <Text className="text-sm text-white font-medium">{wine.name}</Text>
                    <View className="flex items-center gap-2 mt-1">
                      <Text className="text-xs text-gray-400">原价¥{wine.product?.price}</Text>
                      <Text className="text-xs text-green-400 font-bold">1元加购</Text>
                    </View>
                  </View>
                  {isClaimed && <View className="bg-green-500 text-white text-xs px-2 py-1 rounded">已领</View>}
                  {isSelected && !isClaimed && <View className="bg-purple-500 text-white text-xs px-2 py-1 rounded">选中</View>}
                  {!isSelected && !isClaimed && <View className="w-5 h-5 rounded-full border-2 border-slate-600" />}
                </View>
              )
            })}
          </View>
        </View>

        {/* 底部按钮 */}
        <View className="p-5 pt-2">
          {canClaimTicket() ? (
            <View className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A855F7)' }} onClick={handleConfirm}>
              <View className="py-3 flex items-center justify-center gap-2">
                <ShoppingCart size={16} color="white" />
                <Text className="text-white font-semibold">1元加入购物车</Text>
              </View>
            </View>
          ) : (
            <View className="rounded-xl overflow-hidden bg-slate-700 py-3 text-center" onClick={() => setShowTicketModal(false)}>
              <Text className="text-gray-400 text-sm">本月已领取过，下月1号可再次领取</Text>
            </View>
          )}
          <View className="mt-3 text-center" onClick={() => setShowTicketModal(false)}>
            <Text className="text-sm text-gray-500">暂不领取（当月不领自动失效）</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
