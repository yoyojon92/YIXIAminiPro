/**
 * 产品 Mock 数据
 * 邑夏果酒/果汁小程序 - 12款产品完整数据
 */

// 产品图片路径映射
const PRODUCT_IMAGES: Record<string, string> = {
  // 果酒产品图（yixia-wine目录）
  prod_pomegranate_new: 'https://www.coze.cn/s/_KuHIctBmwQ/',
  prod_grape_wine: 'https://www.coze.cn/s/CcrcKobZK2U/',
  prod_peach_new: 'https://www.coze.cn/s/F6Y-2sQg4qA/',
  prod_apple_wine: 'https://www.coze.cn/s/9OyqabNJYJ8/',
  prod_guava_wine: 'https://www.coze.cn/s/DNEftAIzsT0/',
  prod_red_wine: 'https://www.coze.cn/s/Fy-W35FoUfY/',
  // 原果汁产品图（yixia-juice目录）
  juice_pear: 'https://www.coze.cn/s/Drf71ZrIAIA/',
  juice_peach: 'https://www.coze.cn/s/B7-mnhcqnOY/',
  juice_red_grape: 'https://www.coze.cn/s/B7HvpiSr6u4/',
  juice_white_grape: 'https://www.coze.cn/s/CbnDWZB8oPY/',
  // 礼盒产品图（暂用果汁图占位）
  gift_juice_box: 'https://www.coze.cn/s/E5zc94S68r4/',
  gift_wine_box: 'https://www.coze.cn/s/EnInykiCgVY/',
  // 老款果酒产品图
  prod_pomelo_old: 'https://www.coze.cn/s/QRBnCcdas_g/',
  prod_hawthorn_old: 'https://www.coze.cn/s/OpRocfTFcmU/',
  prod_hawthorn_oolong_old: 'https://www.coze.cn/s/O4R5VLDhLWM/',
  // 毕业派对套餐图
  pkg_graduation_party: 'https://www.coze.cn/s/oOjiijqGGuQ/',
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
  isPintuanPackage?: boolean
  pintuanTiers?: { minPeople: number; pricePerPerson: number; label: string }[]
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
  // ============ 果酒系列（邑夏品牌，9款）============
  {
    id: 'prod_pomegranate_new',
    name: '榴红心事',
    subtitle: '石榴金银花果酒',
    price: 18.8,
    originalPrice: 29.9,
    image: PRODUCT_IMAGES.prod_pomegranate_new,
    images: [PRODUCT_IMAGES.prod_pomegranate_new],
    tags: ['果酒', '石榴酒', '新品', '金银花', '养心'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_pomegranate_new_500', name: '500ml 单瓶装', price: 18.8, originalPrice: 29.9, stock: 100 }
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
    price: 18.8,
    originalPrice: 29.9,
    image: PRODUCT_IMAGES.prod_grape_wine,
    images: [PRODUCT_IMAGES.prod_grape_wine],
    tags: ['果酒', '葡萄酒', '新品', '金银花', '养肝'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_grape_wine_500', name: '500ml 单瓶装', price: 18.8, originalPrice: 29.9, stock: 120 }
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
    subtitle: '黄桃金银花果酒',
    price: 18.8,
    originalPrice: 29.9,
    image: PRODUCT_IMAGES.prod_peach_new,
    images: [PRODUCT_IMAGES.prod_peach_new],
    tags: ['果酒', '桃酒', '新品', '金银花', '养脾'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_peach_new_500', name: '500ml 单瓶装', price: 18.8, originalPrice: 29.9, stock: 80 }
    ],
    description: '黄桃入酒，温润如阳。健脾养胃，甜而不腻。精选金黄黄桃，搭配金银花精华，低温慢酿，酒体呈琥珀色，桃香馥郁，入口丝滑。',
    story: '"桃之夭夭，灼灼其华。我是藏府君皮皮，这杯桃心暗动，愿你脾胃调和，气色如桃花。"',
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
    subtitle: '苹果金银花果酒',
    price: 18.8,
    originalPrice: 29.9,
    image: PRODUCT_IMAGES.prod_apple_wine,
    images: [PRODUCT_IMAGES.prod_apple_wine],
    tags: ['果酒', '苹果酒', '新品', '金银花', '润肺'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_apple_wine_500', name: '500ml 单瓶装', price: 18.8, originalPrice: 29.9, stock: 90 }
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
    subtitle: '芭乐金银花果酒',
    price: 39.9,
    originalPrice: 59.9,
    image: PRODUCT_IMAGES.prod_guava_wine,
    images: [PRODUCT_IMAGES.prod_guava_wine],
    tags: ['果酒', '芭乐酒', '新品', '金银花', '养心'],
    category: 'fruit_wine',
    alcohol: '5%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_guava_wine_500', name: '500ml 单瓶装', price: 39.9, originalPrice: 59.9, stock: 70 }
    ],
    description: '芭乐碰上微醺，热带风情跃然杯中。养心安神，清爽宜人。精选番石榴搭配金银花精华，热带果香与酒香交织，清新脱俗。',
    story: '"芭乐的热情，微醺的优雅。我是藏府君欣悦，这杯粉乐雾琼，愿你心安神定，热情如火。"',
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
    subtitle: '红葡萄果酒',
    price: 49.9,
    originalPrice: 79.9,
    image: PRODUCT_IMAGES.prod_red_wine,
    images: [PRODUCT_IMAGES.prod_red_wine],
    tags: ['果酒', '干红', '新品', '葡萄酒'],
    category: 'fruit_wine',
    alcohol: '7%vol',
    capacity: '500ml',
    specs: [
      { id: 'spec_red_wine_500', name: '500ml 单瓶装', price: 49.9, originalPrice: 79.9, stock: 80 }
    ],
    description: '甄选优质红葡萄，传统工艺发酵，酒体醇厚丰满，呈深宝石红色，散发黑莓与橡木的复合香气，单宁柔和，回味悠长。',
    story: '"一瓶好酒，一段好时光。邑夏干红，与好友共饮的每一刻都值得铭记。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.9,
    isAlcohol: true,
    brand: '邑夏',
    isNew: false,
    relatedOrgan: 'heart'
  },
  {
    id: 'prod_pomelo_old',
    name: '柚见微醺',
    subtitle: '柚子酒',
    price: 16.8,
    originalPrice: 28.8,
    image: 'https://www.coze.cn/s/QRBnCcdas_g/',
    images: ['https://www.coze.cn/s/QRBnCcdas_g/'],
    tags: ['果酒', '柚子酒', '低度', '润肺', '经典款'],
    category: 'fruit_wine',
    alcohol: '5%vol',
    capacity: '330ml',
    specs: [
      { id: 'spec_pomelo_old_1', name: '单瓶装', price: 16.8, originalPrice: 28.8, stock: 100 },
      { id: 'spec_pomelo_old_2', name: '2瓶装(9折)', price: 30.24, originalPrice: 57.6, stock: 80 },
      { id: 'spec_pomelo_old_3', name: '3瓶装(9折)', price: 45.36, originalPrice: 86.4, stock: 60 },
      { id: 'spec_pomelo_old_4', name: '4瓶装(8.5折)', price: 57.12, originalPrice: 115.2, stock: 40 }
    ],
    description: '柚子入酒，甘洌沁爽。酒体呈淡鹅黄色，口感清爽回甘，酒精度仅5%vol，微醺刚好。选用新鲜柚子低温发酵，保留柚子的天然果香与清润。',
    story: '「柚子甘寒润肺，一杯微醺肺气清。——肺丞相」',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.8,
    isAlcohol: true,
    brand: '邑夏',
    isNew: false,
    relatedOrgan: 'lung'
  },
  {
    id: 'prod_hawthorn_old',
    name: '沂蒙山楂酒',
    subtitle: '沂蒙山楂酒',
    price: 16.8,
    originalPrice: 28.8,
    image: 'https://www.coze.cn/s/OpRocfTFcmU/',
    images: ['https://www.coze.cn/s/OpRocfTFcmU/'],
    tags: ['果酒', '山楂酒', '沂蒙山', '消食', '经典款'],
    category: 'fruit_wine',
    alcohol: '12%vol',
    capacity: '330ml',
    specs: [
      { id: 'spec_hawthorn_old_1', name: '单瓶装', price: 16.8, originalPrice: 28.8, stock: 100 },
      { id: 'spec_hawthorn_old_2', name: '2瓶装(9折)', price: 30.24, originalPrice: 57.6, stock: 80 },
      { id: 'spec_hawthorn_old_3', name: '3瓶装(9折)', price: 45.36, originalPrice: 86.4, stock: 60 },
      { id: 'spec_hawthorn_old_4', name: '4瓶装(8.5折)', price: 57.12, originalPrice: 115.2, stock: 40 }
    ],
    description: '沂蒙山新鲜山楂酿造，酸甜适口，开胃消食。酒体呈琥珀色，澄澈透亮，山楂果香浓郁，12度醇厚回甘。传统工艺发酵，保留山楂天然有机酸与维C。',
    story: '「山楂酸甘化阴，疏肝消食佐酒一杯。——肝谋士」',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.7,
    isAlcohol: true,
    brand: '邑夏',
    isNew: false,
    relatedOrgan: 'liver'
  },
  {
    id: 'prod_hawthorn_oolong_old',
    name: '山楂乌龙酒',
    subtitle: '山楂乌龙茶酒',
    price: 16.8,
    originalPrice: 28.8,
    image: 'https://www.coze.cn/s/O4R5VLDhLWM/',
    images: ['https://www.coze.cn/s/O4R5VLDhLWM/'],
    tags: ['果酒', '山楂酒', '乌龙茶', '低度', '经典款'],
    category: 'fruit_wine',
    alcohol: '3.8%vol',
    capacity: '330ml',
    specs: [
      { id: 'spec_hawthorn_oolong_old_1', name: '单瓶装', price: 16.8, originalPrice: 28.8, stock: 100 },
      { id: 'spec_hawthorn_oolong_old_2', name: '2瓶装(9折)', price: 30.24, originalPrice: 57.6, stock: 80 },
      { id: 'spec_hawthorn_oolong_old_3', name: '3瓶装(9折)', price: 45.36, originalPrice: 86.4, stock: 60 },
      { id: 'spec_hawthorn_oolong_old_4', name: '4瓶装(8.5折)', price: 57.12, originalPrice: 115.2, stock: 40 }
    ],
    description: '山楂香甜，乌龙芬芳。山楂与乌龙茶巧妙融合，酒体呈琥珀色，入口酸甜柔和，茶香悠长回味，酒精度仅3.8%vol，轻饮无负担。冰镇更佳。',
    story: '「山楂消食，乌龙解腻，一杯双效。——肝谋士」',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.8,
    isAlcohol: true,
    brand: '邑夏',
    isNew: false,
    relatedOrgan: 'liver'
  },

  // ============ 原果汁系列（果粟盈品牌，4款）============
  {
    id: 'juice_pear',
    name: '鲜梨果汁',
    subtitle: '100%原榨·雪梨汁',
    price: 9.9,
    originalPrice: 15.9,
    image: PRODUCT_IMAGES.juice_pear,
    images: [PRODUCT_IMAGES.juice_pear],
    tags: ['果汁', '梨汁', '100%原榨', '无添加', '润肺'],
    category: 'nfc_juice',
    alcohol: '0%vol',
    capacity: '300ml',
    specs: [
      { id: 'spec_juice_pear_300', name: '300ml 单瓶装', price: 9.9, originalPrice: 15.9, stock: 200 }
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
    price: 9.9,
    originalPrice: 15.9,
    image: PRODUCT_IMAGES.juice_peach,
    images: [PRODUCT_IMAGES.juice_peach],
    tags: ['果汁', '桃汁', '100%原榨', '无添加', '养颜'],
    category: 'nfc_juice',
    alcohol: '0%vol',
    capacity: '300ml',
    specs: [
      { id: 'spec_juice_peach_300', name: '300ml 单瓶装', price: 9.9, originalPrice: 15.9, stock: 180 }
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
    price: 9.9,
    originalPrice: 15.9,
    image: PRODUCT_IMAGES.juice_red_grape,
    images: [PRODUCT_IMAGES.juice_red_grape],
    tags: ['果汁', '葡萄汁', '100%原榨', '无添加', '抗氧化'],
    category: 'nfc_juice',
    alcohol: '0%vol',
    capacity: '300ml',
    specs: [
      { id: 'spec_juice_red_grape_300', name: '300ml 单瓶装', price: 9.9, originalPrice: 15.9, stock: 160 }
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
    price: 9.9,
    originalPrice: 15.9,
    image: PRODUCT_IMAGES.juice_white_grape,
    images: [PRODUCT_IMAGES.juice_white_grape],
    tags: ['果汁', '葡萄汁', '100%原榨', '无添加', '清润'],
    category: 'nfc_juice',
    alcohol: '0%vol',
    capacity: '300ml',
    specs: [
      { id: 'spec_juice_white_grape_300', name: '300ml 单瓶装', price: 9.9, originalPrice: 15.9, stock: 150 }
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
    subtitle: '果粟盈·原果汁8瓶礼盒装',
    price: 79,
    originalPrice: 79.2,
    image: PRODUCT_IMAGES.gift_juice_box,
    images: [PRODUCT_IMAGES.gift_juice_box, 'https://www.coze.cn/s/Drf71ZrIAIA/', 'https://www.coze.cn/s/B7-mnhcqnOY/', 'https://www.coze.cn/s/B7HvpiSr6u4/', 'https://www.coze.cn/s/CbnDWZB8oPY/'],
    tags: ['礼盒', '果汁套装', '送礼', '家庭装'],
    category: 'gift_box',
    alcohol: '0%vol',
    capacity: '300ml×8',
    specs: [
      { id: 'spec_gift_juice_box', name: '果汁礼盒装（8瓶）', price: 79, originalPrice: 79.2, stock: 60 }
    ],
    description: '果粟盈缤纷礼盒，内含鲜梨、鲜桃、红葡萄、白葡萄果汁各两瓶。精美包装，送礼首选，全家共享。',
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
    subtitle: '邑夏·4瓶果酒装',
    price: 79,
    originalPrice: 119.6,
    image: PRODUCT_IMAGES.gift_wine_box,
    images: [PRODUCT_IMAGES.gift_wine_box, 'https://www.coze.cn/s/_KuHIctBmwQ/', 'https://www.coze.cn/s/CcrcKobZK2U/', 'https://www.coze.cn/s/F6Y-2sQg4qA/', 'https://www.coze.cn/s/9OyqabNJYJ8/'],
    tags: ['礼盒', '果酒套装', '送礼', '珍藏'],
    category: 'gift_box',
    alcohol: '7%vol',
    capacity: '500ml×4',
    specs: [
      { id: 'spec_gift_wine_box', name: '果酒礼盒装（4瓶）', price: 79, originalPrice: 119.6, stock: 30 }
    ],
    description: '邑夏果酒混合礼盒，内含榴红心事、葡香暗度、桃心暗动、青苹微醺各一瓶。精美包装，高端送礼首选。',
    story: '"四款果酒，四种滋味。邑夏礼盒，尽显心意。"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.9,
    isAlcohol: true,
    brand: '邑夏',
    isNew: true
  },
  // ============ 毕业套餐 ============
  {
    id: 'pkg_graduation_party',
    name: '毕业派对套餐',
    subtitle: '果酒11瓶畅饮装',
    price: 699,
    originalPrice: 899,
    image: PRODUCT_IMAGES.pkg_graduation_party,
    images: [
      'https://www.coze.cn/s/oOjiijqGGuQ/',
      'https://www.coze.cn/s/oh_NtSdZdDw/',
      'https://www.coze.cn/s/nzynzr684FA/',
      'https://www.coze.cn/s/pFMTGJ2Ivh0/',
      'https://www.coze.cn/s/o3R3ofTQZSQ/',
      'https://www.coze.cn/s/oZdiRnwolg8/',
    ],
    tags: ['套餐', '毕业季', '派对', '拼团'],
    category: 'gift_box',
    alcohol: '7%vol',
    capacity: '500ml×11',
    specs: [
      { id: 'spec_grad_party_11', name: '11瓶畅饮装', price: 699, originalPrice: 899, stock: 50 }
    ],
    description: '毕业派对套餐，内含：榴红心事×3、葡香暗度×2、桃心暗动×2、青苹微醺×2、干红葡萄酒×2，共11瓶。适合6-10人派对畅饮。拼团更优惠：10人团¥69/人，20人团¥29.9/人！',
    story: '"青春不散场，友谊永长存。邑夏毕业派对套餐，和挚友们举杯告别，迎接未来！"',
    spriteId: '',
    spriteAlias: '',
    salesCount: 0,
    rating: 4.9,
    isAlcohol: true,
    brand: '邑夏',
    isNew: true,
    isPintuanPackage: true,
    pintuanTiers: [
      { minPeople: 10, pricePerPerson: 69, label: '10人团' },
      { minPeople: 20, pricePerPerson: 29.9, label: '20人团·推荐' }
    ]
  }
]

// ============ 拼团数据 ============
export const MOCK_FLASH_SALE: FlashSaleProduct[] = [
  {
    id: 'prod_pomegranate_new',
    name: '榴红心事',
    price: 18.8,
    pintuanPrice: 15.8,
    pintuanCount: 128,
    endTime: '2026-12-31 18:00:00',
    image: 'https://www.coze.cn/s/_KuHIctBmwQ/',
    spriteAlias: ''
  },
  {
    id: 'prod_peach_new',
    name: '桃心暗动',
    price: 18.8,
    pintuanPrice: 15.8,
    pintuanCount: 96,
    endTime: '2026-12-31 18:00:00',
    image: 'https://www.coze.cn/s/F6Y-2sQg4qA/',
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
