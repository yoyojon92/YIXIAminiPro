import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { taroStorage } from './taroStorage'

export interface UGCWork {
  id: string
  title: string
  image: string
  author: string
  school?: string
  productId?: string
  productName?: string
  description?: string
  tags: string[]
  likes: number
  isLiked: boolean
  collects: number
  isCollected: boolean
  shares: number
  votes: number
  isVoted: boolean
  rank: number | null
  type: 'official' | 'member'
  createdAt: number
}

interface UGCState {
  works: UGCWork[]
  myWorks: UGCWork[]
  myVotes: string[]
  currentMonth: number
  publishCount: number
  submitWork: (work: Omit<UGCWork, 'id' | 'likes' | 'isLiked' | 'collects' | 'isCollected' | 'shares' | 'votes' | 'isVoted' | 'rank' | 'createdAt'>) => void
  likeWork: (workId: string) => void
  unlikeWork: (workId: string) => void
  collectWork: (workId: string) => void
  uncollectWork: (workId: string) => void
  shareWork: (workId: string) => void
  voteWork: (workId: string) => void
  unvoteWork: (workId: string) => void
  getRanking: () => UGCWork[]
  getMonthlyRanking: () => UGCWork[]
  getOfficialWorks: () => UGCWork[]
  getMemberWorks: () => UGCWork[]
  getMyVotes: () => string[]
  checkMonthReset: () => void
  trackUGC: (action: string, data: Record<string, unknown>) => void
}

const MOCK_WORKS: UGCWork[] = [
  {
    id: 'ugc-001',
    title: '桃夭的春日约会',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    author: '官方',
    productId: 'prod_peach_001',
    productName: '桃你欢心',
    likes: 888,
    isLiked: false,
    collects: 120,
    isCollected: false,
    shares: 45,
    votes: 128,
    isVoted: false,
    rank: 1,
    type: 'official',
    tags: ['#期末庆祝', '#精灵陪伴'],
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'ugc-002',
    title: '楂楂的冒险日记',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    author: '官方',
    productId: 'prod_hawthorn_001',
    productName: '楂香四溢',
    likes: 756,
    isLiked: false,
    collects: 98,
    isCollected: false,
    shares: 32,
    votes: 96,
    isVoted: false,
    rank: 2,
    type: 'official',
    tags: ['#冒险'],
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'ugc-003',
    title: '夏日清凉特饮',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop',
    author: '官方',
    productId: 'prod_pear_001',
    productName: '大吉大梨',
    likes: 623,
    isLiked: false,
    collects: 87,
    isCollected: false,
    shares: 28,
    votes: 78,
    isVoted: false,
    rank: 3,
    type: 'official',
    tags: ['#清凉'],
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'ugc-004',
    title: '榴莲控的天堂',
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=400&h=400&fit=crop',
    author: '小美同学',
    school: '清华大学',
    productId: 'prod_pomegranate_001',
    productName: '似水榴年',
    likes: 445,
    isLiked: false,
    collects: 56,
    isCollected: false,
    shares: 21,
    votes: 65,
    isVoted: false,
    rank: 4,
    type: 'member',
    tags: ['#榴莲控'],
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'ugc-005',
    title: '葡萄园的浪漫',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop',
    author: '小明同学',
    school: '北京大学',
    productId: 'prod_grape_001',
    productName: '葡写浪漫',
    likes: 389,
    isLiked: false,
    collects: 43,
    isCollected: false,
    shares: 18,
    votes: 52,
    isVoted: false,
    rank: 5,
    type: 'member',
    tags: ['#浪漫'],
    createdAt: Date.now() - 86400000 * 1,
  },
  {
    id: 'ugc-006',
    title: '精灵陪你过生日',
    image: '📸',
    author: '果酒爱好者',
    productId: 'prod_peach_001',
    productName: '桃你欢心',
    likes: 256,
    isLiked: false,
    collects: 34,
    isCollected: false,
    shares: 15,
    votes: 38,
    isVoted: false,
    rank: 6,
    type: 'member',
    tags: ['#生日', '#精灵陪伴'],
    createdAt: Date.now() - 86400000 * 0.5,
  },
  {
    id: 'ugc-007',
    title: '宿舍微醺时刻',
    image: '📸',
    author: '室友小王',
    school: '复旦大学',
    productId: 'prod_hawthorn_001',
    productName: '楂香四溢',
    likes: 198,
    isLiked: false,
    collects: 28,
    isCollected: false,
    shares: 12,
    votes: 25,
    isVoted: false,
    rank: 7,
    type: 'member',
    tags: ['#宿舍聚会', '#微醺时刻'],
    createdAt: Date.now() - 86400000 * 0.3,
  },
  {
    id: 'ugc-008',
    title: '送礼首选推荐',
    image: '📸',
    author: '送礼达人',
    productId: 'prod_grape_001',
    productName: '葡写浪漫',
    likes: 156,
    isLiked: false,
    collects: 22,
    isCollected: false,
    shares: 9,
    votes: 18,
    isVoted: false,
    rank: 8,
    type: 'member',
    tags: ['#送礼佳品'],
    createdAt: Date.now() - 86400000 * 0.2,
  },
  {
    id: 'ugc-009',
    title: '期末解压神器',
    image: '📸',
    author: '学霸小李',
    school: '浙江大学',
    productId: 'prod_pear_001',
    productName: '大吉大梨',
    likes: 134,
    isLiked: false,
    collects: 19,
    isCollected: false,
    shares: 8,
    votes: 12,
    isVoted: false,
    rank: 9,
    type: 'member',
    tags: ['#期末庆祝', '#解压'],
    createdAt: Date.now() - 86400000 * 0.1,
  },
  {
    id: 'ugc-010',
    title: '青梅清新口感',
    image: '📸',
    author: '品酒师小张',
    productId: 'prod_hawthorn_001',
    productName: '楂香四溢',
    likes: 112,
    isLiked: false,
    collects: 15,
    isCollected: false,
    shares: 6,
    votes: 8,
    isVoted: false,
    rank: 10,
    type: 'member',
    tags: ['#青梅精灵', '#低度酒推荐'],
    createdAt: Date.now(),
  },
  {
    id: 'ugc-011',
    title: '包装太精美了',
    image: '📸',
    author: '收藏爱好者',
    productId: 'prod_pomegranate_001',
    productName: '似水榴年',
    likes: 89,
    isLiked: false,
    collects: 12,
    isCollected: false,
    shares: 5,
    votes: 0,
    isVoted: false,
    rank: null,
    type: 'member',
    tags: ['#包装精美'],
    createdAt: Date.now() + 86400000,
  },
]

export const useUGCStore = create<UGCState>()(
  persist(
    (set, get) => ({
      works: MOCK_WORKS,
      myWorks: [],
      myVotes: [],
      currentMonth: new Date().getMonth(),
      publishCount: 0,

      submitWork: (work) => {
        const newWork: UGCWork = {
          ...work,
          id: `ugc-${Date.now()}`,
          likes: 0,
          isLiked: false,
          collects: 0,
          isCollected: false,
          shares: 0,
          votes: 0,
          isVoted: false,
          rank: null,
          createdAt: Date.now(),
        }
        set((state) => ({
          works: [newWork, ...state.works],
          myWorks: [newWork, ...state.myWorks],
          publishCount: state.publishCount + 1,
        }))
        // 埋点
        get().trackUGC('ugc_publish', {
          workId: newWork.id,
          productId: newWork.productId,
        })
      },

      likeWork: (workId) => {
        set((state) => ({
          works: state.works.map((w) =>
            w.id === workId ? { ...w, likes: w.likes + 1, isLiked: true } : w
          ),
        }))
      },

      unlikeWork: (workId) => {
        set((state) => ({
          works: state.works.map((w) =>
            w.id === workId ? { ...w, likes: w.likes - 1, isLiked: false } : w
          ),
        }))
      },

      collectWork: (workId) => {
        set((state) => ({
          works: state.works.map((w) =>
            w.id === workId ? { ...w, collects: w.collects + 1, isCollected: true } : w
          ),
        }))
      },

      uncollectWork: (workId) => {
        set((state) => ({
          works: state.works.map((w) =>
            w.id === workId ? { ...w, collects: w.collects - 1, isCollected: false } : w
          ),
        }))
      },

      shareWork: (workId) => {
        set((state) => ({
          works: state.works.map((w) =>
            w.id === workId ? { ...w, shares: w.shares + 1 } : w
          ),
        }))
        get().trackUGC('ugc_share_vote', { workId })
      },

      voteWork: (workId) => {
        const { myVotes } = get()
        if (myVotes.includes(workId)) return

        set((state) => ({
          works: state.works.map((w) =>
            w.id === workId ? { ...w, votes: w.votes + 1, isVoted: true } : w
          ),
          myVotes: [...state.myVotes, workId],
        }))
        get().trackUGC('ugc_vote', { workId })
      },

      unvoteWork: (workId) => {
        const { myVotes } = get()
        if (!myVotes.includes(workId)) return

        set((state) => ({
          works: state.works.map((w) =>
            w.id === workId ? { ...w, votes: w.votes - 1, isVoted: false } : w
          ),
          myVotes: state.myVotes.filter((id) => id !== workId),
        }))
      },

      getRanking: () => {
        return get().works
          .filter((w) => w.rank !== null)
          .sort((a, b) => (a.rank || 999) - (b.rank || 999))
      },

      getMonthlyRanking: () => {
        get().checkMonthReset()
        return get().works
          .filter((w) => w.votes > 0)
          .sort((a, b) => b.votes - a.votes)
          .slice(0, 10)
          .map((w, index) => ({ ...w, rank: index + 1 }))
      },

      getOfficialWorks: () => {
        return get().works.filter((w) => w.type === 'official')
      },

      getMemberWorks: () => {
        return get().works.filter((w) => w.type === 'member')
      },

      getMyVotes: () => get().myVotes,

      checkMonthReset: () => {
        const currentMonth = new Date().getMonth()
        const { currentMonth: storedMonth } = get()
        if (currentMonth !== storedMonth) {
          set((state) => ({
            works: state.works.map((w) => ({ ...w, votes: 0, rank: null, isVoted: false })),
            myVotes: [],
            currentMonth,
          }))
        }
      },

      trackUGC: (action, data) => {
        const userId = 'user_' + Date.now()
        const trackData = {
          userId,
          action,
          timestamp: Date.now(),
          ...data,
        }
        console.log('[UGC埋点]', trackData)
      },
    }),
    { name: 'ugc-store', storage: taroStorage }
  )
)
