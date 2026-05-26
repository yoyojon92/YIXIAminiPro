"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
let AuthService = class AuthService {
    constructor() {
        this.users = new Map();
    }
    async login(code, encryptedData, iv) {
        const openid = `mock_openid_${code}_${Date.now()}`;
        let user = Array.from(this.users.values()).find(u => u.openid === openid);
        if (!user) {
            user = {
                id: `user_${Date.now()}`,
                openid,
                phone: '',
                nickname: '新用户',
                avatar: '',
                role: 'student',
                ageVerified: false,
                createdAt: new Date().toISOString(),
            };
            this.users.set(openid, user);
        }
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
        return { user, token };
    }
    async getUserById(userId) {
        return Array.from(this.users.values()).find(u => u.id === userId);
    }
    async updateUser(userId, data) {
        const user = await this.getUserById(userId);
        if (user) {
            Object.assign(user, data);
            this.users.set(user.openid, user);
        }
        return user;
    }
    async verifyAge(userId, idCard) {
        const birthYear = parseInt(idCard.substring(6, 10));
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;
        return age >= 18;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map