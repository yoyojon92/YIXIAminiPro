export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    image: string;
    images: string[];
    category: string;
    categoryName: string;
    alcohol: number;
    volume: string;
    tags: string[];
    description: string;
    details: string;
    isAgentProduct: boolean;
    agentCompany?: string;
    sprite: {
        id: string;
        name: string;
        emoji: string;
        rarity: string;
        story: string;
    };
    specs: Array<{
        id: string;
        name: string;
        price: number;
        stock: number;
    }>;
}
export declare class ProductsService {
    private products;
    findAll(category?: string): Promise<Product[]>;
    findOne(id: string): Promise<Product | undefined>;
}
