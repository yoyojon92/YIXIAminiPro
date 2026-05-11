import { Injectable } from '@nestjs/common';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  specId: string;
  specName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: Date;
}

// 内存存储（生产环境应使用数据库）
const carts: Map<string, Cart> = new Map();

@Injectable()
export class CartService {
  private generateId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateItemId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getCart(userId: string): Cart {
    let cart = carts.get(userId);
    if (!cart) {
      cart = {
        userId,
        items: [],
        updatedAt: new Date(),
      };
      carts.set(userId, cart);
    }
    return cart;
  }

  addItem(
    userId: string,
    productId: string,
    specId: string,
    quantity: number,
  ): CartItem {
    const cart = this.getCart(userId);

    // 检查是否已存在该商品
    const existingIndex = cart.items.findIndex(
      (item) => item.productId === productId && item.specId === specId,
    );

    if (existingIndex >= 0) {
      // 更新数量
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].id = cart.items[existingIndex].id;
      return cart.items[existingIndex];
    }

    // 新增商品（使用模拟数据）
    const newItem: CartItem = {
      id: this.generateItemId(),
      productId,
      productName: this.getProductName(productId),
      specId,
      specName: this.getSpecName(specId),
      price: this.getProductPrice(productId),
      quantity,
      image: this.getProductImage(productId),
    };

    cart.items.push(newItem);
    cart.updatedAt = new Date();

    return newItem;
  }

  updateItemQuantity(userId: string, itemId: string, quantity: number): CartItem | null {
    const cart = this.getCart(userId);
    const itemIndex = cart.items.findIndex((item) => item.id === itemId);

    if (itemIndex < 0) {
      return null;
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
      return null;
    }

    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = new Date();

    return cart.items[itemIndex];
  }

  removeItem(userId: string, itemId: string): boolean {
    const cart = this.getCart(userId);
    const initialLength = cart.items.length;

    cart.items = cart.items.filter((item) => item.id !== itemId);
    cart.updatedAt = new Date();

    return cart.items.length < initialLength;
  }

  clearCart(userId: string): void {
    const cart = this.getCart(userId);
    cart.items = [];
    cart.updatedAt = new Date();
  }

  getCartTotal(userId: string): { totalAmount: number; totalItems: number } {
    const cart = this.getCart(userId);
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return { totalAmount, totalItems };
  }

  // 根据商品ID获取商品信息
  private getProductName(productId: string): string {
    const products: Record<string, string> = {
      '1': '大吉大梨 梨酒',
      '2': '似水榴年 金银花石榴酒',
      '3': '沂蒙山楂酒',
    };
    return products[productId] || '未知商品';
  }

  private getSpecName(specId: string): string {
    if (specId.startsWith('s1-')) {
      return '330ml';
    }
    if (specId.startsWith('s2-')) {
      return '500ml';
    }
    if (specId.startsWith('gift-')) {
      return '礼盒装';
    }
    return specId;
  }

  private getProductPrice(productId: string): number {
    const prices: Record<string, number> = {
      '1': 39.9,
      '2': 42.9,
      '3': 29.9,
    };
    return prices[productId] || 0;
  }

  private getProductImage(productId: string): string {
    const images: Record<string, string> = {
      '1': '/assets/products/djl.jpg',
      '2': '/assets/products/ssln.jpg',
      '3': '/assets/products/lms.jpg',
    };
    return images[productId] || '/assets/products/default.jpg';
  }
}
