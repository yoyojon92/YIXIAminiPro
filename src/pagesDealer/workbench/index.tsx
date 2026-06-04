/**
 * 自提点工作台（V4 - 2026-06-05）
 * 扫码核销 · 接单 · 库存管理 · 替顾客下单
 */
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import { useDealerStore, AGENT_LEVEL_NAMES } from '@/store/dealerStore'

type TabId = 'scan' | 'orders' | 'inventory' | 'overflow'

export default function Workbench() {
  const [activeTab, setActiveTab] = useState<TabId>('scan')
  const [manualCode, setManualCode] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')

  const {
    isAgent, agentLevel, hasStockedUp, agentInventory,
    customerOrders, overflowOrders, verifyRecords,
    getAgentDaysLeft, getAgentCommissionRate, getAgentDiscount,
    createCustomerOrder, completeCustomerOrder,
    verifyOrderByCode, confirmVerify, getPendingVerifyOrders,
    acceptOverflowOrder, declineOverflowOrder, fulfillOverflowOrder,
    getInventoryTotal, canRestock, restock,
  } = useDealerStore()

  const tabs: Array<{ id: TabId; label: string; icon: string }> = [
    { id: 'scan', label: '扫码核销', icon: '📷' },
    { id: 'orders', label: '订单管理', icon: '📋' },
    { id: 'inventory', label: '库存管理', icon: '📦' },
    { id: 'overflow', label: '接单赚外快', icon: '💰' },
  ]

  const pendingVerify = getPendingVerifyOrders()
  const inv = getInventoryTotal()

  const handleScan = () => {
    Taro.scanCode({
      scanType: ['qrCode', 'barCode'],
      success: (res) => { handleVerifyCode(res.result) },
      fail: () => { Taro.showToast({ title: '请使用手动输入核销码', icon: 'none' }) }
    })
  }

  const handleManualVerify = () => {
    if (!manualCode.trim()) { Taro.showToast({ title: '请输入核销码', icon: 'none' }); return }
    handleVerifyCode(manualCode.trim())
    setManualCode('')
  }

  const handleVerifyCode = (code: string) => {
    const order = verifyOrderByCode(code)
    if (!order) { Taro.showToast({ title: '核销码无效或订单已核销', icon: 'none' }); return }
    Taro.showModal({
      title: '确认核销',
      content: `顾客：${order.customerName || order.customerPhone}\n商品：${order.items.map(i => i.productName + 'x' + i.quantity).join('、')}\n金额：¥${order.totalAmount.toFixed(2)}\n\n确认发货？`,
      confirmText: '确认核销',
      confirmColor: '#059669',
      success: (res) => { if (res.confirm) confirmVerify(order.id) }
    })
  }

  const handleCreateOrder = () => {
    if (!customerPhone.trim()) { Taro.showToast({ title: '请填写顾客电话', icon: 'none' }); return }
    createCustomerOrder(customerPhone, customerAddress, customerName, 'pickup')
    setCustomerName(''); setCustomerPhone(''); setCustomerAddress('')
    Taro.switchTab({ url: '/pages/category/index' })
  }

  return (
    <View style={{ minHeight: '100vh', backgroundColor: '#FAF5FF', paddingBottom: '80px' }}>
      {/* 顶部状态 */}
      <View style={{ background: 'linear-gradient(135deg, #1E40AF, #7C3AED)', padding: '36px 16px 20px' }}>
        <Text style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>自提点工作台</Text>
        {isAgent && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: '12px' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FDE68A', fontSize: '18px', fontWeight: 'bold' }}>{getAgentDiscount()}折</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>拿货</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FDE68A', fontSize: '18px', fontWeight: 'bold' }}>{getAgentCommissionRate()}%</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>提成</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FDE68A', fontSize: '18px', fontWeight: 'bold' }}>{getAgentDaysLeft()}天</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>剩余</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FDE68A', fontSize: '18px', fontWeight: 'bold' }}>{pendingVerify.length}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>待核销</Text>
            </View>
          </View>
        )}
      </View>

      <View style={{ padding: '12px 16px' }}>
        {/* 扫码核销 */}
        {activeTab === 'scan' && (
          <View>
            <View style={{ backgroundColor: '#059669', borderRadius: '16px', padding: '24px', alignItems: 'center' }} onClick={handleScan}>
              <Text style={{ fontSize: '48px' }}>📷</Text>
              <Text style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', marginTop: '8px' }}>扫描核销码</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginTop: '4px' }}>对准顾客手机上的核销码扫描</Text>
            </View>

            {/* 手动输入 */}
            <View style={{ marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>手动输入核销码</Text>
              <View style={{ flexDirection: 'row', marginTop: '10px' }}>
                <View style={{ flex: 1, backgroundColor: '#F3F4F6', borderRadius: '8px', paddingVertical: '10px', paddingHorizontal: '12px' }}>
                  <Input placeholder='输入核销码（如YX...）' value={manualCode} onInput={(e) => setManualCode((e as any).detail.value || '')} style={{ fontSize: '14px' }} />
                </View>
                <View style={{ backgroundColor: '#7C3AED', borderRadius: '8px', paddingVertical: '10px', paddingHorizontal: '16px', justifyContent: 'center', marginLeft: '8px' }} onClick={handleManualVerify}>
                  <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>核销</Text>
                </View>
              </View>
            </View>

            {/* 待核销订单 */}
            {pendingVerify.length > 0 && (
              <View style={{ marginTop: '12px' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>待核销订单（{pendingVerify.length}）</Text>
                {pendingVerify.map(order => (
                  <View key={order.id} style={{ marginTop: '8px', backgroundColor: '#fff', borderRadius: '12px', padding: '14px' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: '13px', color: '#374151', fontWeight: 'bold' }}>{order.customerName || order.customerPhone}</Text>
                      <Text style={{ fontSize: '12px', color: '#7C3AED', fontWeight: 'bold' }}>¥{order.totalAmount.toFixed(2)}</Text>
                    </View>
                    <Text style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                      {order.items.map(i => i.productName + 'x' + i.quantity).join('、')}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <Text style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>核销码：{order.verifyCode}</Text>
                      <View style={{ backgroundColor: '#059669', borderRadius: '6px', paddingVertical: '6px', paddingHorizontal: '12px' }} onClick={() => { handleVerifyCode(order.verifyCode || '') }}>
                        <Text style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>核销</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* 已核销记录 */}
            {verifyRecords.length > 0 && (
              <View style={{ marginTop: '12px' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>核销记录</Text>
                {verifyRecords.slice(-5).reverse().map(record => (
                  <View key={record.id} style={{ marginTop: '6px', backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '10px' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: '12px', color: '#6B7280' }}>码：{record.verifyCode}</Text>
                      <Text style={{ fontSize: '12px', color: '#059669', fontWeight: 'bold' }}>¥{record.totalAmount.toFixed(2)}</Text>
                    </View>
                    <Text style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{new Date(record.verifiedAt).toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* 替顾客下单 */}
            {hasStockedUp && (
              <View style={{ marginTop: '16px' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>替顾客下单</Text>
                <View style={{ marginTop: '8px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
                  <View style={{ backgroundColor: '#F3F4F6', borderRadius: '8px', paddingVertical: '10px', paddingHorizontal: '12px', marginBottom: '8px' }}>
                    <Input placeholder='顾客姓名（可选）' value={customerName} onInput={(e) => setCustomerName((e as any).detail.value || '')} style={{ fontSize: '14px' }} />
                  </View>
                  <View style={{ backgroundColor: '#F3F4F6', borderRadius: '8px', paddingVertical: '10px', paddingHorizontal: '12px', marginBottom: '8px' }}>
                    <Input type='number' placeholder='顾客电话（必填）' value={customerPhone} onInput={(e) => setCustomerPhone((e as any).detail.value || '')} style={{ fontSize: '14px' }} />
                  </View>
                  <View style={{ backgroundColor: '#F3F4F6', borderRadius: '8px', paddingVertical: '10px', paddingHorizontal: '12px', marginBottom: '12px' }}>
                    <Input placeholder='配送地址（选填，自提可不填）' value={customerAddress} onInput={(e) => setCustomerAddress((e as any).detail.value || '')} style={{ fontSize: '14px' }} />
                  </View>
                  <View style={{ backgroundColor: '#F59E0B', borderRadius: '8px', paddingVertical: '12px', alignItems: 'center' }} onClick={handleCreateOrder}>
                    <Text style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>生成空订单 → 去选酒</Text>
                  </View>
                  <Text style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px', textAlign: 'center' }}>创建空订单后跳转分类页选酒加购</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* 订单管理 */}
        {activeTab === 'orders' && (
          <View>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>订单管理</Text>
            {customerOrders.length === 0 ? (
              <View style={{ marginTop: '40px', alignItems: 'center' }}>
                <Text style={{ fontSize: '40px' }}>📋</Text>
                <Text style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '8px' }}>暂无订单</Text>
              </View>
            ) : (
              customerOrders.slice().reverse().map(order => (
                <View key={order.id} style={{ marginTop: '10px', backgroundColor: '#fff', borderRadius: '12px', padding: '14px' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>{order.customerName || order.customerPhone}</Text>
                    <View style={{ backgroundColor: order.status === 'delivered' ? '#D1FAE5' : order.status === 'paid' ? '#FEF3C7' : '#EDE9FE', borderRadius: '6px', paddingVertical: '2px', paddingHorizontal: '8px' }}>
                      <Text style={{ fontSize: '11px', color: order.status === 'delivered' ? '#059669' : order.status === 'paid' ? '#D97706' : '#7C3AED', fontWeight: 'bold' }}>
                        {order.status === 'delivered' ? '已核销' : order.status === 'paid' ? '待核销' : '选购中'}
                      </Text>
                    </View>
                  </View>
                  {order.items.length > 0 && (
                    <Text style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                      {order.items.map(i => i.productName + 'x' + i.quantity).join('、')}
                    </Text>
                  )}
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '6px' }}>
                    <Text style={{ fontSize: '12px', color: '#9CA3AF' }}>{order.deliveryType === 'pickup' ? '到店自提' : '配送上门'}</Text>
                    <Text style={{ fontSize: '14px', color: '#7C3AED', fontWeight: 'bold' }}>¥{order.totalAmount.toFixed(2)}</Text>
                  </View>
                  {order.verifyCode && (
                    <Text style={{ fontSize: '11px', color: '#059669', marginTop: '4px' }}>核销码：{order.verifyCode}</Text>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {/* 库存管理 */}
        {activeTab === 'inventory' && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>库存管理</Text>
              <Text style={{ fontSize: '13px', color: '#7C3AED' }}>零售值¥{inv.totalRetail} · {inv.totalQty}瓶</Text>
            </View>
            <View style={{ marginTop: '10px' }}>
              <View style={{ backgroundColor: canRestock() ? '#059669' : '#D1D5DB', borderRadius: '8px', paddingVertical: '10px', alignItems: 'center' }} onClick={() => canRestock() && restock()}>
                <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>补货（补充50%库存量）</Text>
              </View>
            </View>
            {agentInventory.map(item => (
              <View key={item.productId} style={{ marginTop: '8px', backgroundColor: '#fff', borderRadius: '12px', padding: '14px' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>{item.productName}</Text>
                    <Text style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>零售价 ¥{item.price}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: '18px', fontWeight: 'bold', color: item.quantity <= 3 ? '#EF4444' : '#059669' }}>{item.quantity}瓶</Text>
                    {item.sold > 0 && <Text style={{ fontSize: '11px', color: '#9CA3AF' }}>已售{item.sold}瓶</Text>}
                  </View>
                </View>
                <View style={{ marginTop: '8px', height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${item.quantity / (item.quantity + item.sold) * 100}%`, backgroundColor: item.quantity <= 3 ? '#EF4444' : '#059669', borderRadius: '3px' }} />
                </View>
                {item.quantity <= 3 && item.quantity > 0 && (
                  <Text style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>库存不足，请尽快补货</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* 接单赚外快 */}
        {activeTab === 'overflow' && (
          <View>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937' }}>接单赚外快</Text>
            <Text style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>附近自提点缺货时，您可以接单供应赚额外提成</Text>
            {overflowOrders.filter(o => o.status === 'pending').length === 0 ? (
              <View style={{ marginTop: '40px', alignItems: 'center' }}>
                <Text style={{ fontSize: '40px' }}>✅</Text>
                <Text style={{ fontSize: '14px', color: '#9CA3AF', marginTop: '8px' }}>暂无待接订单</Text>
              </View>
            ) : (
              overflowOrders.filter(o => o.status === 'pending').map(order => (
                <View key={order.id} style={{ marginTop: '10px', backgroundColor: '#FEF3C7', borderRadius: '12px', padding: '14px', borderWidth: '2px', borderColor: '#F59E0B' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#92400E' }}>来自：{order.fromPickupPoint}</Text>
                    <Text style={{ fontSize: '12px', color: '#D97706' }}>提成¥{order.commission.toFixed(2)}</Text>
                  </View>
                  <Text style={{ fontSize: '13px', color: '#78350F', marginTop: '6px' }}>
                    {order.items.map(i => i.productName + 'x' + i.quantity).join('、')}
                  </Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '8px', alignItems: 'center' }}>
                    <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#7C3AED' }}>¥{order.totalAmount.toFixed(2)}</Text>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ backgroundColor: '#D1D5DB', borderRadius: '6px', paddingVertical: '6px', paddingHorizontal: '14px', marginRight: '8px' }} onClick={() => declineOverflowOrder(order.id)}>
                        <Text style={{ fontSize: '13px', color: '#374151', fontWeight: 'bold' }}>拒绝</Text>
                      </View>
                      <View style={{ backgroundColor: '#059669', borderRadius: '6px', paddingVertical: '6px', paddingHorizontal: '14px' }} onClick={() => acceptOverflowOrder(order.id)}>
                        <Text style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>接单</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
            {overflowOrders.filter(o => o.status === 'accepted').map(order => (
              <View key={order.id} style={{ marginTop: '8px', backgroundColor: '#D1FAE5', borderRadius: '12px', padding: '14px' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#065F46' }}>已接单：{order.fromPickupPoint}</Text>
                  <Text style={{ fontSize: '12px', color: '#059669' }}>¥{order.totalAmount.toFixed(2)}</Text>
                </View>
                <View style={{ marginTop: '8px', backgroundColor: '#059669', borderRadius: '6px', paddingVertical: '8px', alignItems: 'center' }} onClick={() => fulfillOverflowOrder(order.id)}>
                  <Text style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>确认配送完成</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* 底部Tab栏 */}
      <View style={{ position: 'fixed', bottom: '0', left: '0', right: '0', backgroundColor: '#fff', borderTopWidth: '1px', borderTopColor: '#E5E7EB', flexDirection: 'row', paddingBottom: '8px', paddingTop: '6px' }}>
        {tabs.map(tab => (
          <View key={tab.id} style={{ flex: 1, alignItems: 'center', paddingTop: '6px' }} onClick={() => setActiveTab(tab.id)}>
            <Text style={{ fontSize: '20px' }}>{tab.icon}</Text>
            <Text style={{ fontSize: '11px', color: activeTab === tab.id ? '#7C3AED' : '#9CA3AF', marginTop: '2px', fontWeight: activeTab === tab.id ? 'bold' : 'normal' }}>{tab.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}
