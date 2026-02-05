import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Giữ nguyên config của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Tự động thêm token vào mọi request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorageUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý lỗi tập trung
// ⚠️ KHÔNG redirect ở đây - để auth store xử lý 401
// Redirect trong interceptor gây infinite loop khi chưa login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi 403 - Không có quyền
    if (error.response?.status === 403) {
      console.error('Bạn không có quyền truy cập');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;