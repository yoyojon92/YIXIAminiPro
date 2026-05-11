/**
 * 精灵状态管理
 * 管理精灵收集进度、碎片数量、已合成精灵等
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Sprite {
  id: string
  name: string
  alias: string // 别名，如"小梨"
  flavor: string // 对应口味
  rarity: 'N' | 'R' | 'SR' | 'SSR' | 'UR'
  image: string
  story: string
  fragmentCount: number // 合成所需碎片数
  description: string
}

export interface UserSprite extends Sprite {
  isCollected: boolean // 是否已收集
  fragmentCount: number // 用户拥有的碎片数
  collectedAt?: string // 收集时间
}

interface SpriteState {
  // 全部精灵
  allSprites: Sprite[]
  
  // 用户精灵数据
  userSprites: Record<string, { fragments: number; collected: boolean; collectedAt?: string }>
  
  // 计算属性
  collectedCount: () => number
  totalCount: () => number
  progress: () => number
  getSpriteStatus: (spriteId: string) => 'collected' | 'canCombine' | 'fragment' | 'locked'
  getFragments: (spriteId: string) => number
  canCombine: (spriteId: string) => boolean
  
  // 操作方法
  addFragment: (spriteId: string, count?: number) => void
  combineSprite: (spriteId: string) => boolean
  setSprites: (sprites: Sprite[]) => void
  syncUserData: (data: Record<string, { fragments: number; collected: boolean }>) => void
}

// 官方精灵数据 - 3款产品对应3个精灵
export const MOCK_SPRITES: Sprite[] = [
  {
    id: 'sprite_lixiao',
    name: '梨酒精灵',
    alias: '小梨',
    flavor: '梨',
    rarity: 'R',
    image: '🍐',
    story: '"秋高气爽，梨香满园。我是来自沂蒙山的小梨，每一颗梨都承载着果农的期盼。当月光洒落，我会悄悄走进你的梦，带去一份清甜与安宁。"',
    fragmentCount: 3,
    description: '清甜润肺，大吉大利'
  },
  {
    id: 'sprite_liulian',
    name: '石榴精灵',
    alias: '小榴',
    flavor: '石榴',
    rarity: 'SR',
    image: '🍎',
    story: '"红宝石般的果实，蕴含着四季的阳光。我是石榴精灵小榴，每一滴酒都是生命的馈赠。愿与你分享这份红彤彤的喜悦。"',
    fragmentCount: 5,
    description: '红润养颜，似水榴年'
  },
  {
    id: 'sprite_shanjiao',
    name: '山楂精灵',
    alias: '小楂',
    flavor: '山楂',
    rarity: 'R',
    image: '🍒',
    story: '"酸酸甜甜就是我，来自沂蒙山间的小楂。当你在课堂上打瞌睡时，一口山楂酒就能让你精神百倍！学习也要劳逸结合呀~"',
    fragmentCount: 3,
    description: '酸甜开胃，回味无穷'
  }
]

export const useSpriteStore = create<SpriteState>()(
  persist(
    (set, get) => ({
      allSprites: MOCK_SPRITES,
      userSprites: {},
      
      // 已收集数量
      collectedCount: () => {
        return Object.values(get().userSprites).filter(s => s.collected).length
      },
      
      // 总数量
      totalCount: () => get().allSprites.length,
      
      // 收集进度
      progress: () => {
        const total = get().totalCount()
        if (total === 0) return 0
        return Math.round((get().collectedCount() / total) * 100)
      },
      
      // 获取精灵状态
      getSpriteStatus: (spriteId) => {
        const userData = get().userSprites[spriteId]
        const sprite = get().allSprites.find(s => s.id === spriteId)
        
        if (!sprite) return 'locked'
        
        if (userData?.collected) return 'collected'
        
        const fragments = userData?.fragments || 0
        if (fragments >= sprite.fragmentCount) return 'canCombine'
        
        if (fragments > 0) return 'fragment'
        
        return 'locked'
      },
      
      // 获取碎片数量
      getFragments: (spriteId) => {
        return get().userSprites[spriteId]?.fragments || 0
      },
      
      // 是否可以合成
      canCombine: (spriteId) => {
        const sprite = get().allSprites.find(s => s.id === spriteId)
        if (!sprite) return false
        return get().getFragments(spriteId) >= sprite.fragmentCount
      },
      
      // 添加碎片
      addFragment: (spriteId, count = 1) => {
        set(state => {
          const sprite = state.allSprites.find(s => s.id === spriteId)
          if (!sprite) return state
          
          const current = state.userSprites[spriteId] || { fragments: 0, collected: false }
          
          // 如果已收集，不再添加碎片
          if (current.collected) return state
          
          return {
            userSprites: {
              ...state.userSprites,
              [spriteId]: {
                ...current,
                fragments: current.fragments + count
              }
            }
          }
        })
      },
      
      // 合成精灵
      combineSprite: (spriteId) => {
        const sprite = get().allSprites.find(s => s.id === spriteId)
        if (!sprite) return false
        
        if (!get().canCombine(spriteId)) return false
        
        set(state => ({
          userSprites: {
            ...state.userSprites,
            [spriteId]: {
              ...state.userSprites[spriteId],
              fragments: 0,
              collected: true,
              collectedAt: new Date().toISOString()
            }
          }
        }))
        
        return true
      },
      
      // 设置精灵列表
      setSprites: (sprites) => {
        set({ allSprites: sprites })
      },
      
      // 同步用户数据
      syncUserData: (data) => {
        set({ userSprites: data })
      }
    }),
    {
      name: 'yixia-sprites',
      partialize: (state) => ({ userSprites: state.userSprites })
    }
  )
)
