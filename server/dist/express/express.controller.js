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
exports.ExpressController = void 0;
const common_1 = require("@nestjs/common");
const express_service_1 = require("./express.service");
let ExpressController = class ExpressController {
    constructor(expressService) {
        this.expressService = expressService;
    }
    async getCompanies() {
        const companies = await this.expressService.getCompanies();
        return {
            code: 0,
            msg: 'success',
            data: companies,
        };
    }
    async createOrder(body) {
        const result = await this.expressService.createOrder(body);
        return {
            code: 0,
            msg: 'success',
            data: result,
        };
    }
    async getOrder(orderId) {
        const result = await this.expressService.getOrder(orderId);
        return {
            code: 0,
            msg: 'success',
            data: result,
        };
    }
    async getQuota(expressCompany) {
        const result = await this.expressService.getQuota(expressCompany);
        return {
            code: 0,
            msg: 'success',
            data: result,
        };
    }
    async bindAccount(body) {
        const result = await this.expressService.bindAccount(body);
        return {
            code: 0,
            msg: 'success',
            data: result,
        };
    }
};
exports.ExpressController = ExpressController;
__decorate([
    (0, common_1.Get)('companies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ExpressController.prototype, "getCompanies", null);
__decorate([
    (0, common_1.Post)('order'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpressController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('order'),
    __param(0, (0, common_1.Query)('orderId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpressController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Get)('quota'),
    __param(0, (0, common_1.Query)('expressCompany')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExpressController.prototype, "getQuota", null);
__decorate([
    (0, common_1.Post)('bind'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExpressController.prototype, "bindAccount", null);
exports.ExpressController = ExpressController = __decorate([
    (0, common_1.Controller)('express'),
    __metadata("design:paramtypes", [express_service_1.ExpressService])
], ExpressController);
//# sourceMappingURL=express.controller.js.map