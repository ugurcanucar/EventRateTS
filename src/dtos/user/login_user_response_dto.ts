import { BaseDto } from "../baseDto";

export interface LoginUserResponseDto extends BaseDto {
  email: string;
  fullName: string;
  token: string;
}
