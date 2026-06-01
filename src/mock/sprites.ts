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

// 3位精灵数据（对应3款果酒）
export const MOCK_SPRITES: Sprite[] = [
  {
    id: 'sprite_xinxin',
    name: '欣欣',
    alias: '心之精灵',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500 bg-opacity-20',
    borderColor: 'border-rose-500',
    description: '心之精灵，红色系，对应榴红心事和番红暗许',
    personality: '热情温暖，善解人意，喜欢用心语抚慰人心',
    story: '"心如红石榴，热烈而温润。我是藏府君欣欣，石榴酒养心安神，愿每一杯都带给你温暖与平静。"',
    products: ['prod_pomegranate_new', 'prod_guava_wine'],
    productNames: ['榴红心事', '番红暗许'],
    hasDualForm: false,
    alcoholForm: {
      name: '微醺态·欣欣',
      desc: '如红石榴般温暖的心之精灵，散发着安神的魅力',
      image: './assets/images/banner2.jpg'
    },
    freshForm: {
      name: '清爽态·欣欣',
      desc: '清新温暖的心之少女',
      image: './assets/images/banner2.jpg'
    },
    organLord: {
      name: '心君',
      quote: '心君说：石榴养心补血，让你的心更有力量'
    }
  },
  {
    id: 'sprite_feifei',
    name: '霏霏',
    alias: '肺之精灵',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500 bg-opacity-20',
    borderColor: 'border-cyan-500',
    description: '肺之精灵，青绿色系，对应清苹微醉',
    personality: '清新自然，轻盈自在，喜欢用清风抚慰人心',
    story: '"清风徐来，苹果微醺。我是藏府君霏霏，青苹果酒清肺润燥，愿每一杯都带给你轻盈与自在。"',
    products: ['prod_apple_wine'],
    productNames: ['清苹微醉'],
    hasDualForm: false,
    alcoholForm: {
      name: '微醺态·霏霏',
      desc: '带着青苹果清香的轻盈精灵，散发着清新的魅力',
      image: './assets/images/banner1.jpg'
    },
    freshForm: {
      name: '清爽态·霏霏',
      desc: '清新轻盈的苹果少女',
      image: './assets/images/banner1.jpg'
    },
    organLord: {
      name: '肺大人',
      quote: '青苹果清肺·肺大人说：清肺润燥，轻盈自在'
    }
  },
  {
    id: 'sprite_nfc',
    name: '清爽精灵',
    alias: '果汁精灵',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500 bg-opacity-20',
    borderColor: 'border-emerald-500',
    description: '果汁精灵，绿色系，对应原果汁产品',
    personality: '活力充沛，健康阳光，喜欢给人们带去自然的能量',
    story: '"没有酒精的束缚，更加轻盈灵动~快来尝尝清爽版的果汁吧！"',
    products: ['prod_nfc_peach_001', 'prod_nfc_grape_001', 'prod_nfc_pear_001'],
    productNames: ['鲜桃果汁', '红葡萄果汁', '鲜梨果汁'],
    hasDualForm: false,
    alcoholForm: {
      name: '微醺态·清爽精灵',
      desc: '果汁精灵没有微醺态',
      image: './assets/images/banner1.jpg'
    },
    freshForm: {
      name: '清爽态·清爽精灵',
      desc: '活力充沛的果汁少女，给人们带去自然的能量',
      image: './assets/images/banner1.jpg'
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
