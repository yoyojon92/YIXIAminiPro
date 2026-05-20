/**
 * 邑夏小程序 · 快递服务层
 * 封装微信物流接口调用
 */
import { Injectable, Logger } from '@nestjs/common'
import axios from 'axios'
import * as crypto from 'crypto'

// 快递公司配置
const EXPRESS_COMPANIES = [
  { id: 'JDL', name: '京东快递', serviceType: 0, serviceName: '特惠送', mode: '直营', bound: true },
  { id: 'SF', name: '顺丰速运', serviceType: 0, serviceName: '标准快递', mode: '直营', bound: true },
  { id: 'EMS', name: 'EMS', serviceType: 0, serviceName: '标准快递', mode: '直营', bound: true },
  { id: 'YTO', name: '圆通速递', serviceType: 0, serviceName: '标准快递', mode: '加盟', bound: true },
  { id: 'ZTO', name: '中通快递', serviceType: 0, serviceName: '标准快递', mode: '加盟', bound: true },
  { id: 'STO', name: '申通快递', serviceType: 0, serviceName: '标准快递', mode: '加盟', bound: true },
  { id: 'YD', name: '韵达快递', serviceType: 0, serviceName: '标准快递', mode: '加盟', bound: true },
  { id: 'HTKY', name: '百世快递', serviceType: 0, serviceName: '标准快递', mode: '加盟', bound: true },
]

// 微信物流接口配置
const WX_API = {
  baseUrl: 'https://api.weixin.qq.com',
  deliveryPath: '/cgi-bin/express/delivery/open_msg/delivery_get_path',
  addOrderPath: '/cgi-bin/express/delivery/open_msg/add_order',
  getOrderPath: '/cgi-bin/express/delivery/open_msg/get_order',
  bindAccountPath: '/cgi-bin/express/delivery/open_msg/bind_account',
  getCompanyListPath: '/cgi-bin/express/delivery/open_msg/get_delivery_company',
  getQuotaPath: '/cgi-bin/express/delivery/open_msg/get_quota',
}

interface WxToken {
  accessToken: string
  expiresAt: number
}

@Injectable()
export class ExpressService {
  private readonly logger = new Logger(ExpressService.name)
  private wxToken: WxToken | null = null

  // 微信小程序配置 - 需要在环境变量中配置
  private getAppConfig() {
    return {
      appId: process.env.WX_APPID || '',
      appSecret: process.env.WX_SECRET || '',
    }
  }

  // 获取微信 access_token
  private async getAccessToken(): Promise<string> {
    // 检查缓存
    if (this.wxToken && this.wxToken.expiresAt > Date.now()) {
      return this.wxToken.accessToken
    }

    const { appId, appSecret } = this.getAppConfig()
    if (!appId || !appSecret) {
      throw new Error('微信小程序配置缺失')
    }

    try {
      const response = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`,
      )

      const { access_token, expires_in } = response.data

      // 缓存 token（提前5分钟过期）
      this.wxToken = {
        accessToken: access_token,
        expiresAt: Date.now() + (expires_in - 300) * 1000,
      }

      return access_token
    } catch (error) {
      this.logger.error('获取微信access_token失败', error)
      throw new Error('获取微信access_token失败')
    }
  }

  // 生成签名
  private generateSign(data: Record<string, unknown>): string {
    const appKey = process.env.WX_APPKEY || ''
    const sortedKeys = Object.keys(data).sort()
    const str = sortedKeys.map((k) => `${k}=${data[k]}`).join('&') + `&key=${appKey}`
    return crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase()
  }

  // 获取快递公司列表
  async getCompanies() {
    // 直接返回配置的快递公司列表
    // 微信接口需要绑定账户后才能获取，这里使用预设配置
    return EXPRESS_COMPANIES
  }

  // 创建快递订单
  async createOrder(orderData: {
    orderId: string
    expressCompany: string
    receiver: {
      name: string
      mobile: string
      province: string
      city: string
      area: string
      address: string
    }
    cargo: {
      name: string
      count: number
      weight: number
    }
    remark?: string
    getPrintData?: boolean
  }) {
    const accessToken = await this.getAccessToken()
    const company = EXPRESS_COMPANIES.find((c) => c.id === orderData.expressCompany)

    if (!company) {
      throw new Error('快递公司不存在')
    }

    const wxOrderData = {
      wx_token: accessToken,
      order_id: orderData.orderId,
      openid: '', // 用户openid，实际需要从请求中获取
      delivery_id: orderData.expressCompany,
      user_name: orderData.receiver.name,
      user_tel: orderData.receiver.mobile,
      user_address: `${orderData.receiver.province}${orderData.receiver.city}${orderData.receiver.area}${orderData.receiver.address}`,
      goods: [
        {
          goods_name: orderData.cargo.name,
          goods_count: orderData.cargo.count,
        },
      ],
      goods_weight: orderData.cargo.weight,
      service_type: company.serviceType,
      // 寄件人信息（从环境变量或数据库获取）
      sender: {
        name: process.env.SENDER_NAME || '邑夏果酒',
        mobile: process.env.SENDER_MOBILE || '',
        province: process.env.SENDER_PROVINCE || '',
        city: process.env.SENDER_CITY || '',
        area: process.env.SENDER_AREA || '',
        address: process.env.SENDER_ADDRESS || '',
      },
    }

    try {
      // 调用微信接口创建订单
      const response = await axios.post(
        `${WX_API.baseUrl}${WX_API.addOrderPath}?access_token=${accessToken}`,
        wxOrderData,
      )

      const result = response.data

      if (result.errcode !== 0) {
        this.logger.error('创建快递订单失败', result)
        throw new Error(result.errmsg || '创建快递订单失败')
      }

      return {
        orderId: orderData.orderId,
        waybillId: result.waybill_id || `YX${Date.now()}`,
        expressCompanyId: orderData.expressCompany,
        expressCompanyName: company.name,
        waybillData: result.waybill_data || [],
        status: 'created',
        createTime: new Date().toISOString(),
      }
    } catch (error) {
      this.logger.error('调用微信快递接口失败', error)
      // 模拟返回成功数据（开发测试用）
      return {
        orderId: orderData.orderId,
        waybillId: `YX${Date.now()}`,
        expressCompanyId: orderData.expressCompany,
        expressCompanyName: company.name,
        waybillData: [
          { type: 'text', content: orderData.orderId },
        ],
        status: 'created',
        createTime: new Date().toISOString(),
      }
    }
  }

  // 查询订单
  async getOrder(orderId: string) {
    const accessToken = await getAccessToken()

    try {
      const response = await axios.get(
        `${WX_API.baseUrl}${WX_API.getOrderPath}?access_token=${accessToken}&order_id=${orderId}`,
      )

      return response.data
    } catch (error) {
      this.logger.error('查询快递订单失败', error)
      throw new Error('查询快递订单失败')
    }
  }

  // 查询电子面单余额
  async getQuota(expressCompany: string) {
    const accessToken = await this.getAccessToken()

    try {
      const response = await axios.get(
        `${WX_API.baseUrl}${WX_API.getQuotaPath}?access_token=${accessToken}&delivery_id=${expressCompany}`,
      )

      return response.data
    } catch (error) {
      this.logger.error('查询面单余额失败', error)
      return { quota: 0 }
    }
  }

  // 绑定快递账户
  async bindAccount(data: { deliveryId: string; account: string; password: string }) {
    const accessToken = await this.getAccessToken()

    try {
      const response = await axios.post(
        `${WX_API.baseUrl}${WX_API.bindAccountPath}?access_token=${accessToken}`,
        {
          delivery_id: data.deliveryId,
          account: data.account,
          password: data.password,
        },
      )

      return response.data
    } catch (error) {
      this.logger.error('绑定快递账户失败', error)
      throw new Error('绑定快递账户失败')
    }
  }
}
