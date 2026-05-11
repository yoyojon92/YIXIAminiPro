/**
 * 云函数：user/login
 * 微信登录 - 兼容小程序和H5
 */

// 云开发 SDK
let cloud = require('wx-server-sdk')
let TcbRouter = require('tcb-router')

// 初始化云开发
cloud.init({
  env: process.env.cloudEnv || 'yixia-env-xxxx'
})

// 数据库引用
const db = cloud.database()
const _ = db.command

// 模拟产品数据（生产环境从数据库读取）
const mockProducts = [
  {
    id: '1',
    name: '大吉大梨',
    subtitle: '山东莱阳梨 × 8%vol',
    price: 39.9,
    originalPrice: 59.9,
    category: 'pear_wine',
    tags: ['果酒', '低度酒', '送礼', '大吉大利'],
    image: '/assets/products/dajidalili.jpg',
    alcohol: '8%vol',
    specs: [{ id: 's1-330', name: '330ml', price: 39.9 }],
    isFlashSale: true,
    flashSalePrice: 34.9,
    salesCount: 328,
    rating: 4.9,
    description: '精选山东莱阳梨，低温慢发酵，保留梨子清甜本味。入口绵柔，回味悠长，是送礼自饮的上佳之选。',
    producer: '青农酒业研发中心'
  },
  {
    id: '2',
    name: '似水榴年',
    subtitle: '金银花石榴酒 × 7%vol',
    price: 42.9,
    originalPrice: 68.0,
    category: 'pomegranate_wine',
    tags: ['果酒', '低度酒', '养颜', '金银花石榴'],
    image: '/assets/products/sishuiliunian.jpg',
    alcohol: '7%vol',
    specs: [{ id: 's2-330', name: '330ml', price: 42.9 }],
    isFlashSale: false,
    salesCount: 156,
    rating: 4.8,
    description: '云南软籽石榴搭配金银花精华，双重滋养。酒体呈现宝石红色，寓意岁月静好，似水流年。',
    producer: '青农酒业研发中心'
  },
  {
    id: '3',
    name: '沂蒙山楂酒',
    subtitle: '沂蒙山楂 × 8%vol',
    price: 29.9,
    originalPrice: 45.0,
    category: 'hawthorn_wine',
    tags: ['果酒', '低度酒', '开胃', '代理产品'],
    image: '/assets/products/yimengshanzhajiujiu.jpg',
    alcohol: '8%vol',
    specs: [{ id: 's3-330', name: '330ml', price: 29.9 }],
    isFlashSale: true,
    flashSalePrice: 24.9,
    salesCount: 512,
    rating: 4.7,
    description: '沂蒙山区的优质山楂，果香浓郁，酸甜可口。开胃消食，适合聚会佐餐。',
    producer: '山东青农酒业有限公司',
    isAgency: true
  }
]

/**
 * 微信登录云函数
 * 支持：小程序 wx.login() 和 H5 模拟登录
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  // 日志记录
  console.log('user/login 调用参数:', JSON.stringify(event))
  
  try {
    const { code, nickname, avatar, platform = 'weapp' } = event
    
    // 小程序环境：使用 wx.login code 换 openid
    if (platform === 'weapp' && code) {
      // 实际生产环境：调用微信接口换 openid
      // const wxLoginResult = await cloud.cloudCall('wx.login', { code })
      // const openid = wxLoginResult.openid
      
      // 模拟 openid（开发环境）
      const openid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // 查询或创建用户
      const userRes = await db.collection('users').where({
        openid: openid
      }).get()
      
      let user
      let isNewUser = false
      
      if (userRes.data && userRes.data.length > 0) {
        // 老用户：更新登录信息
        user = userRes.data[0]
        await db.collection('users').doc(user._id).update({
          data: {
            lastLoginTime: new Date(),
            loginCount: _.inc(1)
          }
        })
      } else {
        // 新用户：创建用户记录
        isNewUser = true
        const newUser = {
          openid: openid,
          nickname: nickname || `用户${Math.floor(Math.random() * 10000)}`,
          avatar: avatar || '',
          role: 'user', // user | distributor | agent | admin
          schoolId: '',
          schoolName: '',
          ageVerified: false, // 年龄验证状态
          ageVerifyTime: null,
          totalSpent: 0,
          orderCount: 0,
          fragments: {}, // 精灵碎片 { spriteId: count }
          collectedSprites: [], // 已收集精灵
          createdAt: new Date(),
          lastLoginTime: new Date(),
          loginCount: 1,
          status: 'active'
        }
        
        const addRes = await db.collection('users').add({
          data: newUser
        })
        newUser._id = addRes._id
        user = newUser
      }
      
      // 生成会话 token（简化版，生产环境用 JWT）
      const token = Buffer.from(JSON.stringify({
        userId: user._id || user.openid,
        openid: openid,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天有效期
      })).toString('base64')
      
      return {
        code: 200,
        msg: '登录成功',
        data: {
          token: token,
          user: {
            id: user._id || user.openid,
            openid: openid,
            nickname: user.nickname,
            avatar: user.avatar,
            role: user.role,
            schoolId: user.schoolId,
            schoolName: user.schoolName,
            ageVerified: user.ageVerified,
            isNewUser: isNewUser
          }
        }
      }
    }
    
    // H5 环境：模拟登录（开发调试用）
    if (platform === 'h5' || !code) {
      const mockOpenid = `h5_user_${Date.now()}`
      const token = Buffer.from(JSON.stringify({
        userId: mockOpenid,
        openid: mockOpenid,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000
      })).toString('base64')
      
      return {
        code: 200,
        msg: 'H5模拟登录成功',
        data: {
          token: token,
          user: {
            id: mockOpenid,
            openid: mockOpenid,
            nickname: nickname || 'H5测试用户',
            avatar: '',
            role: 'user',
            schoolId: '',
            schoolName: '',
            ageVerified: false,
            isNewUser: true
          }
        }
      }
    }
    
    return {
      code: 400,
      msg: '参数错误：缺少 code 或 platform',
      data: null
    }
    
  } catch (err) {
    console.error('user/login 错误:', err)
    return {
      code: 500,
      msg: '服务器错误：' + err.message,
      data: null
    }
  }
}
