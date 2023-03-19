import { BaseDto } from "../baseDto";

export interface UserDto extends BaseDto {
  email: string;
  fullName: string;
}
