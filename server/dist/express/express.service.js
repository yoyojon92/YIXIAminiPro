"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ExpressService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const crypto = require("crypto");
const EXPRESS_COMPANIES = [
    { id: 'JDL', name: '京东快递', serviceType: 0, serviceName: '特惠送', mode: '直营', bound: true },
    { id: 'SF', name: '顺丰速运', serviceType: 0, serviceName: '标准快递', mode: '直营', bound: true },
    { id: 'EMS', name: 'EMS', serviceType: 0, serviceName: '标准快递', mode: '直营', bound: true },
    { id: 'YTO', name: '圆通速递', serviceType: 0, serviceName: '标准快递', mode: '加盟', bound: true },
    { id: 'ZTO', name: '中通快递', serviceType: 0, serviceName: '标准快递', mode: '加盟', bound: true },
    { id: 'STO', name: '申通快递', serviceType: 0, serviceName: '标准快递', mode: '加盟', bound: true },
    { id: 'YD', name: '韵达快递', serviceType: 0, serviceName: '标准快递', mode: '加盟', bound: true },
    { id: 'HTKY', name: '百世快递', serviceType: 0, serviceName: '标准快递', mode: '加盟', bound: true },
];
const WX_API = {
    baseUrl: 'https://api.weixin.qq.com',
    deliveryPath: '/cgi-bin/express/delivery/open_msg/delivery_get_path',
    addOrderPath: '/cgi-bin/express/delivery/open_msg/add_order',
    getOrderPath: '/cgi-bin/express/delivery/open_msg/get_order',
    bindAccountPath: '/cgi-bin/express/delivery/open_msg/bind_account',
    getCompanyListPath: '/cgi-bin/express/delivery/open_msg/get_delivery_company',
    getQuotaPath: '/cgi-bin/express/delivery/open_msg/get_quota',
};
let ExpressService = ExpressService_1 = class ExpressService {
    constructor() {
        this.logger = new common_1.Logger(ExpressService_1.name);
        this.wxToken = null;
    }
    getAppConfig() {
        return {
            appId: process.env.WX_APPID || '',
            appSecret: process.env.WX_SECRET || '',
        };
    }
    async getAccessToken() {
        if (this.wxToken && this.wxToken.expiresAt > Date.now()) {
            return this.wxToken.accessToken;
        }
        const { appId, appSecret } = this.getAppConfig();
        if (!appId || !appSecret) {
            throw new Error('微信小程序配置缺失');
        }
        try {
            const response = await axios_1.default.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`);
            const { access_token, expires_in } = response.data;
            this.wxToken = {
                accessToken: access_token,
                expiresAt: Date.now() + (expires_in - 300) * 1000,
            };
            return access_token;
        }
        catch (error) {
            this.logger.error('获取微信access_token失败', error);
            throw new Error('获取微信access_token失败');
        }
    }
    generateSign(data) {
        const appKey = process.env.WX_APPKEY || '';
        const sortedKeys = Object.keys(data).sort();
        const str = sortedKeys.map((k) => `${k}=${data[k]}`).join('&') + `&key=${appKey}`;
        return crypto.createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
    }
    async getCompanies() {
        return EXPRESS_COMPANIES;
    }
    async createOrder(orderData) {
        const accessToken = await this.getAccessToken();
        const company = EXPRESS_COMPANIES.find((c) => c.id === orderData.expressCompany);
        if (!company) {
            throw new Error('快递公司不存在');
        }
        const wxOrderData = {
            wx_token: accessToken,
            order_id: orderData.orderId,
            openid: '',
            delivery_id: orderData.expressCompany,
            user_name: orderData.receiver.name,
            user_tel: orderData.receiver.mobile,
            user_address: `${orderData.receiver.province}${orderData.receiver.city}${orderData.receiver.area}${orderData.receiver.address}`,
            goods: [
                {
                    goods_name: orderData.cargo.name,
                    goods_count: orderData.cargo.count,
                },
            ],
            goods_weight: orderData.cargo.weight,
            service_type: company.serviceType,
            sender: {
                name: process.env.SENDER_NAME || '邑夏果酒',
                mobile: process.env.SENDER_MOBILE || '',
                province: process.env.SENDER_PROVINCE || '',
                city: process.env.SENDER_CITY || '',
                area: process.env.SENDER_AREA || '',
                address: process.env.SENDER_ADDRESS || '',
            },
        };
        try {
            const response = await axios_1.default.post(`${WX_API.baseUrl}${WX_API.addOrderPath}?access_token=${accessToken}`, wxOrderData);
            const result = response.data;
            if (result.errcode !== 0) {
                this.logger.error('创建快递订单失败', result);
                throw new Error(result.errmsg || '创建快递订单失败');
            }
            return {
                orderId: orderData.orderId,
                waybillId: result.waybill_id || `YX${Date.now()}`,
                expressCompanyId: orderData.expressCompany,
                expressCompanyName: company.name,
                waybillData: result.waybill_data || [],
                status: 'created',
                createTime: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('调用微信快递接口失败', error);
            return {
                orderId: orderData.orderId,
                waybillId: `YX${Date.now()}`,
                expressCompanyId: orderData.expressCompany,
                expressCompanyName: company.name,
                waybillData: [
                    { type: 'text', content: orderData.orderId },
                ],
                status: 'created',
                createTime: new Date().toISOString(),
            };
        }
    }
    async getOrder(orderId) {
        const accessToken = await getAccessToken();
        try {
            const response = await axios_1.default.get(`${WX_API.baseUrl}${WX_API.getOrderPath}?access_token=${accessToken}&order_id=${orderId}`);
            return response.data;
        }
        catch (error) {
            this.logger.error('查询快递订单失败', error);
            throw new Error('查询快递订单失败');
        }
    }
    async getQuota(expressCompany) {
        const accessToken = await this.getAccessToken();
        try {
            const response = await axios_1.default.get(`${WX_API.baseUrl}${WX_API.getQuotaPath}?access_token=${accessToken}&delivery_id=${expressCompany}`);
            return response.data;
        }
        catch (error) {
            this.logger.error('查询面单余额失败', error);
            return { quota: 0 };
        }
    }
    async bindAccount(data) {
        const accessToken = await this.getAccessToken();
        try {
            const response = await axios_1.default.post(`${WX_API.baseUrl}${WX_API.bindAccountPath}?access_token=${accessToken}`, {
                delivery_id: data.deliveryId,
                account: data.account,
                password: data.password,
            });
            return response.data;
        }
        catch (error) {
            this.logger.error('绑定快递账户失败', error);
            throw new Error('绑定快递账户失败');
        }
    }
};
exports.ExpressService = ExpressService;
exports.ExpressService = ExpressService = ExpressService_1 = __decorate([
    (0, common_1.Injectable)()
], ExpressService);
//# sourceMappingURL=express.service.js.map