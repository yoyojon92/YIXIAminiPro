/**
 * 云函数：product/list 和 product/detail
 * 产品列表和详情
 */

// 云开发 SDK
let cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.cloudEnv || 'yixia-env'
})

const db = cloud.database()

// 产品数据（生产环境从数据库读取）
const products = [
  {
    id: '1',
    name: '大吉大梨',
    subtitle: '山东莱阳梨 × 8%vol',
    price: 39.9,
    originalPrice: 59.9,
    category: 'pear_wine',
    tags: ['果酒', '低度酒', '送礼', '大吉大利'],
    images: [
      'https://example.com/products/dajidalili.jpg',
      'https://example.com/products/dajidalili_2.jpg',
      'https://example.com/products/dajidalili_3.jpg'
    ],
    image: 'https://example.com/products/dajidalili.jpg',
    alcohol: '8%vol',
    specs: [
      { id: 's1-330', name: '330ml', price: 39.9, stock: 100 }
    ],
    isFlashSale: true,
    flashSalePrice: 34.9,
    flashSaleEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
    salesCount: 328,
    rating: 4.9,
    reviewsCount: 89,
    description: '精选山东莱阳梨，低温慢发酵，保留梨子清甜本味。入口绵柔，回味悠长，是送礼自饮的上佳之选。',
    spiritStory: '小梨，来自莱阳梨花深处的精灵。她总是抱着一颗晶莹剔透的梨子，头顶一朵小白花。"大吉大梨，平安如意"——小梨相信，每一口梨酒都能带来好运。',
    producer: '青农酒业研发中心',
    isAgency: false
  },
  {
    id: '2',
    name: '似水榴年',
    subtitle: '金银花石榴酒 × 7%vol',
    price: 42.9,
    originalPrice: 68.0,
    category: 'pomegranate_wine',
    tags: ['果酒', '低度酒', '养颜', '金银花石榴'],
    images: [
      'https://example.com/products/sishuiunian.jpg',
      'https://example.com/products/sishuiunian_2.jpg'
    ],
    image: 'https://example.com/products/sishuiunian.jpg',
    alcohol: '7%vol',
    specs: [
      { id: 's2-330', name: '330ml', price: 42.9, stock: 80 }
    ],
    isFlashSale: false,
    salesCount: 156,
    rating: 4.8,
    reviewsCount: 45,
    description: '云南软籽石榴搭配金银花精华，双重滋养。酒体呈现宝石红色，寓意岁月静好，似水流年。',
    spiritStory: '小榴，是石榴花中诞生的精灵。她身披红纱，眼中总是闪烁着温暖的光芒。"似水榴年，愿你被岁月温柔以待"——小榴守护每一段美好时光。',
    producer: '青农酒业研发中心',
    isAgency: false
  },
  {
    id: '3',
    name: '沂蒙山楂酒',
    subtitle: '沂蒙山楂 × 8%vol',
    price: 29.9,
    originalPrice: 45.0,
    category: 'hawthorn_wine',
    tags: ['果酒', '低度酒', '开胃', '代理产品'],
    images: [
      'https://example.com/products/yimengshanzha.jpg',
      'https://example.com/products/yimengshanzha_2.jpg'
    ],
    image: 'https://example.com/products/yimengshanzha.jpg',
    alcohol: '8%vol',
    specs: [
      { id: 's3-330', name: '330ml', price: 29.9, stock: 200 }
    ],
    isFlashSale: true,
    flashSalePrice: 24.9,
    flashSaleEnd: new Date(Date.now() + 12 * 60 * 60 * 1000),
    salesCount: 512,
    rating: 4.7,
    reviewsCount: 128,
    description: '沂蒙山区的优质山楂，果香浓郁，酸甜可口。开胃消食，适合聚会佐餐。',
    spiritStory: '小楂，来自沂蒙山间的活泼精灵。他穿着红白相间的外套，头顶小红果。"一口山楂，百般滋味"——小楂最爱热闹，每次聚会都有他的身影。',
    producer: '山东青农酒业有限公司',
    isAgency: true
  }
]

// 精灵数据
const sprites = [
  {
    id: 's1',
    name: '小梨',
    emoji: '🍐',
    rarity: 'R',
    productId: '1',
    story: '小梨，来自莱阳梨花深处的精灵。她总是抱着一颗晶莹剔透的梨子，头顶一朵小白花。',
    isCollected: false,
    fragments: 0,
    requiredFragments: 3
  },
  {
    id: 's2',
    name: '小榴',
    emoji: '🍎',
    rarity: 'SR',
    productId: '2',
    story: '小榴，是石榴花中诞生的精灵。她身披红纱，眼中总是闪烁着温暖的光芒。',
    isCollected: false,
    fragments: 0,
    requiredFragments: 5
  },
  {
    id: 's3',
    name: '小楂',
    emoji: '🍒',
    rarity: 'R',
    productId: '3',
    story: '小楂，来自沂蒙山间的活泼精灵。他穿着红白相间的外套，头顶小红果。',
    isCollected: false,
    fragments: 0,
    requiredFragments: 3
  }
]

/**
 * 产品列表云函数
 * GET /api/products
 */
exports.list = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { category, keyword, sort = 'sales', page = 1, pageSize = 20 } = event
    
    // 模拟用户碎片状态（生产环境从用户表读取）
    const userFragments = {}
    
    let result = [...products]
    
    // 分类筛选
    if (category && category !== 'all') {
      if (category === '礼盒套装') {
        // 礼盒套装筛选逻辑
      } else {
        result = result.filter(p => p.category === category)
      }
    }
    
    // 关键词搜索
    if (keyword) {
      const kw = keyword.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(kw) ||
        p.tags.some(t => t.toLowerCase().includes(kw))
      )
    }
    
    // 排序
    switch (sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'sales':
      default:
        result.sort((a, b) => b.salesCount - a.salesCount)
    }
    
    // 添加精灵信息
    result = result.map(p => {
      const sprite = sprites.find(s => s.productId === p.id) || {}
      return {
        ...p,
        sprite: {
          id: sprite.id,
          name: sprite.name,
          emoji: sprite.emoji,
          rarity: sprite.rarity,
          isCollected: sprite.isCollected,
          fragments: userFragments[p.id] || 0
        }
      }
    })
    
    return {
      code: 200,
      msg: 'success',
      data: result,
      total: result.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
    
  } catch (err) {
    console.error('product/list 错误:', err)
    return {
      code: 500,
      msg: '服务器错误',
      data: null
    }
  }
}

/**
 * 产品详情云函数
 * GET /api/products/:id
 */
exports.detail = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  try {
    const { id } = event
    const product = products.find(p => p.id === id)
    
    if (!product) {
      return {
        code: 404,
        msg: '产品不存在',
        data: null
      }
    }
    
    // 查找关联精灵
    const sprite = sprites.find(s => s.productId === id)
    
    // 模拟用户收藏状态
    const isFavorite = false
    
    // 模拟用户评价
    const reviews = [
      {
        id: 'r1',
        userId: 'user_001',
        nickname: '小明同学',
        avatar: '',
        rating: 5,
        content: '超级好喝！精灵图案也很可爱，室友都很喜欢~',
        images: [],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'r2',
        userId: 'user_002',
        nickname: '小红同学',
        avatar: '',
        rating: 5,
        content: '包装很精美，送礼很有面子！',
        images: [],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]
    
    return {
      code: 200,
      msg: 'success',
      data: {
        ...product,
        sprite: sprite || null,
        isFavorite: isFavorite,
        reviews: reviews,
        reviewsCount: reviews.length
      }
    }
    
  } catch (err) {
    console.error('product/detail 错误:', err)
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
  
  // 根据 action 调用不同函数
  if (action === 'detail') {
    return exports.detail(event, context)
  }
  
  // 默认返回列表
  return exports.list(event, context)
}
