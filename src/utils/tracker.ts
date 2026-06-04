/**
 * 埋点SDK
 * 用于收集用户行为数据
 */

import Taro from '@tarojs/taro'

export type EventType = 
  | 'page_view'      // 页面浏览
  | 'click'          // 点击事件
  | 'order_create'   // 创建订单
  | 'order_complete' // 完成订单
  | 'product_view'   // 商品浏览
  | 'add_to_cart'    // 加入购物车
  | 'search'         // 搜索
  | 'share'          // 分享

export interface TrackEvent {
  type: EventType
  timestamp: number
  data: Record<string, unknown>
  userId?: string
  sessionId?: string
}

// 会话ID
let sessionId = ''

/**
 * 初始化埋点SDK
 */
export function initTracker(): void {
  sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  
  // 从存储中恢复会话ID
  const savedSessionId = Taro.getStorageSync('track_session_id')
  if (savedSessionId) {
    sessionId = savedSessionId
  } else {
    Taro.setStorageSync('track_session_id', sessionId)
  }
}

/**
 * 获取当前会话ID
 */
export function getSessionId(): string {
  if (!sessionId) {
    initTracker()
  }
  return sessionId
}

/**
 * 发送埋点事件
 */
export function track(type: EventType, data: Record<string, unknown> = {}): void {
  const event: TrackEvent = {
    type,
    timestamp: Date.now(),
    data,
    sessionId: getSessionId()
  }
  
  // 获取用户ID
  try {
    const userInfo = Taro.getStorageSync('userInfo')
    if (userInfo?.id) {
      event.userId = userInfo.id
    }
  } catch {
    // 忽略错误
  }
  
  // 存储事件到本地队列
  const eventQueue: TrackEvent[] = Taro.getStorageSync('track_event_queue') || []
  eventQueue.push(event)
  
  // 限制队列大小
  if (eventQueue.length > 100) {
    eventQueue.shift()
  }
  
  Taro.setStorageSync('track_event_queue', eventQueue)
  
  // 控制台输出（开发调试用）
  console.log('[Tracker]', type, data)
}

/**
 * 页面浏览埋点
 */
export function trackPageView(pageName: string, data: Record<string, unknown> = {}): void {
  track('page_view', { pageName, ...data })
}

/**
 * 点击事件埋点
 */
export function trackClick(element: string, data: Record<string, unknown> = {}): void {
  track('click', { element, ...data })
}

/**
 * 商品浏览埋点
 */
export function trackProductView(productId: string, productName: string): void {
  track('product_view', { productId, productName })
}

/**
 * 加入购物车埋点
 */
export function trackAddToCart(productId: string, quantity: number, price: number): void {
  track('add_to_cart', { productId, quantity, price })
}


/**
 * 获取事件队列
 */
export function getEventQueue(): TrackEvent[] {
  return Taro.getStorageSync('track_event_queue') || []
}

/**
 * 清空事件队列
 */
export function clearEventQueue(): void {
  Taro.setStorageSync('track_event_queue', [])
}

// 初始化
initTracker()

export default {
  initTracker,
  track,
  trackPageView,
  trackClick,
  trackProductView,
  trackAddToCart,
  getEventQueue,
  clearEventQueue,
  getSessionId
}
