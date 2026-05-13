/**
 * 购物车状态管理
 * 管理购物车商品、配送方式、宿舍信息、代券等
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartAPI } from '@/services/api'
import type { Coupon } from '@/data/coupons'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  originalPrice: number
  spec: string // 规格，如 "300ml"
  flavors?: string[] // 口味选项
  quantity: number
  image: string
  maxQuantity: number // 库存上限
}

export type DeliveryType = 'dormitory' | 'self_pickup'

export interface DormitoryAddress {
  zoneId: string
  zoneName: string
  building: string
  roomNumber: string
}

export interface DeliveryInfo {
  type: DeliveryType
  dormitoryAddress?: DormitoryAddress // 宿舍地址
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
  
  // 代券相关
  selectedCoupon: Coupon | null // 选中的代券
  availableCoupons: Coupon[]   // 可用代券列表
  
  // 计算属性
  totalAmount: () => number
  totalOriginalAmount: () => number
  discountAmount: () => number
  couponDiscount: () => number  // 代券抵扣金额
  finalAmount: () => number     // 最终应付金额
  totalQuantity: () => number
  hasWine: () => boolean // 是否包含果酒（需要年龄验证）
  
  // 操作方法
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setDelivery: (delivery: Partial<DeliveryInfo>) => void
  setPickupShop: (shopId: string, shopName: string) => void
  setDormitoryAddress: (address: DormitoryAddress) => void
  
  // 代券操作
  setSelectedCoupon: (coupon: Coupon | null) => void
  setAvailableCoupons: (coupons: Coupon[]) => void
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  
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
      selectedCoupon: null,
      availableCoupons: [],
      
      // 计算总价
      totalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
      
      // 计算原价总价
      totalOriginalAmount: () => {
        return get().items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)
      },
      
      // 计算优惠金额（会员价/限时优惠等）
      discountAmount: () => {
        return get().totalOriginalAmount() - get().totalAmount()
      },

      // 计算代券抵扣金额
      couponDiscount: () => {
        const { selectedCoupon, totalAmount } = get()
        if (!selectedCoupon) return 0
        if (totalAmount() >= selectedCoupon.minSpend) {
          return selectedCoupon.discount
        }
        return 0
      },

      // 计算最终应付金额
      finalAmount: () => {
        const { totalAmount, couponDiscount } = get()
        return Math.max(0, totalAmount() - couponDiscount())
      },
      
      // 计算总数量
      totalQuantity: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
      
      // 是否包含果酒（通过检查是否包含酒精标识）
      hasWine: () => {
        // 检查商品规格中是否包含"酒"字样
        return get().items.some(item => 
          item.name.includes('酒') || item.spec.includes('酒')
        )
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
      
      // 设置自提点（便捷方法）
      setPickupShop: (shopId: string, shopName: string) => {
        set(state => ({
          delivery: {
            ...state.delivery,
            type: 'self_pickup',
            pickupShopId: shopId,
            pickupShopName: shopName
          }
        }))
      },
      
      // 设置宿舍地址（便捷方法）
      setDormitoryAddress: (address: DormitoryAddress) => {
        set(state => ({
          delivery: {
            ...state.delivery,
            type: 'dormitory',
            dormitoryAddress: address
          }
        }))
      },
      
      // 从服务器同步购物车
      syncFromServer: async () => {
        set({ loading: true })
        try {
          const items = await CartAPI.getList()
          // 将API返回的CartItem转换为store的CartItem格式
          const mappedItems: CartItem[] = items.map((item, index) => ({
            id: `item_${index}`,
            productId: String(item.productId),
            name: item.productName,
            price: item.price,
            originalPrice: item.price,
            spec: item.capacity,
            quantity: item.quantity,
            image: item.image,
            maxQuantity: 99
          }))
          set({ items: mappedItems })
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
          // 购物车同步逻辑 - 目前使用本地状态
          // 后续可通过批量操作API同步
        } catch (error) {
          console.error('同步购物车到服务器失败:', error)
        } finally {
          set({ syncing: false })
        }
      },
      
      // 获取结算商品
      getCheckoutItems: () => get().items,

      // 设置选中的代券
      setSelectedCoupon: (coupon) => {
        set({ selectedCoupon: coupon })
      },

      // 设置可用代券列表
      setAvailableCoupons: (coupons) => {
        set({ availableCoupons: coupons })
      },

      // 应用代券
      applyCoupon: (coupon) => {
        const { totalAmount } = get()
        if (totalAmount() >= coupon.minSpend) {
          set({ selectedCoupon: coupon })
        }
      },

      // 移除代券
      removeCoupon: () => {
        set({ selectedCoupon: null })
      },
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
