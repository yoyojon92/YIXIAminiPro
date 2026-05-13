import type { TagId } from '@/data/userTags'

// 推送场景定义
export type PushScenario = 
  | 'member_benefit_reminder'   // 会员权益提醒
  | 'coupon_expire_warning'     // 代券即将过期
  | 'new_product_match'         // 新品推荐（匹配口味偏好）
  | 'ugc_vote_reminder'         // 创意墙投票提醒
  | 'ranking_change'            // 排名变动通知
  | 'repurchase_suggestion'     // 复购提醒
  | 'flash_sale_notify'         // 拼团限时提醒
  | 'member_expiring_soon'      // 会员即将到期

// 推送消息模板
export interface PushMessage {
  title: string
  content: string
  scenario: PushScenario
  targetTags?: TagId[]      // 针对哪些标签的用户
  action?: { text: string; url: string }  // 行动按钮
}

// 根据用户画像生成推送消息
export function generatePushMessage(
  tags: TagId[],
  scenario: PushScenario,
  data?: Record<string, any>
): PushMessage | null {
  
  switch (scenario) {
    case 'member_benefit_reminder':
      return {
        title: '👑 会员专属提醒',
        content: '你还有3张会员代券未使用，本月有效～去看看吧',
        scenario,
        targetTags: ['member'],
        action: { text: '查看代券', url: '/pages/coupons/index' },
      }
    
    case 'coupon_expire_warning':
      return {
        title: '⏰ 代券即将过期',
        content: `你的${data?.couponName || '代券'}还有${data?.daysLeft || 1}天过期，别浪费了！`,
        scenario,
        action: { text: '立即使用', url: '/pages/cart/index' },
      }
    
    case 'new_product_match': {
      // 根据口味偏好推荐
      const flavorMap: Record<string, { name: string; emoji: string }> = {
        peach_lover: { name: '蜜桃系列', emoji: '🍑' },
        hawthorn_fan: { name: '山楂系列', emoji: '🍒' },
        pear_lover: { name: '梨酒系列', emoji: '🍐' },
        pomegranate_fan: { name: '石榴系列', emoji: '🍎' },
        grape_lover: { name: '葡萄系列', emoji: '🍇' },
      }
      
      const matchedFlavors = tags.filter(t => flavorMap[t])
      if (matchedFlavors.length === 0) return null
      
      const flavor = flavorMap[matchedFlavors[0]]
      return {
        title: `${flavor.emoji} 新品推荐`,
        content: `根据你的口味偏好，${flavor.name}上新了！来看看有没有你喜欢的～`,
        scenario,
        targetTags: matchedFlavors as TagId[],
        action: { text: '去看看', url: '/pages/category/index?type=new' },
      }
    }
    
    case 'ugc_vote_reminder':
      return {
        title: '🗳 投票提醒',
        content: data?.isVoter 
          ? '你关注的作品排名上升了，快去投票支持！'
          : '本月投票通道即将关闭，还有作品值得你一票！',
        scenario,
        targetTags: ['voter', 'content_creator'],
        action: { text: '去投票', url: '/pages/wall/index?tab=ranking' },
      }
    
    case 'ranking_change':
      return {
        title: '🏆 排名变动',
        content: `你的作品"${data?.workTitle || ''}"当前排名第${data?.rank || 0}名，还差${data?.votesNeeded || 0}票就能超越上一名！`,
        scenario,
        action: { text: '拉票去', url: '/pages/wall/index?tab=ranking' },
      }
    
    case 'repurchase_suggestion': {
      // 根据购买历史推荐复购
      const flavorNames: Record<string, string> = {
        peach_lover: '蜜桃',
        hawthorn_fan: '山楂',
        pear_lover: '梨酒',
        pomegranate_fan: '石榴',
        grape_lover: '葡萄',
      }
      
      const purchaseFlavor = tags.find(t => 
        ['peach_lover', 'hawthorn_fan', 'pear_lover', 'pomegranate_fan', 'grape_lover'].includes(t)
      )
      if (!purchaseFlavor) return null
      
      return {
        title: '🛒 复购提醒',
        content: `你上次购买已经过了${data?.daysSince || 7}天啦，来一瓶你最爱的${flavorNames[purchaseFlavor] || '果酒'}？`,
        scenario,
        action: { text: '再买一瓶', url: '/pages/category/index' },
      }
    }
    
    case 'flash_sale_notify':
      return {
        title: '⚡ 限时拼团',
        content: '今晚8点限时拼团开启，低至6折！邀请好友一起更便宜～',
        scenario,
        action: { text: '立即参团', url: '/pages/category/index?type=group' },
      }
    
    case 'member_expiring_soon':
      return {
        title: '👑 会员到期提醒',
        content: `你的会员还有${data?.daysLeft || 3}天到期，续费享8.5折专属优惠！`,
        scenario,
        targetTags: ['member'],
        action: { text: '立即续费', url: '/pages/profile/index' },
      }
    
    default:
      return null
  }
}

// 判断是否应该推送（基于用户行为）
export function shouldPush(
  tags: TagId[],
  scenario: PushScenario,
  behaviorData: Record<string, any>
): boolean {
  
  const rule = generatePushMessage(tags, scenario, behaviorData)
  if (!rule) return false
  
  // 检查标签匹配
  if (rule.targetTags && rule.targetTags.length > 0) {
    const hasMatch = rule.targetTags.some(t => tags.includes(t))
    if (!hasMatch) return false
  }
  
  // 场景特殊规则
  switch (scenario) {
    case 'coupon_expire_warning':
      return (behaviorData?.couponCount || 0) > 0
    case 'repurchase_suggestion':
      return (behaviorData?.lastPurchaseDays || 999) >= 7
    case 'member_expiring_soon':
      return (behaviorData?.memberDaysLeft || 999) <= 7
    case 'ranking_change':
      return (behaviorData?.hasUGCWork || false)
    default:
      return true
  }
}
