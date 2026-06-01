/**
 * 会员积分中心页面
 * 功能：积分余额、获取规则、兑换商品、积分对话
 */
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { usePointsStore, PointsRecord } from '@/store/pointsStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Coins, ArrowUpRight, ArrowDownLeft, Clock, Gift,
  Sparkles, MessageCircle, Ticket
} from 'lucide-react-taro'
import { useEffect, useState } from 'react'
import './index.css'

export default function PointsPage() {
  const { 
    balance, totalEarned, totalSpent, expiringSoon, records, 
    loadRecords, rewards, canRedeem, redeem, chat, addPoints 
  } = usePointsStore()
  
  const [showChat, setShowChat] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([])

  useEffect(() => {
    loadRecords()
  }, [])

  // 签到获取积分
  const handleSign = () => {
    addPoints(10, 'sign', '每日签到')
    Taro.showToast({ title: '签到成功+10积分', icon: 'success' })
  }

  // 兑换商品
  const handleRedeem = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId)
    if (!reward) return
    
    if (!canRedeem(rewardId)) {
      Taro.showToast({ title: '积分不足', icon: 'none' })
      return
    }
    
    if (redeem(rewardId)) {
      Taro.showToast({ title: `已兑换${reward.name}`, icon: 'success' })
    }
  }

  // 发送聊天消息
  const handleSendChat = () => {
    if (!chatInput.trim()) return
    
    const userMessage = chatInput
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }])
    
    // 获取机器人回复
    const botReply = chat(userMessage)
    setChatMessages(prev => [...prev, { role: 'bot', content: botReply }])
    
    setChatInput('')
  }

  const getTypeIcon = (type: PointsRecord['type']) => {
    switch (type) {
      case 'earn':
        return <ArrowUpRight size={20} color="#07C160" />
      case 'spend':
        return <ArrowDownLeft size={20} color="#FF6B00" />
      case 'expire':
        return <Clock size={20} color="#999" />
      case 'gift':
        return <Gift size={20} color="#FBBF24" />
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
        <Button className="points-actions__btn" onClick={handleSign}>
          <Sparkles size={18} color="#FF6B00" />
          <Text>签到+10</Text>
        </Button>
        <Button className="points-actions__btn" onClick={() => setShowChat(!showChat)}>
          <MessageCircle size={18} color="#8B5CF6" />
          <Text>积分助手</Text>
        </Button>
      </View>

      {/* 积分对话 */}
      {showChat && (
        <Card className="points-chat">
          <CardContent className="p-3">
            <View className="points-chat__header">
              <MessageCircle size={16} color="#8B5CF6" />
              <Text className="text-sm font-medium">积分小助手</Text>
            </View>
            <View className="points-chat__messages">
              {chatMessages.map((msg, idx) => (
                <View key={idx} className={`points-chat__msg points-chat__msg--${msg.role}`}>
                  <Text className="text-sm">{msg.content}</Text>
                </View>
              ))}
            </View>
            <View className="points-chat__input">
              <input
                className="points-chat__input-field"
                placeholder="问：积分怎么获得？"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <Button size="sm" onClick={handleSendChat}>发送</Button>
            </View>
          </CardContent>
        </Card>
      )}

      {/* 积分兑换 */}
      <View className="points-rewards">
        <View className="flex items-center justify-between mb-3">
          <Text className="text-sm font-semibold">积分兑换</Text>
          <Text className="text-xs text-gray-500">更多 {'>'}</Text>
        </View>
        <View className="points-rewards__list">
          {rewards.slice(0, 2).map((reward) => (
            <Card key={reward.id} className="points-reward">
              <CardContent className="p-3">
                <View className="flex items-center gap-3">
                  <View className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                    <Ticket size={24} color="#FBBF24" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium">{reward.name}</Text>
                    <Text className="text-xs text-gray-500">{reward.description}</Text>
                  </View>
                  <Button 
                    size="sm" 
                    disabled={!canRedeem(reward.id)}
                    onClick={() => handleRedeem(reward.id)}
                  >
                    {reward.points}积分
                  </Button>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
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
                {record.type === 'earn' || record.type === 'gift' ? '+' : '-'}{record.amount}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
