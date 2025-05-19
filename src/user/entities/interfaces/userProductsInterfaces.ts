import {User } from "@user/entities/interfaces/userInterfaces";
import { Product } from "@product/entities/interfaces/productInterfaces";


export interface UserProducts {
    id: string;
    user: User;
    product: Product;
  
}