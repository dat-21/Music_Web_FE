import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../contracts";

export interface ListenPositionData {
  songId: string;
  position: number;
  updatedAt: string | null;
}

export interface ListenHistoryItem {
  songId: {
    _id: string;
    title: string;
    artist: string;
    coverUrl: string;
    duration: number;
    fileUrl: string;
  };
  position: number;
  updatedAt: string;
}

export interface ListenHistoryResponse {
  data: ListenHistoryItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * API để quản lý lịch sử nghe nhạc
 */

// Cập nhật vị trí nghe của bài hát
export const updateListenPosition = async (
  songId: string,
  position: number
): Promise<ListenPositionData> => {
  const response = await axiosInstance.post<ListenPositionData>(API_ENDPOINTS.history.position, {
    songId,
    position,
  });
  return response.data!;
};

// Lấy vị trí nghe đã lưu của một bài hát
export const getListenPosition = async (
  songId: string
): Promise<ListenPositionData> => {
  const response = await axiosInstance.get<ListenPositionData>(API_ENDPOINTS.history.positionBySong(songId));
  return response.data!;
};

// Lấy toàn bộ lịch sử nghe
export const getListenHistory = async (
  page = 1,
  limit = 50
): Promise<ListenHistoryResponse> => {
  const response = await axiosInstance.get<ListenHistoryResponse>(API_ENDPOINTS.history.list, {
    params: { page, limit },
  });
  return response.data!;
};

// Xóa một bài khỏi lịch sử
export const removeFromHistory = async (songId: string): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.history.remove(songId));
};

// Xóa toàn bộ lịch sử
export const clearHistory = async (): Promise<void> => {
  await axiosInstance.delete(API_ENDPOINTS.history.clear);
};
