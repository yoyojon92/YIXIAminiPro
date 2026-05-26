import { CartService } from './cart.service';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    private extractUserId;
    getCart(auth: string): {
        code: number;
        msg: string;
        data: {
            items: import("./cart.service").CartItem[];
            totalAmount: number;
            totalItems: number;
        };
    };
    addToCart(auth: string, body: {
        productId: string;
        specId: string;
        quantity: number;
    }): {
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: {
            item: import("./cart.service").CartItem;
            totalAmount: number;
            totalItems: number;
        };
    };
    updateQuantity(auth: string, itemId: string, body: {
        quantity: number;
    }): {
        code: number;
        msg: string;
        data: {
            item: import("./cart.service").CartItem | null;
            totalAmount: number;
            totalItems: number;
        };
    };
    removeItem(auth: string, itemId: string): {
        code: number;
        msg: string;
        data: {
            totalAmount: number;
            totalItems: number;
        };
    };
    clearCart(auth: string): {
        code: number;
        msg: string;
        data: {
            totalAmount: number;
            totalItems: number;
        };
    };
}
