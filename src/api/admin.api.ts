
import { API_ENDPOINTS } from "../contracts";
import axiosInstance from "./axiosConfig";
import type { Song } from "@/types/song.types";
// ===== Song APIs =====
export const addSongApi = (formData: FormData) =>
    axiosInstance.post<Song>(API_ENDPOINTS.songs.upload, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteSongApi = (songId: string) =>
    axiosInstance.delete(API_ENDPOINTS.songs.detail(songId));