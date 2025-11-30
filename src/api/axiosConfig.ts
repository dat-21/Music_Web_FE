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
axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            // Cookie hết hạn → logout FE
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
