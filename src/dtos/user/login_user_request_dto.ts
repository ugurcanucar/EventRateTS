import { BaseDto } from "../baseDto";

export interface LoginUserRequestDto extends BaseDto {
  email: string;
  password: string;
}
