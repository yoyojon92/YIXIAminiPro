/**
 * 藏府君联盟 · IP角色数据
 * 五脏器官拟人化 · 东西方双线世界观
 * 版本：Week 1 角色细化
 */

export interface IPCharacter {
  id: string;
  // 基础设定
  name: string;              // 中文名
  nameEn: string;            // 英文名
  nicknames: string[];       // 昵称列表
  gender: 'male' | 'female' | 'neutral';
  age: string;               // 年龄描述
  height: string;            // 身高
  weight: string;            // 体重
  
  // 五行属性
  element: string;           // 五行归属（火木土金水）
  elementEmoji: string;      // 元素符号
  season: string;            // 代表季节
  timeSlot: string;          // 守护时段
  
  // 视觉设计
  color: string;             // 主题色（渐变起点）
  colorEnd: string;          // 主题色（渐变终点）
  colorName: string;         // 颜色名称
  
  // 性格特征
  personality: {
    core: string[];          // 核心性格关键词
    strengths: string[];     // 优点
    weaknesses: string[];    // 缺点
    mbti: string;            // MBTI类型
  };
  
  // 人设文案
  catchphrase: string;       // 口头禅
  signatureMove: string;     // 招牌动作
  quote: string;             // 角色名言
  
  // 背景故事
  story: {
    suwen: string;           // 素问少女版故事
    lingzhu: string;         // 灵枢战记版故事
  };
  
  // 角色关系
  relationships: {
    character: string;       // 关系对象
    type: string;            // 关系类型
    description: string;     // 关系描述
  }[];
  
  // 战斗设定（灵枢战记版）
  combat: {
    mechaName: string;       // 机甲名称
    mechaColor: string;      // 机甲配色
    weapon: string;          // 武器
    skills: { name: string; type: string; desc: string; }[];
    ultimate: { name: string; desc: string; };
    weaknesses: string[];
  };
  
  // 关联产品
  relatedProducts: string[];
  productIds: string[];
  
  // 图片资源
  image: string;
  emoji: string;
}

// ========== 心心 (Heart) ==========
const XIN_XIN: IPCharacter = {
  id: 'xinxin',
  name: '心心',
  nameEn: 'Corrine',
  nicknames: ['小心脏', '跳动女王', '心宝'],
  gender: 'female',
  age: '外表16岁（实际与人体同龄）',
  height: '155cm',
  weight: '45kg',
  
  element: '火',
  elementEmoji: '🔥',
  season: '夏',
  timeSlot: '午时（11:00-13:00）',
  
  color: '#E63946',
  colorEnd: '#F4A261',
  colorName: '朱砂红',
  
  personality: {
    core: ['温暖治愈', '热血冲动', '责任感强', '玻璃心', '领导气质'],
    strengths: ['充满热情与活力', '善于表达情感', '关键时刻可靠', '共情能力强', '富有牺牲精神'],
    weaknesses: ['容易感情用事', '过于在意他人看法', '工作狂倾向', '偶尔傲娇'],
    mbti: 'ENFJ',
  },
  
  catchphrase: '跳动不息，生命不止！',
  signatureMove: '手抚心口 + 微微鞠躬行礼',
  quote: '每一次跳动，都是为了让你好好活着。',
  
  story: {
    suwen: '心心是"素问村"的村长助理，负责协调五大家族的日常事务。她从小就知道自己是"生命的核心"，这份使命感让她比同龄人更加成熟懂事。',
    lingzhu: '心心是"灵枢王国"的女战神，驾驶名为「脉动号」的红色机甲。她是五脏战队的指挥官，在抵御外敌"浊气军团"的战役中从未败北。',
  },
  
  relationships: [
    { character: '肝肝', type: '挚友/对手', description: '欢喜冤家，理性与感性的碰撞' },
    { character: '脾脾', type: '依赖', description: '最需要脾脾的运化支持' },
    { character: '肺肺', type: '信任', description: '最佳拍档，共同完成气血循环' },
    { character: '肾肾', type: '守护', description: '默默照顾的小妹妹' },
  ],
  
  combat: {
    mechaName: '脉动号 Mk-1',
    mechaColor: '赤红 + 金色 + 黑色能量纹路',
    weapon: '双手剑「炽心」，剑柄为心脏造型',
    skills: [
      { name: '心火斩', type: '近战', desc: '挥动炽心剑，斩出火焰剑气' },
      { name: '脉动冲击', type: '远程', desc: '释放心跳节奏的能量波' },
      { name: '热血领域', type: '辅助', desc: '范围内友军攻击力提升30%' },
      { name: '共振治疗', type: '治愈', desc: '通过心跳共鸣恢复队友HP' },
    ],
    ultimate: { name: '心火真谛 · 永动之心', desc: '积蓄全身心火能量，化为巨型心脏机甲形态，释放毁灭性一击' },
    weaknesses: ['情绪波动', '心魔侵蚀', '孤独', '熬夜'],
  },
  
  relatedProducts: ['似水榴年'],
  productIds: ['prod_pomegranate_001'],
  image: '/assets/images/ip/xinxin.jpg',
  emoji: '❤️',
};

// ========== 肝肝 (Liver) ==========
const GAN_GAN: IPCharacter = {
  id: 'gangan',
  name: '肝肝',
  nameEn: 'Logan',
  nicknames: ['解毒君', '肝大人', '肝宝'],
  gender: 'male',
  age: '外表18岁',
  height: '178cm',
  weight: '62kg',
  
  element: '木',
  elementEmoji: '🌿',
  season: '春',
  timeSlot: '丑时（01:00-03:00）',
  
  color: '#059669',
  colorEnd: '#34D399',
  colorName: '翠玉绿',
  
  personality: {
    core: ['理性冷静', '傲娇毒舌', '完美主义', '外冷内热', '守护本能'],
    strengths: ['逻辑思维强', '善解人意（虽然不表现出来）', '危机时刻靠谱', '忠诚度高'],
    weaknesses: ['过度理性', '嘴硬心软', '完美主义焦虑', '容易焦虑'],
    mbti: 'INTJ',
  },
  
  catchphrase: '冷静分析，理性决策。',
  signatureMove: '推眼镜 + 叹气',
  quote: '我的解毒，是对生命的承诺。',
  
  story: {
    suwen: '肝肝是素问村的外科医师，专精"解毒之术"。他总是以冷漠的态度对待村民，但每当有人受伤，他总是第一个冲上去。',
    lingzhu: '肝肝是灵枢王国的战略官，驾驶名为「解毒号」的绿色机甲。他的战斗风格冷静精准，从不浪费任何一次攻击。',
  },
  
  relationships: [
    { character: '心心', type: '挚友/对手', description: '感性与理性的碰撞，互相补位' },
    { character: '脾脾', type: '守护', description: '默默守护的对象' },
    { character: '肺肺', type: '竞争', description: '总是比较谁更"完美"' },
    { character: '肾肾', type: '理解', description: '少数能读懂他沉默的人' },
  ],
  
  combat: {
    mechaName: '解毒号 Mk-2',
    mechaColor: '翠绿 + 银灰 + 白色能量纹路',
    weapon: '长弓「破邪」，箭矢为解毒药剂',
    skills: [
      { name: '净化之箭', type: '远程', desc: '射出解毒箭矢，消除范围毒素' },
      { name: '疏泄斩', type: '近战', desc: '短刀斩击，切断异常能量' },
      { name: '藏血领域', type: '辅助', desc: '储存队友伤害，延迟结算' },
    ],
    ultimate: { name: '木之真谛 · 万物生', desc: '释放春之气息，治愈全场并解除所有负面状态' },
    weaknesses: ['过度思虑', '完美主义', '难以表达情感'],
  },
  
  relatedProducts: ['楂香四溢'],
  productIds: ['prod_hawthorn_001'],
  image: '/assets/images/ip/gangan.jpg',
  emoji: '💚',
};

// ========== 脾脾 (Spleen) ==========
const PI_PI: IPCharacter = {
  id: 'pipi',
  name: '脾脾',
  nameEn: 'Penny',
  nicknames: ['脾宝', '小脾脾', '大地之母'],
  gender: 'female',
  age: '外表15岁',
  height: '150cm',
  weight: '42kg',
  
  element: '土',
  elementEmoji: '🌍',
  season: '长夏',
  timeSlot: '巳时（09:00-11:00）',
  
  color: '#F59E0B',
  colorEnd: '#FCD34D',
  colorName: '琥珀黄',
  
  personality: {
    core: ['包容无私', '温柔可靠', '默默付出', '母性光辉', '坚强后盾'],
    strengths: ['无私奉献', '超级可靠', '烹饪高手', '包容力MAX'],
    weaknesses: ['不善表达需求', '容易被忽视', '过度付出', '不会拒绝'],
    mbti: 'ISFJ',
  },
  
  catchphrase: '吃饱了才有力气哦~',
  signatureMove: '递上刚做好的点心 + 温柔微笑',
  quote: '我愿意成为所有人的后盾。',
  
  story: {
    suwen: '脾脾是素问村的大厨娘，经营着"脾胃食堂"。她总是默默为所有人准备食物，却从不要求回报。',
    lingzhu: '脾脾是灵枢王国的后勤官，驾驶名为「厚德号」的黄色重装机甲。她的机甲防御力最高，为队友抵挡一切伤害。',
  },
  
  relationships: [
    { character: '心心', type: '被依赖', description: '心心的运化支持者' },
    { character: '肝肝', type: '被守护', description: '被肝肝默默守护' },
    { character: '肺肺', type: '陪伴', description: '一起打理日常事务' },
    { character: '肾肾', type: '照顾', description: '照顾这个不爱说话的孩子' },
  ],
  
  combat: {
    mechaName: '厚德号 Mk-3',
    mechaColor: '琥珀黄 + 大地褐 + 白色纹路',
    weapon: '巨盾「坤元」，可变形为重锤',
    skills: [
      { name: '运化护盾', type: '防御', desc: '为全体队友生成护盾' },
      { name: '食补治愈', type: '治愈', desc: '投掷食物恢复HP' },
      { name: '厚德载物', type: '辅助', desc: '吸引敌人仇恨，保护队友' },
    ],
    ultimate: { name: '土之真谛 · 大地之母', desc: '化为大地屏障，为全队抵挡致命伤害' },
    weaknesses: ['过度付出', '不会拒绝', '容易被忽视'],
  },
  
  relatedProducts: ['桃你欢心', '蜜桃微醺'],
  productIds: ['prod_peach_001', 'prod_peach_002'],
  image: '/assets/images/ip/pipi.jpg',
  emoji: '💛',
};

// ========== 肺肺 (Lung) ==========
const FEI_FEI: IPCharacter = {
  id: 'feifei',
  name: '肺肺',
  nameEn: 'Luna',
  nicknames: ['风之子', '肺大人', '自由使者'],
  gender: 'female',
  age: '外表17岁',
  height: '165cm',
  weight: '48kg',
  
  element: '金',
  elementEmoji: '🌬️',
  season: '秋',
  timeSlot: '寅时（03:00-05:00）',
  
  color: '#E2E8F0',
  colorEnd: '#60A5FA',
  colorName: '皓白',
  
  personality: {
    core: ['豁达自由', '潇洒不羁', '风趣幽默', '神秘感', '边界意识'],
    strengths: ['调节气氛', '超然物外', '言简意赅', '直觉敏锐'],
    weaknesses: ['太过随性', '难以捉摸', '回避深层情感', '边界感太强'],
    mbti: 'ENTP',
  },
  
  catchphrase: '随遇而安，顺其自然~',
  signatureMove: '转身离去 + 留下一串笑声',
  quote: '呼吸之间，便是天地。',
  
  story: {
    suwen: '肺肺是素问村的"风之行者"，负责调节村中的气息流通。她总是来去如风，神秘而自由。',
    lingzhu: '肺肺是灵枢王国的侦察兵，驾驶名为「呼吸号」的白色轻装机甲。她的速度最快，来无影去无踪。',
  },
  
  relationships: [
    { character: '心心', type: '拍档', description: '共同完成气血循环' },
    { character: '肝肝', type: '竞争', description: '总是比较谁更"完美"' },
    { character: '脾脾', type: '陪伴', description: '一起打理日常事务' },
    { character: '肾肾', type: '同频', description: '同属阴脏，默契十足' },
  ],
  
  combat: {
    mechaName: '呼吸号 Mk-4',
    mechaColor: '皓白 + 银灰 + 蓝色气流纹路',
    weapon: '双扇「清风」，可合体为圆环',
    skills: [
      { name: '清风斩', type: '远程', desc: '释放风刃，切割敌人' },
      { name: '呼吸领域', type: '辅助', desc: '调节全场气息，增益/减益' },
      { name: '雾隐', type: '闪避', desc: '化为雾气，无法被锁定' },
    ],
    ultimate: { name: '金之真谛 · 天地一清', desc: '释放净化风暴，清除全场负面效果并造成大量伤害' },
    weaknesses: ['太过随性', '回避深层情感', '边界感太强'],
  },
  
  relatedProducts: ['大吉大梨', '柚见微醺'],
  productIds: ['prod_pear_001', 'prod_pear_002'],
  image: '/assets/images/ip/feifei.jpg',
  emoji: '🤍',
};

// ========== 肾肾 (Kidney) ==========
const SHEN_SHEN: IPCharacter = {
  id: 'shenshen',
  name: '肾肾',
  nameEn: 'Kira',
  nicknames: ['暗影之子', '肾宝', '深渊行者'],
  gender: 'neutral',
  age: '外表年龄不明',
  height: '160cm',
  weight: '不明',
  
  element: '水',
  elementEmoji: '🌊',
  season: '冬',
  timeSlot: '酉时（17:00-19:00）',
  
  color: '#6366F1',
  colorEnd: '#1E3A5F',
  colorName: '深紫',
  
  personality: {
    core: ['沉稳内敛', '洞察敏锐', '爆发潜力', '守护本能', '神秘莫测'],
    strengths: ['绝对可靠', '洞察本质', '关键时刻爆发', '隐忍力MAX'],
    weaknesses: ['不善表达', '容易压抑', '孤独感', '难以接近'],
    mbti: 'INFJ',
  },
  
  catchphrase: '静水流深...',
  signatureMove: '无声出现 + 凝视',
  quote: '深渊之中，藏着最纯粹的力量。',
  
  story: {
    suwen: '肾肾是素问村的隐士，住在村子最深处的"命门泉水"旁。他极少开口说话，但每当有人需要帮助，他总会默默出现。',
    lingzhu: '肾肾是灵枢王国的暗影战士，驾驶名为「水寒号」的深蓝隐形机甲。他的战斗风格无声致命，专门执行隐秘任务。',
  },
  
  relationships: [
    { character: '心心', type: '被守护', description: '被心心默默照顾' },
    { character: '肝肝', type: '被理解', description: '少数能读懂他沉默的人' },
    { character: '脾脾', type: '被照顾', description: '被脾脾照顾的对象' },
    { character: '肺肺', type: '同频', description: '同属阴脏，默契十足' },
  ],
  
  combat: {
    mechaName: '水寒号 Mk-5',
    mechaColor: '深紫 + 深蓝 + 黑色水流纹路',
    weapon: '双匕首「寒渊」，可合体为长枪',
    skills: [
      { name: '寒冰突袭', type: '近战', desc: '瞬移攻击，附带减速' },
      { name: '深渊汲取', type: '吸血', desc: '吸取敌人生命恢复自身' },
      { name: '隐匿', type: '潜行', desc: '进入隐身状态' },
    ],
    ultimate: { name: '水之真谛 · 归墟', desc: '召唤深渊吞噬一切，造成真实伤害' },
    weaknesses: ['不善表达', '容易压抑', '孤独感', '寒冷'],
  },
  
  relatedProducts: ['葡写浪漫'],
  productIds: ['prod_grape_001'],
  image: '/assets/images/ip/shenshen.jpg',
  emoji: '💜',
};

// ========== 导出所有角色 ==========
export const ipCharacters: IPCharacter[] = [
  XIN_XIN,
  GAN_GAN,
  PI_PI,
  FEI_FEI,
  SHEN_SHEN,
];

// 根据ID获取角色
export function getCharacterById(id: string): IPCharacter | undefined {
  return ipCharacters.find(char => char.id === id);
}

// 根据产品ID获取对应角色
export function getCharacterByProduct(productId: string): IPCharacter | undefined {
  return ipCharacters.find(char => char.productIds.includes(productId));
}

// 根据产品名称获取对应角色
export function getCharacterByProductName(productName: string): IPCharacter | undefined {
  return ipCharacters.find(char => char.relatedProducts.includes(productName));
}

// 根据五行属性获取角色
export function getCharactersByElement(element: string): IPCharacter[] {
  return ipCharacters.filter(char => char.element === element);
}

// ========== 兼容旧数据格式 ==========
export interface OrganLord {
  id: string;
  name: string;
  title: string;
  color: string;
  colorEnd: string;
  healthText: string;
  relatedProducts: string[];
  productIds: string[];
  image: string;
  emoji: string;
}

// 转换为舊格式（兼容现有代碼）
export const organLords: OrganLord[] = ipCharacters.map(char => ({
  id: char.id,
  name: char.name,
  title: char.story.suwen.slice(0, 20) + '...',
  color: char.color,
  colorEnd: char.colorEnd,
  healthText: char.catchphrase,
  relatedProducts: char.relatedProducts,
  productIds: char.productIds,
  image: char.image,
  emoji: char.emoji,
}));

// 根据产品ID获取对应藏府君（兼容旧API）
export function getOrganLordByProduct(productId: string): OrganLord | undefined {
  return organLords.find(lord => lord.productIds.includes(productId));
}

// 根据产品名称获取对应藏府君（兼容旧API）
export function getOrganLordByProductName(productName: string): OrganLord | undefined {
  return organLords.find(lord => lord.relatedProducts.includes(productName));
}
