// src/hooks/queries/useAdmin.ts
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS, type UserDTO } from "@/contracts";
import axios from "@/api/axiosConfig";

export interface UsersListResponse {
  total: number;
  users: UserDTO[];
}

// Query keys tập trung
export const adminKeys = {
  all: ["admin"] as const,
  users: ["admin", "users"] as const,
  userDetail: (id: string) => ["admin", "users", id] as const,
};

/**
 * Lấy danh sách người dùng (admin only)
 */
export const useUsers = (enabled: boolean = true) =>
  useQuery<UsersListResponse>({
    queryKey: adminKeys.users,
    queryFn: async (): Promise<UsersListResponse> => {
      const res = await axios.get<UsersListResponse>(
        API_ENDPOINTS.admin.users
      );
      return res.data!;
    },
    enabled,
  });

/**
 * Lấy chi tiết một người dùng (admin only)
 */
export const useUserDetail = (id: string, enabled: boolean = true) =>
  useQuery<UserDTO | undefined>({
    queryKey: adminKeys.userDetail(id),
    queryFn: async (): Promise<UserDTO | undefined> => {
      const res = await axios.get<UserDTO>(
        API_ENDPOINTS.admin.userDetail(id)
      );
      return res.data;
    },
    enabled: enabled && !!id,
  });
