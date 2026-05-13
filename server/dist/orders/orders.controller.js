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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
class CreateOrderDto {
}
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    getUserId(auth) {
        if (!auth)
            return 'guest';
        try {
            return Buffer.from(auth.replace('Bearer ', ''), 'base64').toString().split(':')[0];
        }
        catch {
            return 'guest';
        }
    }
    async findAll(auth, status) {
        const userId = this.getUserId(auth);
        let orders = await this.ordersService.findByUser(userId);
        if (status) {
            orders = orders.filter(o => o.status === status);
        }
        return {
            code: 200,
            msg: 'success',
            data: orders,
        };
    }
    async findOne(id) {
        const order = await this.ordersService.findOne(id);
        return {
            code: order ? 200 : 404,
            msg: order ? 'success' : '订单不存在',
            data: order,
        };
    }
    async create(auth, body) {
        const userId = this.getUserId(auth);
        const order = await this.ordersService.create(userId, body);
        return {
            code: 200,
            msg: 'success',
            data: order,
        };
    }
    async pay(id) {
        const order = await this.ordersService.updateStatus(id, 'paid');
        return {
            code: order ? 200 : 404,
            msg: order ? '支付成功' : '订单不存在',
            data: order,
        };
    }
    async cancel(id) {
        const order = await this.ordersService.cancel(id);
        return {
            code: order ? 200 : 404,
            msg: order ? '取消成功' : '订单不存在',
            data: order,
        };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('Authorization')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('Authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id/pay'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "pay", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cancel", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map