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
  complaintCount: number  // 累计被投诉次数
  isSuspended: boolean     // 是否被暂停接单资格
  suspendedReason?: string // 暂停原因
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
  isAvailable: boolean  // 是否接单中
  
  // 订单列表
  orders: RunnerOrder[]
  
  // 新订单通知
  newOrderNotification: RunnerOrder | null
  
  // 操作方法
  register: (info: { name: string; phone: string; school: string; studentId: string }) => void
  logout: () => void
  setAvailable: (available: boolean) => void
  
  // 订单操作
  acceptOrder: (orderId: string) => void
  completeOrder: (orderId: string) => void
  addMockOrder: () => void
  dismissNotification: () => void
  
  // 统计
  getTodayOrders: () => RunnerOrder[]
  getTodayEarnings: () => number
  
  // 投诉管理（平台端调用）
  addComplaint: (orderId: string) => void
  reviewAndRestore: () => void  // 人工审核后恢复接单资格
  getComplaintCount: () => number
}

export const useRunnerStore = create<RunnerState>()(
  persist(
    (set, get) => ({
      runnerInfo: null,
      isRegistered: false,
      isAvailable: false,
      orders: [],
      newOrderNotification: null,

      register: (info) => {
        const newRunner: RunnerInfo = {
          ...info,
          id: `runner_${Date.now()}`,
          registeredAt: Date.now(),
          todayEarnings: 0,
          totalEarnings: 0,
          complaintCount: 0,
          isSuspended: false
        }
        set({ runnerInfo: newRunner, isRegistered: true, isAvailable: true })
      },

      logout: () => {
        set({ runnerInfo: null, isRegistered: false, isAvailable: false, orders: [], newOrderNotification: null })
      },

      setAvailable: (available) => {
        set({ isAvailable: available })
        console.log("[埋点] 跑腿员接单状态切换", {
          runnerId: get().runnerInfo?.id,
          action: available ? "runner_available" : "runner_unavailable",
          timestamp: Date.now()
        })
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
        set((state) => ({ 
          orders: [newOrder, ...state.orders],
          newOrderNotification: newOrder
        }))
      },

      dismissNotification: () => {
        set({ newOrderNotification: null })
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
      },

      // 添加投诉（用户端申请退款时调用）
      addComplaint: (_orderId: string) => {
        const state = get()
        if (!state.runnerInfo) return
        
        const newCount = state.runnerInfo.complaintCount + 1
        const isSuspended = newCount >= 5
        
        set({
          runnerInfo: {
            ...state.runnerInfo,
            complaintCount: newCount,
            isSuspended,
            suspendedReason: isSuspended ? `累计被投诉${newCount}次，已暂停接单资格，请联系客服审核` : undefined
          }
        })
      },

      // 人工审核后恢复接单资格
      reviewAndRestore: () => {
        const state = get()
        if (!state.runnerInfo) return
        
        set({
          runnerInfo: {
            ...state.runnerInfo,
            complaintCount: 0,
            isSuspended: false,
            suspendedReason: undefined
          }
        })
      },

      getComplaintCount: () => {
        return get().runnerInfo?.complaintCount || 0
      }
    }),
    {
      name: 'yixia-runner-storage'
    }
  )
)
