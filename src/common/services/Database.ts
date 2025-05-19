import * as CustomError from "../services/CustomError";
import { Pool } from "pg";
import { Config } from "@common/services/Config";
import { Logger } from "@common/services/Logger";

const configuration = Config.Instance;
const logger = Logger.Instance;
export class Database  {
  static pool: Pool;
  private static _instance: Database;

  constructor() {
    Database.pool = new Pool({
      user: configuration.get("DBUSERNAME"),
      host: configuration.get("DBHOST"),
      database: configuration.get("DBNAME"),
      password: configuration.get("DBPASSWORD"),
      port: configuration.get("DBPORT"),
    });
  }

  public static get Instance(): Database {
    return this._instance || (this._instance = new this());
  }

  public static async runQuery(query: string, params?: any[]): Promise<unknown> {
    try {
      const client = await this.pool.connect();
      logger.info("Database connection successful");
      try {
        const result = await client.query(query, params);
        return result.rows;
      } catch (error) {
        throw new CustomError.DatabaseQueryError(
          "Database query failed",
          error
        );
      } finally {
        client.release();
      }
    } catch (error) {
      throw new CustomError.DatabaseConnectionError(
        "Database connection failed",
        error
      );
    }
  }
}
