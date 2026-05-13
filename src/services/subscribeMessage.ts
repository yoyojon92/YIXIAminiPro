import Taro from '@tarojs/taro'

/**
 * 订阅消息模板ID配置
 * 需要在微信小程序后台配置后替换实际的模板ID
 */
const TEMPLATE_IDS: Record<string, string> = {
  // 会员权益提醒
  member_benefit_reminder: 'YOUR_TEMPLATE_ID_MEMBER_BENEFIT',
  // 代券即将过期
  coupon_expire_warning: 'YOUR_TEMPLATE_ID_COUPON_EXPIRE',
  // 新品推荐
  new_product_match: 'YOUR_TEMPLATE_ID_NEW_PRODUCT',
  // 复购提醒
  repurchase_suggestion: 'YOUR_TEMPLATE_ID_REPURCHASE',
  // 拼团限时提醒
  flash_sale_notify: 'YOUR_TEMPLATE_ID_FLASH_SALE',
  // 会员即将到期
  member_expiring_soon: 'YOUR_TEMPLATE_ID_MEMBER_EXPIRE',
  // 创意墙投票提醒
  ugc_vote_reminder: 'YOUR_TEMPLATE_ID_UGC_VOTE',
  // 排名变动通知
  ranking_change: 'YOUR_TEMPLATE_ID_RANKING',
}

/**
 * 请求订阅消息权限
 * @param scenario 推送场景
 * @returns Promise<void>
 */
export function requestSubscribeMessage(scenario: string): Promise<void> {
  return new Promise((resolve) => {
    const templateId = TEMPLATE_IDS[scenario]
    
    // 如果没有配置模板ID，直接返回（开发环境）
    if (!templateId || templateId.startsWith('YOUR_')) {
      console.log('[订阅消息] 开发模式，跳过订阅请求:', scenario)
      resolve()
      return
    }

    // 小程序环境
    if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
      ;(Taro as any).requestSubscribeMessage({
        tmplIds: [templateId],
        success: (res: any) => {
          console.log('[订阅消息] 请求成功:', scenario, res)
          resolve()
        },
        fail: (err: any) => {
          console.log('[订阅消息] 请求失败:', scenario, err)
          // 用户拒绝也正常处理
          resolve()
        },
      })
    } else {
      // H5 等其他环境直接返回
      console.log('[订阅消息] 非小程序环境:', Taro.getEnv())
      resolve()
    }
  })
}

/**
 * 发送订阅消息（模拟）
 * 实际发送需要在后端使用微信订阅消息API
 * @param scenario 推送场景
 * @param data 消息数据
 */
export async function sendSubscribeMessage(
  scenario: string,
  data: Record<string, { value: string }>
): Promise<void> {
  console.log('[订阅消息] 模拟发送消息:', {
    scenario,
    data,
    templateId: TEMPLATE_IDS[scenario] || '未配置',
  })
  
  // 实际项目中，这里应该调用后端API发送订阅消息
  // await Network.request({
  //   url: '/api/message/send-subscribe',
  //   method: 'POST',
  //   data: { scenario, data }
  // })
}

/**
 * 检查用户是否已订阅某个模板
 * @param scenario 推送场景
 * @returns 是否已订阅
 */
export function isSubscribed(_scenario: string): boolean {
  // 实际项目中应该从后端或本地存储获取订阅状态
  // 这里简化为总是返回 true（已订阅）
  return true
}
