/**
 * 邑夏精灵 IP 数据
 */

// 导入精灵图片
import taoyaoImg from '@/assets/images/spirits/taoyao.jpg'
import liliImg from '@/assets/images/spirits/lili.jpg'
import liuliuImg from '@/assets/images/spirits/liuliu.jpg'

export interface Sprite {
  id: string;
  name: string;
  emoji: string;
  color: string; // 主题色
  image: string; // 精灵立绘图片路径
  productId: string; // 关联产品ID (与 products.ts 中的 id 一致)
  productName: string; // 关联产品名称
}

// 邑夏精灵数据
export const SPRITES: Sprite[] = [
  {
    id: 'sprite-xinxin',
    name: '欣欣',
    emoji: '❤️',
    color: '#DC2626', // 心红
    image: liuliuImg,
    productId: 'prod_pomegranate_new', // 榴红心事
    productName: '榴红心事',
  },
  {
    id: 'sprite-feifei',
    name: '霏霏',
    emoji: '🫁',
    color: '#06B6D4', // 肺蓝
    image: liliImg,
    productId: 'prod_apple_001', // 清苹微醉
    productName: '清苹微醉',
  },
  {
    id: 'sprite-guava',
    name: '番番',
    emoji: '🍑',
    color: '#F59E0B', // 番石榴橙
    image: taoyaoImg,
    productId: 'prod_guava_001', // 番红暗许
    productName: '番红暗许',
  },
];

// 根据产品ID获取精灵
export function getSpriteByProductId(productId: string): Sprite | undefined {
  return SPRITES.find((sprite) => sprite.productId === productId);
}
