export declare class ExpressService {
    private readonly logger;
    private wxToken;
    private getAppConfig;
    private getAccessToken;
    private generateSign;
    getCompanies(): Promise<{
        id: string;
        name: string;
        serviceType: number;
        serviceName: string;
        mode: string;
        bound: boolean;
    }[]>;
    createOrder(orderData: {
        orderId: string;
        expressCompany: string;
        receiver: {
            name: string;
            mobile: string;
            province: string;
            city: string;
            area: string;
            address: string;
        };
        cargo: {
            name: string;
            count: number;
            weight: number;
        };
        remark?: string;
        getPrintData?: boolean;
    }): Promise<{
        orderId: string;
        waybillId: any;
        expressCompanyId: string;
        expressCompanyName: string;
        waybillData: any;
        status: string;
        createTime: string;
    }>;
    getOrder(orderId: string): Promise<any>;
    getQuota(expressCompany: string): Promise<any>;
    bindAccount(data: {
        deliveryId: string;
        account: string;
        password: string;
    }): Promise<any>;
}
