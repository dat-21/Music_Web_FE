import { useState, useEffect, useCallback } from 'react';
import {
    Music,
    Search,
    Trash2,
    Play,
    Clock,
    HardDrive,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';
import { getAllSongsApi } from '../../api/song.api';
import { deleteSongApi } from '../../api/admin.api';
import type { Song } from '../../types';

const AdminSongs = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchSongs = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await getAllSongsApi();
            setSongs(res.data?.songs || []);
        } catch (err) {
            console.error('Failed to fetch songs:', err);
            setError('Failed to load songs. Make sure the backend is running.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    const handleDelete = async (songId: string) => {
        try {
            await deleteSongApi(songId);
            setSongs((prev) => prev.filter((s) => s._id !== songId));
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Failed to delete song:', err);
            alert('Failed to delete song');
        }
    };

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '--:--';
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    const formatSize = (bytes?: number) => {
        if (!bytes) return '--';
        const mb = bytes / (1024 * 1024);
        return `${mb.toFixed(1)} MB`;
    };

    const filteredSongs = songs.filter(
        (song) =>
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Music size={24} className="text-blue-400" />
                        Song Management
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        {songs.length} songs in database
                    </p>
                </div>
                <button
                    onClick={fetchSongs}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                    <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                    type="text"
                    placeholder="Search songs by title or artist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle size={20} className="text-red-400" />
                    <p className="text-red-400 text-sm">{error}</p>
                </div>
            )}

            {/* Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-zinc-500 text-xs uppercase bg-zinc-900/50">
                                <th className="text-left px-5 py-3 font-medium">#</th>
                                <th className="text-left px-5 py-3 font-medium">Song</th>
                                <th className="text-left px-5 py-3 font-medium">Artist</th>
                                <th className="text-center px-5 py-3 font-medium">
                                    <Clock size={14} className="inline" />
                                </th>
                                <th className="text-center px-5 py-3 font-medium">
                                    <HardDrive size={14} className="inline" />
                                </th>
                                <th className="text-center px-5 py-3 font-medium">
                                    <Play size={14} className="inline" />
                                </th>
                                <th className="text-center px-5 py-3 font-medium">Genres</th>
                                <th className="text-right px-5 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-t border-zinc-800/50">
                                        <td colSpan={8} className="px-5 py-4">
                                            <div className="h-4 bg-zinc-800 rounded animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredSongs.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-zinc-500">
                                        {searchQuery ? 'No songs match your search' : 'No songs uploaded yet'}
                                    </td>
                                </tr>
                            ) : (
                                filteredSongs.map((song, index) => (
                                    <tr
                                        key={song._id}
                                        className="border-t border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group"
                                    >
                                        <td className="px-5 py-3 text-zinc-500 text-sm">{index + 1}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                {song.coverUrl ? (
                                                    <img
                                                        src={song.coverUrl}
                                                        alt={song.title}
                                                        className="w-10 h-10 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center">
                                                        <Music size={16} className="text-zinc-500" />
                                                    </div>
                                                )}
                                                <span className="font-medium text-sm truncate max-w-[200px]">
                                                    {song.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-zinc-400 text-sm">{song.artist}</td>
                                        <td className="px-5 py-3 text-center text-zinc-400 text-sm">
                                            {formatDuration(song.duration)}
                                        </td>
                                        <td className="px-5 py-3 text-center text-zinc-400 text-sm">
                                            {formatSize(song.size)}
                                        </td>
                                        <td className="px-5 py-3 text-center text-zinc-400 text-sm">
                                            {song.plays?.toLocaleString() || 0}
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                {song.genres?.map((g) => (
                                                    <span
                                                        key={g}
                                                        className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full"
                                                    >
                                                        {g}
                                                    </span>
                                                )) || <span className="text-zinc-600 text-xs">--</span>}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            {deleteConfirm === song._id ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDelete(song._id)}
                                                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(song._id)}
                                                    className="text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete song"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminSongs;
