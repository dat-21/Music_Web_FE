// src/hooks/queries/useSongs.ts
import { useQuery } from "@tanstack/react-query";
import { getAllSongsApi, getSongByIdApi } from "@/api/song.api";

// Query keys tập trung — tránh hardcode string rải rác
export const songKeys = {
  all:    ["songs"] as const,
  detail: (id: string) => ["songs", id] as const,
};

// Tất cả songs
export const useAllSongs = () =>
  useQuery({
    queryKey: songKeys.all,
    queryFn:  async () => {
      const res = await getAllSongsApi();
      return res.data.data?.songs ?? [];
    },
  });

// Song theo ID
export const useSongById = (id: string) =>
  useQuery({
    queryKey: songKeys.detail(id),
    queryFn:  async () => {
      const res = await getSongByIdApi(id);
      return res.data.data;
    },
    enabled: !!id, // chỉ fetch khi có id
  });