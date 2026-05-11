/**
 * 云函数：cart 增删改查
 * 购物车管理
 */

// 云开发 SDK
let cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.cloudEnv || 'yixia-env-xxxx'
})

const db = cloud.database()
const _ = db.command

// 模拟产品数据
const products = [
  { id: '1', name: '大吉大梨', image: '/assets/products/dajidalili.jpg', specs: [{ id: 's1-330', name: '330ml', price: 39.9 }] },
  { id: '2', name: '似水榴年', image: '/assets/products/sishuiunian.jpg', specs: [{ id: 's2-330', name: '330ml', price: 42.9 }] },
  { id: '3', name: '沂蒙山楂酒', image: '/assets/products/yimengshanzha.jpg', specs: [{ id: 's3-330', name: '330ml', price: 29.9 }] }
]

// 模拟购物车数据（生产环境从数据库读取）
let mockCart = {}

/**
 * 获取购物车
 */
exports.get = async (event, context) => {
  try {
    const { token } = event
    
    let userId = 'h5_user_test'
    if (token) {
      try {
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString())
        userId = tokenData.userId
      } catch (e) {}
    }
    
    // 获取用户购物车
    const cartData = mockCart[userId] || { items: [] }
    
    // 补充产品信息
    const items = cartData.items.map(item => {
      const product = products.find(p => p.id === item.productId)
      const spec = product?.specs.find(s => s.id === item.specId) || product?.specs[0]
      return {
        ...item,
        productName: product?.name || '未知商品',
        productImage: product?.image || '',
        specName: spec?.name || '',
        unitPrice: spec?.price || 0,
        amount: (spec?.price || 0) * item.quantity
      }
    })
    
    // 计算总金额
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    
    return {
      code: 200,
      msg: 'success',
      data: {
        items: items,
        totalItems: totalItems,
        totalAmount: totalAmount
      }
    }
    
  } catch (err) {
    console.error('cart/get 错误:', err)
    return {
      code: 500,
      msg: '服务器错误',
      data: null
    }
  }
}

/**
 * 添加商品到购物车
 */
exports.add = async (event, context) => {
  try {
    const { token, productId, specId, quantity = 1 } = event
    
    let userId = 'h5_user_test'
    if (token) {
      try {
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString())
        userId = tokenData.userId
      } catch (e) {}
    }
    
    // 验证商品
    const product = products.find(p => p.id === productId)
    if (!product) {
      return {
        code: 404,
        msg: '商品不存在',
        data: null
      }
    }
    
    // 初始化购物车
    if (!mockCart[userId]) {
      mockCart[userId] = { items: [] }
    }
    
    // 检查是否已存在
    const existIndex = mockCart[userId].items.findIndex(
      item => item.productId === productId && item.specId === specId
    )
    
    if (existIndex >= 0) {
      // 已存在，增加数量
      mockCart[userId].items[existIndex].quantity += quantity
    } else {
      // 新增
      mockCart[userId].items.push({
        id: `cart_${Date.now()}`,
        productId,
        specId,
        quantity
      })
    }
    
    // 获取更新后的购物车
    const cartData = await exports.get({ token }, context)
    
    return {
      code: 200,
      msg: '添加成功',
      data: cartData.data
    }
    
  } catch (err) {
    console.error('cart/add 错误:', err)
    return {
      code: 500,
      msg: '服务器错误',
      data: null
    }
  }
}

/**
 * 更新购物车商品数量
 */
exports.update = async (event, context) => {
  try {
    const { token, itemId, quantity } = event
    
    let userId = 'h5_user_test'
    if (token) {
      try {
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString())
        userId = tokenData.userId
      } catch (e) {}
    }
    
    if (!mockCart[userId]) {
      return { code: 404, msg: '购物车为空', data: null }
    }
    
    const itemIndex = mockCart[userId].items.findIndex(item => item.id === itemId)
    if (itemIndex < 0) {
      return { code: 404, msg: '商品不存在', data: null }
    }
    
    if (quantity <= 0) {
      // 数量为0或负数，删除商品
      mockCart[userId].items.splice(itemIndex, 1)
    } else {
      mockCart[userId].items[itemIndex].quantity = quantity
    }
    
    const cartData = await exports.get({ token }, context)
    
    return {
      code: 200,
      msg: '更新成功',
      data: cartData.data
    }
    
  } catch (err) {
    return { code: 500, msg: '服务器错误', data: null }
  }
}

/**
 * 删除购物车商品
 */
exports.remove = async (event, context) => {
  try {
    const { token, itemId } = event
    
    let userId = 'h5_user_test'
    if (token) {
      try {
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString())
        userId = tokenData.userId
      } catch (e) {}
    }
    
    if (!mockCart[userId]) {
      return { code: 200, msg: '购物车为空', data: { items: [], totalItems: 0, totalAmount: 0 } }
    }
    
    // 删除商品
    mockCart[userId].items = mockCart[userId].items.filter(item => item.id !== itemId)
    
    const cartData = await exports.get({ token }, context)
    
    return {
      code: 200,
      msg: '删除成功',
      data: cartData.data
    }
    
  } catch (err) {
    return { code: 500, msg: '服务器错误', data: null }
  }
}

/**
 * 清空购物车
 */
exports.clear = async (event, context) => {
  try {
    const { token } = event
    
    let userId = 'h5_user_test'
    if (token) {
      try {
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString())
        userId = tokenData.userId
      } catch (e) {}
    }
    
    mockCart[userId] = { items: [] }
    
    return {
      code: 200,
      msg: '清空成功',
      data: { items: [], totalItems: 0, totalAmount: 0 }
    }
    
  } catch (err) {
    return { code: 500, msg: '服务器错误', data: null }
  }
}

// 云函数入口
exports.main = async (event, context) => {
  const { action } = event
  
  if (action === 'add') {
    return exports.add(event, context)
  } else if (action === 'update') {
    return exports.update(event, context)
  } else if (action === 'remove') {
    return exports.remove(event, context)
  } else if (action === 'clear') {
    return exports.clear(event, context)
  }
  
  // 默认获取
  return exports.get(event, context)
}
