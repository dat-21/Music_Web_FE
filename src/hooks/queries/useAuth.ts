// src/hooks/queries/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/api/auth.api";
import type { UserDTO } from "@/contracts";

// Query keys tập trung
export const authKeys = {
  all: ["auth"] as const,
  me: ["auth", "me"] as const,
};

/**
 * Lấy thông tin người dùng hiện tại
 * @param enabled - có fetch hay không (mặc định true)
 */
export const useCurrentUser = (enabled: boolean = true) =>
  useQuery<UserDTO | undefined>({
    queryKey: authKeys.me,
    queryFn: async (): Promise<UserDTO | undefined> => {
      try {
        const res = await authApi.me();
        return res.data;
      } catch {
        // Nếu không authenticate, trả về undefined thay vì throw
        return undefined;
      }
    },
    enabled,
    retry: false, // không retry nếu không authenticate
  });

/**
 * Kiểm tra xem user đã auth chưa
 */
export const useIsAuthenticated = () => {
  const { data: user, isLoading } = useCurrentUser();
  return {
    isAuthenticated: !!user,
    user,
    isLoading,
  };
};
