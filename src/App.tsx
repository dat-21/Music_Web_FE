import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
// import { AuthProvider } from "./context/auth/AuthProvider";
// import { useAuthStore } from "./store/auth.store";

function App() {
  // const user = useAuthStore((state) => state.user);

  // useEffect(() => {
  //   if (loadUser) (loadUser())
  //   // gọi /auth/me để lấy user
  // }, []);

  return (


    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>


  )
}

export default App
