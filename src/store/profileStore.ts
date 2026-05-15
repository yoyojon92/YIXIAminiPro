import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { USER_TAGS, TagId } from '@/data/userTags'
import { taroStorage } from './taroStorage'

// 用户行为记录
interface UserActions {
  // 购买记录
  purchases: { productId: string; productName: string; category: string; price: number; time: number }[]
  // UGC投稿
  ugcPosts: string[]
  // 投票记录
  votes: string[]
  // 分享记录
  shares: string[]
  // 精灵查看
  spiritViews: string[]
  // 器官大人查看
  organLordViews: string[]
  // 代券使用
  couponUses: number
  // 会员开通
  memberJoined: boolean
  // 首单完成
  firstOrderDone: boolean
  // 累计消费
  totalSpend: number
  // 活跃天数（存储为数组）
  activeDays: number[]
}

// 画像计算结果
export interface UserProfile {
  tags: TagId[]
  tasteProfile: string[]      // 口味偏好
  behaviorProfile: string[]   // 消费行为
  socialProfile: string[]     // 社交属性
  healthProfile: string[]     // 养生倾向
  identityProfile: string[]   // 身份标签
  summary: string            // 画像一句话总结
  level: number              // 用户等级 1-5
  title: string              // 用户称号
}

interface ProfileState {
  // 行为数据
  actions: UserActions
  
  // 计算后的画像
  profile: UserProfile
  
  // 用户ID
  userId: string
  
  // 上次计算时间
  lastCalculate: number
  
  // Actions
  recordPurchase: (productId: string, productName: string, category: string, price: number) => void
  recordUGCPost: (workId: string) => void
  recordVote: (workId: string) => void
  recordShare: (workId: string) => void
  recordSpiritView: (spiritId: string) => void
  recordOrganLordView: (lordId: string) => void
  recordCouponUse: () => void
  recordMemberJoin: () => void
  recordFirstOrder: () => void
  recordActiveDay: () => void
  
  // 计算画像
  calculateProfile: () => void
  
  // 获取画像摘要
  getProfileSummary: () => string
  
  // 获取称号
  getTitle: () => string
}

// 获取口味标签
function getTasteTags(actions: UserActions): TagId[] {
  const tags: TagId[] = []
  const productCount: Record<string, number> = {}
  
  actions.purchases.forEach(p => {
    if (p.category === '果酒') {
      if (p.productName.includes('桃') || p.productName.includes('蜜桃')) productCount['peach'] = (productCount['peach'] || 0) + 1
      if (p.productName.includes('楂') || p.productName.includes('山楂')) productCount['hawthorn'] = (productCount['hawthorn'] || 0) + 1
      if (p.productName.includes('梨')) productCount['pear'] = (productCount['pear'] || 0) + 1
      if (p.productName.includes('榴') || p.productName.includes('石榴')) productCount['pomegranate'] = (productCount['pomegranate'] || 0) + 1
      if (p.productName.includes('葡萄') || p.productName.includes('葡')) productCount['grape'] = (productCount['grape'] || 0) + 1
    }
  })
  
  if (productCount['peach'] >= 2) tags.push('peach_lover')
  if (productCount['hawthorn'] >= 2) tags.push('hawthorn_fan')
  if (productCount['pear'] >= 2) tags.push('pear_lover')
  if (productCount['pomegranate'] >= 2) tags.push('pomegranate_fan')
  if (productCount['grape'] >= 2) tags.push('grape_lover')
  
  return tags
}

// 获取行为标签
function getBehaviorTags(actions: UserActions): TagId[] {
  const tags: TagId[] = []
  
  // 薅羊毛达人：使用过代券
  if (actions.couponUses >= 3) tags.push('bargain_hunter')
  
  // 豪客：单笔消费>100或累计消费>500
  if (actions.purchases.some(p => p.price > 100) || actions.totalSpend > 500) tags.push('big_spender')
  
  // 券王：使用过代券
  if (actions.couponUses >= 2) tags.push('coupon_user')
  
  return tags
}

// 获取社交标签
function getSocialTags(actions: UserActions): TagId[] {
  const tags: TagId[] = []
  
  // 创作者：投稿>=2
  if (actions.ugcPosts.length >= 2) tags.push('content_creator')
  
  // 投票积极分子：投票>=5
  if (actions.votes.length >= 5) tags.push('voter')
  
  // 社交达人：分享>=3
  if (actions.shares.length >= 3) tags.push('social_butterfly')
  
  // 安静观察者：只看不发
  if (actions.ugcPosts.length === 0 && actions.votes.length === 0 && actions.shares.length === 0 && 
      (actions.spiritViews.length > 0 || actions.organLordViews.length > 0)) {
    tags.push('shy_observer')
  }
  
  return tags
}

// 获取养生标签
function getHealthTags(actions: UserActions): TagId[] {
  const tags: TagId[] = []
  
  // 器官大人粉丝：查看>=3
  if (actions.organLordViews.length >= 3) tags.push('organ_lord_follower')
  
  // 精灵收集者：查看>=4
  if (actions.spiritViews.length >= 4) tags.push('sprite_collector')
  
  // 中医养生派：购买过>=2种不同果酒（说明在意功效）
  const fruitWineCount = actions.purchases.filter(p => p.category === '果酒').length
  if (fruitWineCount >= 2) tags.push('tcm_fan')
  
  return tags
}

// 获取身份标签
function getIdentityTags(actions: UserActions): TagId[] {
  const tags: TagId[] = []
  
  // 邑夏会员
  if (actions.memberJoined) tags.push('member')
  
  // 萌新：首单未完成
  if (!actions.firstOrderDone) tags.push('new_user')
  
  // 铁粉：购买>=5次
  if (actions.purchases.length >= 5) tags.push('loyal_customer')
  
  return tags
}

// 生成画像摘要
function generateSummary(tags: TagId[]): string {
  if (tags.length === 0) return '初来乍到，快去探索邑夏的魅力吧~'
  
  const identities = tags.filter(t => USER_TAGS[t]?.category === 'identity')
  const tastes = tags.filter(t => USER_TAGS[t]?.category === 'taste')
  const socials = tags.filter(t => USER_TAGS[t]?.category === 'social')
  
  let summary = ''
  
  if (identities.includes('member')) summary += '尊贵的邑夏会员，'
  else if (identities.includes('new_user')) summary += '初来乍到的新朋友，'
  else if (identities.includes('loyal_customer')) summary += '铁杆粉丝，'
  
  if (tastes.length > 0) {
    const tasteNames = tastes.map(t => USER_TAGS[t]?.name)
    summary += `${tasteNames.join('·')}，`
  }
  
  if (socials.includes('content_creator')) summary += '爱创作的活跃用户'
  else if (socials.includes('voter')) summary += '热情参与的投票达人'
  else if (socials.includes('social_butterfly')) summary += '热衷分享的社交达人'
  else if (socials.length === 0) summary = summary.slice(0, -1) || '低调潜水的探索者'
  
  return summary
}

// 获取称号
function getTitleByLevel(level: number): string {
  const titles = ['', '萌新品鉴师', '果酒爱好者', '养生品鉴家', '邑夏资深玩家', '果酒大师']
  return titles[level] || '果酒新手'
}

// 计算用户等级
function calculateLevel(actions: UserActions): number {
  let score = 0
  score += actions.purchases.length * 2
  score += actions.ugcPosts.length * 3
  score += actions.votes.length * 1
  score += actions.shares.length * 2
  score += actions.spiritViews.length * 1
  score += actions.organLordViews.length * 1
  if (actions.memberJoined) score += 10
  if (actions.firstOrderDone) score += 5
  
  if (score >= 30) return 5
  if (score >= 20) return 4
  if (score >= 12) return 3
  if (score >= 5) return 2
  return 1
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      actions: {
        purchases: [],
        ugcPosts: [],
        votes: [],
        shares: [],
        spiritViews: [],
        organLordViews: [],
        couponUses: 0,
        memberJoined: false,
        firstOrderDone: false,
        totalSpend: 0,
        activeDays: [],
      },
      
      profile: {
        tags: [],
        tasteProfile: [],
        behaviorProfile: [],
        socialProfile: [],
        healthProfile: [],
        identityProfile: [],
        summary: '初来乍到，快去探索邑夏的魅力吧~',
        level: 1,
        title: '果酒新手',
      },
      
      userId: `user_${Date.now()}`,
      lastCalculate: 0,
      
      recordPurchase: (productId, productName, category, price) => {
        const state = get()
        const today = new Date().setHours(0, 0, 0, 0)
        const currentDays = state.actions.activeDays || []
        const newActiveDays = currentDays.includes(today) ? currentDays : [...currentDays, today]
        
        set({
          actions: {
            ...state.actions,
            purchases: [...state.actions.purchases, {
              productId, productName, category, price, time: Date.now()
            }],
            totalSpend: state.actions.totalSpend + price,
            activeDays: newActiveDays,
          }
        })
        get().calculateProfile()
      },
      
      recordUGCPost: (workId) => {
        const state = get()
        set({
          actions: {
            ...state.actions,
            ugcPosts: [...state.actions.ugcPosts, workId],
          }
        })
        get().calculateProfile()
      },
      
      recordVote: (workId) => {
        const state = get()
        set({
          actions: {
            ...state.actions,
            votes: [...state.actions.votes, workId],
          }
        })
        get().calculateProfile()
      },
      
      recordShare: (workId) => {
        const state = get()
        set({
          actions: {
            ...state.actions,
            shares: [...state.actions.shares, workId],
          }
        })
        get().calculateProfile()
      },
      
      recordSpiritView: (spiritId) => {
        const state = get()
        set({
          actions: {
            ...state.actions,
            spiritViews: [...state.actions.spiritViews, spiritId],
          }
        })
        get().calculateProfile()
      },
      
      recordOrganLordView: (lordId) => {
        const state = get()
        set({
          actions: {
            ...state.actions,
            organLordViews: [...state.actions.organLordViews, lordId],
          }
        })
        get().calculateProfile()
      },
      
      recordCouponUse: () => {
        const state = get()
        set({
          actions: {
            ...state.actions,
            couponUses: state.actions.couponUses + 1,
          }
        })
        get().calculateProfile()
      },
      
      recordMemberJoin: () => {
        const state = get()
        set({
          actions: {
            ...state.actions,
            memberJoined: true,
          }
        })
        get().calculateProfile()
      },
      
      recordFirstOrder: () => {
        const state = get()
        set({
          actions: {
            ...state.actions,
            firstOrderDone: true,
          }
        })
        get().calculateProfile()
      },
      
      recordActiveDay: () => {
        const state = get()
        const today = new Date().setHours(0, 0, 0, 0)
        const currentDays = state.actions.activeDays || []
        const newActiveDays = currentDays.includes(today) ? currentDays : [...currentDays, today]
        set({
          actions: {
            ...state.actions,
            activeDays: newActiveDays,
          }
        })
      },
      
      calculateProfile: () => {
        const state = get()
        const actions = state.actions
        
        const tasteTags = getTasteTags(actions)
        const behaviorTags = getBehaviorTags(actions)
        const socialTags = getSocialTags(actions)
        const healthTags = getHealthTags(actions)
        const identityTags = getIdentityTags(actions)
        
        const allTags = [...tasteTags, ...behaviorTags, ...socialTags, ...healthTags, ...identityTags]
        const level = calculateLevel(actions)
        const summary = generateSummary(allTags)
        const title = getTitleByLevel(level)
        
        set({
          profile: {
            tags: allTags,
            tasteProfile: tasteTags.map(t => USER_TAGS[t]?.name || t),
            behaviorProfile: behaviorTags.map(t => USER_TAGS[t]?.name || t),
            socialProfile: socialTags.map(t => USER_TAGS[t]?.name || t),
            healthProfile: healthTags.map(t => USER_TAGS[t]?.name || t),
            identityProfile: identityTags.map(t => USER_TAGS[t]?.name || t),
            summary,
            level,
            title,
          },
          lastCalculate: Date.now(),
        })
      },
      
      getProfileSummary: () => {
        return get().profile.summary
      },
      
      getTitle: () => {
        return get().profile.title
      },
    }),
    {
      name: 'profile-store',
      storage: taroStorage,
      partialize: (state) => ({
        actions: state.actions,
        profile: state.profile,
        userId: state.userId,
        lastCalculate: state.lastCalculate,
      }),
    }
  )
)

// 埋点函数
export function trackProfileAction(action: string, data?: Record<string, unknown>) {
  const state = useProfileStore.getState()
  const event = {
    userId: state.userId,
    action,
    data,
    timestamp: Date.now(),
  }
  console.log('[Profile Track]', JSON.stringify(event))
  // 实际项目中可发送到分析服务
}
