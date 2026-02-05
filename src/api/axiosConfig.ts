import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,   // 🔥 CHO PHÉP GỬI COOKIE
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Không cần request interceptor để thêm token nữa
// ⚠️ KHÔNG redirect ở đây - để auth store xử lý 401
// Redirect trong interceptor gây infinite loop khi chưa login
axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
        // Chỉ log lỗi, không redirect - auth store sẽ xử lý
        return Promise.reject(error);
    }
);

export default axiosInstance;
