import { create } from 'zustand'

export interface UGCWork {
  id: string
  title: string
  image: string
  author: string
  school?: string
  productId?: string
  likes: number
  isLiked: boolean
  collects: number
  isCollected: boolean
  shares: number
  type: 'official' | 'member'
  createdAt: number
}

interface UGCState {
  works: UGCWork[]
  myWorks: UGCWork[]
  submitWork: (work: Omit<UGCWork, 'id' | 'likes' | 'isLiked' | 'collects' | 'isCollected' | 'shares' | 'createdAt'>) => void
  likeWork: (workId: string) => void
  unlikeWork: (workId: string) => void
  collectWork: (workId: string) => void
  uncollectWork: (workId: string) => void
  shareWork: (workId: string) => void
  getRanking: () => UGCWork[]
  getOfficialWorks: () => UGCWork[]
  getMemberWorks: () => UGCWork[]
}

const MOCK_WORKS: UGCWork[] = [
  {
    id: 'ugc-001',
    title: '桃夭的春日约会',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    author: '官方',
    productId: 'fw-001',
    likes: 888,
    isLiked: false,
    collects: 120,
    isCollected: false,
    shares: 45,
    type: 'official',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'ugc-002',
    title: '楂楂的冒险日记',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    author: '官方',
    productId: 'fw-002',
    likes: 756,
    isLiked: false,
    collects: 98,
    isCollected: false,
    shares: 32,
    type: 'official',
    createdAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'ugc-003',
    title: '夏日清凉特饮',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop',
    author: '官方',
    productId: 'fw-003',
    likes: 623,
    isLiked: false,
    collects: 87,
    isCollected: false,
    shares: 28,
    type: 'official',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'ugc-004',
    title: '榴莲控的天堂',
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=400&h=400&fit=crop',
    author: '小美',
    school: '清华大学',
    productId: 'fw-004',
    likes: 445,
    isLiked: false,
    collects: 56,
    isCollected: false,
    shares: 21,
    type: 'member',
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'ugc-005',
    title: '葡萄园的浪漫',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop',
    author: '小明',
    school: '北京大学',
    productId: 'fw-005',
    likes: 389,
    isLiked: false,
    collects: 43,
    isCollected: false,
    shares: 18,
    type: 'member',
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'ugc-006',
    title: '醉美微醺时刻',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=400&fit=crop',
    author: '小兰',
    school: '复旦大学',
    productId: 'fw-006',
    likes: 312,
    isLiked: false,
    collects: 38,
    isCollected: false,
    shares: 15,
    type: 'member',
    createdAt: Date.now() - 43200000,
  },
]

export const useUGCStore = create<UGCState>((set, get) => ({
  works: MOCK_WORKS,
  myWorks: [],

  submitWork: (work) => {
    const newWork: UGCWork = {
      ...work,
      id: `ugc-${Date.now()}`,
      likes: 0,
      isLiked: false,
      collects: 0,
      isCollected: false,
      shares: 0,
      createdAt: Date.now(),
    }
    set((state) => ({
      works: [newWork, ...state.works],
      myWorks: [newWork, ...state.myWorks],
    }))
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
  },

  getRanking: () => {
    return get().works
      .filter((w) => {
        const workMonth = new Date(w.createdAt).getMonth()
        const now = new Date()
        return workMonth === now.getMonth()
      })
      .sort((a, b) => b.likes - a.likes)
  },

  getOfficialWorks: () => {
    return get().works.filter((w) => w.type === 'official')
  },

  getMemberWorks: () => {
    return get().works.filter((w) => w.type === 'member')
  },
}))
