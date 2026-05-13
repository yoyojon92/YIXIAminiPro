import { USER_TAGS, type TagId } from '@/data/userTags'

// 用户行为数据接口
export interface UserBehavior {
  purchases: { productId: string; quantity: number; price: number; timestamp: number }[]
  cartAdds: { productId: string; timestamp: number }[]
  couponUses: { couponId: string; discount: number; timestamp: number }[]
  ugcWorks: { productId: string; votes: number; timestamp: number }[]
  votes: { workId: string; timestamp: number }[]
  spriteClicks: { spriteId: string; timestamp: number }[]
  organLordClicks: { organLordId: string; timestamp: number }[]
  pageViews: { page: string; count: number }[]
  shareCount: number
  isMember: boolean
  memberSince: number | null
}

// 计算用户标签
export function calculateTags(behavior: UserBehavior): TagId[] {
  const tags: TagId[] = []
  
  // === 口味偏好 ===
  // 根据购买最多的产品判断
  const purchaseCounts: Record<string, number> = {}
  behavior.purchases.forEach(p => {
    purchaseCounts[p.productId] = (purchaseCounts[p.productId] || 0) + p.quantity
  })
  
  const productIdTagMap: Record<string, TagId> = {
    'prod_peach_001': 'peach_lover',
    'prod_hawthorn_001': 'hawthorn_fan',
    'prod_pear_001': 'pear_lover',
    'prod_pomegranate_001': 'pomegranate_fan',
    'prod_grape_001': 'grape_lover',
  }
  
  // 购买最多的产品标签
  let maxCount = 0, maxProductId = ''
  for (const [pid, count] of Object.entries(purchaseCounts)) {
    if (count > maxCount) { maxCount = count; maxProductId = pid }
  }
  if (maxProductId && productIdTagMap[maxProductId]) {
    tags.push(productIdTagMap[maxProductId])
  }
  
  // 精灵图鉴点击对应的口味标签
  const spriteProductMap: Record<string, string> = {
    'sprite-taoyao': 'prod_peach_001',
    'sprite-zhacha': 'prod_hawthorn_001',
    'sprite-lili': 'prod_pear_001',
    'sprite-liuliu': 'prod_pomegranate_001',
    'sprite-pupu': 'prod_grape_001',
  }
  behavior.spriteClicks.forEach(c => {
    const pid = spriteProductMap[c.spriteId]
    if (pid && productIdTagMap[pid] && !tags.includes(productIdTagMap[pid])) {
      tags.push(productIdTagMap[pid])
    }
  })
  
  // === 消费行为 ===
  const totalSpend = behavior.purchases.reduce((s, p) => s + p.price * p.quantity, 0)
  if (totalSpend >= 500) tags.push('big_spender')
  if (behavior.couponUses.length >= 3) tags.push('coupon_user')
  if (behavior.cartAdds.length > behavior.purchases.length * 2) tags.push('bargain_hunter')
  
  // === 社交属性 ===
  if (behavior.ugcWorks.length >= 3) tags.push('content_creator')
  if (behavior.votes.length >= 5) tags.push('voter')
  if (behavior.shareCount >= 5) tags.push('social_butterfly')
  if (behavior.ugcWorks.length === 0 && behavior.votes.length === 0 && behavior.shareCount === 0) {
    tags.push('shy_observer')
  }
  
  // === 养生倾向 ===
  if (behavior.organLordClicks.length >= 3) {
    tags.push('organ_lord_follower')
    tags.push('tcm_fan')
  }
  const uniqueSpriteClicks = new Set(behavior.spriteClicks.map(c => c.spriteId)).size
  if (uniqueSpriteClicks >= 3) tags.push('sprite_collector')
  
  // === 身份标签 ===
  if (behavior.isMember) tags.push('member')
  if (behavior.purchases.length === 0 && behavior.memberSince === null) tags.push('new_user')
  if (behavior.purchases.length >= 5) tags.push('loyal_customer')
  
  return tags
}

// 生成画像摘要（用于展示）
export function generateProfileSummary(tags: TagId[]): string {
  const categoryNames = {
    taste: '口味偏好',
    behavior: '消费行为',
    social: '社交属性',
    health: '养生倾向',
    identity: '身份标签',
  }
  
  const grouped: Record<string, TagId[]> = {}
  tags.forEach(tagId => {
    const tag = USER_TAGS[tagId]
    if (!tag) return
    const cat = tag.category
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(tagId)
  })
  
  return Object.entries(grouped)
    .map(([cat, tagIds]) => {
      const names = tagIds.map(id => USER_TAGS[id].name)
      return `${categoryNames[cat as keyof typeof categoryNames]}: ${names.join('、')}`
    })
    .join('\n')
}
