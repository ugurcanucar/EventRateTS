import postgresClient from "../config/db";
import { BaseEntity } from "src/entities/base_entity";

export abstract class GenericRepository<T extends BaseEntity> {
  private readonly tableName;

  constructor(tableName: string) {
    this.tableName = tableName;
  }
  private getKeysAndValues(condition: Partial<T>): {
    keys: string[];
    values: any[];
  } {
    const keys = Object.keys(condition);
    const values = Object.values(condition);

    return { keys, values };
  }

  getById = async (id: number): Promise<T> => {
    const result = await postgresClient.query(
      `SELECT*FROM ${this.tableName} where id= $1 AND "isDeleted"=false`,
      [id]
    );
    return result.rows[0];
  };

  getAll = async (): Promise<T[]> => {
    const result = await postgresClient.query(
      `SELECT * FROM ${this.tableName} where "isDeleted"=false`
    );
    return result.rows;
  };

  getOneWithCondition = async (condition: Partial<T>) => {
    const { keys, values } = this.getKeysAndValues(condition);

    const query = `SELECT * FROM ${this.tableName} WHERE ${keys
      .map((k, i) => `"${k}" = $${i + 1}`)
      .join(" AND ")} LIMIT 1`;

    // const query = Object.entries(condition)
    //   .map(([key, value]) => `"${key}" = $${value}`)
    //   .join(" AND ");

    console.log(query);
    const result = await postgresClient.query(query, values);
    console.log(query, values);
    return result.rowCount === 0 ? null : result.rows[0];
  };

  create = async (entity: T): Promise<T> => {
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
  };

  update = async (id: number, entity: T): Promise<T> => {
    const propertyNames = Object.keys(entity).map((x) => `"${x}"`);
    const values = Object.values(entity);
    const assignments = propertyNames.map((name, i) => `${name} = $${i + 1}`);

    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000; // convert minutes to milliseconds
    const localTime = new Date(now.getTime() - timezoneOffset);
    entity.updatedDate = new Date(localTime);
    const result = await postgresClient.query(
      `UPDATE ${this.tableName} SET ${assignments.join(", ")} WHERE id = $${
        values.length + 1
      } RETURNING *`,
      [...values, id]
    );
    return result.rows[0];
  };

  delete = async (id: number): Promise<T> => {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
    const localTime = new Date(now.getTime() - timezoneOffset);
    const updatedDate = new Date(localTime);
    const result = await postgresClient.query(
      `UPDATE ${this.tableName} SET "isDeleted"=true, "updatedDate"= $2 WHERE id = $1 RETURNING *`,
      [id, updatedDate]
    );
    return result.rows[0];
  };
}
