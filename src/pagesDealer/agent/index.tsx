/**
 * 代理商中心
 * - 代理等级 + 今日业绩看板
 * - 去营销（分享推广）
 * - 替客户下单（给线下客户代下单）
 * - 代下单记录
 */
import { View, Text, Input } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import { useDealerStore } from '@/store/dealerStore'

/** 商品快捷列表 */
const QUICK_PRODUCTS = [
  { id: 'p1', name: '榴红果酒', price: 18.8 },
  { id: 'p2', name: '葡香果酒', price: 18.8 },
  { id: 'p3', name: '桃心果酒', price: 18.8 },
  { id: 'p4', name: '青苹果酒', price: 18.8 },
  { id: 'p5', name: '芭乐果酒', price: 39.9 },
  { id: 'p6', name: '干红果酒', price: 49.9 },
  { id: 'p7', name: '果汁(任选)', price: 9.9 },
]

export default function AgentCenter() {
  const {
    isAgent, agentLevel, todayCommission, todayOrderCount,
    totalAgentSales, agentOrders, getAgentLevelName,
    createAgentOrder, getTodayPerformance,
  } = useDealerStore()

  const [showOrderForm, setShowOrderForm] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<Array<{ name: string; qty: number; price: number }>>([])
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery' | 'mail'>('pickup')

  const levelName = getAgentLevelName()
  const perf = getTodayPerformance()

  const addProduct = (product: typeof QUICK_PRODUCTS[0]) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.name === product.name)
      if (existing) {
        return prev.map(p => p.name === product.name ? { ...p, qty: p.qty + 1 } : p)
      }
      return [...prev, { name: product.name, qty: 1, price: product.price }]
    })
  }

  const removeProduct = (name: string) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.name === name)
      if (existing && existing.qty > 1) {
        return prev.map(p => p.name === name ? { ...p, qty: p.qty - 1 } : p)
      }
      return prev.filter(p => p.name !== name)
    })
  }

  const totalAmount = selectedProducts.reduce((sum, p) => sum + p.price * p.qty, 0)

  const handleSubmitOrder = () => {
    if (!customerName.trim()) {
      Taro.showToast({ title: '请输入客户姓名', icon: 'none' })
      return
    }
    if (selectedProducts.length === 0) {
      Taro.showToast({ title: '请选择商品', icon: 'none' })
      return
    }
    createAgentOrder({
      customerName,
      customerPhone,
      products: selectedProducts,
      totalAmount,
      deliveryMethod,
    })
    setShowOrderForm(false)
    setCustomerName('')
    setCustomerPhone('')
    setSelectedProducts([])
  }

  const handleGoMarketing = () => {
    Taro.navigateTo({ url: '/pagesDealer/dealer/index' })
  }

  return (
    <View style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', paddingBottom: '30px' }}>
      {/* 顶部业绩看板 */}
      <View style={{ background: 'linear-gradient(135deg, #1E40AF, #3B82F6)', padding: '40px 16px 24px' }}>
        <Text style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
          {isAgent ? levelName : '代理商中心'}
        </Text>
        {isAgent && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: '16px' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FDE68A', fontSize: '24px', fontWeight: 'bold' }}>¥{perf.commission.toFixed(2)}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' }}>今日提成</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FDE68A', fontSize: '24px', fontWeight: 'bold' }}>{perf.orderCount}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' }}>今日订单</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FDE68A', fontSize: '24px', fontWeight: 'bold' }}>¥{totalAgentSales.toFixed(0)}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' }}>累计销售</Text>
            </View>
          </View>
        )}
      </View>

      <View style={{ padding: '12px 16px' }}>
        {/* 两个核心按钮 */}
        <View style={{ flexDirection: 'row', gap: '8px' }}>
          <View
            style={{ flex: 1, backgroundColor: '#2563EB', borderRadius: '12px', padding: '20px', alignItems: 'center' }}
            onClick={handleGoMarketing}
          >
            <Text style={{ color: '#fff', fontSize: '17px', fontWeight: 'bold' }}>去营销</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '4px' }}>分享推广赚返利</Text>
          </View>
          <View
            style={{ flex: 1, backgroundColor: '#059669', borderRadius: '12px', padding: '20px', alignItems: 'center' }}
            onClick={() => setShowOrderForm(true)}
          >
            <Text style={{ color: '#fff', fontSize: '17px', fontWeight: 'bold' }}>替客户下单</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '4px' }}>线下客户代下单</Text>
          </View>
        </View>

        {/* 代理等级进度 */}
        {!isAgent && (
          <View style={{ marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>代理商等级</Text>
            <Text style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px' }}>
              累计销售满¥500 → 实习代理商{'\n'}
              累计销售满¥2000 → 正式代理商{'\n'}
              累计销售满¥5000 → 资深代理商{'\n'}
              {'\n'}
              替客户下单即可累计销售额，享受5%提成
            </Text>
            <View style={{ marginTop: '12px', height: '8px', backgroundColor: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${Math.min(100, (totalAgentSales / 500) * 100)}%`, backgroundColor: '#3B82F6', borderRadius: '4px' }} />
            </View>
            <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
              ¥{totalAgentSales.toFixed(0)} / ¥500 实习代理商
            </Text>
          </View>
        )}

        {/* 代下单记录 */}
        <View style={{ marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
          <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>代下单记录</Text>
          {agentOrders.length === 0 ? (
            <Text style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '12px', textAlign: 'center' }}>暂无记录</Text>
          ) : (
            agentOrders.slice(-10).reverse().map(order => (
              <View key={order.id} style={{ marginTop: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '12px' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>{order.customerName}</Text>
                  <Text style={{ fontSize: '12px', color: order.status === 'completed' ? '#059669' : '#F59E0B' }}>
                    {order.status === 'completed' ? '已完成' : '待完成'}
                  </Text>
                </View>
                <Text style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                  {order.products.map(p => `${p.name}x${p.qty}`).join(' ')}
                </Text>
                <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#1F2937', marginTop: '4px' }}>¥{order.totalAmount}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      {/* 替客户下单弹窗 */}
      {showOrderForm && (
        <View style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: '16px 16px 0 0', padding: '20px 16px', maxHeight: '80vh', overflowY: 'scroll' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F2937' }}>替客户下单</Text>
              <Text style={{ fontSize: '14px', color: '#9CA3AF' }} onClick={() => setShowOrderForm(false)}>关闭</Text>
            </View>

            {/* 客户信息 */}
            <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>客户信息</Text>
            <Input
              style={{ marginTop: '8px', backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '10px 12px', fontSize: '14px' }}
              placeholder="客户姓名"
              value={customerName}
              onInput={e => setCustomerName(e.detail.value)}
            />
            <Input
              style={{ marginTop: '8px', backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '10px 12px', fontSize: '14px' }}
              placeholder="客户电话（选填）"
              type="number"
              value={customerPhone}
              onInput={e => setCustomerPhone(e.detail.value)}
            />

            {/* 选择商品 */}
            <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginTop: '16px' }}>选择商品</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {QUICK_PRODUCTS.map(p => (
                <View
                  key={p.id}
                  style={{ backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '8px 12px' }}
                  onClick={() => addProduct(p)}
                >
                  <Text style={{ fontSize: '13px', color: '#374151' }}>{p.name}</Text>
                  <Text style={{ fontSize: '12px', color: '#7C3AED' }}>¥{p.price}</Text>
                </View>
              ))}
            </View>

            {/* 已选商品 */}
            {selectedProducts.length > 0 && (
              <View style={{ marginTop: '12px' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>已选</Text>
                {selectedProducts.map(p => (
                  <View key={p.name} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <Text style={{ fontSize: '13px', color: '#374151' }}>{p.name} x{p.qty}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                      <Text style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 'bold' }}>¥{(p.price * p.qty).toFixed(2)}</Text>
                      <Text style={{ fontSize: '12px', color: '#DC2626' }} onClick={() => removeProduct(p.name)}>删</Text>
                    </View>
                  </View>
                ))}
                <View style={{ marginTop: '8px', paddingTop: '8px', borderTopWidth: '1px', borderTopColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>合计</Text>
                  <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#DC2626' }}>¥{totalAmount.toFixed(2)}</Text>
                </View>
              </View>
            )}

            {/* 配送方式 */}
            <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginTop: '16px' }}>配送方式</Text>
            <View style={{ flexDirection: 'row', gap: '8px', marginTop: '8px' }}>
              {[
                { key: 'pickup', label: '到店自提' },
                { key: 'delivery', label: '同城配送' },
                { key: 'mail', label: '邮寄' },
              ].map(m => (
                <View
                  key={m.key}
                  style={{
                    flex: 1, paddingVertical: '10px', alignItems: 'center', borderRadius: '8px',
                    backgroundColor: deliveryMethod === m.key ? '#7C3AED' : '#F3F4F6',
                  }}
                  onClick={() => setDeliveryMethod(m.key as any)}
                >
                  <Text style={{ color: deliveryMethod === m.key ? '#fff' : '#374151', fontSize: '13px' }}>{m.label}</Text>
                </View>
              ))}
            </View>

            {/* 提交按钮 */}
            <View
              style={{ marginTop: '20px', backgroundColor: '#059669', borderRadius: '10px', paddingVertical: '14px', alignItems: 'center' }}
              onClick={handleSubmitOrder}
            >
              <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>确认下单</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
