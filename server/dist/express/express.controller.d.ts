import { ExpressService } from './express.service';
export declare class ExpressController {
    private readonly expressService;
    constructor(expressService: ExpressService);
    getCompanies(): Promise<{
        code: number;
        msg: string;
        data: {
            id: string;
            name: string;
            serviceType: number;
            serviceName: string;
            mode: string;
            bound: boolean;
        }[];
    }>;
    createOrder(body: {
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
        code: number;
        msg: string;
        data: {
            orderId: string;
            waybillId: any;
            expressCompanyId: string;
            expressCompanyName: string;
            waybillData: any;
            status: string;
            createTime: string;
        };
    }>;
    getOrder(orderId: string): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    getQuota(expressCompany: string): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
    bindAccount(body: {
        deliveryId: string;
        account: string;
        password: string;
    }): Promise<{
        code: number;
        msg: string;
        data: any;
    }>;
}
