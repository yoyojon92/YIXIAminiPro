"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
let OrdersService = class OrdersService {
    constructor() {
        this.orders = new Map();
    }
    async create(userId, data) {
        const order = {
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
        };
        this.orders.set(order.id, order);
        return order;
    }
    async findByUser(userId) {
        return Array.from(this.orders.values())
            .filter(o => o.userId === userId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async findOne(id) {
        return this.orders.get(id);
    }
    async updateStatus(id, status) {
        const order = this.orders.get(id);
        if (order) {
            order.status = status;
            if (status === 'paid')
                order.paidAt = new Date().toISOString();
            if (status === 'shipped')
                order.shippedAt = new Date().toISOString();
            if (status === 'delivered')
                order.deliveredAt = new Date().toISOString();
            this.orders.set(id, order);
        }
        return order;
    }
    async cancel(id) {
        return this.updateStatus(id, 'cancelled');
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)()
], OrdersService);
//# sourceMappingURL=orders.service.js.map