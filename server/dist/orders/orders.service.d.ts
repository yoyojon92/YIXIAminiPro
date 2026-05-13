export interface OrderItem {
    productId: string;
    productName: string;
    image: string;
    specId: string;
    specName: string;
    price: number;
    quantity: number;
}
export interface Order {
    id: string;
    orderNo: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
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
    createdAt: string;
    paidAt?: string;
    shippedAt?: string;
    deliveredAt?: string;
}
export declare class OrdersService {
    private orders;
    create(userId: string, data: {
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
    }): Promise<Order>;
    findByUser(userId: string): Promise<Order[]>;
    findOne(id: string): Promise<Order | undefined>;
    updateStatus(id: string, status: Order['status']): Promise<Order | undefined>;
    cancel(id: string): Promise<Order | undefined>;
}
