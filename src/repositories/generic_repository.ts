import postgresClient from "../config/db";
import { BaseEntity } from "src/entities/base_entity";

export abstract class GenericRepository<T extends BaseEntity> {
  private readonly tableName;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getById(id: number): Promise<T> {
    const result = await postgresClient.query(
      `SELECT*FROM ${this.tableName} where id= $1`,
      [id]
    );
    return result.rows[0];
  }

  async getAll(): Promise<T[]> {
    const result = await postgresClient.query(
      `SELECT * FROM ${this.tableName}`
    );
    return result.rows;
  }

  async create(entity: T): Promise<T> {
    const propertyNames = Object.keys(entity).map((x) => `"${x}"`);
    const result = await postgresClient.query(
      `INSERT INTO ${this.tableName} (${propertyNames.join(
        ", "
      )}) VALUES (${Object.keys(entity)
        .map((_, i) => `$${i + 1}`)
        .join(", ")}) RETURNING *`,
      Object.values(entity)
    );
    const createdEntity = result.rows[0];
    return createdEntity;
  }
}
