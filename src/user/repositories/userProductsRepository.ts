import { Product } from "@product/models/productModel";
import { UserProduct, UserRecord } from "@/user/models/userProductsModel";
import { Database } from "@/common/services/Database";
import * as CustomError from "@/common/services/CustomError";

const database = Database.Instance;


export class UserProductsRepository {
  name = () => "UserProducts";

  async create(item: Omit<UserProduct, "id">): Promise<UserProduct> {
    try {
      const result = (await database.runQuery(
        `INSERT INTO ${this.name()} (user_id, product_id) VALUES ($1, $2) RETURNING *`,
        [item.user_id, item.product_id]
      )) as UserProduct[];
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new CustomError.CreationFailedError("UserProduct creation failed");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }


  async findUserRecordById(id: string): Promise<UserRecord | null> {
    try {
      const result = (await database.runQuery(
        `SELECT u.*, p.* FROM ${this.name()} up JOIN users u ON up.user_id = u.id JOIN products p ON up.product_id = p.id WHERE u.id = $1`,
        [id]
      )) as UserRecord[];
      if (result && result.length > 0) {
        return result[0] as UserRecord;
      } else {
        throw new CustomError.NotFoundError("UserRecord not found");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async findByUserId(user_id: string): Promise<UserProduct[]> {
    try {
      const result = (await database.runQuery(
        `SELECT * FROM ${this.name()} WHERE user_id = $1`,
        [user_id]
      )) as UserProduct[];
      return result;
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async findProductsByUserId(user_id: string): Promise<Product[]> {
    try {
      const result = (await database.runQuery(
        `SELECT p.* FROM ${this.name()} up JOIN products p ON up.product_id = p.id WHERE up.user_id = $1`,
        [user_id]
      )) as Product[];
      return result;
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

    async findByProductId(product_id: string): Promise<UserProduct[]> {
        try {
        const result = (await database.runQuery(
            `SELECT * FROM ${this.name()} WHERE product_id = $1`,
            [product_id]
        )) as UserProduct[];
        return result;
        } catch (error) {
        throw new CustomError.DatabaseQueryError("Database query failed", error);
        }
    }

    async deleteByUserId(user_id: string): Promise<UserProduct | null> {
        try {
        const result = (await database.runQuery(
            `DELETE FROM ${this.name()} WHERE user_id = $1 RETURNING *`,
            [user_id]
        )) as UserProduct[];
        if (result && result.length > 0) {
            return result[0];
        } else {
            throw new CustomError.NotFoundError("UserProduct not found");
        }
        } catch (error) {
        throw new CustomError.DatabaseQueryError("Database query failed", error);
        }
    }

    async deleteByProductId(product_id: string): Promise<UserProduct | null> {
        try {
            const result = (await database.runQuery(
                `DELETE FROM ${this.name()} WHERE product_id = $1 RETURNING *`,
                [product_id]
            )) as UserProduct[];
            if (result && result.length > 0) {
                return result[0];
            } else {
                throw new CustomError.NotFoundError("UserProduct not found");
            }
        } catch (error) {
            throw new CustomError.DatabaseQueryError("Database query failed", error);
        }
    }

    async deleteByUserIdAndProductId(user_id: string, product_id: string): Promise<UserProduct | null> {
        try {
            const result = (await database.runQuery(
                `DELETE FROM ${this.name()} WHERE user_id = $1 AND product_id = $2 RETURNING *`,
                [user_id, product_id]
            )) as UserProduct[];
            if (result && result.length > 0) {
                return result[0];
            } else {
                throw new CustomError.NotFoundError("UserProduct not found");
            }
        } catch (error) {
            throw new CustomError.DatabaseQueryError("Database query failed", error);
        }
    }
}