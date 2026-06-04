/**
 * 经销商中心
 * - 纯分销角色：分享小程序赚返利，不处理订单
 * - 推荐进度 + 等级 + 返利 + 提现
 */
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useDealerStore } from '@/store/dealerStore'

export default function DealerCenter() {
  const {
    isDealer, dealerLevel, referralCount, dealerCode,
    totalCommission, availableCommission, getCommissionRate,
    getNextDealerMilestone, getDealerLevelName, groupBuyEligible,
    generateDealerCode, withdrawCommission,
  } = useDealerStore()

  const milestone = getNextDealerMilestone()
  const commissionRate = getCommissionRate()
  const levelName = getDealerLevelName()

  const handleShareQrCode = () => {
    const code = generateDealerCode()
    Taro.setClipboardData({ data: code, success: () => {
      Taro.showToast({ title: `专属码已复制: ${code}`, icon: 'none', duration: 2000 })
    }})
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
            <View
              style={{ flex: 1, backgroundColor: '#fff', borderRadius: '12px', padding: '16px', alignItems: 'center' }}
              onClick={handleShareQrCode}
            >
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#7C3AED' }}>分享专属码</Text>
              <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>推荐赚返利</Text>
            </View>
            <View
              style={{ flex: 1, backgroundColor: '#fff', borderRadius: '12px', padding: '16px', alignItems: 'center' }}
              onClick={handleWithdraw}
            >
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>¥{availableCommission.toFixed(2)}</Text>
              <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>点击提现</Text>
            </View>
          </View>

          {/* 角色说明 */}
          <View style={{ marginTop: '12px', backgroundColor: '#EDE9FE', borderRadius: '12px', padding: '16px' }}>
            <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#5B21B6' }}>经销商 = 纯分销</Text>
            <Text style={{ fontSize: '12px', color: '#7C3AED', marginTop: '8px', lineHeight: '20px' }}>
              · 分享小程序专属码给好友{'\n'}
              · 好友下单你拿返利{'\n'}
              · 订单由最近自提点处理配送{'\n'}
              · 不需要你备货/发货
            </Text>
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
        </View>
      )}

      {/* 未解锁经销商的引导 */}
      {!isDealer && (
        <View style={{ padding: '16px' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '20px' }}>
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>成为经销商</Text>
            <Text style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px', lineHeight: '20px' }}>
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
