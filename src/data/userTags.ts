// 标签分类（移除"消费行为"，符合微信审核合规）
export const TAG_CATEGORIES = [
  { id: 'taste', name: '口味偏好', icon: '🍷' },
  { id: 'social', name: '社交属性', icon: '🎭' },
  { id: 'health', name: '养生倾向', icon: '🌿' },
  { id: 'identity', name: '身份标签', icon: '🎖' },
]

// 标签定义（移除消费行为相关标签，符合微信审核合规）
export const USER_TAGS = {
  // 口味偏好
  peach_lover: { name: '蜜桃控', category: 'taste', icon: '🍑', color: '#F59E0B' },
  hawthorn_fan: { name: '山楂迷', category: 'taste', icon: '🍒', color: '#DC2626' },
  pear_lover: { name: '梨酒爱好者', category: 'taste', icon: '🍐', color: '#06B6D4' },
  pomegranate_fan: { name: '石榴控', category: 'taste', icon: '🏅', color: '#BE185D' },
  grape_lover: { name: '葡萄酒爱好者', category: 'taste', icon: '🍇', color: '#7C3AED' },
  
  // 社交属性
  social_butterfly: { name: '社交达人', category: 'social', icon: '🦋', color: '#3B82F6' },
  content_creator: { name: '创作者', category: 'social', icon: '✏️', color: '#06B6D4' },
  voter: { name: '投票积极分子', category: 'social', icon: '🗳️', color: '#8B5CF6' },
  shy_observer: { name: '安静观察者', category: 'social', icon: '👀', color: '#6B7280' },
  
  // 养生倾向
  tcm_fan: { name: '中医养生派', category: 'health', icon: '📿', color: '#059669' },
  organ_lord_follower: { name: '器官大人粉丝', category: 'health', icon: '🏛️', color: '#F59E0B' },
  sprite_collector: { name: '精灵收集者', category: 'health', icon: '✨', color: '#A78BFA' },
  
  // 身份标签
  member: { name: '邑夏会员', category: 'identity', icon: '👑', color: '#FBBF24' },
  new_user: { name: '萌新', category: 'identity', icon: '🌱', color: '#10B981' },
  loyal_customer: { name: '铁粉', category: 'identity', icon: '❤️', color: '#EF4444' },
  campus_ambassador: { name: '校园管家', category: 'identity', icon: '🎓', color: '#8B5CF6' },
}

export type TagId = keyof typeof USER_TAGS
export type TagCategory = typeof TAG_CATEGORIES[number]['id']
