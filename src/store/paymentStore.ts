/**
 * 支付方式 Store - 管理用户支付方式列表、默认支付方式
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { taroStorage } from './taroStorage'

export interface PaymentMethod {
  id: string
  type: 'wechat' | 'alipay' | 'balance'
  label: string
  account: string
  avatar?: string
  isDefault: boolean
  isEnabled: boolean
}

interface PaymentState {
  methods: PaymentMethod[]
  selectedMethodId: string | null
  addMethod: (method: Omit<PaymentMethod, 'id'>) => void
  removeMethod: (id: string) => void
  setDefault: (id: string) => void
  toggleEnabled: (id: string) => void
  selectMethod: (id: string) => void
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      methods: [
        {
          id: 'pm_wechat',
          type: 'wechat',
          label: '微信支付',
          account: '张**',
          isDefault: true,
          isEnabled: true
        },
        {
          id: 'pm_balance',
          type: 'balance',
          label: '余额支付',
          account: '¥128.50',
          isDefault: false,
          isEnabled: true
        }
      ],
      selectedMethodId: 'pm_wechat',

      addMethod: (method) => set((state) => ({
        methods: [
          ...state.methods,
          { ...method, id: `pm_${Date.now()}` }
        ]
      })),

      removeMethod: (id) => set((state) => ({
        methods: state.methods.filter(m => m.id !== id)
      })),

      setDefault: (id) => set((state) => ({
        methods: state.methods.map(m => ({
          ...m,
          isDefault: m.id === id
        }))
      })),

      toggleEnabled: (id) => set((state) => ({
        methods: state.methods.map(m =>
          m.id === id ? { ...m, isEnabled: !m.isEnabled } : m
        )
      })),

      selectMethod: (id) => set({ selectedMethodId: id })
    }),
    {
      name: 'yixia-payment-storage',
      storage: taroStorage,
      partialize: (state) => ({
        methods: state.methods,
        selectedMethodId: state.selectedMethodId
      })
    }
  )
)
