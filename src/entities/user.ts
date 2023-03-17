import { BaseEntity } from "./base_entity";

export interface UserEntity extends BaseEntity {
  email: string;
  fullName: string;
  password: string;
}
