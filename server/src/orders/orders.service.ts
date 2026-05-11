import { Injectable } from '@nestjs/common'

export interface OrderItem {
  productId: string
  productName: string
  image: string
  specId: string
  specName: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  orderNo: string
  userId: string
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled'
  deliveryType: 'dormitory' | 'pickup'
  address?: {
    dormitory: string
    roomNumber: string
  }
  pickupShop?: {
    id: string
    name: string
    address: string
  }
  remark?: string
  createdAt: string
  paidAt?: string
  shippedAt?: string
  deliveredAt?: string
}

@Injectable()
export class OrdersService {
  private orders: Map<string, Order> = new Map()

  async create(userId: string, data: {
    items: OrderItem[]
    totalAmount: number
    deliveryType: 'dormitory' | 'pickup'
    address?: { dormitory: string; roomNumber: string }
    pickupShop?: { id: string; name: string; address: string }
    remark?: string
  }): Promise<Order> {
    const order: Order = {
      id: `order_${Date.now()}`,
      orderNo: `YX${Date.now()}`,
      userId,
      items: data.items,
      totalAmount: data.totalAmount,
      status: 'pending',
      deliveryType: data.deliveryType,
      address: data.address,
      pickupShop: data.pickupShop,
      remark: data.remark,
      createdAt: new Date().toISOString(),
    }
    this.orders.set(order.id, order)
    return order
  }

  async findByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(o => o.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async findOne(id: string): Promise<Order | undefined> {
    return this.orders.get(id)
  }

  async updateStatus(id: string, status: Order['status']): Promise<Order | undefined> {
    const order = this.orders.get(id)
    if (order) {
      order.status = status
      if (status === 'paid') order.paidAt = new Date().toISOString()
      if (status === 'shipped') order.shippedAt = new Date().toISOString()
      if (status === 'delivered') order.deliveredAt = new Date().toISOString()
      this.orders.set(id, order)
    }
    return order
  }

  async cancel(id: string): Promise<Order | undefined> {
    return this.updateStatus(id, 'cancelled')
  }
}
