import { create } from 'zustand'

interface MemberModalState {
  showMemberModal: boolean
  setShowMemberModal: (show: boolean) => void
}

// 会员弹窗状态（简化版）
export const useMemberStore = create<MemberModalState>((set) => ({
  showMemberModal: false,
  setShowMemberModal: (show) => set({ showMemberModal: show }),
}))
