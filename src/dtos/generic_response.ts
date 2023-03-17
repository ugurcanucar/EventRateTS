export interface GenericResponse<T> {
  message: string;
  isSuccess: boolean;
  data: T;
}

export interface GenericListResponse<T> {
  message: string;
  isSuccess: boolean;
  data: T[];
}
