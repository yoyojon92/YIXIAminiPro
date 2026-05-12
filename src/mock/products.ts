/**
 * 产品 Mock 数据
 * 邑夏果酒/果汁小程序 - 11款产品完整数据
 */

// 产品图片路径映射
const PRODUCT_IMAGES: Record<string, string> = {
  prod_peach_001: './assets/images/products/邑夏产品图/01-桃你欢心-金银花发酵酒.png',
  prod_hawthorn_001: './assets/images/products/邑夏产品图/02-楂香四溢-沂蒙山楂酒.png',
  prod_pear_001: './assets/images/products/邑夏产品图/03-大吉大梨-金银花梨酒.png',
  prod_pomegranate_001: './assets/images/products/邑夏产品图/04-似水榴年-金银花石榴酒.png',
  prod_grape_001: './assets/images/products/邑夏产品图/05-葡写浪漫-金银花葡萄酒.png',
  prod_nfc_peach_001: './assets/images/products/邑夏产品图/06-鲜桃果汁-NFC.png',
  prod_nfc_grape_001: './assets/images/products/邑夏产品图/07-红葡萄果汁-NFC.png',
  prod_nfc_pear_001: './assets/images/products/邑夏产品图/08-鲜梨果汁-NFC.png',
}

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
  category: 'fruit_wine' | 'grain_wine' | 'nfc_juice' | 'gift'
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
  category: 'fruit_wine' | 'grain_wine' | 'nfc_juice' | 'gift'
}

// 器官大人IP
export interface OrganLord {
  id: string
  name: string
  productId: string
  productName: string
  avatar: string
  quote: string
  description: string
}

// 器官大人数据
export const ORGAN_LORDS: OrganLord[] = [
  {
    id: 'organ_fei',
    name: '肺大人',
    productId: 'prod_pear_001',
    productName: '大吉大梨',
    avatar: '🫁',
    quote: '梨润肺·肺大人说：秋燥伤肺，来杯梨酒润一润',
    description: '中医认为"梨性寒味甘，有润肺止咳、滋阴清热"的功效。肺大人是五脏中最怕燥热的器官，秋季干燥时更需要滋润。'
  },
  {
    id: 'organ_xin',
    name: '心君',
    productId: 'prod_pomegranate_001',
    productName: '似水榴年',
    avatar: '❤️',
    quote: '心君说：石榴养心补血，让你的心更有力量',
    description: '中医认为"石榴性温味甘酸，有生津止渴、收敛固涩"的功效，对心脏健康大有裨益。'
  }
]

// 官方产品数据 - 11款产品
export const MOCK_PRODUCTS: Product[] = [
  // ============ 果酒系列（邑夏品牌，5款）============
  {
    id: 'prod_peach_001',
    name: '桃你欢心',
    subtitle: '金银花发酵酒·桃',
    price: 32.9,
    originalPrice: 39.9,
    image: PRODUCT_IMAGES.prod_peach_001,
    images: [PRODUCT_IMAGES.prod_peach_001, PRODUCT_IMAGES.prod_pear_001, PRODUCT_IMAGES.prod_pomegranate_001],
    tags: ['果酒', '桃花酿', '养颜', '金银花'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '330ml',
    specs: [
      { id: 'spec_peach_330', name: '330ml 单瓶装', price: 32.9, originalPrice: 39.9, stock: 100 }
    ],
    description: '甄选新鲜蜜桃，搭配金银花精华，采用低温发酵工艺精制而成。酒体呈淡粉色，清甜醇厚，散发着蜜桃与金银花的双重香气。',
    story: '"桃花灼灼，宜室宜家。我是桃花精灵桃夭，每一滴桃酒都承载着春日的浪漫。愿你的人生如桃花般绚烂芬芳~"',
    spriteId: 'sprite_taoyao',
    spriteAlias: '桃夭',
    salesCount: 1568,
    rating: 4.8,
    isAlcohol: true,
    brand: '邑夏'
  },
  {
    id: 'prod_hawthorn_001',
    name: '楂香四溢',
    subtitle: '沂蒙山楂酒',
    price: 24.9,
    originalPrice: 29.9,
    image: PRODUCT_IMAGES.prod_hawthorn_001,
    images: [PRODUCT_IMAGES.prod_hawthorn_001, PRODUCT_IMAGES.prod_peach_001, PRODUCT_IMAGES.prod_pomegranate_001],
    tags: ['果酒', '山楂酒', '开胃', '沂蒙山'],
    category: 'fruit_wine',
    alcohol: '12%vol',
    capacity: '330ml',
    specs: [
      { id: 'spec_hawthorn_330', name: '330ml 单瓶装', price: 24.9, originalPrice: 29.9, stock: 150 }
    ],
    description: '以沂蒙山新鲜山楂为原料，山楂富含维生素C和有机酸，经传统工艺酿造，酸甜适口，开胃消食。酒体呈淡红色，清新爽口。',
    story: '"酸酸甜甜就是我，来自沂蒙山间的小楂。当你在课堂上打瞌睡时，一口山楂酒就能让你精神百倍！学习也要劳逸结合呀~"',
    spriteId: 'sprite_shazha',
    spriteAlias: '楂楂',
    salesCount: 2103,
    rating: 4.7,
    isAlcohol: true,
    brand: '邑夏'
  },
  {
    id: 'prod_pear_001',
    name: '大吉大梨',
    subtitle: '金银花梨酒',
    price: 32.9,
    originalPrice: 39.9,
    image: PRODUCT_IMAGES.prod_pear_001,
    images: [PRODUCT_IMAGES.prod_pear_001, PRODUCT_IMAGES.prod_peach_001, PRODUCT_IMAGES.prod_pomegranate_001],
    tags: ['果酒', '梨酒', '润肺', '金银花'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '330ml',
    specs: [
      { id: 'spec_pear_330', name: '330ml 单瓶装', price: 32.9, originalPrice: 39.9, stock: 100 }
    ],
    description: '精选沂蒙山新鲜大梨，采用传统酿造工艺，低温发酵，保留梨的自然清甜。酒体金黄透亮，口感清爽甘甜，是送礼自饮的绝佳选择。',
    story: '"秋高气爽，梨香满园。我是来自沂蒙山的小梨，每一颗梨都承载着果农的期盼。当月光洒落，我会悄悄走进你的梦，带去一份清甜与安宁。"',
    spriteId: 'sprite_lili',
    spriteAlias: '梨梨',
    organLord: 'organ_fei',
    salesCount: 1856,
    rating: 4.8,
    isAlcohol: true,
    brand: '邑夏'
  },
  {
    id: 'prod_pomegranate_001',
    name: '似水榴年',
    subtitle: '金银花石榴酒',
    price: 35.9,
    originalPrice: 42.9,
    image: PRODUCT_IMAGES.prod_pomegranate_001,
    images: [PRODUCT_IMAGES.prod_pomegranate_001, PRODUCT_IMAGES.prod_peach_001, PRODUCT_IMAGES.prod_grape_001],
    tags: ['果酒', '石榴酒', '养颜', '金银花'],
    category: 'fruit_wine',
    alcohol: '7.8%vol',
    capacity: '330ml',
    specs: [
      { id: 'spec_pomegranate_330', name: '330ml 单瓶装', price: 35.9, originalPrice: 42.9, stock: 80 }
    ],
    description: '甄选优质石榴，搭配金银花精华，采用现代酿造工艺精制而成。酒体呈宝石红色，晶莹剔透，口感醇厚绵甜，富含花青素，养颜美容两相宜。',
    story: '"红宝石般的果实，蕴含着四季的阳光。我是石榴精灵榴榴，每一滴酒都是生命的馈赠。愿与你分享这份红彤彤的喜悦。"',
    spriteId: 'sprite_liuliu',
    spriteAlias: '榴榴',
    organLord: 'organ_xin',
    salesCount: 1392,
    rating: 4.9,
    isAlcohol: true,
    brand: '邑夏'
  },
  {
    id: 'prod_grape_001',
    name: '葡写浪漫',
    subtitle: '金银花葡萄酒',
    price: 32.9,
    originalPrice: 39.9,
    image: PRODUCT_IMAGES.prod_grape_001,
    images: [PRODUCT_IMAGES.prod_grape_001, PRODUCT_IMAGES.prod_pomegranate_001, PRODUCT_IMAGES.prod_nfc_grape_001],
    tags: ['果酒', '葡萄酒', '浪漫', '金银花'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '330ml',
    specs: [
      { id: 'spec_grape_330', name: '330ml 单瓶装', price: 32.9, originalPrice: 39.9, stock: 90 }
    ],
    description: '精选优质葡萄，搭配金银花精华，采用现代酿造工艺精制而成。酒体呈紫红色，散发着葡萄的果香与金银花的清雅，口感柔和绵长。',
    story: '"紫水晶般的葡萄，凝结了阳光的温度。我是葡萄精灵葡葡，每一瓶酒都是我对美好生活的诠释。愿与你共享这份紫色的浪漫。"',
    spriteId: 'sprite_pupu',
    spriteAlias: '葡葡',
    salesCount: 1234,
    rating: 4.8,
    isAlcohol: true,
    brand: '邑夏'
  },

  // ============ NFC果汁系列（果粟盈品牌，3款）============
  {
    id: 'prod_nfc_peach_001',
    name: '鲜桃果汁',
    subtitle: '100%纯果汁 NFC工艺',
    price: 18.9,
    originalPrice: 22.9,
    image: PRODUCT_IMAGES.prod_nfc_peach_001,
    images: [PRODUCT_IMAGES.prod_nfc_peach_001, PRODUCT_IMAGES.prod_nfc_grape_001, PRODUCT_IMAGES.prod_nfc_pear_001],
    tags: ['NFC果汁', '鲜桃', '100%', '全年龄'],
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
    tags: ['NFC果汁', '红葡萄', '100%', '全年龄'],
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
    tags: ['NFC果汁', '鲜梨', '100%', '全年龄'],
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

  // ============ 粮食酒系列（兴水河品牌，3款）============
  {
    id: 'prod_xingshui_pinjian',
    name: '兴水河·品鉴',
    subtitle: '浓香型粮食酒',
    price: 168,
    originalPrice: 198,
    image: './assets/images/banner3.jpg',
    images: ['./assets/images/banner3.jpg', './assets/images/banner1.jpg', './assets/images/banner2.jpg'],
    tags: ['粮食酒', '白酒', '浓香型', '品鉴'],
    category: 'grain_wine',
    alcohol: '38%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_xingshui_pinjian_500', name: '500ml 单瓶装', price: 168, originalPrice: 198, stock: 50 }
    ],
    description: '兴水河·品鉴，甄选优质高粱、小麦为原料，采用传统固态发酵工艺酿造。酒体清澈透明，窖香浓郁，绵甜醇和，回味悠长。',
    story: '兴水河酒，传承百年酿造技艺，以匠心酿好酒，为您带来舌尖上的味蕾盛宴。',
    spriteId: '',
    spriteAlias: '',
    salesCount: 456,
    rating: 4.6,
    isAlcohol: true,
    brand: '兴水河'
  },
  {
    id: 'prod_xingshui_jingdian',
    name: '兴水河·经典',
    subtitle: '浓香型粮食酒',
    price: 128,
    originalPrice: 158,
    image: './assets/images/banner3.jpg',
    images: ['./assets/images/banner3.jpg', './assets/images/banner1.jpg', './assets/images/banner2.jpg'],
    tags: ['粮食酒', '白酒', '浓香型', '经典'],
    category: 'grain_wine',
    alcohol: '38%vol',
    capacity: '450ml',
    specs: [
      { id: 'spec_xingshui_jingdian_450', name: '450ml 单瓶装', price: 128, originalPrice: 158, stock: 80 }
    ],
    description: '兴水河·经典，选用优质粮食为原料，经过长期窖藏老熟，酒体醇厚丰满，香气协调，是商务宴请、馈赠亲友的上佳之选。',
    story: '经典传承，品质如一。兴水河·经典，承载着几代人的记忆与情怀。',
    spriteId: '',
    spriteAlias: '',
    salesCount: 678,
    rating: 4.5,
    isAlcohol: true,
    brand: '兴水河'
  },
  {
    id: 'prod_xingshui_xiyan',
    name: '兴水河·禧宴',
    subtitle: '浓香型粮食酒',
    price: 228,
    originalPrice: 268,
    image: './assets/images/banner3.jpg',
    images: ['./assets/images/banner3.jpg', './assets/images/banner1.jpg', './assets/images/banner2.jpg'],
    tags: ['粮食酒', '白酒', '浓香型', '喜宴'],
    category: 'grain_wine',
    alcohol: '38%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_xingshui_xiyan_500', name: '500ml 单瓶装', price: 228, originalPrice: 268, stock: 40 }
    ],
    description: '兴水河·禧宴，专为喜庆场合打造。酒体醇厚绵柔，香气馥郁，寓意吉祥如意。无论是婚宴喜寿还是节日庆典，都是不可或缺的美酒佳酿。',
    story: '"禧"从天降，喜庆满堂。兴水河·禧宴，为您的人生重要时刻增添一份醇香与欢乐。',
    spriteId: '',
    spriteAlias: '',
    salesCount: 234,
    rating: 4.7,
    isAlcohol: true,
    brand: '兴水河'
  }
]

// 拼团产品
export const MOCK_FLASH_SALE: FlashSaleProduct[] = [
  {
    id: 'prod_pear_001',
    name: '大吉大梨',
    price: 32.9,
    pintuanPrice: 26.9,
    pintuanCount: 156,
    endTime: '2025-06-30 18:00:00',
    image: PRODUCT_IMAGES.prod_pear_001,
    spriteAlias: '梨梨'
  },
  {
    id: 'prod_hawthorn_001',
    name: '楂香四溢',
    price: 24.9,
    pintuanPrice: 19.9,
    pintuanCount: 89,
    endTime: '2025-06-30 18:00:00',
    image: PRODUCT_IMAGES.prod_hawthorn_001,
    spriteAlias: '楂楂'
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
    id: 'cat_grain_wine',
    name: '粮食酒系列',
    icon: 'glass-water',
    color: 'text-red-400',
    bgColor: 'bg-red-500 bg-opacity-20',
    category: 'grain_wine'
  },
  {
    id: 'cat_nfc_juice',
    name: 'NFC果汁系列',
    icon: 'apple',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500 bg-opacity-20',
    category: 'nfc_juice'
  },
  {
    id: 'cat_gift',
    name: '礼盒套装',
    icon: 'gift',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500 bg-opacity-20',
    category: 'gift'
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

// 根据器官大人获取产品
export const getProductByOrganLord = (organLordId: string): Product | undefined => {
  return MOCK_PRODUCTS.find(p => p.organLord === organLordId)
}
