"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const carts = new Map();
let CartService = class CartService {
    generateId() {
        return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    generateItemId() {
        return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    getCart(userId) {
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
    addItem(userId, productId, specId, quantity) {
        const cart = this.getCart(userId);
        const existingIndex = cart.items.findIndex((item) => item.productId === productId && item.specId === specId);
        if (existingIndex >= 0) {
            cart.items[existingIndex].quantity += quantity;
            cart.items[existingIndex].id = cart.items[existingIndex].id;
            return cart.items[existingIndex];
        }
        const newItem = {
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
    updateItemQuantity(userId, itemId, quantity) {
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
    removeItem(userId, itemId) {
        const cart = this.getCart(userId);
        const initialLength = cart.items.length;
        cart.items = cart.items.filter((item) => item.id !== itemId);
        cart.updatedAt = new Date();
        return cart.items.length < initialLength;
    }
    clearCart(userId) {
        const cart = this.getCart(userId);
        cart.items = [];
        cart.updatedAt = new Date();
    }
    getCartTotal(userId) {
        const cart = this.getCart(userId);
        const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        return { totalAmount, totalItems };
    }
    getProductName(productId) {
        const products = {
            '1': '大吉大梨 梨酒',
            '2': '似水榴年 金银花石榴酒',
            '3': '沂蒙山楂酒',
        };
        return products[productId] || '未知商品';
    }
    getSpecName(specId) {
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
    getProductPrice(productId) {
        const prices = {
            '1': 39.9,
            '2': 42.9,
            '3': 29.9,
        };
        return prices[productId] || 0;
    }
    getProductImage(productId) {
        const images = {
            '1': '/assets/products/djl.jpg',
            '2': '/assets/products/ssln.jpg',
            '3': '/assets/products/lms.jpg',
        };
        return images[productId] || '/assets/products/default.jpg';
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)()
], CartService);
//# sourceMappingURL=cart.service.js.map