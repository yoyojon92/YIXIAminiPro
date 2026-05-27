/**
 * 用户状态管理
 * 管理用户登录状态、用户信息、Token 等
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { taroStorage } from './taroStorage'

export interface UserInfo {
  id: string
  openid: string
  nickname: string
  avatar: string
  phone: string
  schoolId: string
  schoolName: string
  ageVerified: boolean // 年龄验证状态（果酒购买需要）
  // 四角色体系：普通用户/跑腿员/辅导员/超级管理员
  role: 'user' | 'agent' | 'counselor' | 'super_admin'
  // 辅导员专属字段
  counselorCode?: string  // 一人一码推广码
  counselorLevel?: number // 辅导员层级（1/2/3级）
}

interface UserState {
  // 用户信息
  userInfo: UserInfo | null
  token: string | null
  isLoggedIn: boolean
  isMember: boolean
  memberExpire: number | null
  
  // 操作方法
  setUserInfo: (user: UserInfo | null) => void
  setToken: (token: string | null) => void
  setIsMember: (isMember: boolean) => void
  joinMember: () => void
  setAgeVerified: (verified: boolean) => void
  logout: () => void
  
  // 微信登录
  loginWithWechat: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userInfo: null,
      token: null,
      isLoggedIn: false,
      isMember: false,
      memberExpire: null,
      
      setUserInfo: (user) => set({ 
        userInfo: user, 
        isLoggedIn: !!user 
      }),
      
      setToken: (token) => set({ token }),
      
      setAgeVerified: (verified) => set((state) => ({
        userInfo: state.userInfo ? { ...state.userInfo, ageVerified: verified } : null
      })),
      
      setIsMember: (isMember) => set({ isMember }),
      
      logout: () => set({ 
        userInfo: null, 
        token: null, 
        isLoggedIn: false,
        isMember: false,
        memberExpire: null,
      }),
      
      // 开通会员 - 模拟支付
      joinMember: () => {
        const expire = Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天后
        set({ isMember: true, memberExpire: expire })
      },
      
      // 微信登录 - 实际需要调用 wx.login 获取 code
      loginWithWechat: async () => {
        // #ifdef MP-WEIXIN
        try {
          // 获取微信登录凭证
          const loginResult = await Taro.login()
          const code = loginResult.code
          
          // TODO: 调用后端 API 换取 openid 和 token
          // const res = await fetch('/api/auth/login', {
          //   method: 'POST',
          //   data: { code }
          // })
          
          // 临时 Mock 数据
          const mockUser: UserInfo = {
            id: 'user_' + Date.now(),
            openid: 'mock_openid_' + code,
            nickname: '大学生用户',
            avatar: '',
            phone: '138****8888',
            schoolId: 'school_1',
            schoolName: '青岛农业大学',
            ageVerified: false,
            role: 'user'
          }
          
          set({ userInfo: mockUser, token: 'mock_token', isLoggedIn: true })
        } catch (error) {
          console.error('微信登录失败:', error)
        }
        // #endif
      }
    }),
    {
      name: 'yixia-user-storage',
      storage: taroStorage,
      partialize: (state) => ({ 
        userInfo: state.userInfo,
        token: state.token,
        isLoggedIn: state.isLoggedIn
      })
    }
  )
)
