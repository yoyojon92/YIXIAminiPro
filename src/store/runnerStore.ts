/**
 * 跑腿员状态管理
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RunnerInfo {
  id: string
  name: string
  phone: string
  school: string
  studentId: string
  registeredAt: number
  todayEarnings: number
  totalEarnings: number
}

export interface RunnerOrder {
  id: string
  orderNo: string
  status: 'pending' | 'delivering' | 'completed'
  pickupLocation: string
  deliveryAddress: string
  deliveryFee: number
  createdAt: number
  completedAt?: number
}

interface RunnerState {
  // 跑腿员信息
  runnerInfo: RunnerInfo | null
  isRegistered: boolean
  
  // 订单列表
  orders: RunnerOrder[]
  
  // 操作方法
  register: (info: Omit<RunnerInfo, 'id' | 'registeredAt' | 'todayEarnings' | 'totalEarnings'>) => void
  logout: () => void
  
  // 订单操作
  acceptOrder: (orderId: string) => void
  completeOrder: (orderId: string) => void
  addMockOrder: () => void
  
  // 统计
  getTodayOrders: () => RunnerOrder[]
  getTodayEarnings: () => number
}

export const useRunnerStore = create<RunnerState>()(
  persist(
    (set, get) => ({
      runnerInfo: null,
      isRegistered: false,
      orders: [],

      register: (info) => {
        const newRunner: RunnerInfo = {
          ...info,
          id: `runner_${Date.now()}`,
          registeredAt: Date.now(),
          todayEarnings: 0,
          totalEarnings: 0
        }
        set({ runnerInfo: newRunner, isRegistered: true })
      },

      logout: () => {
        set({ runnerInfo: null, isRegistered: false, orders: [] })
      },

      acceptOrder: (orderId) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: 'delivering' as const } : order
          )
        }))
        
        const order = get().orders.find(o => o.id === orderId)
        if (order) {
          console.log("[埋点] 跑腿员接单", {
            runnerId: get().runnerInfo?.id,
            orderId,
            action: "runner_accept",
            timestamp: Date.now()
          })
        }
      },

      completeOrder: (orderId) => {
        const order = get().orders.find(o => o.id === orderId)
        if (!order) return

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId 
              ? { ...o, status: 'completed' as const, completedAt: Date.now() } 
              : o
          ),
          runnerInfo: state.runnerInfo 
            ? { 
                ...state.runnerInfo, 
                todayEarnings: state.runnerInfo.todayEarnings + order.deliveryFee,
                totalEarnings: state.runnerInfo.totalEarnings + order.deliveryFee
              } 
            : null
        }))

        // 埋点
        console.log("[埋点] 跑腿员送达确认", {
          runnerId: get().runnerInfo?.id,
          orderId,
          action: "runner_delivered",
          timestamp: Date.now()
        })
      },

      addMockOrder: () => {
        const addresses = [
          { zone: '南苑生活区', building: '3号楼', room: '302' },
          { zone: '北苑生活区', building: '8号楼', room: '105' },
          { zone: '西苑生活区', building: '14号楼', room: '401' },
          { zone: '南苑生活区', building: '5号楼', room: '218' },
          { zone: '北苑生活区', building: '10号楼', room: '507' },
        ]
        const randomAddr = addresses[Math.floor(Math.random() * addresses.length)]
        
        const newOrder: RunnerOrder = {
          id: `order_${Date.now()}`,
          orderNo: `ORD${Date.now()}`,
          status: 'pending',
          pickupLocation: '邑夏驿站（北门）',
          deliveryAddress: `${randomAddr.zone} ${randomAddr.building} ${randomAddr.room}`,
          deliveryFee: 1,
          createdAt: Date.now()
        }
        set((state) => ({ orders: [newOrder, ...state.orders] }))
      },

      getTodayOrders: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return get().orders.filter((o) => o.createdAt >= today.getTime())
      },

      getTodayEarnings: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return get().orders
          .filter((o) => o.status === 'completed' && o.completedAt && o.completedAt >= today.getTime())
          .reduce((sum, o) => sum + o.deliveryFee, 0)
      }
    }),
    {
      name: 'yixia-runner-storage'
    }
  )
)
