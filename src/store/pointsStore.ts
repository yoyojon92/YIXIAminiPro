/**
 * 积分 Store - 管理用户积分余额、积分记录
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { taroStorage } from './taroStorage'

export interface PointsRecord {
  id: string
  type: 'earn' | 'spend' | 'expire'
  amount: number
  balance: number
  source: string
  description: string
  createdAt: string
}

interface PointsState {
  balance: number
  totalEarned: number
  totalSpent: number
  expiringSoon: number
  records: PointsRecord[]
  addPoints: (amount: number, source: string, description: string) => void
  spendPoints: (amount: number, source: string, description: string) => void
  loadRecords: () => void
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set) => ({
      balance: 2580,
      totalEarned: 5280,
      totalSpent: 2700,
      expiringSoon: 120,
      records: [],

      addPoints: (amount, source, description) => set((state) => {
        const newBalance = state.balance + amount
        const record: PointsRecord = {
          id: `pr_${Date.now()}`,
          type: 'earn',
          amount,
          balance: newBalance,
          source,
          description,
          createdAt: new Date().toISOString()
        }
        return {
          balance: newBalance,
          totalEarned: state.totalEarned + amount,
          records: [record, ...state.records]
        }
      }),

      spendPoints: (amount, source, description) => set((state) => {
        if (state.balance < amount) {
          return state
        }
        const newBalance = state.balance - amount
        const record: PointsRecord = {
          id: `pr_${Date.now()}`,
          type: 'spend',
          amount,
          balance: newBalance,
          source,
          description,
          createdAt: new Date().toISOString()
        }
        return {
          balance: newBalance,
          totalSpent: state.totalSpent + amount,
          records: [record, ...state.records]
        }
      }),

      loadRecords: () => set({
        records: [
          {
            id: 'pr_1',
            type: 'earn',
            amount: 100,
            balance: 2580,
            source: 'order',
            description: '购买商品获得积分',
            createdAt: '2025-01-15 10:30:00'
          },
          {
            id: 'pr_2',
            type: 'spend',
            amount: 200,
            balance: 2480,
            source: 'redeem',
            description: '兑换优惠券',
            createdAt: '2025-01-14 15:20:00'
          },
          {
            id: 'pr_3',
            type: 'earn',
            amount: 50,
            balance: 2680,
            source: 'sign',
            description: '每日签到',
            createdAt: '2025-01-14 08:00:00'
          }
        ]
      })
    }),
    {
      name: 'yixia-points-storage',
      storage: taroStorage,
      partialize: (state) => ({
        balance: state.balance,
        totalEarned: state.totalEarned,
        totalSpent: state.totalSpent,
        expiringSoon: state.expiringSoon
      })
    }
  )
)
