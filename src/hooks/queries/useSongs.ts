// src/hooks/queries/useSongs.ts
import { useQuery } from "@tanstack/react-query";
import { getAllSongsApi, getSongByIdApi } from "@/api/song.api";
import { API_ENDPOINTS } from "@/contracts";
import api from "@/lib/api";
import type { Song } from "@/types";

export interface SongListPayload {
  page: number;
  limit: number;
  total: number;
  songs: Song[];
}


// Query keys tập trung — tránh hardcode string rải rác
export const songKeys = {
  all: ["songs"] as const,
  allWithParams: (page: number, limit: number) => ["songs", { page, limit }] as const,
  detail: (id: string) => ["songs", id] as const,
  recommendations: ["songs", "recommendations"] as const,
  pending: ["songs", "pending"] as const,
};

// Tất cả songs (không pagination)
export const useAllSongs = () =>
  useQuery<Song[]>({
    queryKey: songKeys.all,
    queryFn: async (): Promise<Song[]> => {
      const res = await getAllSongsApi();
      return res.data?.songs ?? [];
    },
  });

// Tất cả songs với pagination
export const useAllSongsWithPagination = (page: number = 1, limit: number = 20) =>
  useQuery<SongListPayload>({
    queryKey: songKeys.allWithParams(page, limit),
    queryFn: async (): Promise<SongListPayload> => {
      const res = await api.get<SongListPayload>(
        API_ENDPOINTS.songs.list,
        { params: { page, limit } }
      );
      return res.data!;
    },
  });

// Song theo ID
export const useSongById = (id: string) =>
  useQuery<Song | undefined>({
    queryKey: songKeys.detail(id),
    queryFn: async (): Promise<Song | undefined> => {
      const res = await getSongByIdApi(id);
      return res.data;
    },
    enabled: !!id, // chỉ fetch khi có id
  });

// Gợi ý bài hát
export const useSongRecommendations = (enabled: boolean = true) =>
  useQuery<Song[]>({
    queryKey: songKeys.recommendations,
    queryFn: async (): Promise<Song[]> => {
      const res = await api.get<{ songs: Song[] }>(
        API_ENDPOINTS.songs.recommendations
      );
      return res.data?.songs ?? [];
    },
    enabled,
  });

// Bài hát chờ duyệt (admin)
export const usePendingSongs = (enabled: boolean = true) =>
  useQuery<Song[]>({
    queryKey: songKeys.pending,
    queryFn: async (): Promise<Song[]> => {
      const res = await api.get<{ songs: Song[] }>(
        API_ENDPOINTS.songs.pending
      );
      return res.data?.songs ?? [];
    },
    enabled,
  });
