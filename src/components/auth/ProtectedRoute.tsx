import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import type { ProtectedRouteProps } from '@/types';



export const ProtectedRoute = ({
    children,
    requiredRole,
    redirectTo = '/login',
}: ProtectedRouteProps) => {
    const { user, isAuthenticated } = useAuthStore();
    const location = useLocation();

    // isLoading đã được xử lý ở App.tsx — không cần check lại ở đây

    if (!isAuthenticated || !user) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
};