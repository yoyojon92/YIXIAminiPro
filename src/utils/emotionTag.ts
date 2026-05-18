/**
 * 五志情绪标签系统
 * 中医五志：喜、怒、忧、思、恐
 */

export type EmotionType = 'joy' | 'anger' | 'worry' | 'thought' | 'fear'

export interface EmotionTag {
  type: EmotionType
  label: string
  emoji: string
  color: string
  description: string
}

export const EMOTION_TAGS: Record<EmotionType, EmotionTag> = {
  joy: {
    type: 'joy',
    label: '喜',
    emoji: '😊',
    color: '#FFD700',
    description: '心情愉悦，适合庆祝时刻'
  },
  anger: {
    type: 'anger',
    label: '怒',
    emoji: '😤',
    color: '#FF4444',
    description: '情绪激动，需要发泄'
  },
  worry: {
    type: 'worry',
    label: '忧',
    emoji: '😔',
    color: '#888888',
    description: '心有忧虑，需要安慰'
  },
  thought: {
    type: 'thought',
    label: '思',
    emoji: '🤔',
    color: '#4A90D9',
    description: '陷入沉思，独处时光'
  },
  fear: {
    type: 'fear',
    label: '恐',
    emoji: '😨',
    color: '#9932CC',
    description: '有些害怕，需要勇气'
  }
}

/**
 * 根据情绪类型获取标签信息
 */
export function getEmotionTag(type: EmotionType): EmotionTag {
  return EMOTION_TAGS[type] || EMOTION_TAGS.joy
}

/**
 * 获取所有情绪标签列表
 */
export function getAllEmotionTags(): EmotionTag[] {
  return Object.values(EMOTION_TAGS)
}

/**
 * 根据情绪分析推荐酒品
 */
export function recommendByEmotion(emotion: EmotionType): string[] {
  const recommendations: Record<EmotionType, string[]> = {
    joy: ['fruit_wine_peach', 'fruit_wine_grape'], // 喜 - 桃子、葡萄
    anger: ['fruit_wine_hawthorn'], // 怒 - 山楂消食
    worry: ['fruit_wine_pomegranate', 'nfc_peach'], // 忧 - 石榴、果汁
    thought: ['fruit_wine_pear', 'grain_wine_xingshui'], // 思 - 梨、粮食酒
    fear: ['nfc_grape', 'fruit_wine_peach'] // 恐 - 果汁、温和果酒
  }
  return recommendations[emotion] || []
}
