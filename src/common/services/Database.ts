import {databaseInterface} from "@common/types/databaseTypes";
import { CustomError } from "../services/CustomError";
import { Pool } from 'pg';


export class Database implements databaseInterface {
  private pool: Pool;
   

  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD, //testeAiqfome
      port: parseInt(process.env.DB_PORT || '5432', 10),
    });
  }

  public async runQuery(query: string, params?: any[]): Promise<unknown> {
    try {
      const result = await this.pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
}