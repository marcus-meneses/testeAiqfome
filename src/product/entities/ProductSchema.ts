import { EntitySchema } from "typeorm";
import { Product } from "@product/entities/interfaces/productInterfaces";
  
export const ProductSchema = new EntitySchema<Product>({
  name: "Product",
  tableName: "Product",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    fakestore_id: {
      type: "bigint",
      unique: true,
      nullable: false,
    },
    title: {
      type: "text",
      nullable: false,
    },
    image: {
      type: "text",
      nullable: true,
    },
    price: {
      type: "decimal",
      precision: 12,
      scale: 2,
      nullable: false,
    },
    review: {
      type: "decimal",
      precision: 4,
      scale: 2,
      nullable: true,
    },
  }
});
