export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface AxiosErrorResponse {
  response?: {
    data?: ApiError;
    status?: number;
  };
  message?: string;
}