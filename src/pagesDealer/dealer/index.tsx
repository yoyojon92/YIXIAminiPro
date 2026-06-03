/**
 * 经销商中心
 * - 推荐进度 + 等级
 * - 专属小程序码
 * - 返利明细 + 提现
 * - 团购团长资格
 * - 自提订单管理（接单→备货→自提/呼叫第三方配送）
 */
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useDealerStore } from '@/store/dealerStore'
import { useMemberStore } from '@/store/memberStore'

export default function DealerCenter() {
  const {
    isDealer, dealerLevel, referralCount, dealerCode,
    totalCommission, availableCommission, getCommissionRate,
    getNextDealerMilestone, getDealerLevelName, groupBuyEligible,
    dealerOrders, generateDealerCode, withdrawCommission,
    acceptDealerOrder, prepareDealerOrder, completePickupOrder,
    callThirdPartyDelivery,
  } = useDealerStore()
  const { isMember } = useMemberStore()

  const milestone = getNextDealerMilestone()
  const commissionRate = getCommissionRate()
  const levelName = getDealerLevelName()
  const pendingOrders = dealerOrders.filter(o => o.status !== 'picked_up')
  const completedOrders = dealerOrders.filter(o => o.status === 'picked_up')

  const handleShareQrCode = () => {
    const code = generateDealerCode()
    Taro.showToast({ title: `专属码: ${code}`, icon: 'none', duration: 3000 })
  }

  const handleWithdraw = () => {
    if (availableCommission < 1) {
      Taro.showToast({ title: '可提现余额不足1元', icon: 'none' })
      return
    }
    Taro.showModal({
      title: '确认提现',
      content: `提现 ¥${availableCommission.toFixed(2)} 到微信钱包？`,
      success: (res) => {
        if (res.confirm) withdrawCommission(availableCommission)
      }
    })
  }

  const statusText: Record<string, string> = {
    pending: '待接单',
    preparing: '备货中',
    ready: '已备好',
    picked_up: '已取走',
    delivering: '配送中',
  }

  return (
    <View style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', paddingBottom: '30px' }}>
      {/* 顶部等级卡片 */}
      <View style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', padding: '40px 16px 24px' }}>
        <Text style={{ color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
          {isDealer ? levelName : '经销商中心'}
        </Text>
        <View style={{ marginTop: '12px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px' }}>
          {isDealer ? (
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#FDE68A', fontSize: '14px' }}>推荐人数</Text>
                <Text style={{ color: '#fff', fontSize: '14px' }}>{referralCount}人</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '8px' }}>
                <Text style={{ color: '#FDE68A', fontSize: '14px' }}>返利比例</Text>
                <Text style={{ color: '#fff', fontSize: '14px' }}>{commissionRate}%</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '8px' }}>
                <Text style={{ color: '#FDE68A', fontSize: '14px' }}>可提现</Text>
                <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>¥{availableCommission.toFixed(2)}</Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ color: '#fff', fontSize: '14px' }}>
                推荐{milestone.target}人成为创始会员即可解锁经销商
              </Text>
              <Text style={{ color: '#FDE68A', fontSize: '13px', marginTop: '8px' }}>
                当前进度：{milestone.current}/{milestone.target}人
              </Text>
              {/* 进度条 */}
              <View style={{ marginTop: '8px', height: '8px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${Math.min(100, (milestone.current / milestone.target) * 100)}%`, backgroundColor: '#FBBF24', borderRadius: '4px' }} />
              </View>
            </View>
          )}
        </View>
      </View>

      {isDealer && (
        <View style={{ padding: '12px 16px' }}>
          {/* 操作按钮组 */}
          <View style={{ flexDirection: 'row', gap: '8px' }}>
            {/* 分享专属码 */}
            <View
              style={{ flex: 1, backgroundColor: '#fff', borderRadius: '12px', padding: '16px', alignItems: 'center' }}
              onClick={handleShareQrCode}
            >
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#7C3AED' }}>分享专属码</Text>
              <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>推荐赚返利</Text>
            </View>
            {/* 提现 */}
            <View
              style={{ flex: 1, backgroundColor: '#fff', borderRadius: '12px', padding: '16px', alignItems: 'center' }}
              onClick={handleWithdraw}
            >
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>¥{availableCommission.toFixed(2)}</Text>
              <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>点击提现</Text>
            </View>
          </View>

          {/* 团购团长 */}
          {groupBuyEligible && (
            <View style={{ marginTop: '8px', backgroundColor: '#FEF3C7', borderRadius: '12px', padding: '16px', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#92400E' }}>每月团购团长资格</Text>
                <Text style={{ fontSize: '12px', color: '#B45309', marginTop: '4px' }}>享固定酒品团购价</Text>
              </View>
              <Text style={{ fontSize: '13px', color: '#D97706' }}>已开通 →</Text>
            </View>
          )}

          {/* 返利概览 */}
          <View style={{ marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>返利概览</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: '12px' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#7C3AED' }}>¥{totalCommission.toFixed(2)}</Text>
                <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>累计返利</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>¥{availableCommission.toFixed(2)}</Text>
                <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>可提现</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#F59E0B' }}>{commissionRate}%</Text>
                <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>返利率</Text>
              </View>
            </View>
          </View>

          {/* 自提订单管理 */}
          <View style={{ marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>自提订单</Text>
            {pendingOrders.length === 0 ? (
              <Text style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '12px', textAlign: 'center' }}>暂无待处理订单</Text>
            ) : (
              pendingOrders.map(order => (
                <View key={order.id} style={{ marginTop: '12px', backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '12px' }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>{order.customerName}</Text>
                    <Text style={{ fontSize: '12px', color: '#7C3AED', backgroundColor: '#EDE9FE', paddingHorizontal: '8px', paddingVertical: '2px', borderRadius: '4px' }}>
                      {statusText[order.status] || order.status}
                    </Text>
                  </View>
                  <Text style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                    {order.products.map(p => `${p.name}x${p.qty}`).join(' ')}
                  </Text>
                  <Text style={{ fontSize: '13px', fontWeight: 'bold', color: '#1F2937', marginTop: '4px' }}>¥{order.totalAmount}</Text>
                  {order.redeemCode && (
                    <Text style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>核销码: {order.redeemCode}</Text>
                  )}
                  {/* 操作按钮 */}
                  <View style={{ flexDirection: 'row', gap: '8px', marginTop: '8px' }}>
                    {order.status === 'pending' && (
                      <View
                        style={{ flex: 1, backgroundColor: '#7C3AED', borderRadius: '6px', paddingVertical: '8px', alignItems: 'center' }}
                        onClick={() => acceptDealerOrder(order.id)}
                      >
                        <Text style={{ color: '#fff', fontSize: '13px' }}>接单</Text>
                      </View>
                    )}
                    {order.status === 'preparing' && (
                      <View
                        style={{ flex: 1, backgroundColor: '#059669', borderRadius: '6px', paddingVertical: '8px', alignItems: 'center' }}
                        onClick={() => prepareDealerOrder(order.id)}
                      >
                        <Text style={{ color: '#fff', fontSize: '13px' }}>备好货</Text>
                      </View>
                    )}
                    {order.status === 'ready' && (
                      <>
                        <View
                          style={{ flex: 1, backgroundColor: '#059669', borderRadius: '6px', paddingVertical: '8px', alignItems: 'center' }}
                          onClick={() => completePickupOrder(order.id)}
                        >
                          <Text style={{ color: '#fff', fontSize: '13px' }}>确认取走</Text>
                        </View>
                        <View
                          style={{ flex: 1, backgroundColor: '#EA580C', borderRadius: '6px', paddingVertical: '8px', alignItems: 'center' }}
                          onClick={() => callThirdPartyDelivery(order.id)}
                        >
                          <Text style={{ color: '#fff', fontSize: '13px' }}>呼叫配送</Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      )}

      {/* 未解锁经销商的引导 */}
      {!isDealer && (
        <View style={{ padding: '16px' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px' }}>
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>成为经销商</Text>
            <Text style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px', lineHeightHeight: '20px' }}>
              1. 分享小程序给好友{'\n'}
              2. 好友扫码并成为创始会员{'\n'}
              3. 累计20人 → 解锁青铜经销商{'\n'}
              4. 享受5%返利，可提现{'\n'}
              5. 每月团购团长资格{'\n'}
              {'\n'}
              推荐50人 → 白银经销商(7%返利){'\n'}
              推荐100人 → 黄金经销商(10%返利)
            </Text>
            <View
              style={{ marginTop: '16px', backgroundColor: '#7C3AED', borderRadius: '8px', paddingVertical: '12px', alignItems: 'center' }}
              onClick={handleShareQrCode}
            >
              <Text style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>立即分享赚钱</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
