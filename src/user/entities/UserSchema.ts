// UserSchema.ts
import { EntitySchema } from "typeorm";
import { User } from "@user/entities/interfaces/userInterfaces";

export const UserSchema = new EntitySchema<User>({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: "text",
    },
    email: {
      type: "text",
      unique: true,
    },
    password: {
      type: "text",
    },
  }
});
