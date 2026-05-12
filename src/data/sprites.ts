/**
 * 邑夏精灵 IP 数据
 */

export interface Sprite {
  id: string;
  name: string;
  emoji: string;
  color: string; // 主题色
  productId: string; // 关联产品ID (与 products.ts 中的 id 一致)
  productName: string; // 关联产品名称
}

// 邑夏精灵数据
export const SPRITES: Sprite[] = [
  {
    id: 'sprite-taoyao',
    name: '桃夭',
    emoji: '🍑',
    color: '#F59E0B', // 暖橙
    productId: 'prod_peach_001', // 桃你欢心
    productName: '桃你欢心',
  },
  {
    id: 'sprite-zhacha',
    name: '楂楂',
    emoji: '🍒',
    color: '#DC2626', // 山楂红
    productId: 'prod_hawthorn_001', // 楂香四溢
    productName: '楂香四溢',
  },
  {
    id: 'sprite-lili',
    name: '梨梨',
    emoji: '🍐',
    color: '#06B6D4', // 梨银白
    productId: 'prod_pear_001', // 大吉大梨
    productName: '大吉大梨',
  },
  {
    id: 'sprite-liuliu',
    name: '榴榴',
    emoji: '🍎',
    color: '#BE185D', // 石榴红
    productId: 'prod_pomegranate_001', // 似水榴年
    productName: '似水榴年',
  },
  {
    id: 'sprite-pupu',
    name: '葡葡',
    emoji: '🍇',
    color: '#7C3AED', // 葡萄紫
    productId: 'prod_grape_001', // 葡写浪漫
    productName: '葡写浪漫',
  },
];

// 根据产品ID获取精灵
export function getSpriteByProductId(productId: string): Sprite | undefined {
  return SPRITES.find((sprite) => sprite.productId === productId);
}
