/**
 * 产品 Mock 数据
 * 邑夏果酒/果汁小程序 - 12款产品完整数据
 */

// 产品图片路径映射
const PRODUCT_IMAGES: Record<string, string> = {
  // 果酒产品图（yixia-wine目录）
  prod_pomegranate_new: '/assets/images/products/yixia-wine/01-liu-hong-xin-shi.png',
  prod_grape_wine: '/assets/images/products/yixia-wine/02-pu-xiang-an-du.png',
  prod_peach_new: '/assets/images/products/yixia-wine/03-tao-xin-an-dong.png',
  prod_apple_wine: '/assets/images/products/yixia-wine/04-qing-ping-wei-zui.png',
  prod_guava_wine: '/assets/images/products/yixia-wine/05-fen-le-wu-qiong.png',
  prod_red_wine: '/assets/images/products/yixia-wine/06-gan-hong-pu-tao-jiu.png',
  // 原果汁产品图（yixia-juice目录）
  juice_pear: '/assets/images/products/yixia-juice/01-xian-li.png',
  juice_peach: '/assets/images/products/yixia-juice/02-xian-tao.png',
  juice_red_grape: '/assets/images/products/yixia-juice/03-hong-pu-tao.png',
  juice_white_grape: '/assets/images/products/yixia-juice/04-bai-pu-tao.png',
  // 礼盒产品图（暂用果汁图占位）
  gift_juice_box: '/assets/images/products/yixia-gift/gift-juice-box.png',
  gift_wine_box: '/assets/images/products/yixia-gift/gift-wine-box.png',
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
  isNew?: boolean
  relatedOrgan?: string
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
    id: 'organ_xin',
    name: '欣悦',
    productId: 'prod_pomegranate_new',
    productName: '榴红心事',
    avatar: '❤️',
    quote: '欣悦说：石榴养心补血，让你的心更有力量',
    description: '中医认为"石榴性温味甘酸，有生津止渴、收敛固涩"的功效，对心脏健康大有裨益。'
  }
]

// ============ 官方产品数据 - 12款产品 ============
export const MOCK_PRODUCTS: Product[] = [
  // ============ 果酒系列（邑夏品牌，6款）============
  {
    id: 'prod_pomegranate_new',
    name: '榴红心事',
    subtitle: '石榴金银花果酒',
    price: 49.9,
    originalPrice: 68.8,
    image: PRODUCT_IMAGES.prod_pomegranate_new,
    images: [PRODUCT_IMAGES.prod_pomegranate_new],
    tags: ['果酒', '石榴酒', '新品', '金银花', '养心'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_pomegranate_new_500', name: '500ml 单瓶装', price: 49.9, originalPrice: 68.8, stock: 100 }
    ],
    description: '石榴入酒，红若丹心。养血安神，温润如玉。精选鲜红石榴，搭配金银花精华，低温发酵酿造，酒体呈红宝石色，果香浓郁，入口绵柔，回甘悠长。',
    story: '"心如红石榴，热烈而温润。我是藏府君欣悦，石榴酒养心安神，愿每一杯都带给你温暖与平静。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.9,
    isAlcohol: true,
    brand: '邑夏',
    isNew: true,
    relatedOrgan: 'heart'
  },
  {
    id: 'prod_grape_wine',
    name: '葡香暗度',
    subtitle: '葡萄金银花果酒',
    price: 49.9,
    originalPrice: 68.8,
    image: PRODUCT_IMAGES.prod_grape_wine,
    images: [PRODUCT_IMAGES.prod_grape_wine],
    tags: ['果酒', '葡萄酒', '新品', '金银花', '养肝'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_grape_wine_500', name: '500ml 单瓶装', price: 49.9, originalPrice: 68.8, stock: 120 }
    ],
    description: '金银花入酒，紫葡萄为魂。明目养肝，温柔如初。精选优质紫葡萄，搭配金银花精华，低温发酵酿造，酒体呈深紫红色，口感柔和绵长。',
    story: '"紫葡萄入肝经，明目养血。我是藏府君甘甘，这杯葡香暗度，愿你眼神清澈，心境明亮。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.8,
    isAlcohol: true,
    brand: '邑夏',
    isNew: true,
    relatedOrgan: 'liver'
  },
  {
    id: 'prod_peach_new',
    name: '桃心暗动',
    subtitle: '水蜜桃金银花果酒',
    price: 49.9,
    originalPrice: 68.8,
    image: PRODUCT_IMAGES.prod_peach_new,
    images: [PRODUCT_IMAGES.prod_peach_new],
    tags: ['果酒', '桃酒', '新品', '金银花', '养肺'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_peach_new_500', name: '500ml 单瓶装', price: 49.9, originalPrice: 68.8, stock: 80 }
    ],
    description: '水蜜桃入酒，粉若朝霞。润肺生津，沁人心脾。精选成熟水蜜桃，搭配金银花精华，低温发酵酿造，酒体呈粉红色，果香清甜，入口柔顺。',
    story: '"桃之夭夭，灼灼其华。我是藏府君皮皮，这杯桃心暗动，愿你呼吸顺畅，气色如桃花。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.8,
    isAlcohol: true,
    brand: '邑夏',
    isNew: true,
    relatedOrgan: 'lung'
  },
  {
    id: 'prod_apple_wine',
    name: '青苹微醺',
    subtitle: '青苹果金银花果酒',
    price: 49.9,
    originalPrice: 68.8,
    image: PRODUCT_IMAGES.prod_apple_wine,
    images: [PRODUCT_IMAGES.prod_apple_wine],
    tags: ['果酒', '苹果酒', '新品', '金银花', '健脾'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_apple_wine_500', name: '500ml 单瓶装', price: 49.9, originalPrice: 68.8, stock: 90 }
    ],
    description: '青苹果入酒，翠色欲滴。健脾开胃，清新怡人。精选青苹果，搭配金银花精华，低温发酵酿造，酒体呈淡绿色，果酸清新，回味甘甜。',
    story: '"青青子衿，悠悠我心。我是藏府君霏霏，这杯青苹微醺，愿你脾胃调和，食欲常开。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.7,
    isAlcohol: true,
    brand: '邑夏',
    isNew: true,
    relatedOrgan: 'spleen'
  },
  {
    id: 'prod_guava_wine',
    name: '粉乐雾琼',
    subtitle: '番石榴金银花果酒',
    price: 49.9,
    originalPrice: 68.8,
    image: PRODUCT_IMAGES.prod_guava_wine,
    images: [PRODUCT_IMAGES.prod_guava_wine],
    tags: ['果酒', '番石榴酒', '新品', '金银花', '养肾'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_guava_wine_500', name: '500ml 单瓶装', price: 49.9, originalPrice: 68.8, stock: 70 }
    ],
    description: '番石榴入酒，粉雾朦胧。补肾固精，温润如春。精选红心番石榴，搭配金银花精华，低温发酵酿造，酒体呈粉雾色，果香馥郁，口感醇厚。',
    story: '"雾里看花，朦胧之美。我是藏府君沈沈，这杯粉乐雾琼，愿你精气充沛，身心安泰。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.8,
    isAlcohol: true,
    brand: '邑夏',
    isNew: true,
    relatedOrgan: 'kidney'
  },
  {
    id: 'prod_red_wine',
    name: '干红葡萄酒',
    subtitle: '经典干红·七年陈酿',
    price: 128.8,
    originalPrice: 168.8,
    image: PRODUCT_IMAGES.prod_red_wine,
    images: [PRODUCT_IMAGES.prod_red_wine],
    tags: ['果酒', '葡萄酒', '经典', '七年陈酿', '珍藏'],
    category: 'fruit_wine',
    alcohol: '12%vol',
    capacity: '750ml',
    specs: [
      { id: 'spec_red_wine_750', name: '750ml 七年陈酿', price: 128.8, originalPrice: 168.8, stock: 50 }
    ],
    description: '七年陈酿，经典干红。酒体醇厚，单宁柔顺，果香与橡木香交织，余韵悠长。精选赤霞珠葡萄，橡木桶陈酿七年，每一滴都是时光的馈赠。',
    story: '"时光酿造经典，岁月沉淀醇香。这杯干红，敬懂生活的你。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.9,
    isAlcohol: true,
    brand: '邑夏',
    isNew: false,
    relatedOrgan: 'heart'
  },

  // ============ 原果汁系列（果粟盈品牌，4款）============
  {
    id: 'juice_pear',
    name: '鲜梨果汁',
    subtitle: '100%原榨·雪梨汁',
    price: 18.8,
    image: PRODUCT_IMAGES.juice_pear,
    images: [PRODUCT_IMAGES.juice_pear],
    tags: ['果汁', '梨汁', '100%原榨', '无添加', '润肺'],
    category: 'nfc_juice',
    alcohol: '0%vol',
    capacity: '300ml',
    specs: [
      { id: 'spec_juice_pear_300', name: '300ml 单瓶装', price: 18.8, stock: 200 }
    ],
    description: '雪梨原榨，清甜滋润。不加水、不加糖、不加防腐剂，保留雪梨的原汁原味与天然营养。润肺生津，清凉解渴。',
    story: '"一颗雪梨，一杯清甜。果粟盈鲜梨果汁，让自然滋养每一天。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.9,
    isAlcohol: false,
    brand: '果粟盈',
    isNew: true
  },
  {
    id: 'juice_peach',
    name: '鲜桃果汁',
    subtitle: '100%原榨·水蜜桃汁',
    price: 18.8,
    image: PRODUCT_IMAGES.juice_peach,
    images: [PRODUCT_IMAGES.juice_peach],
    tags: ['果汁', '桃汁', '100%原榨', '无添加', '养颜'],
    category: 'nfc_juice',
    alcohol: '0%vol',
    capacity: '300ml',
    specs: [
      { id: 'spec_juice_peach_300', name: '300ml 单瓶装', price: 18.8, stock: 180 }
    ],
    description: '水蜜桃原榨，甜蜜芬芳。不加水、不加糖、不加防腐剂，保留水蜜桃的原汁原味与天然营养。养颜润肤，少女最爱。',
    story: '"水蜜桃的甜蜜，都在这杯果汁里。果粟盈鲜桃果汁，甜美如初恋。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.8,
    isAlcohol: false,
    brand: '果粟盈',
    isNew: true
  },
  {
    id: 'juice_red_grape',
    name: '红葡萄果汁',
    subtitle: '100%原榨·红葡萄汁',
    price: 18.8,
    image: PRODUCT_IMAGES.juice_red_grape,
    images: [PRODUCT_IMAGES.juice_red_grape],
    tags: ['果汁', '葡萄汁', '100%原榨', '无添加', '抗氧化'],
    category: 'nfc_juice',
    alcohol: '0%vol',
    capacity: '300ml',
    specs: [
      { id: 'spec_juice_red_grape_300', name: '300ml 单瓶装', price: 18.8, stock: 160 }
    ],
    description: '红葡萄原榨，醇香浓郁。不加水、不加糖、不加防腐剂，保留红葡萄的原汁原味与天然花青素。抗氧化，呵护年轻。',
    story: '"紫红色的神秘，藏在每一颗葡萄里。果粟盈红葡萄果汁，留住青春。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.7,
    isAlcohol: false,
    brand: '果粟盈',
    isNew: true
  },
  {
    id: 'juice_white_grape',
    name: '白葡萄果汁',
    subtitle: '100%原榨·白葡萄汁',
    price: 18.8,
    image: PRODUCT_IMAGES.juice_white_grape,
    images: [PRODUCT_IMAGES.juice_white_grape],
    tags: ['果汁', '葡萄汁', '100%原榨', '无添加', '清润'],
    category: 'nfc_juice',
    alcohol: '0%vol',
    capacity: '300ml',
    specs: [
      { id: 'spec_juice_white_grape_300', name: '300ml 单瓶装', price: 18.8, stock: 150 }
    ],
    description: '白葡萄原榨，清润甘甜。不加水、不加糖、不加防腐剂，保留白葡萄的原汁原味与天然营养。清热解渴，夏日首选。',
    story: '"晶莹剔透，如露如珠。果粟盈白葡萄果汁，清凉一整夏。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.6,
    isAlcohol: false,
    brand: '果粟盈',
    isNew: true
  },

  // ============ 礼盒套装（邑夏品牌，2款）============
  {
    id: 'gift_juice_box',
    name: '缤纷礼盒',
    subtitle: '果粟盈·4瓶果汁装',
    price: 68.8,
    originalPrice: 88.8,
    image: PRODUCT_IMAGES.gift_juice_box,
    images: [PRODUCT_IMAGES.gift_juice_box, '/assets/images/products/yixia-juice/01-xian-li.png', '/assets/images/products/yixia-juice/02-xian-tao.png', '/assets/images/products/yixia-juice/03-hong-pu-tao.png', '/assets/images/products/yixia-juice/04-bai-pu-tao.png'],
    tags: ['礼盒', '果汁套装', '送礼', '家庭装'],
    category: 'gift_box',
    alcohol: '0%vol',
    capacity: '300ml×4',
    specs: [
      { id: 'spec_gift_juice_box', name: '果汁礼盒装（4瓶）', price: 68.8, originalPrice: 88.8, stock: 60 }
    ],
    description: '果粟盈缤纷礼盒，内含鲜梨、鲜桃、红葡萄、白葡萄果汁各一瓶。精美包装，送礼首选，全家共享。',
    story: '"缤纷礼盒，满满心意。送礼自用两相宜。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.8,
    isAlcohol: false,
    brand: '邑夏',
    isNew: true
  },
  {
    id: 'gift_wine_box',
    name: '果酒混合礼盒',
    subtitle: '邑夏·6瓶果酒装',
    price: 268.8,
    originalPrice: 328.8,
    image: PRODUCT_IMAGES.gift_wine_box,
    images: [PRODUCT_IMAGES.gift_wine_box, '/assets/images/products/yixia-wine/01-liu-hong-xin-shi.png', '/assets/images/products/yixia-wine/02-pu-xiang-an-du.png', '/assets/images/products/yixia-wine/03-tao-xin-an-dong.png', '/assets/images/products/yixia-wine/04-qing-ping-wei-zui.png'],
    tags: ['礼盒', '果酒套装', '送礼', '珍藏'],
    category: 'gift_box',
    alcohol: '7%vol',
    capacity: '500ml×6',
    specs: [
      { id: 'spec_gift_wine_box', name: '果酒礼盒装（6瓶）', price: 268.8, originalPrice: 328.8, stock: 30 }
    ],
    description: '邑夏果酒混合礼盒，内含榴红心事、葡香暗度、桃心暗动、青苹微醺、粉乐雾琼各一瓶。精美包装，高端送礼首选。',
    story: '"六款果酒，六种滋味。邑夏礼盒，尽显心意。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.9,
    isAlcohol: true,
    brand: '邑夏',
    isNew: true
  }
]

// ============ 拼团数据 ============
export const MOCK_FLASH_SALE: FlashSaleProduct[] = [
  {
    id: 'flash_pomegranate',
    name: '榴红心事',
    price: 49.9,
    pintuanPrice: 39.9,
    pintuanCount: 2,
    endTime: '2025-01-01 23:59:59',
    image: PRODUCT_IMAGES.prod_pomegranate_new,
    spriteAlias: ''
  },
  {
    id: 'flash_peach',
    name: '桃心暗动',
    price: 49.9,
    pintuanPrice: 39.9,
    pintuanCount: 2,
    endTime: '2025-01-01 23:59:59',
    image: PRODUCT_IMAGES.prod_peach_new,
    spriteAlias: ''
  }
]

// ============ 产品分类数据 ============
export const MOCK_CATEGORIES: ProductCategory[] = [
  {
    id: 'fruit_wine',
    name: '果酒系列',
    icon: '🍷',
    color: 'text-rose-500',
    bgColor: 'bg-rose-500 bg-opacity-20',
    category: 'fruit_wine'
  },
  {
    id: 'nfc_juice',
    name: '原果汁系列',
    icon: '🧃',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500 bg-opacity-20',
    category: 'nfc_juice'
  },
  {
    id: 'gift_box',
    name: '礼盒套装',
    icon: '🎁',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500 bg-opacity-20',
    category: 'gift_box'
  }
]

export const getProductsByCategory = (category: string): Product[] => {
  if (category === 'all') return MOCK_PRODUCTS
  return MOCK_PRODUCTS.filter(p => p.category === category as UnifiedCategoryId)
}

export const getProductById = (id: string): Product | undefined => {
  return MOCK_PRODUCTS.find(p => p.id === id)
}

export const getProductByOrganLord = (organLordId: string): Product | undefined => {
  return MOCK_PRODUCTS.find(p => p.organLord === organLordId)
}

export interface UnifiedCategory {
  id: UnifiedCategoryId
  name: string
  icon: string
  brandName: string
  ageRequired: boolean
  description: string
}

export const UNIFIED_CATEGORIES: UnifiedCategory[] = [
  {
    id: 'fruit_wine',
    name: '果酒系列',
    icon: '🍷',
    brandName: '邑夏',
    ageRequired: true,
    description: '6款果酒，7度微醺'
  },
  {
    id: 'nfc_juice',
    name: '原果汁系列',
    icon: '🧃',
    brandName: '果粟盈',
    ageRequired: false,
    description: '4款原果汁，全年龄'
  },
  {
    id: 'gift_box',
    name: '礼盒套装',
    icon: '🎁',
    brandName: '邑夏',
    ageRequired: false,
    description: '组合装，送礼首选'
  }
]

export const getUnifiedCategoryById = (id: UnifiedCategoryId): UnifiedCategory | undefined => {
  return UNIFIED_CATEGORIES.find(c => c.id === id)
}
