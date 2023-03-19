import { BaseDto } from "../../baseDto";

export interface RegisterUserRequestDto extends BaseDto {
  email: string;
  password: string;
  fullName: string;
}
