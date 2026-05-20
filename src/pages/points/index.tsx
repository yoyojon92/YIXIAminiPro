import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { usePointsStore, PointsRecord } from '@/store/pointsStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Coins, ArrowUpRight, ArrowDownLeft, Clock, Gift } from 'lucide-react-taro'
import { useEffect } from 'react'
import './index.css'

export default function PointsPage() {
  const { balance, totalEarned, totalSpent, expiringSoon, records, loadRecords } = usePointsStore()

  useEffect(() => {
    loadRecords()
  }, [])

  const handleEarnPoints = () => {
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  const handleRedeem = () => {
    Taro.navigateTo({ url: '/pages/coupons/index' })
  }

  const getTypeIcon = (type: PointsRecord['type']) => {
    switch (type) {
      case 'earn':
        return <ArrowUpRight size={20} color="#07C160" />
      case 'spend':
        return <ArrowDownLeft size={20} color="#FF6B00" />
      case 'expire':
        return <Clock size={20} color="#999" />
      default:
        return <Coins size={20} color="#999" />
    }
  }

  return (
    <View className="points-page">
      {/* 积分卡片 */}
      <Card className="points-card">
        <CardContent className="points-card__content">
          <View className="points-card__header">
            <Coins size={32} color="#FFD700" />
            <Text className="points-card__title">我的积分</Text>
          </View>
          <Text className="points-card__balance">{balance.toLocaleString()}</Text>
          <View className="points-card__stats">
            <View className="points-card__stat">
              <Text className="points-card__stat-label">累计获得</Text>
              <Text className="points-card__stat-value">{totalEarned.toLocaleString()}</Text>
            </View>
            <View className="points-card__stat">
              <Text className="points-card__stat-label">累计使用</Text>
              <Text className="points-card__stat-value">{totalSpent.toLocaleString()}</Text>
            </View>
            <View className="points-card__stat">
              <Text className="points-card__stat-label">即将过期</Text>
              <Text className="points-card__stat-value points-card__stat-value--warning">{expiringSoon}</Text>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <View className="points-actions">
        <Button className="points-actions__btn" onClick={handleEarnPoints}>
          <Gift size={20} color="#FF6B00" />
          <Text>赚积分</Text>
        </Button>
        <Button className="points-actions__btn points-actions__btn--primary" onClick={handleRedeem}>
          <Gift size={20} color="#fff" />
          <Text>兑好礼</Text>
        </Button>
      </View>

      {/* 积分记录 */}
      <View className="points-records">
        <Text className="points-records__title">积分记录</Text>
        {records.map((record) => (
          <View key={record.id} className="points-record">
            <View className="points-record__left">
              <View className="points-record__icon">
                {getTypeIcon(record.type)}
              </View>
              <View className="points-record__info">
                <Text className="points-record__desc">{record.description}</Text>
                <Text className="points-record__time">{record.createdAt}</Text>
              </View>
            </View>
            <View className="points-record__right">
              <Text className={`points-record__amount points-record__amount--${record.type}`}>
                {record.type === 'earn' ? '+' : '-'}{record.amount}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
