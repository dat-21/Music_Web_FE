import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { env } from "@/config/env";
import { API_ENDPOINTS, type ApiResponse } from "@/contracts";

type UnwrappedApiInstance = Omit<AxiosInstance, "get" | "delete" | "post" | "put" | "patch"> & {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
};

const rawApi = axios.create({
  baseURL: `${env.API_URL}${API_ENDPOINTS.base.api}`,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

rawApi.interceptors.response.use(
  (response) => response.data as any,
  (error) => Promise.reject(error),
);

const api = rawApi as UnwrappedApiInstance;

export default api;