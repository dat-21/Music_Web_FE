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

// src/config/env.ts
export const env = {
  // Xóa cả /api lẫn trailing slash ngay tại đây
  API_URL: getEnv('VITE_API_URL').replace(/\/+$/, '').replace(/\/api$/, ''),
  IS_DEV:  import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
} as const;