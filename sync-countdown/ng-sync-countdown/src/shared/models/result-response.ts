export interface ResultResponse<T>{
  success: boolean;
  message?: string;
  data?: T
}
