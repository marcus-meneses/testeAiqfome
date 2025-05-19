import { Product } from "@product/models/productModel";
import { AdapterInterface } from "@/common/interfaces/adapterInterface";
import { Database } from "@/common/services/Database";
import * as CustomError from "@/common/services/CustomError";

const database = Database.Instance;

export class ProductRepository implements AdapterInterface<Product> {
  name = () => "Product";

  async create(item: Omit<Product, "id">): Promise<Product> {
    try {
      const result = (await database.runQuery(
        `INSERT INTO ${this.name()} (fakestore_id, title, image, price, review) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [item.fakestore_id, item.title, item.image, item.price, item.review]
      )) as Product[];
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new CustomError.CreationFailedError("Product creation failed");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const result = (await database.runQuery(
        `SELECT * FROM ${this.name()} WHERE id = $1`,
        [id]
      )) as Product[];
      if (result && result.length > 0) {
        return result[0] as Product;
      } else {
        throw new CustomError.NotFoundError("Product not found");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }
  async findAll(): Promise<Product[]> {
    try {
      const result = (await database.runQuery(
        `SELECT * FROM ${this.name()}`
      )) as Product[];
      return result;
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async update(id: string, item: Product): Promise<Product | null> {
    try {
      const result = (await database.runQuery(
        `UPDATE ${this.name()} SET fakestore_id = $1, title = $2, image = $3, price = $4, review = $5 WHERE id = $6 RETURNING *`,
        [item.fakestore_id, item.title, item.image, item.price, item.review, id]
      )) as Product[];
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new CustomError.UpdateFailedError("Product update failed");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async delete(id: string): Promise<Product | null> {
    try {
      const result = (await database.runQuery(
        `DELETE FROM ${this.name()} WHERE id = $1 RETURNING *`,
        [id]
      )) as Product[];
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new CustomError.DeletionFailedError("Product deletion failed");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async findByField(field: string, value: string): Promise<Product | null> {
    try {
      const result = (await database.runQuery(
        `SELECT * FROM ${this.name()} WHERE ${field} = $1`,
        [value]
      )) as Product[];
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new CustomError.NotFoundError("Product not found");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async findByFields(fields: Record<string, any>): Promise<Product | null> {
    const fieldNames = Object.keys(fields);
    const fieldValues = Object.values(fields);
    const query = `SELECT * FROM ${this.name()} WHERE ${fieldNames
      .map((field, index) => `${field} = $${index + 1}`)
      .join(" AND ")}`;
    try {
      const result = (await database.runQuery(query, fieldValues)) as Product[];
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new CustomError.NotFoundError("Product not found");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async query(query: Record<string, any>): Promise<Product[]> {
    const queryString = `SELECT * FROM ${this.name()} WHERE ${Object.keys(query)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ")}`;
    const values = Object.values(query);
    try {
      const result = (await database.runQuery(
        queryString,
        values
      )) as Product[];
      return result;
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }
}
