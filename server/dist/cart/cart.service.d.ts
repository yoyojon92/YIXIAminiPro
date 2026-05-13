export interface CartItem {
    id: string;
    productId: string;
    productName: string;
    specId: string;
    specName: string;
    price: number;
    quantity: number;
    image: string;
}
export interface Cart {
    userId: string;
    items: CartItem[];
    updatedAt: Date;
}
export declare class CartService {
    private generateId;
    private generateItemId;
    getCart(userId: string): Cart;
    addItem(userId: string, productId: string, specId: string, quantity: number): CartItem;
    updateItemQuantity(userId: string, itemId: string, quantity: number): CartItem | null;
    removeItem(userId: string, itemId: string): boolean;
    clearCart(userId: string): void;
    getCartTotal(userId: string): {
        totalAmount: number;
        totalItems: number;
    };
    private getProductName;
    private getSpecName;
    private getProductPrice;
    private getProductImage;
}
