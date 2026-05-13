import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(category?: string): Promise<{
        code: number;
        msg: string;
        data: import("./products.service").Product[];
    }>;
    findOne(id: string): Promise<{
        code: number;
        msg: string;
        data: null;
    } | {
        code: number;
        msg: string;
        data: import("./products.service").Product;
    }>;
}
