import { OrdersService, OrderItem } from './orders.service';
declare class CreateOrderDto {
    items: OrderItem[];
    totalAmount: number;
    deliveryType: 'dormitory' | 'pickup';
    address?: {
        dormitory: string;
        roomNumber: string;
    };
    pickupShop?: {
        id: string;
        name: string;
        address: string;
    };
    remark?: string;
}
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    private getUserId;
    findAll(auth: string, status?: string): Promise<{
        code: number;
        msg: string;
        data: import("./orders.service").Order[];
    }>;
    findOne(id: string): Promise<{
        code: number;
        msg: string;
        data: import("./orders.service").Order | undefined;
    }>;
    create(auth: string, body: CreateOrderDto): Promise<{
        code: number;
        msg: string;
        data: import("./orders.service").Order;
    }>;
    pay(id: string): Promise<{
        code: number;
        msg: string;
        data: import("./orders.service").Order | undefined;
    }>;
    cancel(id: string): Promise<{
        code: number;
        msg: string;
        data: import("./orders.service").Order | undefined;
    }>;
}
export {};
