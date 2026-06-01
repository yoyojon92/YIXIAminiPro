import { View, Text } from '@tarojs/components'
import { Input } from '@/components/ui/input'
import Taro from '@tarojs/taro'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Wallet, Clock, Check, CircleAlert } from 'lucide-react-taro'
import { useState } from 'react'
import './index.css'

interface WithdrawRecord {
  id: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  method: string
  account: string
  createdAt: string
}

const mockRecords: WithdrawRecord[] = [
  {
    id: '1',
    amount: 150,
    status: 'success',
    method: '微信零钱',
    account: '微信账户',
    createdAt: '2025-01-15 14:30'
  },
  {
    id: '2',
    amount: 200,
    status: 'pending',
    method: '银行卡',
    account: '尾号1234',
    createdAt: '2025-01-16 10:00'
  }
]

export default function WithdrawPage() {
  const [balance] = useState(528.50)
  const [amount, setAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState('wechat')

  const handleWithdrawAll = () => {
    setAmount(balance.toFixed(2))
  }

  const handleWithdraw = () => {
    const withdrawAmount = parseFloat(amount)
    if (!withdrawAmount || withdrawAmount <= 0) {
      Taro.showToast({ title: '请输入有效金额', icon: 'error' })
      return
    }
    if (withdrawAmount > balance) {
      Taro.showToast({ title: '余额不足', icon: 'error' })
      return
    }
    if (withdrawAmount < 10) {
      Taro.showToast({ title: '最低提现10元', icon: 'error' })
      return
    }

    Taro.showModal({
      title: '确认提现',
      content: `提现 ¥${withdrawAmount.toFixed(2)} 到${withdrawMethod === 'wechat' ? '微信零钱' : '银行卡'}`,
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '提现申请已提交', icon: 'success' })
          setAmount('')
        }
      }
    })
  }

  const getStatusIcon = (status: WithdrawRecord['status']) => {
    switch (status) {
      case 'success':
        return <Check size={20} color="#07C160" />
      case 'pending':
        return <Clock size={20} color="#FF6B00" />
      case 'failed':
        return <CircleAlert size={20} color="#FF4D4F" />
      default:
        return null
    }
  }

  const getStatusText = (status: WithdrawRecord['status']) => {
    switch (status) {
      case 'success':
        return '已到账'
      case 'pending':
        return '处理中'
      case 'failed':
        return '提现失败'
      default:
        return ''
    }
  }

  return (
    <View className="withdraw-page">
      {/* 余额卡片 */}
      <Card className="balance-card">
        <CardContent className="balance-card__content">
          <View className="balance-card__header">
            <Wallet size={32} color="#FF6B00" />
            <Text className="balance-card__title">可提现余额</Text>
          </View>
          <Text className="balance-card__amount">¥{balance.toFixed(2)}</Text>
        </CardContent>
      </Card>

      {/* 提现表单 */}
      <View className="withdraw-form">
        <Text className="withdraw-form__label">提现金额</Text>
        <View className="withdraw-form__input-wrap">
          <Text className="withdraw-form__currency">¥</Text>
          <Input
            className="withdraw-form__input"
            type="digit"
            placeholder="最低提现10元"
            value={amount}
            onInput={(e) => setAmount(e.detail.value)}
          />
          <Text className="withdraw-form__all" onClick={handleWithdrawAll}>全部</Text>
        </View>

        <Text className="withdraw-form__label">提现方式</Text>
        <View className="withdraw-methods">
          <View
            className={`withdraw-method ${withdrawMethod === 'wechat' ? 'withdraw-method--active' : ''}`}
            onClick={() => setWithdrawMethod('wechat')}
          >
            <Text className="withdraw-method__name">微信零钱</Text>
            <Text className="withdraw-method__fee">实时到账</Text>
          </View>
          <View
            className={`withdraw-method ${withdrawMethod === 'bank' ? 'withdraw-method--active' : ''}`}
            onClick={() => setWithdrawMethod('bank')}
          >
            <Text className="withdraw-method__name">银行卡</Text>
            <Text className="withdraw-method__fee">1-3个工作日</Text>
          </View>
        </View>

        <Button className="withdraw-btn" onClick={handleWithdraw}>
          立即提现
        </Button>
      </View>

      {/* 提现记录 */}
      <View className="withdraw-records">
        <Text className="withdraw-records__title">提现记录</Text>
        {mockRecords.map((record) => (
          <View key={record.id} className="withdraw-record">
            <View className="withdraw-record__left">
              {getStatusIcon(record.status)}
              <View className="withdraw-record__info">
                <Text className="withdraw-record__method">{record.method}</Text>
                <Text className="withdraw-record__time">{record.createdAt}</Text>
              </View>
            </View>
            <View className="withdraw-record__right">
              <Text className="withdraw-record__amount">+¥{record.amount.toFixed(2)}</Text>
              <Text className={`withdraw-record__status withdraw-record__status--${record.status}`}>
                {getStatusText(record.status)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}
