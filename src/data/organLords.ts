/**
 * 器官大人 IP 数据
 * 脾将军 | 肾智者 | 肺丞相 | 心君 | 肝谋士
 */
export interface OrganLord {
  id: string;
  name: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  emoji: string;
}

export const ORGAN_LORDS: OrganLord[] = [
  {
    id: 'pi-general',
    name: '脾将军',
    title: '气血大将军',
    description: '掌管气血生化，是身体的能量供应站。脾将军一出马，湿气无处遁形！',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    emoji: '🫀',
  },
  {
    id: 'kidney-sage',
    name: '肾智者',
    title: '精气大智者',
    description: '藏精主水，肾智者掌控着生命之源。他的智慧让你精力充沛每一天！',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    emoji: '🧠',
  },
  {
    id: 'lung-minister',
    name: '肺丞相',
    title: '呼吸大丞相',
    description: '司呼吸，主气机。肺丞相一咳嗽，风寒都得绕道走！',
    color: 'text-white',
    bgColor: 'bg-emerald-500',
    emoji: '🫁',
  },
  {
    id: 'heart-ruler',
    name: '心君',
    title: '神明大君主',
    description: '心主血脉，神明所居。心君坐镇，夜夜好眠，精神焕发！',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    emoji: '❤️',
  },
  {
    id: 'liver-strategist',
    name: '肝谋士',
    title: '疏泄大谋士',
    description: '主疏泄，调情志。肝谋士一出招，郁结全散，好心情天天有！',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    emoji: '🌿',
  },
];

/**
 * 根据 ID 获取器官大人
 */
export const getOrganLordById = (id: string): OrganLord | undefined => {
  return ORGAN_LORDS.find((lord) => lord.id === id);
};
