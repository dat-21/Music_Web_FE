import { useEffect, useState, type ReactNode } from "react";
import type { User } from "../../types/auth.types";
import authService from "../../services/authService";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
    children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Khôi phục trạng thái đăng nhập khi component mount
    useEffect(() => {
        const savedUser = authService.getCurrentUser();
        const savedToken = authService.getToken();

        if (savedUser && savedToken) {
            setUser(savedUser);
            setToken(savedToken);
            setIsAuthenticated(true);
        }
    }, []);

    const login = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    const value = {
        user,
        token,
        login,
        logout,
        isAuthenticated,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider