import axios from './axiosConfig';
import { API_ENDPOINTS, type ApiResponse } from '../../../shared/contracts';
import type { Song } from '@/types';

export interface LibraryPlaylist {
    _id?: string;
    id?: string;
    name: string;
    description?: string;
    user?:
        | string
        | {
            _id?: string;
            username?: string;
            name?: string;
        };
    songs: Array<Partial<Song> | string>;
    isPublic?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface LibraryPayload {
    total: number;
    playlists: LibraryPlaylist[];
}

export const getMyPlaylistsApi = () =>
    axios.get<ApiResponse<LibraryPayload>>(API_ENDPOINTS.playlist.mine);

export const deletePlaylistApi = (id: string) =>
    axios.delete<ApiResponse<null>>(API_ENDPOINTS.playlist.detail(id));
