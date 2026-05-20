/**
 * 充值卡管理页面
 * 功能：充值卡列表、购买充值卡、9折优惠说明
 */
import { View, Text } from '@tarojs/components'
import { useRechargeStore, RechargeCard } from '@/store/rechargeStore'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  CreditCard, Clock, Gift, Sparkles
} from 'lucide-react-taro'
import { useEffect, useState } from 'react'
import './index.css'

export default function RechargePage() {
  const { cards, totalBalance, loadCards, loadRecords, records, packages, addCard, getBestDiscountCard } = useRechargeStore()
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

  useEffect(() => {
    loadCards()
    loadRecords()
  }, [])

  // 购买充值卡
  const handleBuyCard = async (packageId: string) => {
    setSelectedPackage(packageId)
    const success = await addCard(packageId)
    if (success) {
      setSelectedPackage(null)
    }
  }

  const bestCard = getBestDiscountCard()

  const getStatusBadge = (status: RechargeCard['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">有效</Badge>
      case 'expired':
        return <Badge variant="destructive">已过期</Badge>
      case 'used':
        return <Badge variant="secondary">已用完</Badge>
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
            <CreditCard size={32} color="#F59E0B" />
            <Text className="balance-card__title">充值卡余额</Text>
          </View>
          <Text className="balance-card__amount">¥{totalBalance.toFixed(2)}</Text>
          <View className="flex items-center justify-between">
            <Text className="balance-card__tip">共 {cards.filter(c => c.status === 'active').length} 张有效充值卡</Text>
            {bestCard && bestCard.discount < 1 && (
              <Badge className="bg-amber-100 text-amber-700">
                <Sparkles size={12} color="#F59E0B" />
                最高{(bestCard.discount * 10).toFixed(1)}折
              </Badge>
            )}
          </View>
        </CardContent>
      </Card>

      {/* 优惠说明 */}
      <Card className="mx-4 mt-4 border-amber-200 bg-amber-50">
        <CardContent className="p-3">
          <View className="flex items-center gap-2">
            <Gift size={20} color="#F59E0B" />
            <View>
              <Text className="text-sm font-medium text-amber-800">充值卡特权</Text>
              <Text className="text-xs text-amber-600">使用充值卡支付享9折优惠，多充多送</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* 充值套餐 */}
      <View className="mx-4 mt-4">
        <Text className="text-sm font-semibold mb-3">充值套餐</Text>
        <View className="flex flex-wrap gap-3">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`flex-1 min-w-[45%] ${selectedPackage === pkg.id ? 'border-amber-500 border-2' : ''}`}
              onClick={() => handleBuyCard(pkg.id)}
            >
              <CardContent className="p-3">
                {pkg.recommended && (
                  <Badge className="bg-amber-500 text-white text-xs mb-2">推荐</Badge>
                )}
                <Text className="text-lg font-bold">¥{pkg.amount}</Text>
                {pkg.bonus > 0 && (
                  <Text className="text-xs text-amber-600">+赠¥{pkg.bonus}</Text>
                )}
                <View className="flex items-center gap-1 mt-1">
                  {pkg.discount < 1 && (
                    <Badge variant="secondary" className="text-xs">
                      {(pkg.discount * 10).toFixed(1)}折
                    </Badge>
                  )}
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>

      {/* 充值卡列表 */}
      <View className="card-list">
        <Text className="card-list__title">我的充值卡</Text>
        {cards.length === 0 ? (
          <View className="text-center py-8">
            <CreditCard size={48} color="#D1D5DB" />
            <Text className="text-gray-400 mt-2">暂无充值卡</Text>
          </View>
        ) : (
          cards.map((card) => (
            <View key={card.id} className="recharge-card">
              <View className="recharge-card__header">
                <Text className="recharge-card__name">{card.name}</Text>
                {getStatusBadge(card.status)}
              </View>
              <View className="recharge-card__info">
                <Text className="recharge-card__balance">余额：¥{card.balance.toFixed(2)}</Text>
                <Text className="recharge-card__original">原值：¥{card.originalAmount}</Text>
                {card.bonusAmount > 0 && (
                  <Text className="text-xs text-amber-600">含赠送 ¥{card.bonusAmount}</Text>
                )}
              </View>
              <View className="recharge-card__footer">
                <View className="recharge-card__validity">
                  <Clock size={16} color="#999" />
                  <Text className="recharge-card__validity-text">有效期至：{card.validUntil}</Text>
                </View>
                {card.discount < 1 && card.status === 'active' && (
                  <Badge variant="outline" className="text-xs text-amber-600">
                    消费享{(card.discount * 10).toFixed(1)}折
                  </Badge>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {/* 使用记录 */}
      {records.length > 0 && (
        <View className="mx-4 mt-4">
          <Text className="text-sm font-semibold mb-3">使用记录</Text>
          {records.slice(0, 5).map((record) => (
            <View key={record.id} className="flex items-center justify-between py-2 border-b border-gray-100">
              <View>
                <Text className="text-sm">{record.description}</Text>
                <Text className="text-xs text-gray-400">{record.createdAt}</Text>
              </View>
              <Text className={`text-sm ${record.type === 'purchase' ? 'text-green-600' : 'text-amber-600'}`}>
                {record.type === 'purchase' ? '+' : '-'}¥{record.amount}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}
