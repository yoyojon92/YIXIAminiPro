import Taro from '@tarojs/taro'
import { createJSONStorage } from 'zustand/middleware'

/**
 * Taro Storage 适配器
 * 用于 zustand persist 中间件，解决微信小程序没有 localStorage 的问题
 */
export const taroStorage = createJSONStorage(() => ({
  getItem: (name: string): string | null => {
    try {
      const value = Taro.getStorageSync(name)
      return value || null
    } catch {
      return null
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      Taro.setStorageSync(name, value)
    } catch {
      // 忽略存储错误
    }
  },
  removeItem: (name: string): void => {
    try {
      Taro.removeStorageSync(name)
    } catch {
      // 忽略删除错误
    }
  }
}))
