import { View, Text, Image } from '@tarojs/components'
import { useState } from 'react'
import { useMemberStore, TICKET_WINE_IDS, TICKET_WINE_NAMES } from '@/store/memberStore'
import { getProductById } from '@/mock/products'
import { useCartStore } from '@/store/cartStore'
import { Gift, MapPin, Truck, CheckCircle, Copy, ShoppingCart } from 'lucide-react-taro'
import Taro from '@tarojs/taro'

const GIFT_WINE_IDS = [...TICKET_WINE_IDS]
const GIFT_WINE_NAMES = { ...TICKET_WINE_NAMES }

type Step = 1 | 2 | 3

export function WelcomeGiftModal() {
  const {
    showWelcomeGiftModal,
    setShowWelcomeGiftModal,
    welcomeGiftRedeemed,
    claimWelcomeGiftWithWine,
  } = useMemberStore()
  const cartStore = useCartStore()

  const [step, setStep] = useState<Step>(1)
  const [selectedWineId, setSelectedWineId] = useState<string | null>(null)
  const [selectedMode, setSelectedMode] = useState<'pickup' | 'delivery' | null>(null)
  const [redeemCode, setRedeemCode] = useState('')
  const [deliveryMode, setDeliveryMode] = useState<'pickup' | 'delivery' | null>(null)

  if (!showWelcomeGiftModal) return null

  const wines = GIFT_WINE_IDS.map(id => ({
    id,
    name: GIFT_WINE_NAMES[id],
    product: getProductById(id),
  }))

  const handleClose = () => setShowWelcomeGiftModal(false)

  /** 步骤1：选酒 */
  const handleSelectWine = () => {
    if (!selectedWineId) { Taro.showToast({ title: '请选择一款酒', icon: 'none' }); return }
    setStep(2)
  }

  /** 步骤2：选配送方式后处理 */
  const handleConfirmMode = () => {
    if (!selectedMode) { Taro.showToast({ title: '请选择领取方式', icon: 'none' }); return }
    if (!selectedWineId) return

    // 调用store记录赠饮信息
    const code = claimWelcomeGiftWithWine(selectedWineId, selectedMode)
    setDeliveryMode(selectedMode)

    if (selectedMode === 'pickup') {
      // 自提：直接生成核销码
      setRedeemCode(code || '')
      setStep(3)
    } else {
      // 配送/邮寄：将¥0赠饮酒加入购物车，跳转到购物车结算
      const wine = wines.find(w => w.id === selectedWineId)
      if (wine && wine.product) {
        cartStore.addItem({
          id: `gift_${wine.id}`,
          productId: wine.id,
          name: `${wine.name}（入会赠饮）`,
          price: 0,
          originalPrice: wine.product.price || 16.8,
          spec: wine.product.specs?.[0]?.name || '330ml',
          quantity: 1,
          image: wine.product.images[0],
          maxQuantity: 1,
          isGift: true,
        })
      }
      setShowWelcomeGiftModal(false)
      Taro.showToast({ title: '赠饮已加入购物车，请去结算', icon: 'none', duration: 2000 })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/cart/index' })
      }, 1500)
    }
  }

  const handleCopyCode = () => {
    if (redeemCode) Taro.setClipboardData({ data: redeemCode })
  }

  if (welcomeGiftRedeemed) {
    return (
      <View className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
        <View className="absolute inset-0" onClick={handleClose} />
        <View className="relative w-11/12 max-w-sm rounded-3xl overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
          <View className="pt-8 pb-6 px-5 text-center">
            <CheckCircle size={48} color="#22C55E" />
            <Text className="block text-xl font-bold text-white mt-4">赠饮已核销</Text>
            <Text className="block text-sm text-gray-400 mt-2">感谢您的支持，祝您品酒愉快！</Text>
          </View>
          <View className="p-5 pt-2">
            <View className="rounded-xl bg-slate-800 py-3 text-center" onClick={handleClose}>
              <Text className="text-gray-300 text-sm">关闭</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <View className="absolute inset-0" onClick={handleClose} />
      <View className="relative w-11/12 max-w-sm rounded-3xl overflow-hidden" style={{ backgroundColor: '#1E293B' }}>
        {/* 标题 */}
        <View className="pt-6 pb-3 px-5 text-center">
          <View className="flex items-center justify-center gap-2 mb-1">
            <Gift size={22} color="#FBBF24" />
            <Text className="text-xl font-bold text-white">入会赠饮</Text>
          </View>
          <Text className="text-sm text-gray-400">开通创始会员，赠送1瓶老款果酒</Text>
        </View>

        {/* 步骤指示器 */}
        <View className="flex items-center justify-center gap-2 px-5 mb-4">
          {[1,2,3].map(s => (
            <View key={s} className="flex items-center gap-2">
              <View className={`w-7 h-7 rounded-full flex items-center justify-center ${step >= s ? 'bg-amber-500' : 'bg-slate-700'}`}>
                <Text className={`text-xs font-bold ${step >= s ? 'text-gray-900' : 'text-gray-500'}`}>{s}</Text>
              </View>
              {s < 3 && <View className={`w-8 h-0.5 ${step > s ? 'bg-amber-500' : 'bg-slate-700'}`} />}
            </View>
          ))}
        </View>

        {/* 步骤1：选酒 */}
        {step === 1 && (
          <View className="px-5 pb-4">
            <Text className="text-sm text-gray-300 mb-3">选择你想要的赠饮（330ml老款）：</Text>
            <View className="">
              {wines.map(wine => {
                const sel = selectedWineId === wine.id
                return (
                  <View key={wine.id} className={`p-3 rounded-xl border-2 flex items-center gap-3 ${sel ? 'border-amber-500 bg-amber-500 bg-opacity-10' : 'border-slate-700 bg-slate-800'}`} onClick={() => setSelectedWineId(wine.id)}>
                    {wine.product && <Image src={wine.product.images[0]} className="w-14 h-14 rounded-lg" mode="aspectFill" />}
                    <View className="flex-1">
                      <Text className="text-sm text-white font-medium">{wine.name}</Text>
                      <Text className="text-xs text-green-400 mt-1">免费赠送</Text>
                    </View>
                    {sel ? <View className="bg-amber-500 text-gray-900 text-xs px-2 py-1 rounded font-bold">选中</View> : <View className="w-5 h-5 rounded-full border-2 border-slate-600" />}
                  </View>
                )
              })}
            </View>
            <View className="mt-4">
              <View className="rounded-xl overflow-hidden py-3 text-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }} onClick={handleSelectWine}>
                <Text className="text-gray-900 font-semibold">下一步</Text>
              </View>
            </View>
          </View>
        )}

        {/* 步骤2：选领取方式 */}
        {step === 2 && (
          <View className="px-5 pb-4">
            <Text className="text-sm text-gray-300 mb-3">选择领取方式：</Text>
            <View className="">
              {/* 同城自提 */}
              <View className={`p-4 rounded-xl border-2 ${selectedMode === 'pickup' ? 'border-green-500 bg-green-500 bg-opacity-10' : 'border-slate-700 bg-slate-800'}`} onClick={() => setSelectedMode('pickup')}>
                <View className="flex items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-green-500 bg-opacity-20 flex items-center justify-center"><MapPin size={20} color="#22C55E" /></View>
                  <View className="flex-1">
                    <Text className="text-white font-medium">同城自提（免运费）</Text>
                    <Text className="text-xs text-gray-400 mt-1">凭取货码到店，出示给店员扫码领取</Text>
                  </View>
                  {selectedMode === 'pickup' && <View className="bg-green-500 text-white text-xs px-2 py-1 rounded">选中</View>}
                </View>
              </View>

              {/* 需要配送 */}
              <View className={`p-4 rounded-xl border-2 ${selectedMode === 'delivery' ? 'border-purple-500 bg-purple-500 bg-opacity-10' : 'border-slate-700 bg-slate-800'}`} onClick={() => setSelectedMode('delivery')}>
                <View className="flex items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-purple-500 bg-opacity-20 flex items-center justify-center"><Truck size={20} color="#A855F7" /></View>
                  <View className="flex-1">
                    <Text className="text-white font-medium">需要配送</Text>
                    <Text className="text-xs text-gray-400 mt-1">赠酒0元加入购物车</Text>
                    <Text className="text-xs text-amber-400 mt-1">同城满50起送 | 非同城满30包邮</Text>
                    <Text className="text-xs text-gray-500 mt-1">可加购其他酒水凑单免运费</Text>
                  </View>
                  {selectedMode === 'delivery' && <View className="bg-purple-500 text-white text-xs px-2 py-1 rounded">选中</View>}
                </View>
              </View>
            </View>
            <View className="flex gap-3 mt-4">
              <View className="flex-1 rounded-xl bg-slate-700 py-3 text-center" onClick={() => setStep(1)}><Text className="text-gray-300 text-sm">上一步</Text></View>
              <View className="flex-1 rounded-xl overflow-hidden py-3 text-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }} onClick={handleConfirmMode}><Text className="text-gray-900 font-semibold">确认</Text></View>
            </View>
          </View>
        )}

        {/* 步骤3：核销码展示（仅自提） */}
        {step === 3 && deliveryMode === 'pickup' && (
          <View className="px-5 pb-6">
            <View className="text-center">
              <View className="rounded-xl border-2 border-amber-500 p-5 mb-4" style={{ backgroundColor: 'rgba(251,191,36,0.08)' }}>
                <Text className="text-sm text-amber-400 mb-2">取货码</Text>
                <Text className="block text-4xl font-bold text-white tracking-[0.3em]">{redeemCode}</Text>
                {/* 核销码展示区 - 店员扫这个码 */}
                <View className="mt-4 flex items-center justify-center">
                  <View className="w-44 h-44 bg-white rounded-xl flex flex-col items-center justify-center">
                    <Text className="text-xs text-gray-500 mb-2">出示给店员扫码</Text>
                    <View className="w-36 h-36 border-4 border-gray-900 rounded flex items-center justify-center">
                      <View className="text-center">
                        <Text className="text-2xl font-bold text-gray-900 tracking-wider">{redeemCode}</Text>
                        <Text className="text-xs text-gray-500 mt-1">邑夏果酒</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Text className="block text-xs text-gray-400 mt-3">到取货点出示此码，店员扫码核销后领取酒水</Text>
                <Text className="block text-xs text-red-400 mt-1">⚠ 此码仅限使用一次，核销后即失效</Text>
              </View>
              <View className="rounded-xl bg-slate-800 p-3 flex items-center justify-center gap-2" onClick={handleCopyCode}>
                <Copy size={16} color="#FBBF24" />
                <Text className="text-amber-400 text-sm">复制取货码</Text>
              </View>
            </View>
            <View className="mt-4">
              <View className="rounded-xl overflow-hidden py-3 text-center" style={{ background: 'linear-gradient(135deg, #F59E0B, #FBBF24)' }} onClick={handleClose}>
                <Text className="text-gray-900 font-semibold">我知道了</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
