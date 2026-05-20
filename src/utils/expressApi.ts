/**
 * 邑夏小程序 · 快递API封装
 * 对接后端 /api/express 接口
 */
import { Network } from '@/network'
import Taro from '@tarojs/taro'

export interface ExpressCompany {
  id: string
  name: string
  serviceType: number
  serviceName: string
  mode: string
  bound: boolean
}

export interface Receiver {
  name: string
  mobile: string
  province: string
  city: string
  area: string
  address: string
}

export interface Cargo {
  name: string
  count: number
  weight: number
  detailList?: Array<{ name: string; count: number }>
}

export interface CreateOrderParams {
  orderId: string
  expressCompany?: string
  receiver: Receiver
  sender?: Partial<Receiver>
  cargo: Cargo
  remark?: string
  getPrintData?: boolean
  openid?: string
  bizId?: string
}

export interface CreateOrderResult {
  orderId: string
  waybillId: string
  waybillData: Array<{ type: string; content: string }>
  expressCompany: string
  expressCompanyName: string
}

export interface PrintData {
  orderId: string
  waybillId: string
  html: string | null
  imageUrl: string | null
  raw: Record<string, unknown> | null
}

export interface BatchCreateResult {
  results: CreateOrderResult[]
  errors: Array<{ orderId: string; error: string }>
  total: number
  success: number
  failed: number
}

/**
 * 获取支持的快递公司列表
 */
export const getCompanies = async (): Promise<ExpressCompany[]> => {
  const res = await Network.request({
    url: '/api/express/companies',
    method: 'GET',
  })
  return res.data.data
}

/**
 * 获取已绑定的快递账号
 */
export const getAccounts = async () => {
  const res = await Network.request({
    url: '/api/express/accounts',
    method: 'GET',
  })
  return res.data.data
}

/**
 * 创建快递订单（获取电子面单）
 */
export const createOrder = async (params: CreateOrderParams): Promise<CreateOrderResult> => {
  const res = await Network.request({
    url: '/api/express/order',
    method: 'POST',
    data: {
      orderId: params.orderId,
      expressCompany: params.expressCompany || 'JDL',
      receiver: params.receiver,
      sender: params.sender,
      cargo: params.cargo,
      remark: params.remark || '',
      getPrintData: params.getPrintData !== false,
      openid: params.openid,
      bizId: params.bizId,
    },
  })
  return res.data.data
}

/**
 * 查询订单/面单信息
 */
export const getOrder = async (orderId: string, waybillId?: string, getPrintData = true) => {
  const res = await Network.request({
    url: `/api/express/order/${orderId}?waybillId=${waybillId || ''}&getPrintData=${getPrintData}`,
    method: 'GET',
  })
  return res.data.data
}

/**
 * 取消快递订单
 */
export const cancelOrder = async (orderId: string, waybillId?: string, openid?: string) => {
  const res = await Network.request({
    url: `/api/express/order/${orderId}?waybillId=${waybillId || ''}&openid=${openid || ''}`,
    method: 'DELETE',
  })
  return res.data.data
}

/**
 * 获取面单打印数据
 */
export const getPrintData = async (orderId: string, waybillId?: string): Promise<PrintData> => {
  const res = await Network.request({
    url: `/api/express/print/${orderId}`,
    method: 'POST',
    data: { waybillId },
  })
  return res.data.data
}

/**
 * 批量创建快递订单
 */
export const batchCreateOrders = async (orders: CreateOrderParams[]): Promise<BatchCreateResult> => {
  const res = await Network.request({
    url: '/api/express/batch',
    method: 'POST',
    data: { orders },
  })
  return res.data.data
}

/**
 * 格式化收件人地址
 */
export const formatAddress = (province: string, city: string, area: string, address: string): string => {
  return `${province}${city}${area}${address}`
}

/**
 * 选择收件地址（微信地址选择）
 */
export const chooseAddress = async (): Promise<Receiver | null> => {
  try {
    const res = await Taro.chooseAddress()
    return {
      name: res.userName,
      mobile: res.telNumber,
      province: res.provinceName,
      city: res.cityName,
      area: res.countyName,
      address: res.detailInfo,
    }
  } catch {
    return null
  }
}

/**
 * 预览面单图片
 */
export const previewWaybillImage = (imageUrl: string) => {
  Taro.previewImage({
    urls: [imageUrl],
    current: imageUrl,
  })
}
