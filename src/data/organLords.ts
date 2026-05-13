/**
 * 器官大人 IP 数据
 * 5位器官大人对应5款果酒产品
 */

export interface OrganLord {
  id: string;
  name: string;
  title: string;          // 中医官职
  color: string;          // 主题色（渐变起点）
  colorEnd: string;       // 主题色（渐变终点）
  healthText: string;     // 中医养生文案
  relatedProduct: string; // 关联产品名称
  productId: string;      // 关联产品ID
  image: string;          // 立绘图片路径
  emoji: string;          // Emoji 占位符
}

export const organLords: Record<string, OrganLord> = {
  'prod_peach_001': {
    id: 'pijiangjun',
    name: '脾将军',
    title: '后天之本',
    color: '#F59E0B',
    colorEnd: '#FF8C42',
    healthText: '桃养脾胃 · 脾胃为后天之本，气血生化之源',
    relatedProduct: '桃你欢心',
    productId: 'prod_peach_001',
    image: '/assets/images/organ-lords/pijiangjun.jpg',
    emoji: '🍑',
  },
  'prod_hawthorn_001': {
    id: 'shenzhizhe',
    name: '肾智者',
    title: '先天之本',
    color: '#1E3A5F',
    colorEnd: '#6366F1',
    healthText: '山楂消食 · 酸甘化阴，肾为先天之本',
    relatedProduct: '楂香四溢',
    productId: 'prod_hawthorn_001',
    image: '/assets/images/organ-lords/shenzhizhe.jpg',
    emoji: '🍒',
  },
  'prod_pear_001': {
    id: 'feichengxiang',
    name: '肺丞相',
    title: '相傅之官',
    color: '#E2E8F0',
    colorEnd: '#60A5FA',
    healthText: '梨润肺 · 肺主气，司呼吸，润肺生津',
    relatedProduct: '大吉大梨',
    productId: 'prod_pear_001',
    image: '/assets/images/organ-lords/feichengxiang.jpg',
    emoji: '🍐',
  },
  'prod_pomegranate_001': {
    id: 'xinjun',
    name: '心君',
    title: '君主之官',
    color: '#DC2626',
    colorEnd: '#F59E0B',
    healthText: '石榴养心 · 心主神明，养心安神',
    relatedProduct: '似水榴年',
    productId: 'prod_pomegranate_001',
    image: '/assets/images/organ-lords/xinjun.jpg',
    emoji: '🍎',
  },
  'prod_grape_001': {
    id: 'ganmoushi',
    name: '肝谋士',
    title: '将军之官',
    color: '#059669',
    colorEnd: '#94A3B8',
    healthText: '葡萄补肝 · 肝藏血，主疏泄，滋阴养血',
    relatedProduct: '葡写浪漫',
    productId: 'prod_grape_001',
    image: '/assets/images/organ-lords/ganmoushi.jpg',
    emoji: '🍇',
  },
};

// 根据产品ID获取对应器官大人
export function getOrganLordByProduct(productId: string): OrganLord | undefined {
  return organLords[productId];
}
