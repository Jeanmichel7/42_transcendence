// export interface ApiSuccessResponse<T> {
//   status: number;
//   data: T;
// }

export interface Api2FAResponse {
  is2FAactivated: boolean;
  user: {
    id: number;
  };
}

export interface ApiLogin2FACode {
  message: string;
}

export interface ApiErrorResponse {
  status: number | undefined | null;
  error: string | undefined | null;
  message: string;
}