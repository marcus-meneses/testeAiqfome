import { User } from "@user/models/userModel";
import { AdapterInterface } from "@/common/interfaces/adapterInterface";
import { Database } from "@/common/services/Database";
import * as CustomError from "@/common/services/CustomError";
import { Logger } from "@/common/services/Logger";
import { Config } from "@/common/services/Config";
import bcrypt from "bcrypt";
import pg from "pg";

const configuration = Config.Instance;
const database = Database.Instance;
const logger = Logger.Instance;

export class UserRepository implements AdapterInterface<User> {
  name = () => "User";

  async create(item: Omit<User, "id">): Promise<User | null> {
     
      const saltRounds = configuration.get("SALT");
      const hashedPassword = await bcrypt.hash(
        item.password,
        Number(saltRounds)
      );
      const result = (await database.runQuery(
        `INSERT INTO "${this.name()}" (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
        [item.name, item.email, hashedPassword]
      )) as User[];

      return result[0];
    
  }

  async findByCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    const result = (await database.runQuery(
      `SELECT * FROM "${this.name()}" WHERE "email" = $1`,
      [email]
    )) as User[];

    const user = result[0];

    const validPassword = await bcrypt.compare(password, user?.password || "");

    if (validPassword) {
      const { password, ...userWithoutPassword } = user;
      logger.info(`User credentials for user <${result[0]?.name}> found`);
      return userWithoutPassword as User;
    } else {
      logger.info(`User credentials for <${email}> not found`);
      return null;
    }
  }

  async findById(id: string): Promise<User | null> {
    const result = (await database.runQuery(
      `SELECT * FROM "${this.name()}" WHERE "id" = $1`,
      [id]
    )) as User[];
    return result[0];
  }

  async findAll(): Promise<User[]> {
    const result = (await database.runQuery(
      `SELECT * FROM "${this.name()}" ORDER BY id ASC`
    )) as User[];
    return result;
  }

  async update(id: string, item: Omit<User & {id?:string}, "password">): Promise<User | null> {
    const result = (await database.runQuery(
      `UPDATE "${this.name()}" SET "name" = $1, "email" = $2 WHERE "id" = $3 RETURNING *`,
      [item.name, item.email, id]
    )) as User[];
    return result[0];
  }

  async delete(id: string): Promise<User | null> {
    const result = (await database.runQuery(
      `DELETE FROM "${this.name()}" WHERE "id" = $1 RETURNING *`,
      [id]
    )) as User[];
    return result[0] || null;
  }

  async findByField(field: string, value: string): Promise<User | null> {
    const result = (await database.runQuery(
      `SELECT * FROM "${this.name()}" WHERE "${field}" = $1`,
      [value]
    )) as User[];
    return result[0];
  }

  async findByFields(fields: Record<string, any>): Promise<User | null> {
    const fieldKeys = Object.keys(fields);
    const fieldValues = Object.values(fields);
    const query = `SELECT * FROM ${this.name()} WHERE ${fieldKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ")}`;

    const result = (await database.runQuery(query, fieldValues)) as User[];
    return result[0];
  }

  async query(query: Record<string, any>): Promise<User[]> {
    const fieldKeys = Object.keys(query);
    const fieldValues = Object.values(query);
    const sqlQuery = `SELECT * FROM ${this.name()} WHERE ${fieldKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ")}`;

    const result = (await database.runQuery(sqlQuery, fieldValues)) as User[];
    return result;
  }
}
