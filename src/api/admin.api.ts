
import { API_ENDPOINTS } from "../contracts";
import api from "@/lib/api";
import type { Song } from "@/types/song.types";
// ===== Song APIs =====
export const addSongApi = (formData: FormData) =>
    api.post<Song>(API_ENDPOINTS.songs.upload, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteSongApi = (songId: string) =>
    api.delete(API_ENDPOINTS.songs.detail(songId));