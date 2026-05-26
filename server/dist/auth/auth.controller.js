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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
class LoginDto {
}
class UpdateUserDto {
}
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(body) {
        const result = await this.authService.login(body.code, body.encryptedData, body.iv);
        if (!result) {
            return {
                code: 401,
                msg: '登录失败',
                data: null,
            };
        }
        return {
            code: 200,
            msg: 'success',
            data: result,
        };
    }
    async getUser(auth) {
        if (!auth) {
            return {
                code: 401,
                msg: '未登录',
                data: null,
            };
        }
        const userId = Buffer.from(auth.replace('Bearer ', ''), 'base64').toString().split(':')[0];
        const user = await this.authService.getUserById(userId);
        return {
            code: 200,
            msg: 'success',
            data: user,
        };
    }
    async updateUser(auth, body) {
        const userId = Buffer.from(auth.replace('Bearer ', ''), 'base64').toString().split(':')[0];
        const user = await this.authService.updateUser(userId, body);
        return {
            code: 200,
            msg: 'success',
            data: user,
        };
    }
    async verifyAge(auth, body) {
        const userId = Buffer.from(auth.replace('Bearer ', ''), 'base64').toString().split(':')[0];
        const success = await this.authService.verifyAge(userId, body.idCard);
        if (success) {
            await this.authService.updateUser(userId, { ageVerified: true });
        }
        return {
            code: success ? 200 : 400,
            msg: success ? '验证通过' : '未满18岁，无法购买果酒',
            data: { success },
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('user'),
    __param(0, (0, common_1.Headers)('Authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getUser", null);
__decorate([
    (0, common_1.Put)('user'),
    __param(0, (0, common_1.Headers)('Authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)('verify-age'),
    __param(0, (0, common_1.Headers)('Authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyAge", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map