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
  // 榴红心事（欣欣推荐）
  {
    id: 'dialog_pomegranate_new',
    productId: 'prod_pomegranate_new',
    characterId: 'heart',
    characterName: '欣欣',
    characterImage: '❤️',
    dialogue: '这杯榴红心事，如同我心中的暖阳，温暖而不灼热，适合与挚爱共饮。',
    emotion: 'happy',
    timestamp: '刚刚'
  },
  // 清苹微醉（霏霏推荐）
  {
    id: 'dialog_apple_001',
    productId: 'prod_apple_001',
    characterId: 'lung',
    characterName: '霏霏',
    characterImage: '🤍',
    dialogue: '清苹微醉，清润入喉，在干燥的季节里，让呼吸都变得轻盈自由~',
    emotion: 'calm',
    timestamp: '刚刚'
  },
  // 番红暗许（欣欣推荐）
  {
    id: 'dialog_guava_001',
    productId: 'prod_guava_001',
    characterId: 'heart',
    characterName: '欣欣',
    characterImage: '❤️',
    dialogue: '番红暗许，热带风情跃然杯中，每一口都是热情的告白！',
    emotion: 'excited',
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
