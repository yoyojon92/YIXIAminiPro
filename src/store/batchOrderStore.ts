/**
 * 批量配送订单状态管理
 * 管理员发起批量订单，指定学校+楼栋，跑腿员统一配送
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { taroStorage } from './taroStorage'

// 批量订单商品项
export interface BatchOrderItem {
  productId: string
  productName: string
  productImage: string
  quantity: number           // 批量数量
  unitPrice: number          // 单价
  totalPrice: number         // 总价
}

// 批量配送订单
export interface BatchOrder {
  id: string
  schoolId: string
  schoolName: string
  targetBuildings: string[]        // 目标楼栋列表
  items: BatchOrderItem[]
  totalQuantity: number
  totalAmount: number
  status: 'pending' | 'delivering' | 'completed' | 'cancelled'
  assignedRunnerId?: string        // 指定跑腿员ID
  assignedRunnerName?: string      // 跑腿员姓名
  createdAt: string
  completedAt?: string
  note?: string                    // 备注
  // 分销相关
  distributionEligible: boolean    // 批量配送默认计入分销
  counselorId?: string             // 关联辅导员
}

// 批量订单进度
export interface BatchOrderProgress {
  orderId: string
  totalItems: number               // 总商品数
  deliveredItems: number           // 已配送数
  remainingItems: number           // 剩余数
  percentage: number               // 完成百分比
}

interface BatchOrderState {
  // 批量订单列表
  orders: BatchOrder[]
  
  // 当前选中的订单
  currentOrderId: string | null
  
  // 操作方法
  createOrder: (order: Omit<BatchOrder, 'id' | 'createdAt' | 'status' | 'totalQuantity' | 'totalAmount' | 'distributionEligible'>) => void
  updateOrder: (orderId: string, updates: Partial<BatchOrder>) => void
  cancelOrder: (orderId: string) => void
  assignRunner: (orderId: string, runnerId: string, runnerName: string) => void
  startDelivery: (orderId: string) => void
  completeOrder: (orderId: string) => void
  
  // 查询方法
  getOrder: (orderId: string) => BatchOrder | undefined
  getOrdersByStatus: (status: BatchOrder['status']) => BatchOrder[]
  getOrdersBySchool: (schoolId: string) => BatchOrder[]
  
  // 进度追踪
  getProgress: (orderId: string) => BatchOrderProgress
  
  // 当前订单快捷方法
  setCurrentOrder: (orderId: string | null) => void
  getCurrentOrder: () => BatchOrder | undefined
}

// 初始化Mock数据（2条批量订单示例）
const INITIAL_BATCH_ORDERS: BatchOrder[] = [
  {
    id: 'batch_1',
    schoolId: 'school_qdu',
    schoolName: '青岛大学',
    targetBuildings: ['南苑3号楼', '南苑5号楼', '北苑8号楼'],
    items: [
      { productId: '1', productName: '蜜桃果酒', productImage: '', quantity: 50, unitPrice: 29.9, totalPrice: 1495 },
      { productId: '2', productName: '青梅果酒', productImage: '', quantity: 30, unitPrice: 29.9, totalPrice: 897 }
    ],
    totalQuantity: 80,
    totalAmount: 2392,
    status: 'delivering',
    assignedRunnerId: 'runner_001',
    assignedRunnerName: '张三',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
    distributionEligible: true
  },
  {
    id: 'batch_2',
    schoolId: 'school_ouc',
    schoolName: '中国海洋大学',
    targetBuildings: ['东区1号楼', '东区2号楼'],
    items: [
      { productId: '3', productName: 'NFC柠檬果汁', productImage: '', quantity: 100, unitPrice: 15.9, totalPrice: 1590 }
    ],
    totalQuantity: 100,
    totalAmount: 1590,
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30分钟前
    distributionEligible: true
  }
]

export const useBatchOrderStore = create<BatchOrderState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_BATCH_ORDERS,
      currentOrderId: null,

      // 创建批量订单
      createOrder: (order) => {
        const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0)
        const totalAmount = order.items.reduce((sum, item) => sum + item.totalPrice, 0)

        const newOrder: BatchOrder = {
          ...order,
          id: `batch_${Date.now()}`,
          createdAt: new Date().toISOString(),
          status: 'pending',
          totalQuantity,
          totalAmount,
          distributionEligible: true // 批量配送默认计入分销
        }

        set(state => ({ orders: [newOrder, ...state.orders] }))
      },

      // 更新订单
      updateOrder: (orderId, updates) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, ...updates } : order
          )
        }))
      },

      // 取消订单
      cancelOrder: (orderId) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, status: 'cancelled' as const } : order
          )
        }))
      },

      // 分配跑腿员
      assignRunner: (orderId, runnerId, runnerName) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, assignedRunnerId: runnerId, assignedRunnerName: runnerName }
              : order
          )
        }))
      },

      // 开始配送
      startDelivery: (orderId) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId ? { ...order, status: 'delivering' as const } : order
          )
        }))
      },

      // 完成订单
      completeOrder: (orderId) => {
        set(state => ({
          orders: state.orders.map(order =>
            order.id === orderId
              ? { ...order, status: 'completed' as const, completedAt: new Date().toISOString() }
              : order
          )
        }))
      },

      // 获取订单
      getOrder: (orderId) => {
        return get().orders.find(order => order.id === orderId)
      },

      // 按状态获取订单
      getOrdersByStatus: (status) => {
        return get().orders.filter(order => order.status === status)
      },

      // 按学校获取订单
      getOrdersBySchool: (schoolId) => {
        return get().orders.filter(order => order.schoolId === schoolId)
      },

      // 获取进度
      getProgress: (orderId) => {
        const order = get().getOrder(orderId)
        if (!order) {
          return { orderId, totalItems: 0, deliveredItems: 0, remainingItems: 0, percentage: 0 }
        }

        // 模拟进度计算（实际应根据配送记录计算）
        let deliveredItems = 0
        if (order.status === 'delivering') {
          deliveredItems = Math.floor(order.totalQuantity * 0.6) // 假设已配送60%
        } else if (order.status === 'completed') {
          deliveredItems = order.totalQuantity
        }

        return {
          orderId,
          totalItems: order.totalQuantity,
          deliveredItems,
          remainingItems: order.totalQuantity - deliveredItems,
          percentage: Math.round((deliveredItems / order.totalQuantity) * 100)
        }
      },

      // 设置当前订单
      setCurrentOrder: (orderId) => {
        set({ currentOrderId: orderId })
      },

      // 获取当前订单
      getCurrentOrder: () => {
        const { currentOrderId, orders } = get()
        if (!currentOrderId) return undefined
        return orders.find(order => order.id === currentOrderId)
      }
    }),
    {
      name: 'yixia-batch-order-storage',
      storage: taroStorage
    }
  )
)
