/**
 * 产品 Mock 数据
 * 邑夏果酒 - 3款核心产品
 */

// 产品规格
export interface ProductSpec {
  id: string
  name: string
  price: number
  originalPrice?: number
  stock: number
}

// 产品实体
export interface Product {
  id: string
  name: string
  subtitle: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  tags: string[]
  category: 'pear' | 'pomegranate' | 'hawthorn' | 'gift'
  alcohol: string
  capacity: string
  specs: ProductSpec[]
  description: string
  story: string
  spriteId: string
  salesCount: number
  rating: number
  isAgentProduct?: boolean
  agentName?: string
}

// 拼团产品
export interface FlashSaleProduct {
  id: string
  name: string
  price: number
  pintuanPrice: number
  pintuanCount: number
  endTime: string
  image: string
  spriteAlias: string
}

// 产品分类
export interface ProductCategory {
  id: string
  name: string
  icon: string
  products: string[]
}

// 官方产品数据 - 3款核心产品
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_pear_001',
    name: '大吉大梨',
    subtitle: '沂蒙山新鲜梨酿造，低度微醺',
    price: 39.9,
    originalPrice: 49.9,
    image: './assets/images/banner1.jpg',
    images: [
      './assets/images/banner1.jpg',
      './assets/images/banner2.jpg',
      './assets/images/banner3.jpg'
    ],
    tags: ['果酒', '低度酒', '送礼', '大吉大利'],
    category: 'pear',
    alcohol: '8%vol',
    capacity: '330ml',
    specs: [
      {
        id: 'spec_pear_330',
        name: '330ml 单瓶装',
        price: 39.9,
        originalPrice: 49.9,
        stock: 100
      }
    ],
    description: '精选沂蒙山新鲜大梨，采用传统酿造工艺，低温发酵，保留梨的自然清甜。酒体金黄透亮，口感清爽甘甜，是送礼自饮的绝佳选择。',
    story: '"秋高气爽，梨香满园。我是来自沂蒙山的小梨，每一颗梨都承载着果农的期盼。当月光洒落，我会悄悄走进你的梦，带去一份清甜与安宁。"',
    spriteId: 'sprite_lixiao',
    salesCount: 1256,
    rating: 4.8
  },
  {
    id: 'prod_pomegranate_001',
    name: '似水榴年',
    subtitle: '金银花石榴酒，红润养颜',
    price: 42.9,
    originalPrice: 52.9,
    image: './assets/images/banner2.jpg',
    images: [
      './assets/images/banner2.jpg',
      './assets/images/banner1.jpg',
      './assets/images/banner3.jpg'
    ],
    tags: ['果酒', '石榴酒', '养颜', '似水榴年'],
    category: 'pomegranate',
    alcohol: '7%vol',
    capacity: '330ml',
    specs: [
      {
        id: 'spec_pomegranate_330',
        name: '330ml 单瓶装',
        price: 42.9,
        originalPrice: 52.9,
        stock: 80
      }
    ],
    description: '甄选优质石榴，搭配金银花精华，采用现代酿造工艺精制而成。酒体呈宝石红色，晶莹剔透，口感醇厚绵甜，富含花青素，养颜美容两相宜。',
    story: '"红宝石般的果实，蕴含着四季的阳光。我是石榴精灵小榴，每一滴酒都是生命的馈赠。愿与你分享这份红彤彤的喜悦。"',
    spriteId: 'sprite_liulian',
    salesCount: 892,
    rating: 4.9,
    isAgentProduct: true,
    agentName: '分销商专供'
  },
  {
    id: 'prod_hawthorn_001',
    name: '沂蒙山楂酒',
    subtitle: '酸甜开胃，回忆无穷',
    price: 29.9,
    originalPrice: 36.9,
    image: './assets/images/banner3.jpg',
    images: [
      './assets/images/banner3.jpg',
      './assets/images/banner1.jpg',
      './assets/images/banner2.jpg'
    ],
    tags: ['果酒', '山楂酒', '开胃', '沂蒙山'],
    category: 'hawthorn',
    alcohol: '8%vol',
    capacity: '330ml',
    specs: [
      {
        id: 'spec_hawthorn_330',
        name: '330ml 单瓶装',
        price: 29.9,
        originalPrice: 36.9,
        stock: 150
      }
    ],
    description: '以沂蒙山新鲜山楂为原料，山楂富含维生素C和有机酸，经传统工艺酿造，酸甜适口，开胃消食。酒体呈淡红色，清新爽口，是餐桌佐餐的完美搭配。',
    story: '"酸酸甜甜就是我，来自沂蒙山间的小楂。当你在课堂上打瞌睡时，一口山楂酒就能让你精神百倍！学习也要劳逸结合呀~"',
    spriteId: 'sprite_shanjiao',
    salesCount: 2103,
    rating: 4.7,
    isAgentProduct: true,
    agentName: '山东青农酒业有限公司'
  }
]

// 拼团产品
export const MOCK_FLASH_SALE: FlashSaleProduct[] = [
  {
    id: 'prod_pear_001',
    name: '大吉大梨',
    price: 39.9,
    pintuanPrice: 32.9,
    pintuanCount: 156,
    endTime: '2025-05-20 18:00:00',
    image: './assets/images/banner1.jpg',
    spriteAlias: '小梨'
  },
  {
    id: 'prod_hawthorn_001',
    name: '沂蒙山楂酒',
    price: 29.9,
    pintuanPrice: 24.9,
    pintuanCount: 89,
    endTime: '2025-05-20 18:00:00',
    image: './assets/images/banner3.jpg',
    spriteAlias: '小楂'
  }
]

// 产品分类
export const MOCK_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat_pear',
    name: '梨酒系列',
    icon: '🍐',
    products: ['prod_pear_001']
  },
  {
    id: 'cat_pomegranate',
    name: '石榴酒系列',
    icon: '🍎',
    products: ['prod_pomegranate_001']
  },
  {
    id: 'cat_hawthorn',
    name: '山楂酒系列',
    icon: '🍒',
    products: ['prod_hawthorn_001']
  },
  {
    id: 'cat_gift',
    name: '礼盒套装',
    icon: '🎁',
    products: []
  }
]

// 根据分类获取产品
export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return MOCK_PRODUCTS
  return MOCK_PRODUCTS.filter(p => p.category === category)
}

// 根据ID获取产品
export const getProductById = (id: string): Product | undefined => {
  return MOCK_PRODUCTS.find(p => p.id === id)
}
