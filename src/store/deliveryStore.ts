import { create } from 'zustand'
import { DeliveryMode, PICKUP_POINTS, PickupPoint } from '../mock/delivery'

interface DeliveryState {
  mode: DeliveryMode
  selectedPickupPoint: PickupPoint
  setMode: (mode: DeliveryMode) => void
  setPickupPoint: (point: PickupPoint) => void
  getPickupPointName: () => string
}

export const useDeliveryStore = create<DeliveryState>((set, get) => ({
  mode: 'delivery',
  selectedPickupPoint: PICKUP_POINTS[0], // 默认最近的
  setMode: (mode) => set({ mode }),
  setPickupPoint: (point) => set({ selectedPickupPoint: point }),
  getPickupPointName: () => {
    const state = get()
    return state.mode === 'pickup' ? state.selectedPickupPoint.name : '配送到门'
  }
}))
