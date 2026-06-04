/**
 * 经销商中心（V3 - 2026-06-05重构）
 * 纯分销零库存零风险：
 * - 生成专属分享码
 * - 推荐10人支付9.9成为创始会员→自动成为经销商
 * - 好友终身消费1%佣金
 * - 活动期至7月30日
 */
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useDealerStore } from '@/store/dealerStore'

/** 经销商解锁所需推荐人数 */
const DEALER_UNLOCK_COUNT = 10

export default function DealerCenter() {
  const {
    isDealer, dealerCode, referralCount, referrals,
    totalCommission, availableCommission, commissionRecords,
    generateDealerCode, withdrawCommission, getDealerProgressText,
  } = useDealerStore()

  const progressText = getDealerProgressText()
  const promoActive = Date.now() < new Date('2026-07-30T23:59:59').getTime()

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
    <View style={{ minHeight: '100vh', backgroundColor: '#FAF5FF', paddingBottom: '30px' }}>
      {/* 顶部卡片 */}
      <View style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', padding: '40px 16px 24px' }}>
        <Text style={{ color: '#fff', fontSize: '22px', fontWeight: 'bold' }}>
          {isDealer ? '🎉 经销商中心' : '经销商中心'}
        </Text>
        <View style={{ marginTop: '12px', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px' }}>
          {isDealer ? (
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: '#FDE68A', fontSize: '14px' }}>推荐人数</Text>
                <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{referralCount}人</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '8px' }}>
                <Text style={{ color: '#FDE68A', fontSize: '14px' }}>佣金比例</Text>
                <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>1%</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: '8px' }}>
                <Text style={{ color: '#FDE68A', fontSize: '14px' }}>可提现</Text>
                <Text style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>¥{availableCommission.toFixed(2)}</Text>
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ color: '#fff', fontSize: '14px' }}>
                推荐{DEALER_UNLOCK_COUNT}人成为创始会员即可解锁经销商
              </Text>
              <Text style={{ color: '#FDE68A', fontSize: '13px', marginTop: '8px' }}>
                当前进度：{referralCount}/{DEALER_UNLOCK_COUNT}人
              </Text>
              <View style={{ marginTop: '8px', height: '8px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${Math.min(100, (referralCount / DEALER_UNLOCK_COUNT) * 100)}%`, backgroundColor: '#FBBF24', borderRadius: '4px' }} />
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={{ padding: '12px 16px' }}>
        {/* 操作按钮组 */}
        <View style={{ flexDirection: 'row', gap: '8px' }}>
          <View
            style={{ flex: 1, backgroundColor: '#fff', borderRadius: '12px', padding: '16px', alignItems: 'center' }}
            onClick={handleShareQrCode}
          >
            <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#7C3AED' }}>分享专属码</Text>
            <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>推荐赚1%终身佣金</Text>
          </View>
          {isDealer && (
            <View
              style={{ flex: 1, backgroundColor: '#fff', borderRadius: '12px', padding: '16px', alignItems: 'center' }}
              onClick={handleWithdraw}
            >
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>¥{availableCommission.toFixed(2)}</Text>
              <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>点击提现</Text>
            </View>
          )}
        </View>

        {/* 角色说明 */}
        <View style={{ marginTop: '12px', backgroundColor: '#EDE9FE', borderRadius: '12px', padding: '16px' }}>
          <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#5B21B6' }}>经销商 = 纯分销·零库存·零风险</Text>
          <Text style={{ fontSize: '13px', color: '#6D28D9', marginTop: '8px', lineHeight: '22px' }}>
            · 分享专属码给好友{'\n'}
            · 好友扫码注册并支付9.9成为创始会员{'\n'}
            · 好友终身消费的1%作为你的佣金{'\n'}
            · 不需要你备货/发货/囤货{'\n'}
            · 订单由最近自提点处理配送
          </Text>
        </View>

        {/* 活动倒计时 */}
        {!isDealer && promoActive && (
          <View style={{ marginTop: '8px', backgroundColor: '#FEF3C7', borderRadius: '12px', padding: '16px' }}>
            <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#92400E' }}>⏰ 经销商活动期至7月30日</Text>
            <Text style={{ fontSize: '12px', color: '#B45309', marginTop: '4px' }}>
              活动期间推荐10人支付9.9即可成为经销商，享受1%终身佣金
            </Text>
          </View>
        )}

        {/* 佣金概览 */}
        {isDealer && (
          <View style={{ marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>佣金概览</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: '12px' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#7C3AED' }}>¥{totalCommission.toFixed(2)}</Text>
                <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>累计佣金</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#059669' }}>¥{availableCommission.toFixed(2)}</Text>
                <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>可提现</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#F59E0B' }}>1%</Text>
                <Text style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>终身佣金率</Text>
              </View>
            </View>
          </View>
        )}

        {/* 推荐记录 */}
        {isDealer && referrals.length > 0 && (
          <View style={{ marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px', padding: '16px' }}>
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>推荐记录</Text>
            {referrals.slice(-10).reverse().map((r, i) => (
              <View key={i} style={{ marginTop: '10px', paddingBottom: '10px', borderBottomWidth: i < 9 ? '1px' : '0', borderBottomColor: '#F3F4F6' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: '13px', color: '#374151', fontWeight: 'bold' }}>{r.nickname}</Text>
                  <Text style={{ fontSize: '12px', color: r.isFoundingMember ? '#059669' : '#9CA3AF' }}>
                    {r.isFoundingMember ? '已支付9.9' : '未支付'}
                  </Text>
                </View>
                <Text style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                  {new Date(r.joinedAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 未解锁引导 */}
        {!isDealer && (
          <View style={{ marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px', padding: '20px' }}>
            <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#1F2937' }}>成为经销商</Text>
            <Text style={{ fontSize: '13px', color: '#6B7280', marginTop: '8px', lineHeight: '22px' }}>
              1. 分享小程序专属码给好友{'\n'}
              2. 好友扫码注册并支付9.9成为创始会员{'\n'}
              3. 累计10人 → 自动成为经销商{'\n'}
              4. 好友终身消费的1%作为佣金{'\n'}
              5. 可随时提现到微信钱包{'\n'}
              {'\n'}
              零库存·零风险·纯赚佣金
            </Text>
            <View
              style={{ marginTop: '16px', backgroundColor: '#7C3AED', borderRadius: '8px', paddingVertical: '12px', alignItems: 'center' }}
              onClick={handleShareQrCode}
            >
              <Text style={{ color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>立即分享赚钱</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}
