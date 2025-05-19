import * as CustomError from "../services/CustomError";
import { Pool, PoolClient } from "pg";
import { Config } from "@common/services/Config";
import { Logger } from "@common/services/Logger";

const configuration = Config.Instance;
const logger = Logger.Instance;

class Transaction {
  private client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
  }

  public async begin(): Promise<void> {
    try {
      await this.client.query("BEGIN");
      logger.info("Transaction started");
    } catch (error) {
      throw new CustomError.DatabaseTransactionError(
        "Failed to begin transaction",
        error
      );
    }
  }

  public async commit(): Promise<void> {
    try {
      await this.client.query("COMMIT");
      logger.info("Transaction committed");
      await this.release();
    } catch (error) {
      this.rollback();
      throw new CustomError.DatabaseTransactionError(
        "Failed to commit transaction",
        error
      );
    }
  }

  public async rollback(): Promise<void> {
    try {
      await this.client.query("ROLLBACK");
      logger.info("Transaction rolled back");
    } catch (error) {
      throw new CustomError.DatabaseTransactionError(
        "Failed to rollback transaction",
        error
      );
    }
  }

  public async release(): Promise<void> {
    try {
      await this.client.release();
      logger.info("Transaction client released");
    } catch (error) {
      throw new CustomError.DatabaseTransactionError(
        "Failed to release transaction client",
        error
      );
    }
  }

  public async query(query: string, params?: any[]): Promise<unknown> {
    try {
      const result = await this.client.query(query, params);
      return result.rows;
    } catch (error) {
      throw new CustomError.DatabaseQueryError(
        "Transaction query failed",
        error
      );
    }
  }
}

export class Database {
  private pool: Pool;
  private static _instance: Database;

  private constructor() {
    this.pool = new Pool({
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

  public get Transaction() {
    return async (): Promise<Transaction> => {
      try {
        const client = await this.pool.connect();
        logger.info("Transaction client connected");
        return new Transaction(client);
      } catch (error) {
        throw new CustomError.DatabaseConnectionError(
          "Failed to get transaction client",
          error
        );
      }
    };
  }

  public async runQuery(query: string, params?: any[]): Promise<unknown> {
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
