/**
 * 成本比例模型状态管理
 * 按学校配置成本比例，动态计算建议售价
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { taroStorage } from './taroStorage'

// 成本比例配置
export interface CostRatio {
  id: string
  schoolId: string              // 学校ID
  schoolName: string            // 学校名称
  rawMaterialRatio: number      // 原料成本占比，默认0.35
  packagingRatio: number        // 包装成本占比，默认0.15
  deliveryRatio: number         // 配送成本占比，默认0.10
  distributionRatio: number     // 分销提成占比，默认0.10
  platformRatio: number         // 平台运营占比，默认0.10
  profitRatio: number           // 利润占比，默认0.20
  updatedAt: string
}

// 成本结构（单品）
export interface CostBreakdown {
  rawMaterial: number   // 原料成本
  packaging: number     // 包装成本
  delivery: number      // 配送成本
  distribution: number  // 分销提成
  platform: number      // 平台运营
  profit: number        // 利润
  total: number         // 总计
}

interface CostState {
  // 成本比例配置列表（按学校）
  costRatios: CostRatio[]
  
  // 当前选中的学校
  currentSchoolId: string | null
  
  // 操作方法
  getCostRatio: (schoolId: string) => CostRatio | undefined
  setCostRatio: (ratio: Partial<CostRatio> & { schoolId: string }) => void
  
  // 计算方法
  calculateSuggestedPrice: (costPrice: number, schoolId: string, isBatch?: boolean) => number
  calculateCostBreakdown: (sellingPrice: number, schoolId: string) => CostBreakdown
  
  // 当前学校快捷方法
  setCurrentSchool: (schoolId: string) => void
  getCurrentCostRatio: () => CostRatio | undefined
}

// 默认成本比例
const DEFAULT_COST_RATIO: Omit<CostRatio, 'id' | 'schoolId' | 'schoolName' | 'updatedAt'> = {
  rawMaterialRatio: 0.35,
  packagingRatio: 0.15,
  deliveryRatio: 0.10,
  distributionRatio: 0.10,
  platformRatio: 0.10,
  profitRatio: 0.20
}

// 初始化Mock数据（3个学校）
const INITIAL_COST_RATIOS: CostRatio[] = [
  {
    id: 'cost_1',
    schoolId: 'school_qdu',
    schoolName: '青岛大学',
    ...DEFAULT_COST_RATIO,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cost_2',
    schoolId: 'school_ouc',
    schoolName: '中国海洋大学',
    ...DEFAULT_COST_RATIO,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cost_3',
    schoolId: 'school_sdust',
    schoolName: '山东科技大学',
    ...DEFAULT_COST_RATIO,
    updatedAt: new Date().toISOString()
  }
]

export const useCostStore = create<CostState>()(
  persist(
    (set, get) => ({
      costRatios: INITIAL_COST_RATIOS,
      currentSchoolId: 'school_qdu',

      // 获取指定学校的成本比例
      getCostRatio: (schoolId) => {
        return get().costRatios.find(r => r.schoolId === schoolId)
      },

      // 设置成本比例
      setCostRatio: (ratio) => {
        set(state => {
          const existingIndex = state.costRatios.findIndex(r => r.schoolId === ratio.schoolId)
          if (existingIndex >= 0) {
            // 更新现有配置
            const updated = [...state.costRatios]
            updated[existingIndex] = {
              ...updated[existingIndex],
              ...ratio,
              updatedAt: new Date().toISOString()
            }
            return { costRatios: updated }
          } else {
            // 新增配置
            return {
              costRatios: [...state.costRatios, {
                id: `cost_${Date.now()}`,
                ...DEFAULT_COST_RATIO,
                ...ratio,
                updatedAt: new Date().toISOString()
              } as CostRatio]
            }
          }
        })
      },

      // 计算建议售价
      // 公式：售价 = 成本 / (1 - 利润率 - 分销率 - 平台率 - 配送率)
      // 批量订单享受配送率降50%优惠
      calculateSuggestedPrice: (costPrice, schoolId, isBatch = false) => {
        const ratio = get().getCostRatio(schoolId)
        if (!ratio) return costPrice / (1 - 0.20 - 0.10 - 0.10 - 0.10) // 使用默认值

        const effectiveDeliveryRatio = isBatch ? ratio.deliveryRatio * 0.5 : ratio.deliveryRatio
        const denominator = 1 - ratio.profitRatio - ratio.distributionRatio - ratio.platformRatio - effectiveDeliveryRatio

        return Math.round((costPrice / denominator) * 100) / 100 // 保留2位小数
      },

      // 计算成本结构分解
      calculateCostBreakdown: (sellingPrice, schoolId) => {
        const ratio = get().getCostRatio(schoolId)
        if (!ratio) {
          return {
            rawMaterial: sellingPrice * 0.35,
            packaging: sellingPrice * 0.15,
            delivery: sellingPrice * 0.10,
            distribution: sellingPrice * 0.10,
            platform: sellingPrice * 0.10,
            profit: sellingPrice * 0.20,
            total: sellingPrice
          }
        }

        return {
          rawMaterial: sellingPrice * ratio.rawMaterialRatio,
          packaging: sellingPrice * ratio.packagingRatio,
          delivery: sellingPrice * ratio.deliveryRatio,
          distribution: sellingPrice * ratio.distributionRatio,
          platform: sellingPrice * ratio.platformRatio,
          profit: sellingPrice * ratio.profitRatio,
          total: sellingPrice
        }
      },

      // 设置当前学校
      setCurrentSchool: (schoolId) => {
        set({ currentSchoolId: schoolId })
      },

      // 获取当前学校的成本比例
      getCurrentCostRatio: () => {
        const { currentSchoolId, costRatios } = get()
        if (!currentSchoolId) return undefined
        return costRatios.find(r => r.schoolId === currentSchoolId)
      }
    }),
    {
      name: 'yixia-cost-storage',
      storage: taroStorage
    }
  )
)
