// src/hooks/queries/useHistory.ts
import { useQuery } from "@tanstack/react-query";
import {
  getListenPosition,
  getListenHistory,
  type ListenPositionData,
  type ListenHistoryResponse,
} from "@/api/history.api";

// Query keys tập trung
export const historyKeys = {
  all: ["history"] as const,
  list: ["history", "list"] as const,
  listWithParams: (page: number, limit: number) =>
    ["history", "list", { page, limit }] as const,
  position: (songId: string) => ["history", "position", songId] as const,
};

/**
 * Lấy vị trí nghe của một bài hát
 */
export const useListenPosition = (songId: string, enabled: boolean = true) =>
  useQuery<ListenPositionData>({
    queryKey: historyKeys.position(songId),
    queryFn: async (): Promise<ListenPositionData> => {
      return getListenPosition(songId);
    },
    enabled: enabled && !!songId,
  });

/**
 * Lấy toàn bộ lịch sử nghe
 */
export const useListenHistory = (
  page: number = 1,
  limit: number = 50,
  enabled: boolean = true
) =>
  useQuery<ListenHistoryResponse>({
    queryKey: historyKeys.listWithParams(page, limit),
    queryFn: async (): Promise<ListenHistoryResponse> => {
      return getListenHistory(page, limit);
    },
    enabled,
  });
