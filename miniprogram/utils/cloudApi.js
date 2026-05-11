/**
 * 微信云开发 API 调用封装
 * 封装 wx.cloud.callFunction 统一调用云函数
 */

// 云开发环境 ID（需在 project.config.json 中配置）
let CLOUD_ENV = 'yixia-env-xxxx'

/**
 * 初始化云开发
 */
export function initCloud() {
  if (typeof wx !== 'undefined' && wx.cloud) {
    wx.cloud.init({
      env: CLOUD_ENV,
      traceUser: true
    })
    console.log('云开发初始化成功，env:', CLOUD_ENV)
  }
}

/**
 * 通用云函数调用
 * @param {string} name 云函数名称
 * @param {object} data 参数
 * @returns {Promise<object>} 返回结果
 */
export async function callFunction(name, data = {}) {
  try {
    console.log(`调用云函数: ${name}`, data)
    
    const res = await wx.cloud.callFunction({
      name: name,
      data: data
    })
    
    console.log(`云函数 ${name} 返回:`, res)
    
    if (res.errMsg && res.errMsg.includes('ok')) {
      return res.result
    } else {
      throw new Error(res.errMsg || '云函数调用失败')
    }
    
  } catch (err) {
    console.error(`云函数 ${name} 调用失败:`, err)
    throw err
  }
}

/**
 * 用户相关 API
 */
export const userApi = {
  /**
   * 微信登录
   * @param {string} code 微信登录code
   * @param {string} nickname 用户昵称
   */
  login: async (code, nickname) => {
    return callFunction('user', {
      action: 'login',
      code,
      nickname
    })
  },
  
  /**
   * 获取用户信息
   */
  getUserInfo: async () => {
    return callFunction('user', { action: 'getUserInfo' })
  },
  
  /**
   * 年龄验证
   */
  verifyAge: async (idCard) => {
    return callFunction('user', { action: 'verifyAge', idCard })
  }
}

/**
 * 产品相关 API
 */
export const productApi = {
  /**
   * 获取产品列表
   * @param {string} category 分类（可选）
   */
  list: async (category) => {
    return callFunction('product', { action: 'list', category })
  },
  
  /**
   * 获取产品详情
   * @param {string} productId 产品ID
   */
  detail: async (productId) => {
    return callFunction('product', { action: 'detail', productId })
  }
}

/**
 * 购物车相关 API
 */
export const cartApi = {
  /**
   * 获取购物车
   */
  getCart: async (token) => {
    return callFunction('cart', { action: 'get', token })
  },
  
  /**
   * 添加商品到购物车
   * @param {string} token 用户token
   * @param {string} productId 产品ID
   * @param {string} specId 规格ID
   * @param {number} quantity 数量
   */
  addToCart: async (token, productId, specId, quantity) => {
    return callFunction('cart', {
      action: 'add',
      token,
      productId,
      specId,
      quantity
    })
  },
  
  /**
   * 更新购物车商品数量
   */
  updateCart: async (token, itemId, quantity) => {
    return callFunction('cart', {
      action: 'update',
      token,
      itemId,
      quantity
    })
  },
  
  /**
   * 删除购物车商品
   */
  removeFromCart: async (token, itemId) => {
    return callFunction('cart', {
      action: 'remove',
      token,
      itemId
    })
  },
  
  /**
   * 清空购物车
   */
  clearCart: async (token) => {
    return callFunction('cart', { action: 'clear', token })
  }
}

/**
 * 订单相关 API
 */
export const orderApi = {
  /**
   * 创建订单
   * @param {string} token 用户token
   * @param {Array} items 商品列表
   * @param {string} deliveryType 配送方式
   * @param {object} address 地址信息
   * @param {string} remark 备注
   */
  create: async (token, items, deliveryType, address, remark) => {
    return callFunction('order', {
      action: 'create',
      token,
      items,
      deliveryType,
      address,
      remark
    })
  },
  
  /**
   * 获取订单列表
   * @param {string} token 用户token
   * @param {string} status 订单状态（可选）
   * @param {number} page 页码
   */
  list: async (token, status, page = 1) => {
    return callFunction('order', {
      action: 'list',
      token,
      status,
      page
    })
  },
  
  /**
   * 获取订单详情
   */
  detail: async (token, orderId) => {
    return callFunction('order', {
      action: 'detail',
      token,
      orderId
    })
  },
  
  /**
   * 更新订单状态
   */
  updateStatus: async (token, orderId, status) => {
    return callFunction('order', {
      action: 'updateStatus',
      token,
      orderId,
      status
    })
  }
}

/**
 * 精灵相关 API
 */
export const spriteApi = {
  /**
   * 获取精灵列表
   */
  list: async (token) => {
    return callFunction('sprite', { action: 'list', token })
  },
  
  /**
   * 合成精灵
   */
  combine: async (token, spriteId) => {
    return callFunction('sprite', { action: 'combine', token, spriteId })
  }
}

/**
 * 软文相关 API
 */
export const articleApi = {
  /**
   * 获取软文列表
   */
  list: async (page = 1, pageSize = 10) => {
    return callFunction('article', { action: 'list', page, pageSize })
  },
  
  /**
   * 获取软文详情
   */
  detail: async (articleId) => {
    return callFunction('article', { action: 'detail', articleId })
  }
}

export default {
  initCloud,
  callFunction,
  userApi,
  productApi,
  cartApi,
  orderApi,
  spriteApi,
  articleApi
}
