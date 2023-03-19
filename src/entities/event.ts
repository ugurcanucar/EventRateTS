import { BaseEntity } from "./base_entity";

export interface EventEntity extends BaseEntity {
  star: number;
  name: string;
}
