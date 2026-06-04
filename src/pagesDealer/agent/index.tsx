/**
 * 区域代理中心（V4 - 2026-06-05重构）
 * 成为代理→选等级→支付→进货/补货/替顾客下单
 */
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useDealerStore, AGENT_CONFIG, AGENT_LEVEL_NAMES } from '@/store/dealerStore'
import type { AgentLevel } from '@/store/dealerStore'

const AGENT_TIERS: Array<{
  level: AgentLevel; deposit: number; name: string; discount: string;
  duration: string; commission: string; color: string; bgColor: string; borderColor: string; icon: string;
}> = [
  { level: 'bronze', deposit: 2000, name: '铜牌代理', discount: '9.5折', duration: '3个月', commission: '10%', color: '#B45309', bgColor: '#FEF3C7', borderColor: '#F59E0B', icon: '🥉' },
  { level: 'silver', deposit: 5000, name: '银牌代理', discount: '9折', duration: '6个月', commission: '15%', color: '#4B5563', bgColor: '#F3F4F6', borderColor: '#9CA3AF', icon: '🥈' },
  { level: 'gold', deposit: 10000, name: '金牌代理', discount: '8.5折', duration: '1年', commission: '18%', color: '#92400E', bgColor: '#FEF3C7', borderColor: '#D97706', icon: '🥇' },
]

export default function AgentCenter() {
  const {
    isAgent, agentLevel, hasStockedUp, agentInventory,
    agentTotalSales, agentCommission, agentSecondaryCode, agentSecondarySales,
    getAgentDiscount, getAgentCommissionRate, getAgentDaysLeft,
    activateAgent, stockUp, restock, canRestock, getInventoryTotal,
  } = useDealerStore()

  const discount = getAgentDiscount()
  const commissionRate = getAgentCommissionRate()
  const daysLeft = getAgentDaysLeft()
  const inv = getInventoryTotal()

  const handleSelectTier = (level: AgentLevel) => {
    if (level === 'none') return
    const config = AGENT_CONFIG[level]
    Taro.showModal({
      title: `确认开通${config.name}`,
      content: `支付¥${config.deposit}拿等值酒水囤货，享${config.discount}折拿货，${config.durationMonths}个月代理权，${config.commissionRate}%销售提成。确认开通？`,
      confirmText: '确认支付',
      confirmColor: '#7C3AED',
      success: (res) => { if (res.confirm) activateAgent(level) }
    })
  }

  const handleStockUp = () => {
    Taro.showModal({
      title: '确认进货',
      content: '系统将按代理等级自动分配等值酒水到您的库存，确认进货？',
      confirmText: '确认进货',
      confirmColor: '#7C3AED',
      success: (res) => { if (res.confirm) stockUp() }
    })
  }

  const handleRestock = () => {
    Taro.showModal({
      title: '确认补货',
      content: '按首次进货量50%补充库存，确认补货？',
      confirmText: '确认补货',
      confirmColor: '#059669',
      success: (res) => { if (res.confirm) restock() }
    })
  }

  const handleOrderForCustomer = () => {
    Taro.navigateTo({ url: '/pagesDealer/workbench/index?tab=order' })
  }

  const handleGoWorkbench = () => {
    Taro.navigateTo({ url: '/pagesDealer/workbench/index' })
  }

  return (
    <View style={{ minHeight: '100vh', backgroundColor: '#FAF5FF', paddingBottom: '30px' }}>
      {/* 顶部 */}
      <View style={{ background: 'linear-gradient(135deg, #1E40AF, #7C3AED)', padding: '40px 16px 24px' }}>
        <Text style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>
          {isAgent ? AGENT_LEVEL_NAMES[agentLevel] : '成为代理'}
        </Text>
        {isAgent && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: '16px' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FDE68A', fontSize: '24px', fontWeight: 'bold' }}>{discount}折</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' }}>拿货折扣</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FDE68A', fontSize: '24px', fontWeight: 'bold' }}>{commissionRate}%</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' }}>销售提成</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#FDE68A', fontSize: '24px', fontWeight: 'bold' }}>{daysLeft}天</Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' }}>剩余天数</Text>
            </View>
          </View>
        )}
      </View>

      <View style={{ padding: '12px 16px' }}>
        {/* 已开通代理 - 进货/补货/替顾客下单 */}
        {isAgent && (
          <View>
            {/* 业绩看板 */}
            <View style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
              <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>业绩看板</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: '12px' }}>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#7C3AED' }}>¥{agentTotalSales.toFixed(0)}</Text>
                  <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>累计销售</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>¥{agentCommission.toFixed(2)}</Text>
                  <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>累计提成</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#F59E0B' }}>{inv.soldQty}瓶</Text>
                  <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>已售出</Text>
                </View>
              </View>
            </View>

            {/* 库存概览 */}
            {hasStockedUp && (
              <View style={{ marginTop: '8px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>库存概览</Text>
                  <Text style={{ fontSize: '13px', color: '#7C3AED' }}>零售值¥{inv.totalRetail} · {inv.totalQty}瓶</Text>
                </View>
                {agentInventory.slice(0, 4).map(item => (
                  <View key={item.productId} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '8px', paddingBottom: '6px', borderBottomWidth: '1px', borderBottomColor: '#F3F4F6' }}>
                    <Text style={{ fontSize: '13px', color: '#374151' }}>{item.productName}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: '13px', color: item.quantity <= 3 ? '#EF4444' : '#059669', fontWeight: 'bold' }}>{item.quantity}瓶</Text>
                      {item.sold > 0 && <Text style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: '6px' }}>已售{item.sold}</Text>}
                    </View>
                  </View>
                ))}
                {agentInventory.length > 4 && (
                  <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px', textAlign: 'center' }}>共{agentInventory.length}款酒水</Text>
                )}
              </View>
            )}

            {/* 操作按钮组 */}
            <View style={{ marginTop: '12px', flexDirection: 'row', gap: '8px' }}>
              {/* 进货 */}
              {!hasStockedUp && (
                <View style={{ flex: 1, backgroundColor: '#7C3AED', borderRadius: '12px', paddingVertical: '14px', alignItems: 'center' }} onClick={handleStockUp}>
                  <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>📦 进货</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px' }}>自动分配酒水到库存</Text>
                </View>
              )}
              {/* 补货 */}
              {hasStockedUp && (
                <View style={{ flex: 1, backgroundColor: canRestock() ? '#059669' : '#D1D5DB', borderRadius: '12px', paddingVertical: '14px', alignItems: 'center' }} onClick={() => canRestock() && handleRestock()}>
                  <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>🔄 补货</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px' }}>{canRestock() ? '补充50%库存量' : '需卖出后才能补货'}</Text>
                </View>
              )}
              {/* 替顾客下单 */}
              {hasStockedUp && (
                <View style={{ flex: 1, backgroundColor: '#F59E0B', borderRadius: '12px', paddingVertical: '14px', alignItems: 'center' }} onClick={handleOrderForCustomer}>
                  <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>🛒 替顾客下单</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px' }}>填写电话地址即可</Text>
                </View>
              )}
            </View>

            {/* 自提点工作台入口 */}
            {hasStockedUp && (
              <View style={{ marginTop: '12px', backgroundColor: '#1E40AF', borderRadius: '12px', padding: '16px' }} onClick={handleGoWorkbench}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>🏪 自提点工作台</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '4px' }}>扫码核销 · 接单 · 库存管理</Text>
                  </View>
                  <Text style={{ color: '#FDE68A', fontSize: '16px', fontWeight: 'bold', fontStyle: 'italic' }}>Go!</Text>
                </View>
              </View>
            )}

            {/* 分享二维码 */}
            <View style={{ marginTop: '8px', backgroundColor: '#EDE9FE', borderRadius: '12px', padding: '16px' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#5B21B6' }}>📢 宣传小程序</Text>
              <Text style={{ fontSize: '12px', color: '#6D28D9', marginTop: '6px', lineHeight: '20px' }}>
                分享您的专属二维码，顾客在家自主下单{'\n'}
                自提点自提 · 满50起送 · 不足50到店自提{'\n'}
                您的提成自动计入！
              </Text>
            </View>

            {/* 金牌代理专属 */}
            {agentLevel === 'gold' && agentSecondaryCode && (
              <View style={{ marginTop: '8px', backgroundColor: '#FEF3C7', borderRadius: '12px', padding: '16px' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#92400E' }}>金牌专属·次级代理码</Text>
                    <Text style={{ fontSize: '12px', color: '#B45309', marginTop: '4px' }}>次级代理销售5%分红</Text>
                  </View>
                  <View style={{ backgroundColor: '#D97706', borderRadius: '8px', paddingVertical: '8px', paddingHorizontal: '16px' }} onClick={() => Taro.setClipboardData({ data: agentSecondaryCode, success: () => Taro.showToast({ title: '已复制', icon: 'success' }) })}>
                    <Text style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>复制</Text>
                  </View>
                </View>
                <Text style={{ fontSize: '14px', color: '#78350F', fontWeight: 'bold', marginTop: '8px' }}>专属码：{agentSecondaryCode}</Text>
              </View>
            )}
          </View>
        )}

        {/* 三档代理选择（未开通或查看等级） */}
        <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937', marginTop: isAgent ? '16px' : '0' }}>
          {isAgent ? '代理等级说明' : '选择代理等级'}
        </Text>

        {AGENT_TIERS.map((tier) => {
          const isCurrent = isAgent && agentLevel === tier.level
          return (
            <View key={tier.level} style={{ marginTop: '12px', backgroundColor: isCurrent ? tier.bgColor : '#fff', borderRadius: '12px', padding: '16px', borderWidth: '2px', borderColor: isCurrent ? tier.borderColor : '#E5E7EB' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: '28px' }}>{tier.icon}</Text>
                  <View style={{ marginLeft: '10px' }}>
                    <Text style={{ fontSize: '16px', fontWeight: 'bold', color: tier.color }}>{tier.name}</Text>
                    <Text style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>¥{tier.deposit}等值酒水囤货</Text>
                  </View>
                </View>
                {isCurrent && (
                  <View style={{ backgroundColor: tier.borderColor, borderRadius: '12px', paddingVertical: '4px', paddingHorizontal: '10px' }}>
                    <Text style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>当前等级</Text>
                  </View>
                )}
              </View>
              <View style={{ marginTop: '12px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '8px', padding: '12px' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: '13px', color: '#6B7280' }}>拿货折扣</Text>
                  <Text style={{ fontSize: '13px', fontWeight: 'bold', color: tier.color }}>{tier.discount}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '6px' }}>
                  <Text style={{ fontSize: '13px', color: '#6B7280' }}>代理期限</Text>
                  <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>{tier.duration}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '6px' }}>
                  <Text style={{ fontSize: '13px', color: '#6B7280' }}>销售提成</Text>
                  <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#059669' }}>{tier.commission}</Text>
                </View>
              </View>
              {!isCurrent && (
                <View style={{ marginTop: '12px', backgroundColor: tier.color, borderRadius: '8px', paddingVertical: '10px', alignItems: 'center' }} onClick={() => handleSelectTier(tier.level)}>
                  <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                    {isAgent && agentLevel !== 'none' ? '升级' : '开通'}¥{tier.deposit}
                  </Text>
                </View>
              )}
            </View>
          )
        })}

        {/* 规则说明 */}
        <View style={{ marginTop: '16px', backgroundColor: '#EDE9FE', borderRadius: '12px', padding: '16px' }}>
          <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#5B21B6' }}>代理规则</Text>
          <Text style={{ fontSize: '12px', color: '#6D28D9', marginTop: '8px', lineHeight: '20px' }}>
            · 铜牌¥2000：9.5折囤货，3月权，10%提成{'\n'}
            · 3月内销完¥2000+再拿¥3000→升级银牌{'\n'}
            · 银牌¥5000：9折囤货，6月权，15%提成{'\n'}
            · 6月内销完¥5000+再拿¥5000→升级金牌{'\n'}
            · 金牌¥10000：8.5折囤货，1年权，18%提成+5%次级分红{'\n'}
            · 超期不累计，需重新计算{'\n'}
            · 顾客选自提→生成核销码→您扫码核销发货{'\n'}
            · 可接附近自提点缺货漏单赚额外提成
          </Text>
        </View>
      </View>
    </View>
  )
}
