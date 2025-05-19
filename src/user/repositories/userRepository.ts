import { User } from "@user/models/userModel";
import { AdapterInterface } from "@/common/interfaces/adapterInterface";
import { Database } from "@/common/services/Database";
import * as CustomError from "@/common/services/CustomError";

const database = Database.Instance;

export class UserRepository implements AdapterInterface<User> {
  name = () => "User";

  async create(item: Omit<User, "id">): Promise<User> {
    try {
      const result = (await database.runQuery(
        `INSERT INTO ${this.name()} (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
        [item.name, item.email, item.password]
      )) as User[];
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new CustomError.CreationFailedError("User creation failed");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const result = (await database.runQuery(
        `SELECT * FROM ${this.name()} WHERE id = $1`,
        [id]
      )) as User[];
      if (result && result.length > 0) {
        return result[0] as User;
      } else {
        throw new CustomError.NotFoundError("User not found");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const result = (await database.runQuery(
        `SELECT * FROM ${this.name()}`
      )) as User[];
      return result;
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async update(id: string, item: User): Promise<User | null> {
    try {
      const result = (await database.runQuery(
        `UPDATE ${this.name()} SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`,
        [item.name, item.email, item.password, id]
      )) as User[];
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new CustomError.UpdateFailedError("User update failed");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async delete(id: string): Promise<User | null> {
    try {
      const result = (await database.runQuery(
        `DELETE FROM ${this.name()} WHERE id = $1 RETURNING *`,
        [id]
      )) as User[];
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new CustomError.DeletionFailedError("User deletion failed");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async findByField(field: string, value: string): Promise<User | null> {
    try {
      const result = (await database.runQuery(
        `SELECT * FROM ${this.name()} WHERE ${field} = $1`,
        [value]
      )) as User[];
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new CustomError.NotFoundError("User not found");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async findByFields(fields: Record<string, any>): Promise<User | null> {
    const fieldKeys = Object.keys(fields);
    const fieldValues = Object.values(fields);
    const query = `SELECT * FROM ${this.name()} WHERE ${fieldKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ")}`;
    try {
      const result = (await database.runQuery(query, fieldValues)) as User[];
      if (result && result.length > 0) {
        return result[0];
      } else {
        throw new CustomError.NotFoundError("User not found");
      }
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }

  async query(query: Record<string, any>): Promise<User[]> {
    const fieldKeys = Object.keys(query);
    const fieldValues = Object.values(query);
    const sqlQuery = `SELECT * FROM ${this.name()} WHERE ${fieldKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ")}`;
    try {
      const result = (await database.runQuery(sqlQuery, fieldValues)) as User[];
      return result;
    } catch (error) {
      throw new CustomError.DatabaseQueryError("Database query failed", error);
    }
  }
}
