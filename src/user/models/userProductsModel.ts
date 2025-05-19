import { Product } from "@product/models/productModel";

export interface UserProduct {
    id: string;
    user_id: string;
    product_id: string;
}

export interface UserRecord {
    id: string;
    name: string;
    email: string;
    products: Product[];
}