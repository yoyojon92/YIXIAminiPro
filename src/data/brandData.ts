/**
 * 藏府君项目完整品牌数据
 * 项目定位：中医文化 × 二次元 × AI动画网剧
 */

// 品牌版本类型
export type BrandVersion = 'suwen' | 'lingshu' | 'alliance'

// 品牌基础信息
export interface BrandInfo {
  id: BrandVersion
  nameChinese: string
  nameEnglish: string
  shortName: string
  slogan: string
  primaryColor: string
  secondaryColor: string
  style: string
  theme: string
  era: string
  visualStyle: string
  targetAudience: string
}

// 三大品牌
export const BRANDS: Record<BrandVersion, BrandInfo> = {
  suwen: {
    id: 'suwen',
    nameChinese: '素问少女',
    nameEnglish: 'Suwen Girls',
    shortName: '素问',
    slogan: '养生即正义',
    primaryColor: '#059669', // 青绿色
    secondaryColor: '#E0F2F1', // 月白色
    style: '圆润可爱风',
    theme: '养生文化、中医智慧',
    era: '宋朝（文化繁荣、生活精致）',
    visualStyle: '古风、清新、治愈系',
    targetAudience: '养生爱好者、年轻女性'
  },
  lingshu: {
    id: 'lingshu',
    nameChinese: '灵枢战记',
    nameEnglish: 'Lingshu War',
    shortName: '灵枢',
    slogan: '抗疫即荣耀',
    primaryColor: '#DC2626', // 宫墙红
    secondaryColor: '#1E3A5F', // 深蓝色
    style: '硬朗战斗风',
    theme: '抗疫战争、热血战斗',
    era: '清朝（瘟疫横行、国难当头）',
    visualStyle: '古风、热血、战斗系',
    targetAudience: '二次元玩家、热血动漫爱好者'
  },
  alliance: {
    id: 'alliance',
    nameChinese: '藏府君联盟',
    nameEnglish: 'Organs Alliance',
    shortName: '藏府君',
    slogan: '五脏即宇宙',
    primaryColor: '#7C3AED', // 紫色
    secondaryColor: '#FBBF24', // 金色
    style: '二次元联盟风',
    theme: '五脏即宇宙，中医即正义',
    era: '跨越时空',
    visualStyle: '二次元、多元化',
    targetAudience: '中医爱好者、二次元群体'
  }
}

// 场景简称使用规范
export interface UsageScenario {
  scenario: string
  nameToUse: string
  reason: string
}

export const USAGE_SCENARIOS: UsageScenario[] = [
  { scenario: '游戏内', nameToUse: '素问/灵枢', reason: '简洁好记' },
  { scenario: '社交媒体', nameToUse: '藏府君联盟', reason: '有话题性' },
  { scenario: '官方文件', nameToUse: '素问少女/灵枢战记', reason: '正式名称' },
  { scenario: '周边产品', nameToUse: '藏府君', reason: 'IP化' },
  { scenario: '海外发行', nameToUse: 'Organs Alliance', reason: '国际化' }
]

// 第一季内容规划
export interface Episode {
  id: number
  title: string
  topic: string
  description: string
  focusOrgan?: string
}

export const SEASON_ONE_EPISODES: Episode[] = [
  { id: 1, title: '心心的一天', topic: '介绍心脏', description: '认识心心，了解心脏的功能与重要性', focusOrgan: '心' },
  { id: 2, title: '肝肝的秘密', topic: '介绍肝脏', description: '探索肝肝的神秘世界，了解肝脏的解毒功能', focusOrgan: '肝' },
  { id: 3, title: '脾脾的美食', topic: '介绍脾脏', description: '跟随脾脾学习脾胃运化，了解消化系统', focusOrgan: '脾' },
  { id: 4, title: '肺肺的呼吸', topic: '介绍肺脏', description: '和肺肺一起呼吸，了解呼吸系统的工作原理', focusOrgan: '肺' },
  { id: 5, title: '肾肾的力量', topic: '介绍肾脏', description: '感受肾肾的深邃力量，了解肾脏的重要功能', focusOrgan: '肾' },
  { id: 6, title: '五脏初相识', topic: '团队集结', description: '五位器官少女首次集结，建立藏府君联盟' },
  { id: 7, title: '养生小课堂', topic: '知识科普', description: '五脏养生知识大科普，学习中医智慧' },
  { id: 8, title: '四时养生', topic: '春夏秋冬', description: '春夏秋冬四季养生法则，顺应自然规律' },
  { id: 9, title: '情绪管理', topic: '七情调理', description: '喜怒忧思悲恐惊，学会管理七情' },
  { id: 10, title: '五脏大联盟', topic: '第一季终', description: '第一季完结篇，藏府君联盟正式成立' }
]

// 平台矩阵
export interface Platform {
  name: string
  role: string
  contentForm: string
  frequency: string
}

export const PLATFORM_MATRIX: Platform[] = [
  { name: '小红书', role: '主阵地', contentForm: '视频笔记', frequency: '每周2集' },
  { name: 'B站', role: '深度内容', contentForm: '完整版动画', frequency: '每周1集' },
  { name: '抖音', role: '流量获取', contentForm: '短视频切片', frequency: '每天1条' },
  { name: '微博', role: '话题传播', contentForm: '动态/预告', frequency: '每天2-3条' }
]

// 里程碑规划
export interface Milestone {
  period: string
  goals: string[]
}

export const MILESTONES: Milestone[] = [
  {
    period: '1个月',
    goals: [
      '首集样片发布',
      '建立1000粉丝基础',
      '收集用户反馈'
    ]
  },
  {
    period: '3个月',
    goals: [
      '第一季10集完成',
      '建立10万粉丝基础',
      '探索变现路径'
    ]
  },
  {
    period: '6个月',
    goals: [
      '第二季制作中',
      '建立50万粉丝基础',
      '实现稳定收入'
    ]
  },
  {
    period: '1年',
    goals: [
      '完整IP品牌建立',
      '多平台分发矩阵',
      '年收入50万+'
    ]
  }
]

// 核心优势
export interface Advantage {
  title: string
  items: string[]
}

export const ADVANTAGES: Advantage[] = [
  {
    title: '文化底蕴',
    items: [
      '中医文化IP（素问/灵枢）',
      '黄帝内经知名度',
      '传统文化复兴趋势'
    ]
  },
  {
    title: '二次元市场',
    items: [
      '年轻群体喜欢',
      '传播力强',
      '商业化成熟'
    ]
  },
  {
    title: 'AI技术赋能',
    items: [
      '降低制作成本',
      '提升制作效率',
      '持续迭代优化'
    ]
  },
  {
    title: '差异化定位',
    items: [
      '中医+二次元蓝海',
      '养生+娱乐结合',
      '教育+娱乐结合'
    ]
  }
]

// AI工具链
export interface AITool {
  category: string
  tools: { name: string; use: string }[]
}

export const AI_TOOLCHAIN: AITool[] = [
  {
    category: '角色设计',
    tools: [
      { name: 'Midjourney', use: '角色概念图' },
      { name: 'Stable Diffusion', use: '可控角色生成' }
    ]
  },
  {
    category: '场景设计',
    tools: [
      { name: 'Midjourney', use: '场景概念图' }
    ]
  },
  {
    category: '动画生成',
    tools: [
      { name: 'Runway Gen-3', use: '高质量动画生成' },
      { name: 'Pika', use: '快速动画生成' },
      { name: '可灵AI', use: '国产替代方案' }
    ]
  },
  {
    category: '配音配乐',
    tools: [
      { name: '剪映AI配音', use: '角色配音' },
      { name: 'Suno', use: '背景音乐生成' },
      { name: 'Udio', use: '主题曲创作' }
    ]
  }
]

// 变现路径
export interface MonetizationPath {
  period: string
  methods: string[]
}

export const MONETIZATION_PATHS: MonetizationPath[] = [
  {
    period: '短期（3-6个月）',
    methods: ['平台流量分成', '小额打赏', '周边预售']
  },
  {
    period: '中期（6-12个月）',
    methods: ['IP授权', '品牌联名', '游戏联运', '知识付费（养生课程）']
  },
  {
    period: '长期（1年以上）',
    methods: ['动画大电影', '衍生游戏', '主题乐园', '实体周边']
  }
]

// 获取品牌信息
export function getBrandInfo(version: BrandVersion): BrandInfo {
  return BRANDS[version]
}

// 获取所有品牌
export function getAllBrands(): BrandInfo[] {
  return Object.values(BRANDS)
}
