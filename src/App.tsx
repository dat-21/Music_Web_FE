import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { useAuthStore } from "./store/auth.store";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

function App() {
  const { loadUser, isLoading } = useAuthStore();

  // ✅ Load user từ cookie khi app khởi động
  useEffect(() => {
    loadUser();
  }, []);

  // ✅ Hiển thị loading screen khi đang check authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App
