import { BaseDto } from "../baseDto";

export interface CreateUserDto extends BaseDto {
  email: string;
  fullName: string;
}
