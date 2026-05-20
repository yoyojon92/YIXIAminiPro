import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useRechargeStore, RechargeCard } from '@/store/rechargeStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CreditCard, Plus, Clock } from 'lucide-react-taro'
import { useEffect } from 'react'
import './index.css'

export default function RechargePage() {
  const { cards, totalBalance, loadCards } = useRechargeStore()

  useEffect(() => {
    loadCards()
  }, [])

  const handleBuyCard = () => {
    Taro.showActionSheet({
      itemList: ['100元充值卡', '200元充值卡', '500元充值卡', '1000元充值卡'],
      success: (res) => {
        const amounts = [100, 200, 500, 1000]
        Taro.showToast({ title: `购买${amounts[res.tapIndex]}元充值卡`, icon: 'success' })
      }
    })
  }

  const getStatusBadge = (status: RechargeCard['status']) => {
    switch (status) {
      case 'active':
        return <View className="card-status card-status--active">有效</View>
      case 'expired':
        return <View className="card-status card-status--expired">已过期</View>
      case 'used':
        return <View className="card-status card-status--used">已用完</View>
      default:
        return null
    }
  }

  return (
    <View className="recharge-page">
      {/* 余额卡片 */}
      <Card className="balance-card">
        <CardContent className="balance-card__content">
          <View className="balance-card__header">
            <CreditCard size={32} color="#FF6B00" />
            <Text className="balance-card__title">充值卡余额</Text>
          </View>
          <Text className="balance-card__amount">¥{totalBalance.toFixed(2)}</Text>
          <Text className="balance-card__tip">共 {cards.filter(c => c.status === 'active').length} 张有效充值卡</Text>
        </CardContent>
      </Card>

      {/* 购买按钮 */}
      <Button className="buy-btn" onClick={handleBuyCard}>
        <Plus size={20} color="#fff" />
        <Text className="buy-btn__text">购买充值卡</Text>
      </Button>

      {/* 充值卡列表 */}
      <View className="card-list">
        <Text className="card-list__title">我的充值卡</Text>
        {cards.map((card) => (
          <View key={card.id} className="recharge-card">
            <View className="recharge-card__header">
              <Text className="recharge-card__name">{card.name}</Text>
              {getStatusBadge(card.status)}
            </View>
            <View className="recharge-card__info">
              <Text className="recharge-card__balance">余额：¥{card.balance.toFixed(2)}</Text>
              <Text className="recharge-card__original">原值：¥{card.originalAmount}</Text>
            </View>
            <View className="recharge-card__footer">
              <View className="recharge-card__validity">
                <Clock size={16} color="#999" />
                <Text className="recharge-card__validity-text">有效期至：{card.validUntil}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
