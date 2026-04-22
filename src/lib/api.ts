import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { env } from "@/config/env";
import { API_ENDPOINTS, type ApiResponse } from "@/contracts";

const unwrap = <T>(promise: Promise<{ data: T }>): Promise<T> =>
  promise.then((res) => res.data);

type UnwrappedApiInstance = Omit<AxiosInstance, "get" | "delete" | "post" | "put" | "patch"> & {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
  post<TResponse = unknown, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig<TBody>
  ): Promise<ApiResponse<TResponse>>;
  put<TResponse = unknown, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig<TBody>
  ): Promise<ApiResponse<TResponse>>;
  patch<TResponse = unknown, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig<TBody>
  ): Promise<ApiResponse<TResponse>>;
};

const rawApi = axios.create({
  baseURL: `${env.API_URL}${API_ENDPOINTS.base.api}`,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const rawGet: AxiosInstance["get"] = rawApi.get.bind(rawApi);
const rawDelete: AxiosInstance["delete"] = rawApi.delete.bind(rawApi);
const rawPost: AxiosInstance["post"] = rawApi.post.bind(rawApi);
const rawPut: AxiosInstance["put"] = rawApi.put.bind(rawApi);
const rawPatch: AxiosInstance["patch"] = rawApi.patch.bind(rawApi);

const api = rawApi as UnwrappedApiInstance;

api.get = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
  unwrap(rawGet<ApiResponse<T>>(url, config));

api.delete = <T = unknown>(url: string, config?: AxiosRequestConfig) =>
  unwrap(rawDelete<ApiResponse<T>>(url, config));

api.post = <TResponse = unknown, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: AxiosRequestConfig<TBody>
) => unwrap(rawPost<ApiResponse<TResponse>>(url, data, config));

api.put = <TResponse = unknown, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: AxiosRequestConfig<TBody>
) => unwrap(rawPut<ApiResponse<TResponse>>(url, data, config));

api.patch = <TResponse = unknown, TBody = unknown>(
  url: string,
  data?: TBody,
  config?: AxiosRequestConfig<TBody>
) => unwrap(rawPatch<ApiResponse<TResponse>>(url, data, config));

export default api;