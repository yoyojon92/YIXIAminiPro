/**
 * 年龄验证工具函数
 * 用于酒精类商品的 18+ 验证
 */
import Taro from '@tarojs/taro'

const AGE_VERIFIED_KEY = 'age_verified'

/**
 * 检查是否已验证年龄
 */
export function isAgeVerified(): boolean {
  try {
    const verified = Taro.getStorageSync(AGE_VERIFIED_KEY)
    return verified === true
  } catch {
    return false
  }
}

/**
 * 年龄验证弹窗
 * 如果未验证，显示确认弹窗
 * @returns Promise<boolean> 用户确认返回 true，拒绝返回 false
 */
export function ageVerify(): Promise<boolean> {
  return new Promise((resolve) => {
    // 已验证过，直接返回 true
    if (isAgeVerified()) {
      resolve(true)
      return
    }

    // 显示年龄确认弹窗
    Taro.showModal({
      title: '年龄验证',
      content: '该商品含酒精，根据法律规定需年满18岁方可购买',
      confirmText: '我已满18岁',
      cancelText: '未满18岁',
      success: (res) => {
        if (res.confirm) {
          // 用户确认，记录验证状态
          try {
            Taro.setStorageSync(AGE_VERIFIED_KEY, true)
          } catch {
            // 存储失败不影响使用
          }
          resolve(true)
        } else {
          // 用户取消
          resolve(false)
        }
      },
      fail: () => {
        // 弹窗失败，默认拒绝
        resolve(false)
      }
    })
  })
}

/**
 * 重置年龄验证状态（用于退出登录等场景）
 */
export function resetAgeVerification(): void {
  try {
    Taro.removeStorageSync(AGE_VERIFIED_KEY)
  } catch {
    // 忽略错误
  }
}
