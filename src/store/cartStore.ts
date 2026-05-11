/**
 * 购物车状态管理
 * 管理购物车商品、配送方式、宿舍信息等
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartAPI } from '@/services/api'

export interface CartItem {
  id: string
  productId: number
  name: string
  price: number
  originalPrice: number
  spec: string // 规格，如 "300ml"
  quantity: number
  image: string
  maxQuantity: number // 库存上限
}

export type DeliveryType = 'dormitory' | 'self_pickup'

export interface DeliveryInfo {
  type: DeliveryType
  dormitory: string // 宿舍楼栋
  roomNumber: string // 房间号
  pickupShopId?: string // 自提点ID
  pickupShopName?: string // 自提点名称
}

interface CartState {
  // 购物车商品
  items: CartItem[]
  
  // 配送信息
  delivery: DeliveryInfo
  
  // 加载状态
  loading: boolean
  syncing: boolean // 是否正在同步到服务器
  
  // 计算属性
  totalAmount: () => number
  totalOriginalAmount: () => number
  discountAmount: () => number
  totalQuantity: () => number
  hasWine: () => boolean // 是否包含果酒（需要年龄验证）
  
  // 操作方法
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setDelivery: (delivery: Partial<DeliveryInfo>) => void
  
  // API 同步
  syncFromServer: () => Promise<void>
  syncToServer: () => Promise<void>
  
  // 选中结算（用于生成订单）
  getCheckoutItems: () => CartItem[]
}

// 生成唯一ID
const generateId = () => `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      delivery: {
        type: 'dormitory',
        dormitory: '',
        roomNumber: ''
      },
      loading: false,
      syncing: false,
      
      // 计算总价
      totalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
      
      // 计算原价总价
      totalOriginalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
      },
      
      // 计算优惠金额
      discountAmount: () => {
        return get().totalOriginalAmount() - get().totalAmount()
      },
      
      // 计算总数量
      totalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      
      // 是否包含果酒
      hasWine: () => {
        // 假设 productId < 1000 为果酒
        return get().items.some(item => item.productId < 1000)
      },
      
      // 添加商品到购物车
      addItem: async (item) => {
        const state = get()
        const existingItem = state.items.find(
          i => i.productId === item.productId && i.spec === item.spec
        )
        
        if (existingItem) {
          // 更新数量
          const newQuantity = Math.min(existingItem.quantity + item.quantity, item.maxQuantity)
          set({
            items: state.items.map(i =>
              i.id === existingItem.id ? { ...i, quantity: newQuantity } : i
            )
          })
        } else {
          // 新增
          set({
            items: [...state.items, { ...item, id: generateId() }]
          })
        }
        
        // 同步到服务器
        get().syncToServer()
      },
      
      // 移除商品
      removeItem: async (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }))
        // 同步到服务器
        get().syncToServer()
      },
      
      // 更新数量
      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        set(state => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quantity: Math.min(quantity, item.maxQuantity) }
              : item
          )
        }))
        
        // 同步到服务器
        get().syncToServer()
      },
      
      // 清空购物车
      clearCart: async () => {
        set({ items: [] })
        // 同步到服务器
        get().syncToServer()
      },
      
      // 设置配送信息
      setDelivery: (delivery) => {
        set(state => ({
          delivery: { ...state.delivery, ...delivery }
        }))
      },
      
      // 从服务器同步购物车
      syncFromServer: async () => {
        set({ loading: true })
        try {
          const res = await CartAPI.getCart()
          if (res.code === 200 && res.data) {
            set({ items: res.data.items || [] })
          }
        } catch (error) {
          console.error('同步购物车失败:', error)
        } finally {
          set({ loading: false })
        }
      },
      
      // 同步到服务器
      syncToServer: async () => {
        const state = get()
        if (state.syncing) return
        
        set({ syncing: true })
        try {
          await CartAPI.syncCart({
            items: state.items.map(item => ({
              productId: item.productId,
              spec: item.spec,
              quantity: item.quantity
            }))
          })
        } catch (error) {
          console.error('同步购物车到服务器失败:', error)
        } finally {
          set({ syncing: false })
        }
      },
      
      // 获取结算商品
      getCheckoutItems: () => get().items
    }),
    {
      name: 'yixia-cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        delivery: state.delivery
      })
    }
  )
)
