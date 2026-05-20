/**
 * 支付方式管理页面
 * 功能：支付方式列表、添加支付方式、默认设置、余额充值入口
 */
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { usePaymentStore, PaymentMethod } from '@/store/paymentStore'
import { useRechargeStore } from '@/store/rechargeStore'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Wallet, CreditCard, Check, ChevronRight,
  Gift, Sparkles
} from 'lucide-react-taro'
import './index.css'

export default function PaymentPage() {
  const { methods, selectedMethodId, balance, setDefault, toggleEnabled, selectMethod, addMethod, removeMethod } = usePaymentStore()
  const { totalBalance: rechargeBalance, getBestDiscountCard } = useRechargeStore()

  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'wechat':
        return <Wallet size={24} color="#07C160" />
      case 'alipay':
        return <CreditCard size={24} color="#1677FF" />
      case 'balance':
        return <Wallet size={24} color="#FF6B00" />
      case 'recharge_card':
        return <Gift size={24} color="#FBBF24" />
      default:
        return <CreditCard size={24} color="#666666" />
    }
  }

  const handleSelect = (id: string) => {
    selectMethod(id)
    Taro.showToast({ title: '已选择', icon: 'success' })
  }

  const handleSetDefault = (id: string) => {
    setDefault(id)
    Taro.showToast({ title: '已设为默认', icon: 'success' })
  }

  const handleToggleEnabled = (id: string) => {
    const method = methods.find(m => m.id === id)
    if (method?.isSystem && !method.isEnabled) {
      Taro.showToast({ title: '系统支付方式不可禁用', icon: 'none' })
      return
    }
    toggleEnabled(id)
  }

  const handleAddAlipay = () => {
    // 添加支付宝支付方式
    addMethod({
      type: 'alipay',
      label: '支付宝支付',
      account: '支付宝账号',
      isDefault: false,
      isEnabled: true
    })
    Taro.showToast({ title: '已添加支付宝', icon: 'success' })
  }

  const handleRecharge = () => {
    Taro.navigateTo({ url: '/pages/recharge/index' })
  }

  const bestCard = getBestDiscountCard()

  return (
    <View className="payment-page">
      {/* 余额卡片 */}
      <Card className="payment-balance-card">
        <CardContent className="p-4">
          <View className="flex items-center justify-between">
            <View className="flex items-center gap-3">
              <View className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Wallet size={24} color="#F59E0B" />
              </View>
              <View>
                <Text className="text-sm text-gray-500">账户余额</Text>
                <Text className="text-2xl font-bold text-amber-600">¥{balance.toFixed(2)}</Text>
              </View>
            </View>
            <Button size="sm" onClick={handleRecharge}>
              充值
            </Button>
          </View>
          
          {rechargeBalance > 0 && (
            <>
              <Separator className="my-3" />
              <View 
                className="flex items-center justify-between"
                onClick={() => Taro.navigateTo({ url: '/pages/recharge/index' })}
              >
                <View className="flex items-center gap-2">
                  <Gift size={16} color="#FBBF24" />
                  <Text className="text-sm text-gray-700">充值卡余额 ¥{rechargeBalance.toFixed(2)}</Text>
                  {bestCard && bestCard.discount < 1 && (
                    <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">
                      <Sparkles size={10} color="#F59E0B" />
                      {(bestCard.discount * 10).toFixed(1)}折
                    </Badge>
                  )}
                </View>
                <ChevronRight size={16} color="#9CA3AF" />
              </View>
            </>
          )}
        </CardContent>
      </Card>

      {/* 当前选中 */}
      <View className="payment-header">
        <Text className="payment-header__title">选择支付方式</Text>
      </View>

      {/* 支付方式列表 */}
      <View className="payment-list">
        {methods.filter(m => m.isEnabled).map((method) => (
          <Card 
            key={method.id} 
            className={`payment-item ${selectedMethodId === method.id ? 'payment-item--selected' : ''}`}
          >
            <CardContent className="payment-item__content">
              <View className="payment-item__left" onClick={() => handleSelect(method.id)}>
                <View className="payment-item__icon">
                  {getMethodIcon(method.type)}
                </View>
                <View className="payment-item__info">
                  <View className="flex items-center gap-2">
                    <Text className="payment-item__label">{method.label}</Text>
                    {method.isSystem && (
                      <Badge variant="outline" className="text-xs">系统</Badge>
                    )}
                  </View>
                  <Text className="payment-item__account">{method.account}</Text>
                </View>
              </View>
              
              <View className="payment-item__actions">
                {method.isDefault && (
                  <View className="payment-item__default">
                    <Check size={14} color="#07C160" />
                    <Text className="payment-item__default-text">默认</Text>
                  </View>
                )}
                {!method.isSystem && (
                  <Switch
                    checked={method.isEnabled}
                    onCheckedChange={() => handleToggleEnabled(method.id)}
                  />
                )}
              </View>
            </CardContent>
            
            {!method.isDefault && method.isEnabled && !method.isSystem && (
              <View className="payment-item__footer">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleSetDefault(method.id)}
                >
                  设为默认
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => {
                    if (removeMethod(method.id)) {
                      Taro.showToast({ title: '已删除', icon: 'success' })
                    }
                  }}
                >
                  删除
                </Button>
              </View>
            )}
          </Card>
        ))}
      </View>

      {/* 添加支付方式 */}
      <View className="payment-add">
        <Text className="payment-add__title">添加支付方式</Text>
        <Card className="payment-add__item" onClick={handleAddAlipay}>
          <CardContent className="p-3">
            <View className="flex items-center gap-3">
              <CreditCard size={24} color="#1677FF" />
              <Text className="text-sm font-medium">添加支付宝支付</Text>
              <ChevronRight size={16} color="#9CA3AF" className="ml-auto" />
            </View>
          </CardContent>
        </Card>
      </View>

      {/* 支付说明 */}
      <View className="payment-tips">
        <Text className="payment-tips__title">支付说明</Text>
        <Text className="payment-tips__text">• 微信支付自动绑定当前微信账号，不可删除</Text>
        <Text className="payment-tips__text">• 余额支付可通过充值卡充值，享9折优惠</Text>
        <Text className="payment-tips__text">• 支付宝支付需绑定支付宝账号</Text>
        <Text className="payment-tips__text">• 充值卡支付享9折优惠，优先推荐使用</Text>
      </View>
    </View>
  )
}
