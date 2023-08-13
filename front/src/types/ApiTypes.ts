// export interface ApiSuccessResponse<T> {
//   status: number;
//   data: T;
// }

export interface ApiErrorResponse {
  status: number;
  error: string;
  message: string;
}
