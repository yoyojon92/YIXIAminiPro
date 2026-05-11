/**
 * 邑夏小程序 - API 服务层
 * 封装所有后端接口调用
 */
import { Network } from '@/network'
import Taro from '@tarojs/taro'

// ============ 类型定义 ============
export interface Product {
  id: number
  name: string
  nameEn?: string
  price: number
  originalPrice: number
  alcohol: string
  capacity: string
  category: 'pear' | 'pomegranate' | 'hawthorn' | 'gift'
  tags: string[]
  images: {
    main: string
    label: string
    detail: string
  }
  sprite: Sprite
  isAgentProduct?: boolean
  agentCompany?: string
}

export interface Sprite {
  id: string
  name: string
  emoji: string
  rarity: 'N' | 'R' | 'SR' | 'SSR' | 'UR'
  story: string
}

export interface Order {
  id: string
  orderNo: string
  productId: number
  productName: string
  price: number
  quantity: number
  totalAmount: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
  deliveryType: 'dormitory' | 'pickup'
  address?: {
    dormitory: string
    room: string
  }
  pickupShop?: {
    name: string
    address: string
  }
}

export interface UserInfo {
  id: string
  nickname: string
  avatar: string
  phone: string
  school: string
  ageVerified: boolean
  role: 'user' | 'agent' | 'distributor' | 'admin'
}

// ============ 响应类型 ============
interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

// ============ Auth API ============
export const AuthAPI = {
  /**
   * 微信登录
   * @param code 微信授权码
   */
  login: async (code: string): Promise<{ token: string; userInfo: UserInfo }> => {
    const res = await Network.request({
      url: '/api/auth/login',
      method: 'POST',
      data: { code }
    })
    console.log('登录响应:', res.data)
    const result = res.data as ApiResponse<{ token: string; userInfo: UserInfo }>
    if (result.code !== 200) {
      throw new Error(result.msg || '登录失败')
    }
    // 保存 token
    Taro.setStorageSync('token', result.data.token)
    Taro.setStorageSync('userInfo', result.data.userInfo)
    return result.data
  },

  /**
   * 获取当前用户信息
   */
  getUserInfo: async (): Promise<UserInfo> => {
    const res = await Network.request({
      url: '/api/auth/userinfo'
    })
    const result = res.data as ApiResponse<UserInfo>
    return result.data
  },

  /**
   * 年龄验证
   */
  verifyAge: async (idCard: string): Promise<boolean> => {
    const res = await Network.request({
      url: '/api/auth/verify-age',
      method: 'POST',
      data: { idCard }
    })
    const result = res.data as ApiResponse<{ success: boolean }>
    return result.data.success
  },

  /**
   * 退出登录
   */
  logout: () => {
    Taro.removeStorageSync('token')
    Taro.removeStorageSync('userInfo')
  }
}

// ============ Products API ============
export const ProductsAPI = {
  /**
   * 获取产品列表
   * @param category 可选，按分类筛选
   */
  getList: async (category?: string): Promise<Product[]> => {
    const res = await Network.request({
      url: '/api/products',
      data: category ? { category } : undefined
    })
    console.log('产品列表响应:', res.data)
    const result = res.data as ApiResponse<Product[]>
    return result.data || []
  },

  /**
   * 获取产品详情
   * @param id 产品ID
   */
  getDetail: async (id: number): Promise<Product> => {
    const res = await Network.request({
      url: `/api/products/${id}`
    })
    console.log('产品详情响应:', res.data)
    const result = res.data as ApiResponse<Product>
    return result.data
  }
}

// ============ Orders API ============
export const OrdersAPI = {
  /**
   * 创建订单
   */
  create: async (data: {
    productId: number
    quantity: number
    deliveryType: 'dormitory' | 'pickup'
    address?: { dormitory: string; room: string }
    pickupShopId?: string
  }): Promise<Order> => {
    const res = await Network.request({
      url: '/api/orders',
      method: 'POST',
      data
    })
    console.log('创建订单响应:', res.data)
    const result = res.data as ApiResponse<Order>
    return result.data
  },

  /**
   * 获取订单列表
   * @param status 可选，按状态筛选
   */
  getList: async (status?: string): Promise<Order[]> => {
    const res = await Network.request({
      url: '/api/orders',
      data: status ? { status } : undefined
    })
    console.log('订单列表响应:', res.data)
    const result = res.data as ApiResponse<Order[]>
    return result.data || []
  },

  /**
   * 获取订单详情
   * @param id 订单ID
   */
  getDetail: async (id: string): Promise<Order> => {
    const res = await Network.request({
      url: `/api/orders/${id}`
    })
    const result = res.data as ApiResponse<Order>
    return result.data
  },

  /**
   * 取消订单
   * @param id 订单ID
   */
  cancel: async (id: string): Promise<void> => {
    const res = await Network.request({
      url: `/api/orders/${id}/cancel`,
      method: 'POST'
    })
    console.log('取消订单响应:', res.data)
  }
}

// ============ Cart API ============
export interface CartItem {
  productId: number
  productName: string
  price: number
  quantity: number
  capacity: string
  image: string
  sprite?: {
    name: string
    emoji: string
  }
}

export const CartAPI = {
  /**
   * 获取购物车列表
   */
  getList: async (): Promise<CartItem[]> => {
    const res = await Network.request({
      url: '/api/cart'
    })
    console.log('购物车响应:', res.data)
    const result = res.data as ApiResponse<CartItem[]>
    return result.data || []
  },

  /**
   * 添加商品到购物车
   */
  addItem: async (data: {
    productId: number
    quantity: number
    capacity?: string
  }): Promise<CartItem[]> => {
    const res = await Network.request({
      url: '/api/cart',
      method: 'POST',
      data
    })
    console.log('添加购物车响应:', res.data)
    const result = res.data as ApiResponse<CartItem[]>
    return result.data || []
  },

  /**
   * 更新购物车商品数量
   */
  updateQuantity: async (productId: number, quantity: number): Promise<CartItem[]> => {
    const res = await Network.request({
      url: `/api/cart/${productId}`,
      method: 'PUT',
      data: { quantity }
    })
    console.log('更新数量响应:', res.data)
    const result = res.data as ApiResponse<CartItem[]>
    return result.data || []
  },

  /**
   * 删除购物车商品
   */
  removeItem: async (productId: number): Promise<CartItem[]> => {
    const res = await Network.request({
      url: `/api/cart/${productId}`,
      method: 'DELETE'
    })
    console.log('删除商品响应:', res.data)
    const result = res.data as ApiResponse<CartItem[]>
    return result.data || []
  },

  /**
   * 清空购物车
   */
  clear: async (): Promise<void> => {
    const res = await Network.request({
      url: '/api/cart/clear',
      method: 'POST'
    })
    console.log('清空购物车响应:', res.data)
  }
}
