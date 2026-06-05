/**
 * 区域代理中心（V5 - 2026-06-05积分体系重构）
 * 积分替代押金，1元=1积分只做记录不做货币
 * 配货逻辑：首次2000@9.5折 + 升银追加3000@9折 + 升金追加8000@8.5折
 */
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useDealerStore, AGENT_CONFIG, AGENT_LEVEL_NAMES } from '@/store/dealerStore'
import type { AgentLevel } from '@/store/dealerStore'

const AGENT_TIERS: Array<{
  level: AgentLevel; points: number; name: string; discount: string;
  duration: string; commission: string; stockAmount: string; color: string; bgColor: string; borderColor: string; icon: string;
}> = [
  { level: 'bronze', points: 2000, name: '铜牌代理', discount: '9.5折', duration: '3个月', commission: '10%', stockAmount: '¥2000等值', color: '#B45309', bgColor: '#FEF3C7', borderColor: '#F59E0B', icon: '🥉' },
  { level: 'silver', points: 5000, name: '银牌代理', discount: '9折', duration: '6个月', commission: '15%', stockAmount: '追加¥3000', color: '#4B5563', bgColor: '#F3F4F6', borderColor: '#9CA3AF', icon: '🥈' },
  { level: 'gold', points: 10000, name: '金牌代理', discount: '8.5折', duration: '1年', commission: '18%', stockAmount: '追加¥8000', color: '#92400E', bgColor: '#FEF3C7', borderColor: '#D97706', icon: '🥇' },
]

export default function AgentCenter() {
  const {
    isAgent, agentLevel, hasStockedUp, hasUpgradeStockedUp, agentInventory,
    agentTotalSales, agentCommission, agentSecondaryCode,
    totalPoints, rechargedPoints, earnedPoints,
    getAgentDiscount, getAgentCommissionRate, getAgentDaysLeft,
    activateAgent, stockUp, restock, canRestock, getInventoryTotal,
    getWithdrawablePoints, withdrawPoints, upgradeAgent, upgradeRestock, getPointsLevel,
  } = useDealerStore()

  const discount = getAgentDiscount()
  const commissionRate = getAgentCommissionRate()
  const daysLeft = getAgentDaysLeft()
  const inv = getInventoryTotal()
  const withdrawable = getWithdrawablePoints()
  const pointsLevel = getPointsLevel()

  /** 开通铜牌代理：充值2000 */
  const handleActivateBronze = () => {
    Taro.showModal({
      title: '开通铜牌代理',
      content: '充值¥2000获得2000积分，解锁铜牌代理。享9.5折拿货、3个月代理权、10%销售提成。\n\n⚠️实际充值通过美团储值完成，确认开通？',
      confirmText: '确认开通',
      confirmColor: '#7C3AED',
      success: (res) => {
        if (res.confirm) {
          useDealerStore.getState().rechargePoints(2000, '开通铜牌代理充值¥2000')
          activateAgent('bronze')
        }
      }
    })
  }

  /** 充值升级 */
  const handleUpgrade = (targetLevel: AgentLevel) => {
    if (targetLevel === 'none') return
    const targetConfig = AGENT_CONFIG[targetLevel]
    const needAmount = targetConfig.pointsThreshold - totalPoints
    if (needAmount <= 0) {
      Taro.showModal({
        title: '积分已达标',
        content: `您已有${totalPoints}积分，已达${targetConfig.name}门槛（${targetConfig.pointsThreshold}），可直接升级！`,
        confirmText: '立即升级',
        confirmColor: '#7C3AED',
        success: (res) => { if (res.confirm) upgradeAgent(0) }
      })
      return
    }
    Taro.showModal({
      title: `充值升级${targetConfig.name}`,
      content: `当前${totalPoints}积分，需再充值¥${needAmount}达到${targetConfig.pointsThreshold}积分。\n升级后享${targetConfig.discount}折拿货，${targetConfig.durationMonths}个月代理权，${targetConfig.commissionRate}%提成。\n\n⚠️实际充值通过美团储值完成`,
      confirmText: `充值¥${needAmount}`,
      confirmColor: '#7C3AED',
      success: (res) => { if (res.confirm) upgradeAgent(needAmount) }
    })
  }

  /** 提现 */
  const handleWithdraw = () => {
    if (withdrawable <= 0) {
      Taro.showToast({ title: '无可提现积分', icon: 'none' })
      return
    }
    Taro.showModal({
      title: '提现积分',
      content: `可提现积分：${withdrawable}（累计${totalPoints} - 充值${rechargedPoints}）\n\n提现将申请至您的微信账户`,
      confirmText: `提现${withdrawable}积分`,
      confirmColor: '#059669',
      success: (res) => { if (res.confirm) withdrawPoints(withdrawable) }
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

  const handleUpgradeRestock = () => {
    const config = agentLevel !== 'none' ? AGENT_CONFIG[agentLevel] : null
    if (!config?.upgradeRestockAmount) return
    Taro.showModal({
      title: '升级追加配货',
      content: `升级后追加¥${config.upgradeRestockAmount}以${config.discount}折拿货，确认配货？`,
      confirmText: '确认配货',
      confirmColor: '#7C3AED',
      success: (res) => { if (res.confirm) upgradeRestock() }
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

  /** 获取下一级信息 */
  const getNextLevel = (): AgentLevel => {
    if (agentLevel === 'bronze') return 'silver'
    if (agentLevel === 'silver') return 'gold'
    return 'none'
  }
  const nextLevel = getNextLevel()
  const nextConfig = nextLevel !== 'none' ? AGENT_CONFIG[nextLevel] : null
  const upgradeProgress = nextConfig ? Math.min(100, Math.round(totalPoints / nextConfig.pointsThreshold * 100)) : 0

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
        {/* ====== 积分看板（V5核心） ====== */}
        <View style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '16px', marginTop: '8px' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>积分看板</Text>
            <View style={{ backgroundColor: totalPoints >= 10000 ? '#FEF3C7' : totalPoints >= 5000 ? '#F3F4F6' : totalPoints >= 2000 ? '#FEF3C7' : '#F3E8FF', borderRadius: '10px', paddingVertical: '3px', paddingHorizontal: '10px' }}>
              <Text style={{ fontSize: '12px', fontWeight: 'bold', color: totalPoints >= 10000 ? '#92400E' : totalPoints >= 5000 ? '#4B5563' : totalPoints >= 2000 ? '#B45309' : '#7C3AED' }}>
                {totalPoints >= 2000 ? AGENT_LEVEL_NAMES[pointsLevel] : '未开通'}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: '12px' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: '22px', fontWeight: 'bold', color: '#7C3AED' }}>{totalPoints}</Text>
              <Text style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>累计积分</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: '22px', fontWeight: 'bold', color: '#F59E0B' }}>{rechargedPoints}</Text>
              <Text style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>充值积分</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: '22px', fontWeight: 'bold', color: '#059669' }}>{earnedPoints}</Text>
              <Text style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>赚取积分</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: '22px', fontWeight: 'bold', color: '#EF4444' }}>{withdrawable}</Text>
              <Text style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>可提现</Text>
            </View>
          </View>

          {/* 积分来源说明 */}
          <View style={{ marginTop: '10px', backgroundColor: '#F3E8FF', borderRadius: '8px', padding: '8px 10px' }}>
            <Text style={{ fontSize: '11px', color: '#6D28D9', lineHeight: '18px' }}>
              💡 1元充值=1积分 | 推荐注册+1 | 推荐创始会员+10 | 名下消费奖励 | 美团核销同步
            </Text>
          </View>
        </View>

        {/* ====== 升级进度条 ====== */}
        {isAgent && nextConfig && (
          <View style={{ marginTop: '8px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#1F2937' }}>
                升级{AGENT_LEVEL_NAMES[nextLevel]}
              </Text>
              <Text style={{ fontSize: '13px', color: '#7C3AED' }}>{totalPoints}/{nextConfig.pointsThreshold}积分</Text>
            </View>
            {/* 进度条 */}
            <View style={{ marginTop: '8px', height: '8px', backgroundColor: '#E9D5FF', borderRadius: '4px', overflow: 'hidden' }}>
              <View style={{ width: `${upgradeProgress}%`, height: '8px', backgroundColor: '#7C3AED', borderRadius: '4px' }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '6px' }}>
              <Text style={{ fontSize: '11px', color: '#9CA3AF' }}>升级后追加¥{nextConfig.upgradeRestockAmount}以{nextConfig.discount}折拿货</Text>
              <Text style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 'bold' }}>{upgradeProgress}%</Text>
            </View>
            {totalPoints < nextConfig.pointsThreshold && (
              <View style={{ marginTop: '8px', backgroundColor: '#7C3AED', borderRadius: '8px', paddingVertical: '10px', alignItems: 'center' }} onClick={() => handleUpgrade(nextLevel)}>
                <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                  充值¥{nextConfig.pointsThreshold - totalPoints}升级{AGENT_LEVEL_NAMES[nextLevel]}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ====== 已开通代理 - 业绩看板+操作 ====== */}
        {isAgent && (
          <View>
            {/* 业绩看板 */}
            <View style={{ marginTop: '8px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
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
              {/* 首次进货 */}
              {!hasStockedUp && (
                <View style={{ flex: 1, backgroundColor: '#7C3AED', borderRadius: '12px', paddingVertical: '14px', alignItems: 'center' }} onClick={handleStockUp}>
                  <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>📦 进货</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px' }}>自动分配酒水到库存</Text>
                </View>
              )}
              {/* 升级追加配货 */}
              {hasStockedUp && !hasUpgradeStockedUp && agentLevel !== 'none' && AGENT_CONFIG[agentLevel]?.upgradeRestockAmount && (
                <View style={{ flex: 1, backgroundColor: '#F59E0B', borderRadius: '12px', paddingVertical: '14px', alignItems: 'center' }} onClick={handleUpgradeRestock}>
                  <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>📦 追加配货</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px' }}>¥{AGENT_CONFIG[agentLevel].upgradeRestockAmount}按{discount}折</Text>
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

            {/* 提现按钮 */}
            {withdrawable > 0 && (
              <View style={{ marginTop: '8px', backgroundColor: '#059669', borderRadius: '12px', padding: '14px', alignItems: 'center' }} onClick={handleWithdraw}>
                <Text style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>💰 提现{withdrawable}积分</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', marginTop: '2px' }}>可提现=累计{totalPoints}-充值{rechargedPoints}</Text>
              </View>
            )}

            {/* 自提点工作台入口 */}
            {hasStockedUp && (
              <View style={{ marginTop: '8px', backgroundColor: '#1E40AF', borderRadius: '12px', padding: '16px' }} onClick={handleGoWorkbench}>
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
                您的提成自动计入！推荐注册+1积分
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

        {/* ====== 三档代理选择（未开通） ====== */}
        {!isAgent && (
          <View>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937', marginTop: '12px' }}>选择代理等级</Text>
            {AGENT_TIERS.map((tier) => (
              <View key={tier.level} style={{ marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px', borderWidth: '2px', borderColor: '#E5E7EB' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: '28px' }}>{tier.icon}</Text>
                    <View style={{ marginLeft: '10px' }}>
                      <Text style={{ fontSize: '16px', fontWeight: 'bold', color: tier.color }}>{tier.name}</Text>
                      <Text style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{tier.points}积分解锁 · {tier.stockAmount}配货</Text>
                    </View>
                  </View>
                </View>
                <View style={{ marginTop: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '12px' }}>
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
                {tier.level === 'bronze' && (
                  <View style={{ marginTop: '12px', backgroundColor: tier.color, borderRadius: '8px', paddingVertical: '10px', alignItems: 'center' }} onClick={handleActivateBronze}>
                    <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>充值¥2000开通铜牌</Text>
                  </View>
                )}
              </View>
            ))}

            {/* 已开通后显示等级说明 */}
          </View>
        )}

        {/* 已开通代理 - 等级说明 */}
        {isAgent && (
          <View>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F2937', marginTop: '16px' }}>代理等级说明</Text>
            {AGENT_TIERS.map((tier) => {
              const isCurrent = agentLevel === tier.level
              return (
                <View key={tier.level} style={{ marginTop: '12px', backgroundColor: isCurrent ? tier.bgColor : '#fff', borderRadius: '12px', padding: '16px', borderWidth: '2px', borderColor: isCurrent ? tier.borderColor : '#E5E7EB' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: '28px' }}>{tier.icon}</Text>
                      <View style={{ marginLeft: '10px' }}>
                        <Text style={{ fontSize: '16px', fontWeight: 'bold', color: tier.color }}>{tier.name}</Text>
                        <Text style={{ fontSize: '13px', color: '#6B7280', marginTop: '2px' }}>{tier.points}积分 · {tier.stockAmount}</Text>
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
                  {/* 升级按钮 */}
                  {!isCurrent && tier.level !== 'bronze' && (tier.level === 'silver' || tier.level === 'gold') && (
                    <View style={{ marginTop: '12px', backgroundColor: tier.color, borderRadius: '8px', paddingVertical: '10px', alignItems: 'center' }} onClick={() => handleUpgrade(tier.level)}>
                      <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>充值升级{tier.name}</Text>
                    </View>
                  )}
                </View>
              )
            })}
          </View>
        )}

        {/* 规则说明 V5 */}
        <View style={{ marginTop: '16px', backgroundColor: '#EDE9FE', borderRadius: '12px', padding: '16px' }}>
          <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#5B21B6' }}>V5积分代理规则</Text>
          <Text style={{ fontSize: '12px', color: '#6D28D9', marginTop: '8px', lineHeight: '20px' }}>
            · 积分=记录≠货币，1元充值=1积分{'\n'}
            · 铜牌：2000积分解锁，9.5折拿货，3月权{'\n'}
            · 银牌：5000积分解锁，9折拿货，6月权{'\n'}
            · 金牌：10000积分解锁，8.5折拿货，1年权{'\n'}
            · 升银后追加¥3000按9折配货{'\n'}
            · 升金后追加¥8000按8.5折配货{'\n'}
            · 可提现=累计积分-充值积分{'\n'}
            · 推荐注册+1积分，推荐创始会员+10积分{'\n'}
            · 名下用户消费1%奖励积分{'\n'}
            · 美团储值核销后积分自动同步{'\n'}
            · 充值通过美团储值完成，不在小程序内收款{'\n'}
            · 3个月内可提现/充值升级/原等级补货
          </Text>
        </View>
      </View>
    </View>
  )
}
