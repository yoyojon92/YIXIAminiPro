/**
 * 漫画/动漫对白数据
 * 用于产品详情页的藏府君角色对话展示
 */

// 漫画对话接口
export interface ComicDialogue {
  id: string
  productId: string        // 关联产品ID
  characterId: string      // 藏府君角色ID（heart/liver/spleen/lung/kidney）
  characterName: string    // 角色名称
  characterImage: string   // 角色头像
  dialogue: string         // 对话内容
  emotion: 'happy' | 'calm' | 'excited' | 'thinking' | 'concerned'  // 情绪
  timestamp?: string       // 时间戳（可选）
}

// 产品推荐对话
export const COMIC_DIALOGUES: ComicDialogue[] = [
  // 葡香暗度（欣欣推荐）
  {
    id: 'dialog_grape_001',
    productId: 'prod_grape_001',
    characterId: 'heart',
    characterName: '欣欣',
    characterImage: '❤️',
    dialogue: '这杯葡香暗度，如同我心中的暖阳，温暖而不灼热，适合与挚爱共饮。',
    emotion: 'happy',
    timestamp: '刚刚'
  },
  // 桃韵清心（欣欣推荐）
  {
    id: 'dialog_peach_001',
    productId: 'prod_peach_001',
    characterId: 'heart',
    characterName: '欣欣',
    characterImage: '❤️',
    dialogue: '桃韵清心，入口清甜，如同初恋的感觉，温柔又美好~',
    emotion: 'happy',
    timestamp: '刚刚'
  },
  // 石榴映红（欣欣推荐）
  {
    id: 'dialog_pomegranate_001',
    productId: 'prod_pomegranate_001',
    characterId: 'heart',
    characterName: '欣欣',
    characterImage: '❤️',
    dialogue: '石榴映红，颜色热烈如爱，每一口都是热情的告白！',
    emotion: 'excited',
    timestamp: '刚刚'
  },
  // 山楂沁润（皮皮推荐）
  {
    id: 'dialog_hawthorn_001',
    productId: 'prod_hawthorn_001',
    characterId: 'spleen',
    characterName: '皮皮',
    characterImage: '💛',
    dialogue: '山楂沁润，酸甜适度，帮助消化又养胃，最贴心的小帮手~',
    emotion: 'calm',
    timestamp: '刚刚'
  },
  // 苹果沁润（皮皮推荐）
  {
    id: 'dialog_apple_001',
    productId: 'prod_apple_001',
    characterId: 'spleen',
    characterName: '皮皮',
    characterImage: '💛',
    dialogue: '苹果沁润，温和不刺激，是我每天都会推荐给朋友们的养生小饮~',
    emotion: 'happy',
    timestamp: '刚刚'
  },
  // 梨韵润燥（霏霏推荐）
  {
    id: 'dialog_pear_001',
    productId: 'prod_pear_001',
    characterId: 'lung',
    characterName: '霏霏',
    characterImage: '🤍',
    dialogue: '梨韵润燥，清润入喉，在干燥的季节里，让呼吸都变得轻盈自由~',
    emotion: 'calm',
    timestamp: '刚刚'
  }
]

// 获取产品的推荐对话
export function getComicDialogueByProductId(productId: string): ComicDialogue | undefined {
  return COMIC_DIALOGUES.find(d => d.productId === productId)
}

// 获取角色的所有对话
export function getComicDialoguesByCharacter(characterId: string): ComicDialogue[] {
  return COMIC_DIALOGUES.filter(d => d.characterId === characterId)
}

// 藏府君角色信息（简化版）
export const ORGAN_LORDS = {
  heart: {
    id: 'heart',
    name: '欣欣',
    title: '心大人',
    image: '❤️',
    color: '#DC2626',
    element: '火',
    personality: '热情主动、直觉型、情感外露'
  },
  liver: {
    id: 'liver',
    name: '甘甘',
    title: '肝大人',
    image: '💚',
    color: '#059669',
    element: '木',
    personality: '理性冷静、内敛缜密、追求公正'
  },
  spleen: {
    id: 'spleen',
    name: '皮皮',
    title: '脾大人',
    image: '💛',
    color: '#D97706',
    element: '土',
    personality: '温和包容、默默付出、乐天知命'
  },
  lung: {
    id: 'lung',
    name: '霏霏',
    title: '肺大人',
    image: '🤍',
    color: '#F8FAFC',
    element: '金',
    personality: '豁达洒脱、追求自由、直觉敏锐'
  },
  kidney: {
    id: 'kidney',
    name: '沈沈',
    title: '肾大人',
    image: '💜',
    color: '#7C3AED',
    element: '水',
    personality: '沉稳深邃、善于蛰伏、洞察本质'
  }
}

export type OrganLordId = keyof typeof ORGAN_LORDS
