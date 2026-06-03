/**
 * 状态管理导出
 */
export { useUserStore } from './userStore'
export type { UserInfo } from './userStore'

export { useCartStore } from './cartStore'
export type { CartItem, DeliveryInfo, DeliveryType } from './cartStore'

export { useSpriteStore, MOCK_SPRITES } from './spriteStore'
export type { Sprite, UserSprite } from './spriteStore'

export { usePaymentStore } from './paymentStore'
export type { PaymentMethod, PaymentType, PaymentResult, PaymentParams } from './paymentStore'

export { usePointsStore } from './pointsStore'
export type { PointsRecord, PointsRule, PointsReward } from './pointsStore'

export { useRechargeStore } from './rechargeStore'
export type { RechargeCard, RechargePackage, RechargeRecord } from './rechargeStore'

export { useAdminStore } from './adminStore'
export type { AdminProduct } from './adminStore'

// 经销商+代理商（替代跑腿员）
export { useDealerStore } from './dealerStore'
export type { DealerLevel, AgentLevel, CommissionRecord, WithdrawRecord, DealerPickupOrder, AgentOrder } from './dealerStore'

// 成本比例、批量配送
export { useCostStore } from './costStore'
export type { CostRatio, CostBreakdown } from './costStore'

export { useBatchOrderStore } from './batchOrderStore'
export type { BatchOrder, BatchOrderItem, BatchOrderProgress } from './batchOrderStore'

export { useMomentStore, ZANGFU_ROLE_INFO } from './momentStore'
export type { RunnerMoment, MomentComment, ZangfuRole } from './momentStore'
