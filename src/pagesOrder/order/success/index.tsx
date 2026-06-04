import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import './index.scss'

export default function OrderSuccess() {
  const [orderId, setOrderId] = useState('')

  useEffect(() => {
    const params = Taro.getCurrentInstance().router?.params
    if (params?.id) setOrderId(params.id)
  }, [])

  const goHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  const goOrders = () => {
    Taro.navigateTo({ url: '/pagesOrder/orders/index' })
  }

  return (
    <View className='order-success'>
      <View className='success-icon'>✓</View>
      <Text className='success-title'>下单成功</Text>
      {orderId && <Text className='order-id'>订单号：{orderId}</Text>}
      <View className='btn-group'>
        <View className='btn btn-outline' onClick={goOrders}>查看订单</View>
        <View className='btn btn-primary' onClick={goHome}>返回首页</View>
      </View>
    </View>
  )
}
