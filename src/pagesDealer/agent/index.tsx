/**
 * 区域代理中心（V3 - 2026-06-05重构）
 * 三档代理囤货体系：
 * - 铜牌代理¥2000：9.5折拿货，3个月，10%提成
 * - 银牌代理¥5000：9折拿货，6个月，15%提成
 * - 金牌代理¥10000：8.5折拿货，1年，18%提成+次级代理5%分红
 */
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useDealerStore, AGENT_CONFIG, AGENT_LEVEL_NAMES } from '@/store/dealerStore'
import type { AgentLevel } from '@/store/dealerStore'

/** 三档代理配置（UI展示用） */
const AGENT_TIERS: Array<{
  level: AgentLevel
  deposit: number
  name: string
  discount: string
  duration: string
  commission: string
  secondary: string
  upgrade: string
  color: string
  bgColor: string
  borderColor: string
  icon: string
}> = [
  {
    level: 'bronze',
    deposit: 2000,
    name: '铜牌代理',
    discount: '9.5折',
    duration: '3个月',
    commission: '10%',
    secondary: '-',
    upgrade: '3个月内销完¥2000+再拿¥3000→升级银牌',
    color: '#B45309',
    bgColor: '#FEF3C7',
    borderColor: '#F59E0B',
    icon: '🥉',
  },
  {
    level: 'silver',
    deposit: 5000,
    name: '银牌代理',
    discount: '9折',
    duration: '6个月',
    commission: '15%',
    secondary: '-',
    upgrade: '6个月内销完¥5000+再拿¥5000→升级金牌',
    color: '#4B5563',
    bgColor: '#F3F4F6',
    borderColor: '#9CA3AF',
    icon: '🥈',
  },
  {
    level: 'gold',
    deposit: 10000,
    name: '金牌代理',
    discount: '8.5折',
    duration: '1年',
    commission: '18%',
    secondary: '+次级代理5%分红',
    upgrade: '已为最高等级',
    color: '#92400E',
    bgColor: '#FEF3C7',
    borderColor: '#D97706',
    icon: '🥇',
  },
]

export default function AgentCenter() {
  const {
    isAgent, agentLevel, agentActivatedAt, agentExpireAt,
    agentTotalSales, agentCommission, agentSecondaryCode, agentSecondarySales,
    getAgentDiscount, getAgentCommissionRate, getAgentDaysLeft,
    activateAgent,
  } = useDealerStore()

  const discount = getAgentDiscount()
  const commissionRate = getAgentCommissionRate()
  const daysLeft = getAgentDaysLeft()

  const handleSelectTier = (level: AgentLevel) => {
    if (level === 'none') return
    const config = AGENT_CONFIG[level]
    Taro.showModal({
      title: `确认开通${config.name}`,
      content: `支付¥${config.deposit}拿等值酒水囤货，享${config.discount}折拿货，${config.durationMonths}个月代理权，${config.commissionRate}%销售提成。确认开通？`,
      confirmText: '确认开通',
      confirmColor: '#7C3AED',
      success: (res) => {
        if (res.confirm) {
          // 模拟支付（后续对接微信支付API）
          activateAgent(level)
        }
      }
    })
  }

  const handleCopySecondaryCode = () => {
    if (!agentSecondaryCode) return
    Taro.setClipboardData({ data: agentSecondaryCode, success: () => {
      Taro.showToast({ title: '次级代理码已复制', icon: 'success' })
    }})
  }

  return (
    <View style={{ minHeight: '100vh', backgroundColor: '#FAF5FF', paddingBottom: '30px' }}>
      {/* 顶部 */}
      <View style={{ background: 'linear-gradient(135deg, #1E40AF, #7C3AED)', padding: '40px 16px 24px' }}>
        <Text style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>
          {isAgent ? AGENT_LEVEL_NAMES[agentLevel] : '区域代理中心'}
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
        {/* 已开通代理的业绩看板 */}
        {isAgent && (
          <View style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginTop: '0px' }}>
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
              {agentLevel === 'gold' && (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#D97706' }}>¥{agentSecondarySales.toFixed(0)}</Text>
                  <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>次级代理销售</Text>
                </View>
              )}
            </View>

            {/* 代理到期时间 */}
            {agentExpireAt && (
              <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '12px', textAlign: 'center' }}>
                代理到期：{new Date(agentExpireAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        )}

        {/* 金牌代理专属：次级代理码 */}
        {isAgent && agentLevel === 'gold' && agentSecondaryCode && (
          <View style={{ marginTop: '8px', backgroundColor: '#FEF3C7', borderRadius: '12px', padding: '16px' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#92400E' }}>金牌专属·次级代理码</Text>
                <Text style={{ fontSize: '12px', color: '#B45309', marginTop: '4px' }}>次级代理销售收入5%分红</Text>
              </View>
              <View
                style={{ backgroundColor: '#D97706', borderRadius: '8px', paddingVertical: '8px', paddingHorizontal: '16px' }}
                onClick={handleCopySecondaryCode}
              >
                <Text style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>复制码</Text>
              </View>
            </View>
            <Text style={{ fontSize: '14px', color: '#78350F', fontWeight: 'bold', marginTop: '8px' }}>
              专属码：{agentSecondaryCode}
            </Text>
          </View>
        )}

        {/* 三档代理选择 */}
        <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937', marginTop: '16px' }}>
          {isAgent ? '代理等级说明' : '选择代理等级'}
        </Text>

        {AGENT_TIERS.map((tier) => {
          const isCurrentTier = isAgent && agentLevel === tier.level
          return (
            <View
              key={tier.level}
              style={{
                marginTop: '12px',
                backgroundColor: isCurrentTier ? tier.bgColor : '#fff',
                borderRadius: '12px',
                padding: '16px',
                borderWidth: '2px',
                borderColor: isCurrentTier ? tier.borderColor : '#E5E7EB',
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: '28px' }}>{tier.icon}</Text>
                  <View style={{ marginLeft: '10px' }}>
                    <Text style={{ fontSize: '16px', fontWeight: 'bold', color: tier.color }}>{tier.name}</Text>
                    <Text style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>¥{tier.deposit}等值酒水囤货</Text>
                  </View>
                </View>
                {isCurrentTier && (
                  <View style={{ backgroundColor: tier.borderColor, borderRadius: '12px', paddingVertical: '4px', paddingHorizontal: '10px' }}>
                    <Text style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>当前等级</Text>
                  </View>
                )}
              </View>

              {/* 权益详情 */}
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
                {tier.level === 'gold' && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '6px' }}>
                    <Text style={{ fontSize: '13px', color: '#6B7280' }}>次级代理分红</Text>
                    <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#D97706' }}>5%</Text>
                  </View>
                )}
              </View>

              {/* 升级路径 */}
              <Text style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '8px' }}>
                升级路径：{tier.upgrade}
              </Text>

              {/* 开通按钮 */}
              {!isCurrentTier && (
                <View
                  style={{
                    marginTop: '12px',
                    backgroundColor: tier.color,
                    borderRadius: '8px',
                    paddingVertical: '10px',
                    alignItems: 'center',
                  }}
                  onClick={() => handleSelectTier(tier.level)}
                >
                  <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                    {isAgent && agentLevel !== 'none' ? '升级' : '开通'}¥{tier.deposit}
                  </Text>
                </View>
              )}
            </View>
          )
        })}

        {/* 说明文字 */}
        <View style={{ marginTop: '16px', backgroundColor: '#EDE9FE', borderRadius: '12px', padding: '16px' }}>
          <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#5B21B6' }}>代理规则说明</Text>
          <Text style={{ fontSize: '12px', color: '#6D28D9', marginTop: '8px', lineHeight: '20px' }}>
            · 铜牌代理¥2000：9.5折拿等值酒水，3个月代理权，10%销售提成{'\n'}
            · 3个月内销完¥2000并再拿货¥3000可升级银牌{'\n'}
            · 超过3个月不累计，需重新计算{'\n'}
            · 银牌代理¥5000：9折拿等值酒水，6个月代理权，15%提成{'\n'}
            · 6个月内销完¥5000并再拿货¥5000可升级金牌{'\n'}
            · 金牌代理¥10000：8.5折拿等值酒水，1年代理权，18%提成{'\n'}
            · 金牌享专属次级代理码，次级代理销售收入5%分红{'\n'}
            · 佣金从客户支付→商户返回数据→系统计算提成→计入代理页面
          </Text>
        </View>
      </View>
    </View>
  )
}
