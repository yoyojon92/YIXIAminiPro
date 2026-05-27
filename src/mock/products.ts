/**
 * 产品 Mock 数据
 * 邑夏果酒/果汁小程序 - 7款产品完整数据
 */

// 产品图片路径映射（英文路径，兼容微信小程序）
const PRODUCT_IMAGES: Record<string, string> = {
  // ★ 果酒新品
  prod_pomegranate_new: '/assets/images/products/yixia-new/01-liu-hong-xin-shi.jpg',
  prod_apple_001: '/assets/images/products/yixia-new/02-qing-ping-wei-zui.jpg',
  prod_guava_001: '/assets/images/products/yixia-new/06-fan-hong-an-xu.jpg',
  // ★ 原果汁
  prod_nfc_peach_001: '/assets/images/products/yixia-products/06-nfc-peach.png',
  prod_nfc_grape_001: '/assets/images/products/yixia-products/07-nfc-grape.png',
  prod_nfc_pear_001: '/assets/images/products/yixia-products/08-nfc-pear.png',
  // ★ 礼盒
  prod_gift_box_001: '/assets/images/products/yixia-new/05-wei-ai-er-sheng.jpg',
  // ★ 新品场景图
  scene_pomegranate: '/assets/images/products/yixia-new/scene_pomegranate.jpeg',
  scene_apple: '/assets/images/products/yixia-new/scene_apple.jpeg',
  scene_grape: '/assets/images/products/yixia-new/scene_grape.jpeg',
  scene_peach: '/assets/images/products/yixia-new/scene_yellow_peach.jpeg',
  scene_mixed: '/assets/images/products/yixia-new/scene_strawberry.jpeg',
  scene_guava: '/assets/images/products/yixia-new/scene_guava.jpeg',
}

// 产品规格
export interface ProductSpec {
  id: string
  name: string
  price: number
  originalPrice?: number
  stock: number
}

// 统一分类ID类型
export type UnifiedCategoryId = 'fruit_wine' | 'nfc_juice' | 'gift_box'

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
  category: UnifiedCategoryId
  alcohol: string
  capacity: string
  specs: ProductSpec[]
  description: string
  story: string
  spriteId: string
  spriteAlias: string
  organLord?: string
  salesCount: number
  rating: number
  isAlcohol: boolean
  brand: string
  isNew?: boolean        // 是否新品
  relatedOrgan?: string  // 关联的藏府君（心/肝/脾/肺/肾）
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
  color: string
  bgColor: string
  category: UnifiedCategoryId
}

// 藏府君IP
export interface OrganLord {
  id: string
  name: string
  productId: string
  productName: string
  avatar: string
  quote: string
  description: string
}

// 藏府君数据
export const ORGAN_LORDS: OrganLord[] = [
  {
    id: 'organ_fei',
    name: '肺大人',
    productId: 'prod_apple_001',
    productName: '清苹微醉',
    avatar: '🫁',
    quote: '青苹果清肺·肺大人说：清肺润燥，轻盈自在',
    description: '中医认为"青苹果性凉味甘，有清热润肺、生津止渴"的功效。肺大人是五脏中最怕燥热的器官，秋季干燥时更需要滋润。'
  },
  {
    id: 'organ_xin',
    name: '心君',
    productId: 'prod_pomegranate_new',
    productName: '榴红心事',
    avatar: '❤️',
    quote: '心君说：石榴养心补血，让你的心更有力量',
    description: '中医认为"石榴性温味甘酸，有生津止渴、收敛固涩"的功效，对心脏健康大有裨益。'
  }
]

// 官方产品数据 - 7款产品
export const MOCK_PRODUCTS: Product[] = [
  // ============ 果酒系列（邑夏品牌，3款）============
  {
    id: 'prod_pomegranate_new',
    name: '榴红心事',
    subtitle: '石榴·红若丹心',
    price: 18.8,
    originalPrice: 28.8,
    image: PRODUCT_IMAGES.prod_pomegranate_new,
    images: [PRODUCT_IMAGES.prod_pomegranate_new, PRODUCT_IMAGES.scene_pomegranate],
    tags: ['果酒', '石榴酒', '新品', '养心', '安神'],
    category: 'fruit_wine',
    alcohol: '6%vol',
    capacity: '330ml',
    specs: [
      { id: 'spec_pomegranate_new_330', name: '330ml 单瓶装', price: 18.8, originalPrice: 28.8, stock: 100 }
    ],
    description: '石榴入酒，红若丹心。养血安神，温润如玉。精选鲜红石榴，低温发酵酿造，酒体呈红宝石色，果香浓郁，入口绵柔，回甘悠长。',
    story: '"心如红石榴，热烈而温润。我是藏府君欣欣，石榴酒养心安神，愿每一杯都带给你温暖与平静。"',
    spriteId: 'sprite_xinxin',
    spriteAlias: '欣欣',
    salesCount: 0,
    rating: 4.9,
    isAlcohol: true,
    brand: '邑夏',
    isNew: true,
    relatedOrgan: 'heart'
  },
  {
    id: 'prod_apple_001',
    name: '清苹微醉',
    subtitle: '青苹果微醺气泡酒',
    price: 18.8,
    originalPrice: 28.8,
    image: PRODUCT_IMAGES.prod_apple_001,
    images: [PRODUCT_IMAGES.prod_apple_001, PRODUCT_IMAGES.scene_apple],
    tags: ['果酒', '苹果酒', '新品', '起泡', '清肺'],
    category: 'fruit_wine',
    alcohol: '5%vol',
    capacity: '330ml',
    specs: [
      { id: 'spec_apple_330', name: '330ml 单瓶装', price: 18.8, originalPrice: 28.8, stock: 150 }
    ],
    description: '青苹果的清新，碰上微醺的浪漫。清肺润燥，轻盈自在。精选青苹果低温发酵，保留了苹果的清脆与活力，微气泡感，适合年轻派对。',
    story: '"清风徐来，苹果微醺。我是藏府君霏霏，青苹果酒清肺润燥，愿每一杯都带给你轻盈与自在。"',
    spriteId: 'sprite_feifei',
    spriteAlias: '霏霏',
    salesCount: 0,
    rating: 4.8,
    isAlcohol: true,
    brand: '邑夏',
    isNew: true,
    relatedOrgan: 'lung'
  },
  {
    id: 'prod_guava_001',
    name: '番红暗许',
    subtitle: '番石榴·红心告白',
    price: 18.8,
    originalPrice: 28.8,
    image: PRODUCT_IMAGES.prod_guava_001,
    images: [PRODUCT_IMAGES.prod_guava_001, PRODUCT_IMAGES.scene_guava],
    tags: ['果酒', '番石榴酒', '新品', '养心', '安神'],
    category: 'fruit_wine',
    alcohol: '6%vol',
    capacity: '330ml',
    specs: [
      { id: 'spec_guava_330', name: '330ml 单瓶装', price: 18.8, originalPrice: 28.8, stock: 100 }
    ],
    description: '番石榴碰上红酒，热带风情跃然杯中。养心安神，清爽宜人。精选番石榴与红葡萄混酿，热带果香与酒香交织，清新脱俗。',
    story: '"番石榴的热情，红酒的优雅。我是藏府君欣欣，番石榴酒养心安神，愿每一杯都带给你热带的阳光。"',
    spriteId: 'sprite_xinxin',
    spriteAlias: '欣欣',
    salesCount: 0,
    rating: 4.9,
    isAlcohol: true,
    brand: '邑夏',
    isNew: true,
    relatedOrgan: 'heart'
  },

  // ============ 原果汁系列（果粟盈品牌，3款）============
  {
    id: 'prod_nfc_peach_001',
    name: '鲜桃果汁',
    subtitle: '100%纯果汁 NFC工艺',
    price: 18.9,
    originalPrice: 22.9,
    image: PRODUCT_IMAGES.prod_nfc_peach_001,
    images: [PRODUCT_IMAGES.prod_nfc_peach_001, PRODUCT_IMAGES.prod_nfc_grape_001, PRODUCT_IMAGES.prod_nfc_pear_001],
    tags: ['原果汁', '鲜桃', '100%', '全年龄'],
    category: 'nfc_juice',
    alcohol: '0%vol',
    capacity: '300ml',
    specs: [
      { id: 'spec_nfc_peach_300', name: '300ml 单瓶装', price: 18.9, originalPrice: 22.9, stock: 200 }
    ],
    description: '甄选当季新鲜蜜桃，采用NFC（非浓缩还原）工艺，直接压榨灌装，保留水果最纯正的营养与风味。不添加任何防腐剂、色素和香精。',
    story: '"清爽版的桃夭来啦！没有酒精的束缚，我更加轻盈灵动~快来尝尝清爽版的鲜桃果汁吧！"',
    spriteId: 'sprite_taoyao',
    spriteAlias: '桃夭（清爽版）',
    salesCount: 3456,
    rating: 4.9,
    isAlcohol: false,
    brand: '果粟盈'
  },
  {
    id: 'prod_nfc_grape_001',
    name: '红葡萄果汁',
    subtitle: '100%纯果汁 NFC工艺',
    price: 18.9,
    originalPrice: 22.9,
    image: PRODUCT_IMAGES.prod_nfc_grape_001,
    images: [PRODUCT_IMAGES.prod_nfc_grape_001, PRODUCT_IMAGES.prod_nfc_peach_001, PRODUCT_IMAGES.prod_nfc_pear_001],
    tags: ['原果汁', '红葡萄', '100%', '全年龄'],
    category: 'nfc_juice',
    alcohol: '0%vol',
    capacity: '300ml',
    specs: [
      { id: 'spec_nfc_grape_300', name: '300ml 单瓶装', price: 18.9, originalPrice: 22.9, stock: 200 }
    ],
    description: '甄选优质红葡萄，采用NFC（非浓缩还原）工艺，直接压榨灌装，保留葡萄最纯正的果香与营养。口感清甜，回味悠长。',
    story: '"清爽版的我更加活泼啦！不用微醺也能感受葡萄的甜蜜~红葡萄果汁，满满的花青素养颜能量！"',
    spriteId: 'sprite_pupu',
    spriteAlias: '葡葡（清爽版）',
    salesCount: 2890,
    rating: 4.8,
    isAlcohol: false,
    brand: '果粟盈'
  },
  {
    id: 'prod_nfc_pear_001',
    name: '鲜梨果汁',
    subtitle: '100%纯果汁 NFC工艺',
    price: 18.9,
    originalPrice: 22.9,
    image: PRODUCT_IMAGES.prod_nfc_pear_001,
    images: [PRODUCT_IMAGES.prod_nfc_pear_001, PRODUCT_IMAGES.prod_nfc_peach_001, PRODUCT_IMAGES.prod_nfc_grape_001],
    tags: ['原果汁', '鲜梨', '100%', '全年龄'],
    category: 'nfc_juice',
    alcohol: '0%vol',
    capacity: '300ml',
    specs: [
      { id: 'spec_nfc_pear_300', name: '300ml 单瓶装', price: 18.9, originalPrice: 22.9, stock: 200 }
    ],
    description: '精选沂蒙山新鲜大梨，采用NFC（非浓缩还原）工艺，直接压榨灌装，保留梨最纯正的清甜与润肺功效。秋燥时节的最佳饮品。',
    story: '"清爽版的小梨更加水润啦！没有酒精的我更加健康自然~鲜梨果汁，润肺清心，老少皆宜！"',
    spriteId: 'sprite_lili',
    spriteAlias: '梨梨（清爽版）',
    salesCount: 3120,
    rating: 4.9,
    isAlcohol: false,
    brand: '果粟盈'
  },

  // ============ 礼盒套装 ============
  {
    id: 'prod_gift_box_001',
    name: '缤纷礼盒',
    subtitle: '果酒果汁精选套装',
    price: 68.8,
    originalPrice: 88.8,
    image: PRODUCT_IMAGES.prod_pomegranate_new,
    images: [PRODUCT_IMAGES.prod_pomegranate_new, PRODUCT_IMAGES.prod_apple_001, PRODUCT_IMAGES.prod_guava_001],
    tags: ['礼盒', '套装', '送礼', '精选'],
    category: 'gift_box',
    alcohol: '0%vol',
    capacity: '礼盒装',
    specs: [
      { id: 'spec_gift_box_001', name: '缤纷礼盒装', price: 68.8, originalPrice: 88.8, stock: 50 }
    ],
    description: '精选邑夏果酒与果粟盈果汁组合套装，包含榴红心事、清苹微醉、番红暗许各一瓶，适合送礼自饮两相宜。',
    story: '"缤纷礼盒，心意满满。送亲友、送爱人、送自己，都是最好的选择。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 128,
    rating: 4.9,
    isAlcohol: false,
    brand: '邑夏'
  }
]

// 拼团产品
export const MOCK_FLASH_SALE: FlashSaleProduct[] = [
  {
    id: 'prod_pomegranate_new',
    name: '榴红心事',
    price: 28.8,
    pintuanPrice: 18.8,
    pintuanCount: 128,
    endTime: '2026-12-31 18:00:00',
    image: PRODUCT_IMAGES.prod_pomegranate_new,
    spriteAlias: '欣欣'
  },
  {
    id: 'prod_apple_001',
    name: '清苹微醉',
    price: 28.8,
    pintuanPrice: 18.8,
    pintuanCount: 96,
    endTime: '2026-12-31 18:00:00',
    image: PRODUCT_IMAGES.prod_apple_001,
    spriteAlias: '霏霏'
  }
]

// 产品分类
export const MOCK_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat_fruit_wine',
    name: '果酒系列',
    icon: 'wine',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500 bg-opacity-20',
    category: 'fruit_wine'
  },
  {
    id: 'cat_nfc_juice',
    name: '原果汁系列',
    icon: 'apple',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500 bg-opacity-20',
    category: 'nfc_juice'
  },
  {
    id: 'cat_gift_box',
    name: '礼盒套装',
    icon: 'gift',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500 bg-opacity-20',
    category: 'gift_box'
  }
]

// 根据分类获取产品
export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return MOCK_PRODUCTS
  return MOCK_PRODUCTS.filter(p => p.category === category as UnifiedCategoryId)
}

// 根据ID获取产品
export const getProductById = (id: string): Product | undefined => {
  return MOCK_PRODUCTS.find(p => p.id === id)
}

// 根据藏府君获取产品
export const getProductByOrganLord = (organLordId: string): Product | undefined => {
  return MOCK_PRODUCTS.find(p => p.organLord === organLordId)
}

// ============ 统一分类体系（所有页面共用） ============
export interface UnifiedCategory {
  id: UnifiedCategoryId
  name: string
  icon: string
  brandName: string       // 品牌名
  ageRequired: boolean    // 是否需要18+验证
  description: string
}

export const UNIFIED_CATEGORIES: UnifiedCategory[] = [
  {
    id: 'fruit_wine',
    name: '果酒系列',
    icon: '🍷',
    brandName: '邑夏',
    ageRequired: true,
    description: '3款果酒，低度微醺'
  },
  {
    id: 'nfc_juice',
    name: '原果汁系列',
    icon: '🧃',
    brandName: '果粟盈',
    ageRequired: false,
    description: '3款原果汁，全年龄'
  },
  {
    id: 'gift_box',
    name: '礼盒套装',
    icon: '🎁',
    brandName: '邑夏',
    ageRequired: true,
    description: '组合装，送礼首选'
  }
]

// 根据统一分类ID获取分类信息
export const getUnifiedCategoryById = (id: UnifiedCategoryId): UnifiedCategory | undefined => {
  return UNIFIED_CATEGORIES.find(c => c.id === id)
}
