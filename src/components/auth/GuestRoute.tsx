import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import type { GuestRouteProps } from '@/types/auth.types';



export const GuestRoute = ({ children }: GuestRouteProps) => {
    const { isAuthenticated } = useAuthStore();

    // isLoading đã được xử lý ở App.tsx — không cần check lại ở đây

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};