import axios, { AxiosError } from 'axios';

type ApiErrorBody = {
  message?: string;
};

export const getApiErrorMessage = (
  error: AxiosError<ApiErrorBody> | Error,
  fallback: string,
): string => {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return error.response?.data?.message || fallback;
  }
  return error.message || fallback;
};

export const withApiError = async <T>(
  action: () => Promise<T>,
  fallback: string,
): Promise<T> => {
  try {
    return await action();
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error as AxiosError<ApiErrorBody> | Error, fallback),
    );
  }
};