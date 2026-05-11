import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // 提取用户ID（从 Authorization header）
  private extractUserId(authHeader: string): string {
    if (!authHeader) {
      return 'guest_' + Date.now();
    }
    // 格式: Bearer dXNlcl8xNzc4NDk1MTU0MzEwOjE3Nzg0OTUxNTQzMTA=
    try {
      const base64 = authHeader.split(' ')[1];
      const decoded = Buffer.from(base64, 'base64').toString('utf-8');
      // 返回 userId 部分
      const [userId] = decoded.split('_');
      return userId || 'guest';
    } catch {
      return 'guest';
    }
  }

  // 获取购物车
  @Get()
  getCart(@Headers('authorization') auth: string) {
    const userId = this.extractUserId(auth);
    const cart = this.cartService.getCart(userId);
    const totals = this.cartService.getCartTotal(userId);

    return {
      code: 200,
      msg: 'success',
      data: {
        items: cart.items,
        totalAmount: totals.totalAmount,
        totalItems: totals.totalItems,
      },
    };
  }

  // 添加商品到购物车
  @Post()
  @HttpCode(HttpStatus.OK)
  addToCart(
    @Headers('authorization') auth: string,
    @Body() body: { productId: string; specId: string; quantity: number },
  ) {
    const userId = this.extractUserId(auth);
    const { productId, specId, quantity } = body;

    if (!productId || !specId) {
      return {
        code: 400,
        msg: '缺少必要参数',
        data: null,
      };
    }

    const item = this.cartService.addItem(userId, productId, specId, quantity || 1);
    const totals = this.cartService.getCartTotal(userId);

    return {
      code: 200,
      msg: '添加成功',
      data: {
        item,
        totalAmount: totals.totalAmount,
        totalItems: totals.totalItems,
      },
    };
  }

  // 更新商品数量
  @Put(':itemId')
  updateQuantity(
    @Headers('authorization') auth: string,
    @Param('itemId') itemId: string,
    @Body() body: { quantity: number },
  ) {
    const userId = this.extractUserId(auth);
    const { quantity } = body;

    const item = this.cartService.updateItemQuantity(userId, itemId, quantity);
    const totals = this.cartService.getCartTotal(userId);

    return {
      code: 200,
      msg: quantity <= 0 ? '商品已从购物车移除' : '更新成功',
      data: {
        item,
        totalAmount: totals.totalAmount,
        totalItems: totals.totalItems,
      },
    };
  }

  // 删除购物车商品
  @Delete(':itemId')
  removeItem(
    @Headers('authorization') auth: string,
    @Param('itemId') itemId: string,
  ) {
    const userId = this.extractUserId(auth);
    const success = this.cartService.removeItem(userId, itemId);
    const totals = this.cartService.getCartTotal(userId);

    return {
      code: 200,
      msg: success ? '删除成功' : '商品不存在',
      data: {
        totalAmount: totals.totalAmount,
        totalItems: totals.totalItems,
      },
    };
  }

  // 清空购物车
  @Delete()
  clearCart(@Headers('authorization') auth: string) {
    const userId = this.extractUserId(auth);
    this.cartService.clearCart(userId);

    return {
      code: 200,
      msg: '购物车已清空',
      data: {
        totalAmount: 0,
        totalItems: 0,
      },
    };
  }
}
