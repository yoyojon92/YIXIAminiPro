/**
 * 跑腿员动态/时刻状态管理
 * 从 runnerStore 拆分出来，负责跑腿员的动态发布、点赞等
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { taroStorage } from './taroStorage'

// 藏府君角色类型（五行对应五脏）
export type ZangfuRole = 'heart' | 'liver' | 'spleen' | 'lung' | 'kidney'

// 藏府君角色信息
export const ZANGFU_ROLE_INFO: Record<ZangfuRole, { name: string; emoji: string; color: string }> = {
  heart: { name: '欣欣', emoji: '❤️', color: '#DC2626' },      // 心大人 - 朱砂红
  liver: { name: '甘甘', emoji: '💚', color: '#059669' },      // 肝大人 - 翠玉绿
  spleen: { name: '皮皮', emoji: '💛', color: '#D97706' },     // 脾大人 - 琥珀黄
  lung: { name: '霏霏', emoji: '🤍', color: '#F8FAFC' },       // 肺大人 - 皓白
  kidney: { name: '沈沈', emoji: '💜', color: '#7C3AED' }      // 肾大人 - 深紫
}

// 跑腿员动态/时刻
export interface RunnerMoment {
  id: string
  runnerId: string
  runnerName: string
  runnerAvatar?: string
  content: string
  images?: string[]
  location?: string
  zangfuRole?: ZangfuRole        // 当前扮演的藏府君角色
  mood?: string                   // 情绪标签
  likes: number
  likedBy: string[]               // 点赞用户ID列表
  comments: MomentComment[]
  createdAt: number
}

export interface MomentComment {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: number
}

interface MomentState {
  // 动态列表
  moments: RunnerMoment[]
  
  // 操作方法
  addMoment: (moment: Omit<RunnerMoment, 'id' | 'likes' | 'likedBy' | 'comments' | 'createdAt'>) => void
  deleteMoment: (momentId: string) => void
  likeMoment: (momentId: string, userId: string) => void
  unlikeMoment: (momentId: string, userId: string) => void
  addComment: (momentId: string, comment: Omit<MomentComment, 'id' | 'createdAt'>) => void
  
  // 查询方法
  getMomentsByRunner: (runnerId: string) => RunnerMoment[]
  getMomentById: (momentId: string) => RunnerMoment | undefined
  
  // 藏府君角色相关
  getZangfuRoleInfo: (role: ZangfuRole) => { name: string; emoji: string; color: string }
}

// Mock 数据
const INITIAL_MOMENTS: RunnerMoment[] = [
  {
    id: 'moment_1',
    runnerId: 'runner_001',
    runnerName: '张三',
    content: '今天配送了20单，腿都要跑断了！不过看到同学们收到果酒时开心的表情，一切都值得了~',
    location: '青岛大学 南苑生活区',
    zangfuRole: 'heart',
    mood: '开心',
    likes: 15,
    likedBy: [],
    comments: [],
    createdAt: Date.now() - 2 * 60 * 60 * 1000
  },
  {
    id: 'moment_2',
    runnerId: 'runner_002',
    runnerName: '李四',
    content: '今天扮演心大人配送，正能量满满！',
    images: [],
    location: '中国海洋大学',
    zangfuRole: 'liver',
    mood: '疲惫但充实',
    likes: 8,
    likedBy: [],
    comments: [],
    createdAt: Date.now() - 5 * 60 * 60 * 1000
  }
]

export const useMomentStore = create<MomentState>()(
  persist(
    (set, get) => ({
      moments: INITIAL_MOMENTS,

      // 发布动态
      addMoment: (moment) => {
        const newMoment: RunnerMoment = {
          ...moment,
          id: `moment_${Date.now()}`,
          likes: 0,
          likedBy: [],
          comments: [],
          createdAt: Date.now()
        }
        set(state => ({ moments: [newMoment, ...state.moments] }))
      },

      // 删除动态
      deleteMoment: (momentId) => {
        set(state => ({
          moments: state.moments.filter(m => m.id !== momentId)
        }))
      },

      // 点赞
      likeMoment: (momentId, userId) => {
        set(state => ({
          moments: state.moments.map(m =>
            m.id === momentId && !m.likedBy.includes(userId)
              ? { ...m, likes: m.likes + 1, likedBy: [...m.likedBy, userId] }
              : m
          )
        }))
      },

      // 取消点赞
      unlikeMoment: (momentId, userId) => {
        set(state => ({
          moments: state.moments.map(m =>
            m.id === momentId && m.likedBy.includes(userId)
              ? { ...m, likes: Math.max(0, m.likes - 1), likedBy: m.likedBy.filter(id => id !== userId) }
              : m
          )
        }))
      },

      // 添加评论
      addComment: (momentId, comment) => {
        const newComment: MomentComment = {
          ...comment,
          id: `comment_${Date.now()}`,
          createdAt: Date.now()
        }
        set(state => ({
          moments: state.moments.map(m =>
            m.id === momentId
              ? { ...m, comments: [...m.comments, newComment] }
              : m
          )
        }))
      },

      // 获取跑腿员的所有动态
      getMomentsByRunner: (runnerId) => {
        return get().moments.filter(m => m.runnerId === runnerId)
      },

      // 根据ID获取动态
      getMomentById: (momentId) => {
        return get().moments.find(m => m.id === momentId)
      },

      // 获取藏府君角色信息
      getZangfuRoleInfo: (role) => {
        return ZANGFU_ROLE_INFO[role]
      }
    }),
    {
      name: 'yixia-moment-storage',
      storage: taroStorage
    }
  )
)
