import api from '@/lib/api';
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
    api.get<LibraryPayload>(API_ENDPOINTS.playlist.mine);

export const deletePlaylistApi = (id: string) =>
    api.delete<null>(API_ENDPOINTS.playlist.detail(id));
