/**
 * 邑夏小程序 · 快递接口控制器
 */
import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { ExpressService } from './express.service'

@Controller('express')
export class ExpressController {
  constructor(private readonly expressService: ExpressService) {}

  /**
   * 获取快递公司列表
   */
  @Get('companies')
  async getCompanies() {
    const companies = await this.expressService.getCompanies()
    return {
      code: 0,
      msg: 'success',
      data: companies,
    }
  }

  /**
   * 创建快递订单
   */
  @Post('order')
  async createOrder(
    @Body()
    body: {
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
    },
  ) {
    const result = await this.expressService.createOrder(body)
    return {
      code: 0,
      msg: 'success',
      data: result,
    }
  }

  /**
   * 查询快递订单
   */
  @Get('order')
  async getOrder(@Query('orderId') orderId: string) {
    const result = await this.expressService.getOrder(orderId)
    return {
      code: 0,
      msg: 'success',
      data: result,
    }
  }

  /**
   * 查询电子面单余额
   */
  @Get('quota')
  async getQuota(@Query('expressCompany') expressCompany: string) {
    const result = await this.expressService.getQuota(expressCompany)
    return {
      code: 0,
      msg: 'success',
      data: result,
    }
  }

  /**
   * 绑定快递账户
   */
  @Post('bind')
  async bindAccount(
    @Body() body: { deliveryId: string; account: string; password: string },
  ) {
    const result = await this.expressService.bindAccount(body)
    return {
      code: 0,
      msg: 'success',
      data: result,
    }
  }
}
