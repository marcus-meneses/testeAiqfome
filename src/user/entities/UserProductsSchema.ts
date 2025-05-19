// UserProductSchema.ts
import { EntitySchema } from "typeorm";
import { UserProducts } from "@user/entities/interfaces/userProductsInterfaces";

export const UserProductsSchema = new EntitySchema<UserProducts>({
  name: "UserProducts",
  tableName: "UserProducts",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      nullable: false,
    },
    product: {
      type: "many-to-one",
      target: "Product",
      joinColumn: { name: "product_id" },
      nullable: false,
    },
  },
  uniques: [
    {
      name: "UQ_user_product",
      columns: ["user", "product"], // Prevent duplicate associations
    },
  ],
});
