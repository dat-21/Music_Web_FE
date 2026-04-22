// src/hooks/queries/useSongs.ts
import { useQuery } from "@tanstack/react-query";
import { getAllSongsApi, getSongByIdApi } from "@/api/song.api";
import type { Song } from "@/types";

// Query keys tập trung — tránh hardcode string rải rác
export const songKeys = {
  all:    ["songs"] as const,
  detail: (id: string) => ["songs", id] as const,
};

// Tất cả songs
export const useAllSongs = () =>
  useQuery<Song[]>({
    queryKey: songKeys.all,
    queryFn: async (): Promise<Song[]> => {
      const res = await getAllSongsApi();
      return res.data.data?.songs ?? [];
    },
  });

// Song theo ID
export const useSongById = (id: string) =>
  useQuery<Song | undefined>({
    queryKey: songKeys.detail(id),
    queryFn: async (): Promise<Song | undefined> => {
      const res = await getSongByIdApi(id);
      return res.data.data;
    },
    enabled: !!id, // chỉ fetch khi có id
  });