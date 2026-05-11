import { Controller, Get, Post, Put, Body, Param, Headers, Query } from '@nestjs/common'
import { OrdersService, OrderItem } from './orders.service'

class CreateOrderDto {
  items: OrderItem[]
  totalAmount: number
  deliveryType: 'dormitory' | 'pickup'
  address?: { dormitory: string; roomNumber: string }
  pickupShop?: { id: string; name: string; address: string }
  remark?: string
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  private getUserId(auth: string): string {
    if (!auth) return 'guest'
    try {
      return Buffer.from(auth.replace('Bearer ', ''), 'base64').toString().split(':')[0]
    } catch {
      return 'guest'
    }
  }

  @Get()
  async findAll(
    @Headers('Authorization') auth: string,
    @Query('status') status?: string,
  ) {
    const userId = this.getUserId(auth)
    let orders = await this.ordersService.findByUser(userId)
    if (status) {
      orders = orders.filter(o => o.status === status)
    }
    return {
      code: 200,
      msg: 'success',
      data: orders,
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findOne(id)
    return {
      code: order ? 200 : 404,
      msg: order ? 'success' : '订单不存在',
      data: order,
    }
  }

  @Post()
  async create(
    @Headers('Authorization') auth: string,
    @Body() body: CreateOrderDto,
  ) {
    const userId = this.getUserId(auth)
    const order = await this.ordersService.create(userId, body)
    return {
      code: 200,
      msg: 'success',
      data: order,
    }
  }

  @Put(':id/pay')
  async pay(@Param('id') id: string) {
    const order = await this.ordersService.updateStatus(id, 'paid')
    return {
      code: order ? 200 : 404,
      msg: order ? '支付成功' : '订单不存在',
      data: order,
    }
  }

  @Put(':id/cancel')
  async cancel(@Param('id') id: string) {
    const order = await this.ordersService.cancel(id)
    return {
      code: order ? 200 : 404,
      msg: order ? '取消成功' : '订单不存在',
      data: order,
    }
  }
}
