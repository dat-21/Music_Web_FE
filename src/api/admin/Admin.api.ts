import axios from "../axiosConfig";
import { API_ENDPOINTS, type ApiResponse } from "../../../../shared/contracts";
import type { Song } from "../../types";

// ===== Song APIs =====
export const addSongApi = (formData: FormData) =>
    axios.post<ApiResponse<Song>>(API_ENDPOINTS.songs.upload, formData, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteSongApi = (songId: string) =>
    axios.delete(API_ENDPOINTS.songs.detail(songId));