/**
 * 精灵 Mock 数据
 * 邑夏果酒/果汁小程序 - 5位精灵IP
 */

export interface Sprite {
  id: string
  name: string
  alias: string
  color: string
  bgColor: string
  borderColor: string
  description: string
  personality: string
  story: string
  products: string[]        // 关联产品ID列表
  productNames: string[]   // 关联产品名称列表
  hasDualForm: boolean     // 是否有双形态
  alcoholForm: {
    name: string
    desc: string
    image: string
  }
  freshForm: {
    name: string
    desc: string
    image: string
  }
  organLord?: {
    name: string
    quote: string
  }
}

// 5位精灵数据
export const MOCK_SPRITES: Sprite[] = [
  {
    id: 'sprite_taoyao',
    name: '桃夭',
    alias: '桃花精灵',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-500',
    description: '桃花精灵，粉色系，微醺系+清爽系双形态',
    personality: '浪漫温柔，活泼可爱，喜欢用花瓣施魔法',
    story: '"桃花灼灼，宜室宜家。我是桃花精灵桃夭，每一滴桃酒都承载着春日的浪漫。愿你的人生如桃花般绚烂芬芳~"',
    products: ['prod_peach_001', 'prod_nfc_peach_001'],
    productNames: ['桃你欢心', '鲜桃果汁'],
    hasDualForm: true,
    alcoholForm: {
      name: '微醺态·桃夭',
      desc: '带着微微酒香的桃花仙子，脸颊泛红，更加娇媚动人',
      image: './assets/images/banner1.jpg'
    },
    freshForm: {
      name: '清爽态·桃夭',
      desc: '清新脱俗的桃花少女，没有酒精的束缚，更加轻盈灵动',
      image: './assets/images/banner1.jpg'
    }
  },
  {
    id: 'sprite_shazha',
    name: '楂楂',
    alias: '山楂精灵',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500',
    description: '山楂精灵，红色系，微醺系',
    personality: '活泼开朗，调皮可爱，最爱恶作剧',
    story: '"酸酸甜甜就是我，来自沂蒙山间的小楂。当你在课堂上打瞌睡时，一口山楂酒就能让你精神百倍！学习也要劳逸结合呀~"',
    products: ['prod_hawthorn_001'],
    productNames: ['楂香四溢'],
    hasDualForm: false,
    alcoholForm: {
      name: '微醺态·楂楂',
      desc: '带着山楂酸甜香气的活泼精灵，越喝越精神！',
      image: './assets/images/banner3.jpg'
    },
    freshForm: {
      name: '清爽态·楂楂',
      desc: '清爽酸甜的山楂小精灵（暂无清爽版产品）',
      image: './assets/images/banner3.jpg'
    }
  },
  {
    id: 'sprite_lili',
    name: '梨梨',
    alias: '梨精灵',
    color: 'text-lime-400',
    bgColor: 'bg-lime-500/20',
    borderColor: 'border-lime-500',
    description: '梨精灵，淡黄绿色系，微醺系+清爽系双形态，器官联名：肺大人',
    personality: '温柔体贴，善解人意，喜欢在夜晚给人们带去安宁',
    story: '"秋高气爽，梨香满园。我是来自沂蒙山的小梨，每一颗梨都承载着果农的期盼。当月光洒落，我会悄悄走进你的梦，带去一份清甜与安宁。"',
    products: ['prod_pear_001', 'prod_nfc_pear_001'],
    productNames: ['大吉大梨', '鲜梨果汁'],
    hasDualForm: true,
    alcoholForm: {
      name: '微醺态·梨梨',
      desc: '带着梨酒清香的温柔精灵，月光下格外动人',
      image: './assets/images/banner1.jpg'
    },
    freshForm: {
      name: '清爽态·梨梨',
      desc: '清新水润的鲜梨少女，更加健康自然',
      image: './assets/images/banner1.jpg'
    },
    organLord: {
      name: '肺大人',
      quote: '梨润肺·肺大人说：秋燥伤肺，来杯梨酒润一润'
    }
  },
  {
    id: 'sprite_liuliu',
    name: '榴榴',
    alias: '石榴精灵',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/20',
    borderColor: 'border-rose-500',
    description: '石榴精灵，深红紫色系，微醺系，器官联名：心君',
    personality: '热情奔放，落落大方，浑身散发着成熟魅力',
    story: '"红宝石般的果实，蕴含着四季的阳光。我是石榴精灵榴榴，每一滴酒都是生命的馈赠。愿与你分享这份红彤彤的喜悦。"',
    products: ['prod_pomegranate_001'],
    productNames: ['似水榴年'],
    hasDualForm: false,
    alcoholForm: {
      name: '微醺态·榴榴',
      desc: '如红宝石般璀璨的石榴精灵，散发着迷人的魅力',
      image: './assets/images/banner2.jpg'
    },
    freshForm: {
      name: '清爽态·榴榴',
      desc: '清新甜美的石榴少女（暂无清爽版产品）',
      image: './assets/images/banner2.jpg'
    },
    organLord: {
      name: '心君',
      quote: '心君说：石榴养心补血，让你的心更有力量'
    }
  },
  {
    id: 'sprite_pupu',
    name: '葡葡',
    alias: '葡萄精灵',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500',
    description: '葡萄精灵，紫蓝色系，微醺系+清爽系双形态',
    personality: '优雅高贵，追求浪漫，擅长用歌声抚慰人心',
    story: '"紫水晶般的葡萄，凝结了阳光的温度。我是葡萄精灵葡葡，每一瓶酒都是我对美好生活的诠释。愿与你共享这份紫色的浪漫。"',
    products: ['prod_grape_001', 'prod_nfc_grape_001'],
    productNames: ['葡写浪漫', '红葡萄果汁'],
    hasDualForm: true,
    alcoholForm: {
      name: '微醺态·葡葡',
      desc: '带着葡萄酒香的优雅精灵，散发着高贵的气质',
      image: './assets/images/banner2.jpg'
    },
    freshForm: {
      name: '清爽态·葡葡',
      desc: '清新甜美的葡萄少女，不用微醺也能感受甜蜜',
      image: './assets/images/banner2.jpg'
    }
  }
]

// 根据ID获取精灵
export const getSpriteById = (id: string): Sprite | undefined => {
  return MOCK_SPRITES.find(s => s.id === id)
}

// 根据产品ID获取精灵
export const getSpriteByProductId = (productId: string): Sprite | undefined => {
  return MOCK_SPRITES.find(s => s.products.includes(productId))
}

// 获取有双形态的精灵
export const getDualFormSprites = (): Sprite[] => {
  return MOCK_SPRITES.filter(s => s.hasDualForm)
}
