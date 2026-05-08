import api from "@/lib/api";
import { API_ENDPOINTS } from "../contracts";
import type { Song } from "../types";

export interface SongListPayload {
    page: number;
    limit: number;
    total: number;
    songs: Song[];
}

export const getAllSongsApi = () =>
    api.get<SongListPayload>(API_ENDPOINTS.songs.list);
export const getSongByIdApi = (id: string) =>
    api.get<Song>(API_ENDPOINTS.songs.detail(id));

