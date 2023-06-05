export interface AuthLogout {
  message: string,
}

export interface Api2FAResponse {
  is2FAactived: boolean;
  user: {
    id: number;
  };
}

export interface ApiLogin2FACode {
  message: string;
}