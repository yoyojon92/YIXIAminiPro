"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    extractUserId(authHeader) {
        if (!authHeader) {
            return 'guest_' + Date.now();
        }
        try {
            const base64 = authHeader.split(' ')[1];
            const decoded = Buffer.from(base64, 'base64').toString('utf-8');
            const [userId] = decoded.split('_');
            return userId || 'guest';
        }
        catch {
            return 'guest';
        }
    }
    getCart(auth) {
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
    addToCart(auth, body) {
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
    updateQuantity(auth, itemId, body) {
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
    removeItem(auth, itemId) {
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
    clearCart(auth) {
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
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addToCart", null);
__decorate([
    (0, common_1.Put)(':itemId'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateQuantity", null);
__decorate([
    (0, common_1.Delete)(':itemId'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map