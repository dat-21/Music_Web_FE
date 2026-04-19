// src/config/env.ts

const getEnv = (key: string): string => {
  const value = import.meta.env[key] as string | undefined;

  if (!value || value.trim() === '') {
    // Throw ngay, không cho app chạy nếu thiếu biến bắt buộc
    throw new Error(
      `[env] Thiếu biến môi trường bắt buộc: ${key}\n` +
      `Hãy thêm ${key} vào file .env hoặc cấu hình deployment environment.`
    );
  }

  return value.trim().replace(/\/+$/, ''); // xóa trailing slash
};

export const env = {
  API_URL: getEnv('VITE_API_URL'),
  MODE:    import.meta.env.MODE,   // 'development' | 'production'
  IS_DEV:  import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;