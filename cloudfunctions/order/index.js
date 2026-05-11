/**
 * 云函数：order/create 和 order/list
 * 订单创建和列表
 */

// 云开发 SDK
let cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.cloudEnv || 'yixia-env-xxxx'
})

const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate

// 模拟产品数据
const products = [
  { id: '1', name: '大吉大梨', price: 39.9, specs: [{ id: 's1-330', name: '330ml', price: 39.9 }] },
  { id: '2', name: '似水榴年', price: 42.9, specs: [{ id: 's2-330', name: '330ml', price: 42.9 }] },
  { id: '3', name: '沂蒙山楂酒', price: 29.9, specs: [{ id: 's3-330', name: '330ml', price: 29.9 }] }
]

/**
 * 订单创建云函数
 * POST /api/orders
 * 
 * 年龄验证逻辑：
 * - 含果酒：需验证≥18岁
 * - 纯NFC果汁：不需要验证
 */
exports.create = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    // 解析 token 获取用户ID
    const { token, items, deliveryType, address, remark } = event
    
    // 解析用户信息
    let userId = 'h5_user_test'
    let userAgeVerified = false
    
    if (token) {
      try {
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString())
        userId = tokenData.userId
      } catch (e) {
        console.error('Token解析失败:', e)
      }
    }
    
    // 验证参数
    if (!items || items.length === 0) {
      return {
        code: 400,
        msg: '订单商品不能为空',
        data: null
      }
    }
    
    // 检查是否为果酒（需要年龄验证）
    const isWine = items.some(item => ['1', '2', '3'].includes(item.productId))
    
    if (isWine && !userAgeVerified) {
      // 果酒需要年龄验证
      return {
        code: 403,
        msg: '购买果酒需要完成年龄验证',
        data: {
          needAgeVerify: true,
          verifyType: 'id_card'
        }
      }
    }
    
    // 计算订单金额
    let totalAmount = 0
    const orderItems = []
    
    for (const item of items) {
      const product = products.find(p => p.id === item.productId)
      if (!product) {
        return {
          code: 400,
          msg: `商品 ${item.productId} 不存在`,
          data: null
        }
      }
      
      const spec = product.specs.find(s => s.id === item.specId) || product.specs[0]
      const itemAmount = spec.price * item.quantity
      
      orderItems.push({
        productId: item.productId,
        productName: product.name,
        specId: item.specId,
        specName: spec.name,
        price: spec.price,
        quantity: item.quantity,
        amount: itemAmount
      })
      
      totalAmount += itemAmount
    }
    
    // 配送费用
    let deliveryFee = 0
    if (deliveryType === 'dormitory') {
      deliveryFee = totalAmount >= 99 ? 0 : 5 // 满99免配送费
    } else if (deliveryType === 'pickup') {
      deliveryFee = -5 // 自提减5元
    }
    
    // 计算优惠
    let discount = 0
    if (totalAmount >= 199) {
      discount = 10 // 满199减10
    }
    
    const actualAmount = totalAmount + deliveryFee - discount
    
    // 生成订单号
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    // 创建订单记录
    const order = {
      orderId: orderId,
      userId: userId,
      items: orderItems,
      totalAmount: totalAmount,
      deliveryFee: deliveryFee,
      discount: discount,
      actualAmount: actualAmount,
      status: 'pending', // pending | paid | shipped | delivered | completed | cancelled
      deliveryType: deliveryType,
      address: address || {},
      remark: remark || '',
      // 支付相关
      payStatus: 'unpaid', // unpaid | paid
      payTime: null,
      // 退款相关
      refundStatus: 'none', // none | applying | refunded
      refundAmount: 0,
      // 配送相关
      shipTime: null,
      deliveryTime: null,
      // 收货相关
      confirmTime: null,
      // 评价
      isReviewed: false,
      // 元数据
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // 生产环境：存入数据库
    // const res = await db.collection('orders').add({ data: order })
    
    // 模拟返回
    return {
      code: 200,
      msg: '订单创建成功',
      data: {
        orderId: orderId,
        totalAmount: totalAmount,
        deliveryFee: deliveryFee,
        discount: discount,
        actualAmount: actualAmount,
        needAgeVerify: false,
        // 模拟微信支付参数
        payment: {
          timeStamp: Math.floor(Date.now() / 1000).toString(),
          nonceStr: Math.random().toString(36).substr(2),
          package: 'prepay_id=' + orderId,
          signType: 'MD5',
          paySign: 'mock_pay_sign_' + orderId
        }
      }
    }
    
  } catch (err) {
    console.error('order/create 错误:', err)
    return {
      code: 500,
      msg: '服务器错误：' + err.message,
      data: null
    }
  }
}

/**
 * 订单列表云函数
 * GET /api/orders
 */
exports.list = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { token, status, page = 1, pageSize = 20 } = event
    
    // 解析用户ID
    let userId = 'h5_user_test'
    if (token) {
      try {
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString())
        userId = tokenData.userId
      } catch (e) {
        console.error('Token解析失败:', e)
      }
    }
    
    // 模拟订单数据
    const mockOrders = [
      {
        orderId: 'ORD202505110001',
        items: [
          { productId: '1', productName: '大吉大梨', specName: '330ml', price: 39.9, quantity: 2, amount: 79.8 }
        ],
        totalAmount: 79.8,
        actualAmount: 74.8,
        status: 'delivered',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        deliveryType: 'dormitory',
        address: { dormitory: '1号楼', roomNumber: '101' }
      },
      {
        orderId: 'ORD202505110002',
        items: [
          { productId: '2', productName: '似水榴年', specName: '330ml', price: 42.9, quantity: 1, amount: 42.9 },
          { productId: '3', productName: '沂蒙山楂酒', specName: '330ml', price: 29.9, quantity: 2, amount: 59.8 }
        ],
        totalAmount: 102.7,
        actualAmount: 97.7,
        status: 'shipped',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        deliveryType: 'dormitory',
        address: { dormitory: '2号楼', roomNumber: '205' }
      }
    ]
    
    // 状态筛选
    let result = mockOrders
    if (status && status !== 'all') {
      result = mockOrders.filter(o => o.status === status)
    }
    
    return {
      code: 200,
      msg: 'success',
      data: result,
      total: result.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
    
  } catch (err) {
    console.error('order/list 错误:', err)
    return {
      code: 500,
      msg: '服务器错误',
      data: null
    }
  }
}

/**
 * 订单详情云函数
 */
exports.detail = async (event, context) => {
  try {
    const { token, orderId } = event
    
    // 模拟订单详情
    const order = {
      orderId: orderId || 'ORD202505110001',
      items: [
        { productId: '1', productName: '大吉大梨', specName: '330ml', price: 39.9, quantity: 2, amount: 79.8, image: '' }
      ],
      totalAmount: 79.8,
      deliveryFee: 0,
      discount: 5,
      actualAmount: 74.8,
      status: 'delivered',
      deliveryType: 'dormitory',
      address: { dormitory: '1号楼', roomNumber: '101', contactName: '张三', contactPhone: '13800138000' },
      logistics: {
        company: '校园配送',
        trackingNo: '',
        status: 'delivered',
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      shippedAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000)
    }
    
    return {
      code: 200,
      msg: 'success',
      data: order
    }
    
  } catch (err) {
    return {
      code: 500,
      msg: '服务器错误',
      data: null
    }
  }
}

/**
 * 订单状态更新云函数
 */
exports.updateStatus = async (event, context) => {
  try {
    const { token, orderId, status } = event
    
    // 生产环境：更新数据库
    // await db.collection('orders').where({ orderId }).update({ data: { status, updatedAt: new Date() } })
    
    return {
      code: 200,
      msg: '状态更新成功',
      data: { orderId, status }
    }
    
  } catch (err) {
    return {
      code: 500,
      msg: '服务器错误',
      data: null
    }
  }
}

// 云函数入口
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action } = event
  
  if (action === 'create') {
    return exports.create(event, context)
  } else if (action === 'detail') {
    return exports.detail(event, context)
  } else if (action === 'updateStatus') {
    return exports.updateStatus(event, context)
  }
  
  // 默认返回列表
  return exports.list(event, context)
}
