import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TagId } from '@/data/userTags'
import { calculateTags, generateProfileSummary, type UserBehavior } from '@/engine/userProfile'

interface UserProfileState {
  // 画像结果
  tags: TagId[]
  profileSummary: string
  behaviorScore: number // 综合活跃度 0-100
  lastUpdated: number
  
  // 行为数据存储
  purchases: UserBehavior['purchases']
  cartAdds: UserBehavior['cartAdds']
  couponUses: UserBehavior['couponUses']
  ugcWorks: UserBehavior['ugcWorks']
  votes: UserBehavior['votes']
  spriteClicks: UserBehavior['spriteClicks']
  organLordClicks: UserBehavior['organLordClicks']
  pageViews: UserBehavior['pageViews']
  shareCount: number
  isMember: boolean
  memberSince: number | null
  
  // Actions
  recordPurchase: (productId: string, quantity: number, price: number) => void
  recordCartAdd: (productId: string) => void
  recordCouponUse: (couponId: string, discount: number) => void
  recordUGCWork: (productId: string) => void
  recordVote: (workId: string) => void
  recordSpriteClick: (spriteId: string) => void
  recordOrganLordClick: (organLordId: string) => void
  recordPageView: (page: string) => void
  recordShare: () => void
  setMemberStatus: (isMember: boolean) => void
  recalculateProfile: () => void
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set, get) => ({
      tags: ['new_user'],
      profileSummary: '身份标签: 萌新',
      behaviorScore: 0,
      lastUpdated: Date.now(),
      
      // 所有行为数据
      purchases: [] as UserBehavior['purchases'],
      cartAdds: [] as UserBehavior['cartAdds'],
      couponUses: [] as UserBehavior['couponUses'],
      ugcWorks: [] as UserBehavior['ugcWorks'],
      votes: [] as UserBehavior['votes'],
      spriteClicks: [] as UserBehavior['spriteClicks'],
      organLordClicks: [] as UserBehavior['organLordClicks'],
      pageViews: [] as UserBehavior['pageViews'],
      shareCount: 0,
      isMember: false,
      memberSince: null,
      
      recordPurchase: (productId, quantity, price) => {
        set((state) => ({
          purchases: [...state.purchases, { productId, quantity, price, timestamp: Date.now() }],
        }))
        get().recalculateProfile()
      },
      
      recordCartAdd: (productId) => {
        set((state) => ({
          cartAdds: [...state.cartAdds, { productId, timestamp: Date.now() }],
        }))
      },
      
      recordCouponUse: (couponId, discount) => {
        set((state) => ({
          couponUses: [...state.couponUses, { couponId, discount, timestamp: Date.now() }],
        }))
        get().recalculateProfile()
      },
      
      recordUGCWork: (productId) => {
        set((state) => ({
          ugcWorks: [...state.ugcWorks, { productId, votes: 0, timestamp: Date.now() }],
        }))
        get().recalculateProfile()
      },
      
      recordVote: (workId) => {
        set((state) => ({
          votes: [...state.votes, { workId, timestamp: Date.now() }],
        }))
        get().recalculateProfile()
      },
      
      recordSpriteClick: (spriteId) => {
        set((state) => ({
          spriteClicks: [...state.spriteClicks, { spriteId, timestamp: Date.now() }],
        }))
        get().recalculateProfile()
      },
      
      recordOrganLordClick: (organLordId) => {
        set((state) => ({
          organLordClicks: [...state.organLordClicks, { organLordId, timestamp: Date.now() }],
        }))
        get().recalculateProfile()
      },
      
      recordPageView: (page) => {
        set((state) => {
          const existing = state.pageViews.find(pv => pv.page === page)
          if (existing) {
            return {
              pageViews: state.pageViews.map(pv => 
                pv.page === page ? { ...pv, count: pv.count + 1 } : pv
              )
            }
          }
          return { pageViews: [...state.pageViews, { page, count: 1 }] }
        })
      },
      
      recordShare: () => {
        set((state) => ({ shareCount: state.shareCount + 1 }))
        get().recalculateProfile()
      },
      
      setMemberStatus: (isMember) => {
        set((state) => ({
          isMember,
          memberSince: isMember && !state.memberSince ? Date.now() : state.memberSince,
        }))
        get().recalculateProfile()
      },
      
      recalculateProfile: () => {
        const state = get()
        const behavior: UserBehavior = {
          purchases: state.purchases,
          cartAdds: state.cartAdds,
          couponUses: state.couponUses,
          ugcWorks: state.ugcWorks,
          votes: state.votes,
          spriteClicks: state.spriteClicks,
          organLordClicks: state.organLordClicks,
          pageViews: state.pageViews,
          shareCount: state.shareCount,
          isMember: state.isMember,
          memberSince: state.memberSince,
        }
        
        const tags = calculateTags(behavior)
        const summary = generateProfileSummary(tags)
        
        // 计算活跃度分数（0-100）
        let score = 0
        score += Math.min(state.purchases.length * 10, 30)
        score += Math.min(state.ugcWorks.length * 15, 20)
        score += Math.min(state.votes.length * 5, 15)
        score += Math.min(state.spriteClicks.length * 2, 10)
        score += Math.min(state.organLordClicks.length * 3, 10)
        score += Math.min(state.shareCount * 5, 10)
        score += state.isMember ? 5 : 0
        score = Math.min(score, 100)
        
        set({
          tags,
          profileSummary: summary,
          behaviorScore: score,
          lastUpdated: Date.now(),
        })
      },
    }),
    { name: 'user-profile-store' }
  )
)
