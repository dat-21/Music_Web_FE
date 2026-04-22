// src/hooks/queries/usePlaylists.ts
import { useQuery } from "@tanstack/react-query";
import { getMyPlaylistsApi } from "@/api/playlist.api";
import { API_ENDPOINTS } from "@/contracts";
import api from "@/lib/api";
import type { LibraryPlaylist } from "@/api/playlist.api";

export interface PlaylistsResponse {
  total: number;
  playlists: LibraryPlaylist[];
}

// Query keys tập trung
export const playlistKeys = {
  all: ["playlists"] as const,
  mine: ["playlists", "mine"] as const,
  list: ["playlists", "list"] as const,
  detail: (id: string) => ["playlists", id] as const,
};

/**
 * Lấy playlist của người dùng hiện tại
 */
export const useMyPlaylists = (enabled: boolean = true) =>
  useQuery<PlaylistsResponse>({
    queryKey: playlistKeys.mine,
    queryFn: async (): Promise<PlaylistsResponse> => {
      const res = await getMyPlaylistsApi();
      return res.data!;
    },
    enabled,
  });

/**
 * Lấy danh sách tất cả playlist công khai
 */
export const usePublicPlaylists = (enabled: boolean = true) =>
  useQuery<PlaylistsResponse>({
    queryKey: playlistKeys.list,
    queryFn: async (): Promise<PlaylistsResponse> => {
      const res = await api.get<PlaylistsResponse>(
        API_ENDPOINTS.playlist.list
      );
      return res.data!;
    },
    enabled,
  });

/**
 * Lấy chi tiết một playlist theo ID
 */
export const usePlaylistById = (id: string, enabled: boolean = true) =>
  useQuery<LibraryPlaylist | undefined>({
    queryKey: playlistKeys.detail(id),
    queryFn: async (): Promise<LibraryPlaylist | undefined> => {
      const res = await api.get<LibraryPlaylist>(
        API_ENDPOINTS.playlist.detail(id)
      );
      return res.data;
    },
    enabled: enabled && !!id,
  });
