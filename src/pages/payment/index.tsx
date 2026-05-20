import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { usePaymentStore, PaymentMethod } from '@/store/paymentStore'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet, CreditCard, Plus, Check } from 'lucide-react-taro'
import './index.css'

export default function PaymentPage() {
  const { methods, selectedMethodId, setDefault, toggleEnabled, selectMethod } = usePaymentStore()

  const getMethodIcon = (type: PaymentMethod['type']) => {
    switch (type) {
      case 'wechat':
        return <Wallet size={24} color="#07C160" />
      case 'alipay':
        return <CreditCard size={24} color="#1677FF" />
      case 'balance':
        return <Wallet size={24} color="#FF6B00" />
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
    toggleEnabled(id)
  }

  const handleAddMethod = () => {
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  return (
    <View className="payment-page">
      {/* 当前选中 */}
      <View className="payment-header">
        <Text className="payment-header__title">选择支付方式</Text>
        <Text className="payment-header__subtitle">
          当前支付：{methods.find(m => m.id === selectedMethodId)?.label || '未选择'}
        </Text>
      </View>

      {/* 支付方式列表 */}
      <View className="payment-list">
        {methods.map((method) => (
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
                  <Text className="payment-item__label">{method.label}</Text>
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
                <Switch
                  checked={method.isEnabled}
                  onCheckedChange={() => handleToggleEnabled(method.id)}
                />
              </View>
            </CardContent>
            
            {!method.isDefault && method.isEnabled && (
              <View className="payment-item__footer">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleSetDefault(method.id)}
                >
                  设为默认
                </Button>
              </View>
            )}
          </Card>
        ))}
      </View>

      {/* 添加支付方式 */}
      <View className="payment-add">
        <Button className="payment-add__btn" onClick={handleAddMethod}>
          <Plus size={20} color="#1890ff" />
          <Text>添加支付方式</Text>
        </Button>
      </View>

      {/* 支付说明 */}
      <View className="payment-tips">
        <Text className="payment-tips__title">支付说明</Text>
        <Text className="payment-tips__text">• 微信支付支持银行卡、零钱支付</Text>
        <Text className="payment-tips__text">• 余额支付可使用充值卡充值</Text>
        <Text className="payment-tips__text">• 支付宝支付需绑定支付宝账号</Text>
      </View>
    </View>
  )
}
