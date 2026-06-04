/**
 * 状态管理导出
 */
export { useUserStore } from './userStore'
export type { UserInfo } from './userStore'

export { useCartStore } from './cartStore'
export type { CartItem, DeliveryInfo, DeliveryType } from './cartStore'

export { usePaymentStore } from './paymentStore'
export type { PaymentMethod, PaymentType, PaymentResult, PaymentParams } from './paymentStore'

export { usePointsStore } from './pointsStore'
export type { PointsRecord, PointsRule, PointsReward } from './pointsStore'

export { useRechargeStore } from './rechargeStore'
export type { RechargeCard, RechargePackage, RechargeRecord } from './rechargeStore'

export { useAdminStore } from './adminStore'
export type { AdminProduct } from './adminStore'

// 经销商+代理商
export { useDealerStore } from './dealerStore'
export type { DealerLevel, AgentLevel, CommissionRecord, WithdrawRecord, DealerPickupOrder, AgentOrder } from './dealerStore'

// 成本比例、批量配送
export { useCostStore } from './costStore'
export type { CostRatio, CostBreakdown } from './costStore'

