/**
 * 器官大人 IP 数据
 * 5位器官大人对应5款果酒产品
 */

export interface OrganLord {
  id: string;
  name: string;
  title: string;
  color: string; // 主题色
  gradient: string; // 渐变背景
  image: string; // 关联产品图片
  productId: number; // 关联产品ID
  productName: string; // 关联产品名称
  quote: string; // 中医名言（引）
  knowledge: string; // 中医知识文案
  detail: string; // 漫剧古风知识介绍
}

// 器官大人数据映射
export const ORGAN_LORDS: OrganLord[] = [
  {
    id: 'pi-jiangjun',
    name: '脾将军',
    title: '脾胃为后天之本',
    color: '#F59E0B', // 暖橙金
    gradient: 'from-amber-500 to-orange-600',
    image: '/assets/images/products/01-桃你欢心-金银花发酵酒.png',
    productId: 101,
    productName: '桃你欢心',
    quote: '桃养脾胃',
    knowledge: '桃子甘温入脾，一杯桃酒暖胃安神',
    detail: '脾为后天之本，气血生化之源。脾将军掌管人体运化之职，主导水谷精微的消化吸收。桃子性温味甘，富含维生素与膳食纤维，入脾经可助运化。邑夏桃酒以金银花发酵酒为底，佐以鲜桃果汁，温润甘甜，实为养脾佳品。脾将军常说：「脾胃和则百病消，一杯桃酒暖中焦」。',
  },
  {
    id: 'shen-zhizhe',
    name: '肾智者',
    title: '肾者水脏主藏精',
    color: '#7C3AED', // 深蓝紫
    gradient: 'from-violet-600 to-purple-700',
    image: '/assets/images/products/02-楂香四溢-沂蒙山楂酒.png',
    productId: 102,
    productName: '楂香四溢',
    quote: '山楂消食·酸甘化阴',
    knowledge: '山楂消食化积，佐酒一杯肾气充',
    detail: '肾为先天之本，藏精主水。肾智者深谙水液代谢之道，以酸甘之味化生阴液。山楂性微温味酸，消食化积尤效，入肾经可助气化。邑雪山楂酒以沂蒙山楂为原料，酸甜适口，微醺之间肾气得充。肾智者有言：「酸甘化阴，肾水充盈，人自然精神矍铄」。',
  },
  {
    id: 'fei-chenxiang',
    name: '肺丞相',
    title: '肺者相傅之官',
    color: '#06B6D4', // 银白蓝
    gradient: 'from-cyan-400 to-sky-500',
    image: '/assets/images/products/03-大吉大梨-金银花梨酒.png',
    productId: 103,
    productName: '大吉大梨',
    quote: '梨润肺·润肺生津',
    knowledge: '秋燥伤肺，来杯梨酒润一润',
    detail: '肺为华盖，主气司呼吸，朝百脉。肺丞相统管一身气机，主皮毛之开合，司津液之分布。梨性凉味甘，润肺生津止咳，入肺经可滋阴润燥。邑夏梨酒以金银花与鲜梨共酿，清润甘甜，尤为适合秋燥之时。肺丞相常言：「秋燥伤肺，宜润忌燥，一杯梨酒津液生」。',
  },
  {
    id: 'xin-jun',
    name: '心君',
    title: '心者君主之官',
    color: '#DC2626', // 红金
    gradient: 'from-red-500 to-rose-600',
    image: '/assets/images/products/04-似水榴年-金银花石榴酒.png',
    productId: 104,
    productName: '似水榴年',
    quote: '石榴养心·养心安神',
    knowledge: '石榴养心安神，一杯入喉心自宁',
    detail: '心为五脏六腑之主，主血脉藏神。心君高坐明堂，统摄神明，心宁则神安。石榴性温味酸，富含花青素与多酚，养心安神之效显著。邑夏石榴酒以金银花发酵酒为基，浸以石榴精华，入口甘醇，回味悠长，饮之可安神定志。心君有训：「心宁则智明，一杯石榴酒可养心宁神」。',
  },
  {
    id: 'gan-moushi',
    name: '肝谋士',
    title: '肝者将军之官',
    color: '#059669', // 深绿银
    gradient: 'from-emerald-600 to-teal-600',
    image: '/assets/images/products/05-葡写浪漫-金银花葡萄酒.png',
    productId: 105,
    productName: '葡写浪漫',
    quote: '葡萄补肝·滋阴养血',
    knowledge: '葡萄入肝经，微醺一杯肝气舒',
    detail: '肝为将军之官，主疏泄藏血，调畅气机。肝谋士运筹帷幄，决断于心，以疏泄调达为要。葡萄性平味甘，富含氨基酸与矿物质，入肝经可滋阴养血、舒筋活络。邑夏葡萄酒以金银花与葡萄共酵，酒香醇厚，饮之可令肝气舒畅。肝谋士有策：「肝主疏泄，喜条达恶抑郁，葡萄酒可养肝柔肝」。',
  },
];

/**
 * 根据产品ID获取对应的器官大人
 */
export function getOrganLordByProductId(productId: number): OrganLord | undefined {
  return ORGAN_LORDS.find((lord) => lord.productId === productId);
}

/**
 * 根据器官大人ID获取器官大人
 */
export function getOrganLordById(id: string): OrganLord | undefined {
  return ORGAN_LORDS.find((lord) => lord.id === id);
}
