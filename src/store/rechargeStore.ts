/**
 * 充值卡 Store - 管理充值卡余额和记录
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { taroStorage } from './taroStorage'

export interface RechargeCard {
  id: string
  name: string
  balance: number
  originalAmount: number
  discount: number
  validUntil: string
  status: 'active' | 'expired' | 'used'
  createdAt: string
}

interface RechargeState {
  cards: RechargeCard[]
  totalBalance: number
  addCard: (card: Omit<RechargeCard, 'id' | 'createdAt' | 'status'>) => void
  useBalance: (amount: number, cardId?: string) => boolean
  loadCards: () => void
}

export const useRechargeStore = create<RechargeState>()(
  persist(
    (set, get) => ({
      cards: [],
      totalBalance: 0,

      addCard: (cardData) => set((state) => {
        const newCard: RechargeCard = {
          ...cardData,
          id: `rc_${Date.now()}`,
          status: 'active',
          createdAt: new Date().toISOString()
        }
        const cards = [newCard, ...state.cards]
        const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0)
        return { cards, totalBalance }
      }),

      useBalance: (amount, cardId) => {
        const state = get()
        if (state.totalBalance < amount) return false

        let remaining = amount
        const cards = state.cards.map((card) => {
          if (remaining <= 0 || card.status !== 'active') return card
          if (cardId && card.id !== cardId) return card

          const deduct = Math.min(card.balance, remaining)
          remaining -= deduct
          return { ...card, balance: card.balance - deduct }
        })
        const totalBalance = cards.reduce((sum, c) => sum + c.balance, 0)
        set({ cards, totalBalance })
        return true
      },

      loadCards: () => set({
        cards: [
          {
            id: 'rc_1',
            name: '充值卡 500元',
            balance: 350,
            originalAmount: 500,
            discount: 1,
            validUntil: '2025-12-31',
            status: 'active',
            createdAt: '2025-01-01 10:00:00'
          }
        ],
        totalBalance: 350
      })
    }),
    {
      name: 'yixia-recharge-storage',
      storage: taroStorage,
      partialize: (state) => ({
        cards: state.cards,
        totalBalance: state.totalBalance
      })
    }
  )
)
