import { Injectable } from '@nestjs/common'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
  images: string[]
  category: string
  categoryName: string
  alcohol: number
  volume: string
  tags: string[]
  description: string
  details: string
  isAgentProduct: boolean
  agentCompany?: string
  sprite: {
    id: string
    name: string
    emoji: string
    rarity: string
    story: string
  }
  specs: Array<{
    id: string
    name: string
    price: number
    stock: number
  }>
}

@Injectable()
export class ProductsService {
  private products: Product[] = [
    {
      id: '1',
      name: '大吉大梨',
      price: 39.9,
      originalPrice: 59.9,
      image: 'https://img.yixia.com/assets/dajidalili.png',
      images: [
        'https://img.yixia.com/assets/dajidalili.png',
        'https://img.yixia.com/assets/dajidalili-detail1.png',
        'https://img.yixia.com/assets/dajidalili-detail2.png',
      ],
      category: 'pear',
      categoryName: '梨酒',
      alcohol: 8,
      volume: '330ml',
      tags: ['果酒', '低度酒', '送礼', '大吉大利'],
      description: '精选山东莱阳梨，低温慢酿，入口清甜，回味悠长。每一瓶都承载着"大吉大梨"的美好寓意，是送礼自饮的佳品。',
      details: '配料表：莱阳梨汁、白酒、冰糖\n执行标准：GB/T 27588\n生产许可证：SC11537060012345\n储藏条件：阴凉干燥处保存',
      isAgentProduct: false,
      sprite: {
        id: 'xiaoli',
        name: '小梨',
        emoji: '🍐',
        rarity: 'R',
        story: '"我是小梨，来自山东莱阳的梨园。每天清晨，露珠都会在我的叶尖跳舞。如果你喜欢清甜果酒，我愿意成为你的第一瓶精灵~"',
      },
      specs: [
        { id: 's1-330', name: '330ml', price: 39.9, stock: 100 },
      ],
    },
    {
      id: '2',
      name: '似水榴年',
      price: 42.9,
      originalPrice: 68.9,
      image: 'https://img.yixia.com/assets/sishiliunian.png',
      images: [
        'https://img.yixia.com/assets/sishiliunian.png',
        'https://img.yixia.com/assets/sishiliunian-detail1.png',
        'https://img.yixia.com/assets/sishiliunian-detail2.png',
      ],
      category: 'pomegranate',
      categoryName: '石榴酒',
      alcohol: 7,
      volume: '330ml',
      tags: ['果酒', '低度酒', '送礼', '美好时光'],
      description: '金银花与石榴的完美邂逅，7度微醺，恰到好处。"似水榴年"愿你珍惜每一刻美好时光。',
      details: '配料表：石榴汁、金银花提取物、白酒、冰糖\n酒精度：7%vol\n净含量：330ml\n保质期：24个月',
      isAgentProduct: false,
      sprite: {
        id: 'xiaoliu',
        name: '小榴',
        emoji: '🍎',
        rarity: 'SR',
        story: '"嗨~我是小榴！石榴籽代表团结和珍惜，每一瓶似水榴年都装满了我对美好生活的向往。7度的微醺，刚刚好的温柔~"',
      },
      specs: [
        { id: 's2-330', name: '330ml', price: 42.9, stock: 80 },
      ],
    },
    {
      id: '3',
      name: '沂蒙山楂酒',
      price: 29.9,
      originalPrice: 45.9,
      image: 'https://img.yixia.com/assets/yimengshanzhajiu.png',
      images: [
        'https://img.yixia.com/assets/yimengshanzhajiu.png',
        'https://img.yixia.com/assets/yimengshanzhajiu-detail1.png',
        'https://img.yixia.com/assets/yimengshanzhajiu-detail2.png',
      ],
      category: 'hawthorn',
      categoryName: '山楂酒',
      alcohol: 8,
      volume: '330ml',
      tags: ['果酒', '低度酒', '开胃', '代理产品'],
      description: '来自沂蒙山区的优质山楂，酸甜可口，开胃健脾。每一口都是大自然的馈赠。',
      details: '配料表：沂蒙山楂、白酒、冰糖\n产品标准代号：GB/T 27588\n生产许可证：SC11537060012345\n产地：山东省临沂市',
      isAgentProduct: true,
      agentCompany: '山东青农酒业有限公司',
      sprite: {
        id: 'xiaozha',
        name: '小楂',
        emoji: '🍒',
        rarity: 'R',
        story: '"我是小楂，住在沂蒙山的山楂树上！我的酒酸酸甜甜的，就像青春的味道。虽然我的果子有点酸，但酿成酒可香了~"',
      },
      specs: [
        { id: 's3-330', name: '330ml', price: 29.9, stock: 120 },
      ],
    },
  ]

  async findAll(category?: string): Promise<Product[]> {
    if (category) {
      return this.products.filter(p => p.category === category)
    }
    return this.products
  }

  async findOne(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id)
  }
}
