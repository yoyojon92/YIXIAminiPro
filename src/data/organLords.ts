/**
 * 藏府君 IP 数据
 * 5位藏府君对应多款果酒产品（按中医同经同治原则）
 */

export interface OrganLord {
  id: string;
  name: string;
  title: string;          // 中医官职
  color: string;          // 主题色（渐变起点）
  colorEnd: string;       // 主题色（渐变终点）
  healthText: string;     // 中医养生文案
  relatedProducts: string[]; // 关联产品名称列表
  productIds: string[];   // 关联产品ID列表
  image: string;          // 立绘图片路径
  emoji: string;          // Emoji 占位符
}

// 脾将军 - 主脾经（对应：清苹微醉）
const PI_JIANG_JUN: OrganLord = {
  id: 'pijiangjun',
  name: '脾将军',
  title: '后天之本',
  color: '#F59E0B',
  colorEnd: '#FF8C42',
  healthText: '苹果健脾 · 脾胃为后天之本，气血生化之源',
  relatedProducts: ['清苹微醉'],
  productIds: ['prod_apple_wine'],
  image: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@44659b2/src/assets/images/organ-lords/pijiangjun.jpg',
  emoji: '🍑',
};

// 肺丞相 - 主肺经（对应：清苹微醉）
const FEI_CHENG_XIANG: OrganLord = {
  id: 'feichengxiang',
  name: '肺丞相',
  title: '相傅之官',
  color: '#E2E8F0',
  colorEnd: '#60A5FA',
  healthText: '苹果清肺 · 肺主气，司呼吸，清肺润燥',
  relatedProducts: ['清苹微醉'],
  productIds: ['prod_apple_wine'],
  image: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@44659b2/src/assets/images/organ-lords/feichengxiang.jpg',
  emoji: '🍐',
};

// 肝谋士 - 主肝经（对应：番红暗许）
const GAN_MOU_SHI: OrganLord = {
  id: 'ganmoushi',
  name: '肝谋士',
  title: '将军之官',
  color: '#059669',
  colorEnd: '#94A3B8',
  healthText: '番石榴养肝 · 肝藏血，主疏泄',
  relatedProducts: ['番红暗许'],
  productIds: ['prod_guava_wine'],
  image: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@44659b2/src/assets/images/organ-lords/ganmoushi.jpg',
  emoji: '🍒',
};

// 心君 - 主心经（对应：榴红心事）
const XIN_JUN: OrganLord = {
  id: 'xinjun',
  name: '心君',
  title: '君主之官',
  color: '#DC2626',
  colorEnd: '#F59E0B',
  healthText: '石榴养心 · 心主神明，养心安神',
  relatedProducts: ['榴红心事'],
  productIds: ['prod_pomegranate_new'],
  image: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@44659b2/src/assets/images/organ-lords/xinjun.jpg',
  emoji: '🍎',
};

// 肾智者 - 主肾经（对应：榴红心事）
const SHEN_ZHI_ZHE: OrganLord = {
  id: 'shenzhizhe',
  name: '肾智者',
  title: '先天之本',
  color: '#6366F1',
  colorEnd: '#1E3A5F',
  healthText: '石榴补肾 · 肾为先天之本，滋阴养血',
  relatedProducts: ['榴红心事'],
  productIds: ['prod_pomegranate_new'],
  image: 'https://cdn.jsdelivr.net/gh/yoyojon92/YIXIAminiPro@44659b2/src/assets/images/organ-lords/shenzhizhe.jpg',
  emoji: '🍇',
};

export const organLords: OrganLord[] = [
  PI_JIANG_JUN,
  FEI_CHENG_XIANG,
  GAN_MOU_SHI,
  XIN_JUN,
  SHEN_ZHI_ZHE,
];

// 根据产品ID获取对应藏府君
export function getOrganLordByProduct(productId: string): OrganLord | undefined {
  return organLords.find(lord => lord.productIds.includes(productId));
}

// 根据产品名称获取对应藏府君
export function getOrganLordByProductName(productName: string): OrganLord | undefined {
  return organLords.find(lord => lord.relatedProducts.includes(productName));
}
