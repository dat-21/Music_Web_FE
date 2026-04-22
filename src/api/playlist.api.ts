import axios from './axiosConfig';
import { API_ENDPOINTS } from '../contracts';
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
    axios.get<LibraryPayload>(API_ENDPOINTS.playlist.mine);

export const deletePlaylistApi = (id: string) =>
    axios.delete<null>(API_ENDPOINTS.playlist.detail(id));
