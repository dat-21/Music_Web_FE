import { useEffect, useMemo, useState } from 'react';
import type { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Clock3,
    Ellipsis,
    Heart,
    ListPlus,
    Play,
    Shuffle,
    UserRound,
} from 'lucide-react';
import { getMyPlaylistsApi, type LibraryPlaylist } from '@/api/playlist.api';
import { getAllSongsApi } from '@/api/song.api';
import { usePlayerStore } from '@/store';
import useNotification from '@/hooks/useNotification';
import { getApiErrorMessage } from '@/utils/apiError.utils';
import type { Song } from '@/types';

type RGB = { r: number; g: number; b: number };

interface PlaylistTrack extends Song {
    addedAt: string;
}

const DEFAULT_NEON: RGB = { r: 0, g: 229, b: 255 };

const formatTrackTime = (seconds?: number) => {
    const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds || 0)) : 0;
    const minutes = Math.floor(total / 60);
    const remain = total % 60;
    return `${minutes}:${remain.toString().padStart(2, '0')}`;
};

const formatPlaylistDuration = (seconds: number) => {
    const safeTotal = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(safeTotal / 3600);
    const minutes = Math.floor((safeTotal % 3600) / 60);

    if (hours <= 0) return `${minutes} min`;
    if (minutes <= 0) return `${hours} hr`;
    return `${hours} hr ${minutes} min`;
};

const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return 'Unknown';

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const toTrack = (
    value: Partial<Song> | string,
    index: number,
    fallbackTimestamp: number,
): PlaylistTrack | null => {
    if (!value || typeof value === 'string') return null;

    const title = value.title?.trim();
    const artist = value.artist?.trim();
    if (!title || !artist) return null;

    const fallbackId = `${title.toLowerCase().replace(/\s+/g, '-')}-${artist
        .toLowerCase()
        .replace(/\s+/g, '-')}-${index}`;

    const addedAt = new Date(fallbackTimestamp - index * 86_400_000).toISOString();

    return {
        _id: value._id || fallbackId,
        title,
        artist,
        album: value.album,
        coverUrl: value.coverUrl || '',
        fileUrl: value.fileUrl || '',
        duration: value.duration,
        genres: value.genres,
        likes: value.likes,
        plays: value.plays,
        addedAt,
    };
};

const resolveOwnerName = (owner: LibraryPlaylist['user']) => {
    if (!owner) return 'You';
    if (typeof owner === 'string') return 'You';

    return owner.username?.trim() || owner.name?.trim() || 'You';
};

const extractDominantColor = (imageUrl: string): Promise<RGB> =>
    new Promise((resolve) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.referrerPolicy = 'no-referrer';

        image.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = 32;
                canvas.height = 32;

                const context = canvas.getContext('2d');
                if (!context) {
                    resolve(DEFAULT_NEON);
                    return;
                }

                context.drawImage(image, 0, 0, 32, 32);
                const pixels = context.getImageData(0, 0, 32, 32).data;

                let red = 0;
                let green = 0;
                let blue = 0;
                let sampled = 0;

                for (let i = 0; i < pixels.length; i += 16) {
                    const alpha = pixels[i + 3];
                    if (alpha < 18) continue;

                    red += pixels[i];
                    green += pixels[i + 1];
                    blue += pixels[i + 2];
                    sampled += 1;
                }

                if (sampled <= 0) {
                    resolve(DEFAULT_NEON);
                    return;
                }

                resolve({
                    r: Math.round(red / sampled),
                    g: Math.round(green / sampled),
                    b: Math.round(blue / sampled),
                });
            } catch {
                resolve(DEFAULT_NEON);
            }
        };

        image.onerror = () => resolve(DEFAULT_NEON);
        image.src = imageUrl;
    });

const toArtistSlug = (artistName: string) =>
    artistName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const PlaylistDetailPage = () => {
    const params = useParams<{ id: string }>();
    const playlistId = params.id?.trim() || '';
    const navigate = useNavigate();

    const [playlist, setPlaylist] = useState<LibraryPlaylist | null>(null);
    const [allSongs, setAllSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [dominantColor, setDominantColor] = useState<RGB>(DEFAULT_NEON);
    const [isFollowed, setIsFollowed] = useState(false);
    const [likedTrackIds, setLikedTrackIds] = useState<string[]>([]);
    const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null);

    const currentSong = usePlayerStore((state) => state.currentSong);
    const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
    const togglePlay = usePlayerStore((state) => state.togglePlay);

    const { showInfo, showSuccess } = useNotification();

    useEffect(() => {
        let mounted = true;

        const fetchPlaylistData = async () => {
            if (!playlistId) {
                setErrorMessage('Playlist ID is missing.');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setErrorMessage(null);

            try {
                const [playlistResponse, songResponse] = await Promise.all([
                    getMyPlaylistsApi(),
                    getAllSongsApi(),
                ]);

                if (!mounted) return;

                const playlists = playlistResponse.data.data?.playlists ?? [];
                const matchedPlaylist = playlists.find((item) => {
                    const itemId = (item._id || item.id || '').toString();
                    return itemId === playlistId;
                });

                setAllSongs(songResponse.data.data?.songs ?? []);

                if (!matchedPlaylist) {
                    setPlaylist(null);
                    setErrorMessage('Playlist not found in your library.');
                    return;
                }

                setPlaylist(matchedPlaylist);
            } catch (error) {
                if (!mounted) return;

                setPlaylist(null);
                setAllSongs([]);
                setErrorMessage(
                    getApiErrorMessage(
                        error as AxiosError<{ message?: string }> | Error,
                        'Unable to load this playlist right now.'
                    )
                );
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchPlaylistData();

        return () => {
            mounted = false;
        };
    }, [playlistId]);

    const tracks = useMemo<PlaylistTrack[]>(() => {
        if (!playlist) return [];

        const fallbackTimestamp = new Date(
            playlist.updatedAt || playlist.createdAt || Date.now(),
        ).getTime();

        const songById = new Map(allSongs.map((song) => [song._id, song]));
        const songByTitleArtist = new Map(
            allSongs.map((song) => [
                `${song.title.toLowerCase()}::${song.artist.toLowerCase()}`,
                song,
            ]),
        );

        return (playlist.songs ?? [])
            .map((value, index) => {
                const track = toTrack(value, index, fallbackTimestamp);
                if (!track) return null;

                const resolvedSong =
                    songById.get(track._id) ||
                    songByTitleArtist.get(
                        `${track.title.toLowerCase()}::${track.artist.toLowerCase()}`,
                    );

                if (!resolvedSong) return track;

                return {
                    ...resolvedSong,
                    coverUrl: resolvedSong.coverUrl || track.coverUrl,
                    fileUrl: resolvedSong.fileUrl || track.fileUrl,
                    addedAt: track.addedAt,
                };
            })
            .filter((song): song is PlaylistTrack => song !== null);
    }, [playlist, allSongs]);

    const owner = useMemo(() => resolveOwnerName(playlist?.user), [playlist?.user]);

    const coverUrl = useMemo(() => tracks[0]?.coverUrl || '', [tracks]);

    useEffect(() => {
        let mounted = true;

        if (!coverUrl) {
            setDominantColor(DEFAULT_NEON);
            return;
        }

        const readColor = async () => {
            const color = await extractDominantColor(coverUrl);
            if (mounted) {
                setDominantColor(color);
            }
        };

        void readColor();

        return () => {
            mounted = false;
        };
    }, [coverUrl]);

    const totalDuration = useMemo(
        () => tracks.reduce((sum, track) => sum + (track.duration || 0), 0),
        [tracks],
    );

    const playlistTrackIds = useMemo(() => new Set(tracks.map((track) => track._id)), [tracks]);

    const recommendedSongs = useMemo(() => {
        if (allSongs.length === 0) return [];

        const artistSet = new Set(tracks.map((track) => track.artist.toLowerCase()));
        const albumSet = new Set(
            tracks
                .map((track) => track.album?.toLowerCase().trim())
                .filter((album): album is string => Boolean(album)),
        );
        const genreSet = new Set(
            tracks.flatMap((track) => (track.genres ?? []).map((genre) => genre.toLowerCase())),
        );

        const scored = allSongs
            .filter((song) => !playlistTrackIds.has(song._id))
            .map((song) => {
                let score = 0;
                if (artistSet.has(song.artist.toLowerCase())) score += 7;
                if (song.album && albumSet.has(song.album.toLowerCase())) score += 3;
                if ((song.genres ?? []).some((genre) => genreSet.has(genre.toLowerCase()))) {
                    score += 3;
                }
                score += Math.min(2, (song.plays ?? 0) / 2000);

                return { song, score };
            })
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return (b.song.plays ?? 0) - (a.song.plays ?? 0);
            });

        const preferred = scored
            .filter((entry) => entry.score > 0)
            .slice(0, 10)
            .map((entry) => entry.song);

        if (preferred.length >= 5) return preferred;

        const fallback = scored.slice(0, 10).map((entry) => entry.song);
        const merged = [...preferred];

        fallback.forEach((song) => {
            if (merged.length >= 10) return;
            if (merged.some((entry) => entry._id === song._id)) return;
            merged.push(song);
        });

        return merged;
    }, [allSongs, tracks, playlistTrackIds]);

    const handlePlayTrack = (track: Song) => {
        if (currentSong?._id === track._id) {
            togglePlay();
            return;
        }

        setCurrentSong(track);
    };

    const handlePlayPlaylist = () => {
        if (tracks.length === 0) return;
        handlePlayTrack(tracks[0]);
    };

    const handleShuffle = () => {
        if (tracks.length === 0) return;

        const randomIndex = Math.floor(Math.random() * tracks.length);
        handlePlayTrack(tracks[randomIndex]);
    };

    const toggleLikeTrack = (trackId: string) => {
        setLikedTrackIds((prev) =>
            prev.includes(trackId)
                ? prev.filter((id) => id !== trackId)
                : [...prev, trackId],
        );
    };

    const handleAddRecommended = (song: Song) => {
        setCurrentSong(song);
        showSuccess(`${song.title} added to queue.`);
    };

    if (isLoading) {
        return (
            <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8">
                <div className="space-y-3">
                    <div className="h-64 rounded-3xl animate-pulse" style={{ background: 'var(--color-bg-surface)' }} />
                    <div className="h-11 rounded-xl animate-pulse" style={{ background: 'var(--color-bg-surface)' }} />
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-14 rounded-lg animate-pulse"
                            style={{ background: 'var(--color-bg-surface)' }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (errorMessage || !playlist) {
        return (
            <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8" style={{ color: 'var(--color-text-primary)' }}>
                <section
                    className="rounded-2xl border px-5 py-8"
                    style={{
                        background: 'var(--color-bg-surface)',
                        borderColor: 'rgba(255, 64, 129, 0.35)',
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', fontFamily: 'var(--font-display)' }}>
                        Playlist unavailable
                    </h2>
                    <p style={{ margin: '0.6rem 0 0 0', color: 'var(--color-text-secondary)' }}>
                        {errorMessage || 'Unable to open this playlist.'}
                    </p>
                </section>
            </div>
        );
    }

    const isPlaylistPlaying = tracks.some((track) => track._id === currentSong?._id);

    return (
        <div className="w-full" style={{ color: 'var(--color-text-primary)' }}>
            <section className="relative overflow-hidden px-4 pb-8 pt-6 md:px-6 lg:px-8">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: `linear-gradient(180deg, rgba(${dominantColor.r},${dominantColor.g},${dominantColor.b},0.42) 0%, rgba(${dominantColor.r},${dominantColor.g},${dominantColor.b},0.18) 32%, rgba(5,7,15,0) 72%)`,
                    }}
                />

                <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end">
                    <div
                        className="h-52 w-52 overflow-hidden rounded-2xl border shadow-[0_22px_40px_-18px_rgba(0,0,0,0.7)] md:h-64 md:w-64"
                        style={{
                            borderColor: 'rgba(255,255,255,0.16)',
                            background: 'var(--color-bg-elevated)',
                        }}
                    >
                        {coverUrl ? (
                            <img src={coverUrl} alt={playlist.name} className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-white/60">
                                <UserRound size={48} />
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1 space-y-2 md:space-y-3">
                        <p
                            style={{
                                margin: 0,
                                fontSize: 'var(--text-xs)',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: 'rgba(240,244,255,0.76)',
                            }}
                        >
                            Playlist
                        </p>

                        <h1
                            className="truncate"
                            style={{
                                margin: 0,
                                fontSize: 'clamp(1.8rem, 4.6vw, 3.3rem)',
                                lineHeight: 1.04,
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                                textShadow: '0 8px 34px rgba(0,0,0,0.45)',
                            }}
                        >
                            {playlist.name}
                        </h1>

                        <p
                            style={{
                                margin: 0,
                                maxWidth: '80ch',
                                color: 'rgba(240,244,255,0.8)',
                            }}
                        >
                            {playlist.description?.trim() || 'No description for this playlist yet.'}
                        </p>

                        <p style={{ margin: 0, color: 'rgba(240,244,255,0.82)', fontSize: 'var(--text-sm)' }}>
                            <span style={{ fontWeight: 700 }}>{owner}</span>
                            <span style={{ margin: '0 0.45rem' }}>•</span>
                            <span>{tracks.length} tracks</span>
                            <span style={{ margin: '0 0.45rem' }}>•</span>
                            <span>{formatPlaylistDuration(totalDuration)}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-2 pt-2">
                            <button
                                type="button"
                                onClick={handlePlayPlaylist}
                                className="inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-bold"
                                style={{
                                    background: 'var(--gradient-accent-neon)',
                                    color: 'var(--color-bg-primary)',
                                    boxShadow: '0 8px 24px rgba(0,229,255,0.3)',
                                }}
                            >
                                <Play size={16} className="ml-0.5" />
                                {isPlaylistPlaying ? 'Now playing' : 'Play'}
                            </button>

                            <button
                                type="button"
                                onClick={handleShuffle}
                                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold"
                                style={{
                                    border: '1px solid var(--color-bg-elevated)',
                                    background: 'rgba(255,255,255,0.04)',
                                }}
                            >
                                <Shuffle size={16} />
                                Shuffle
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsFollowed((prev) => !prev)}
                                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold"
                                style={{
                                    border: isFollowed
                                        ? '1px solid rgba(0,229,255,0.42)'
                                        : '1px solid var(--color-bg-elevated)',
                                    background: isFollowed ? 'rgba(0,229,255,0.14)' : 'rgba(255,255,255,0.04)',
                                    color: isFollowed ? 'var(--color-accent-neon)' : 'var(--color-text-primary)',
                                }}
                            >
                                {isFollowed ? 'Following' : 'Follow'}
                            </button>

                            <button
                                type="button"
                                onClick={() => showInfo('More playlist actions can be added here.')}
                                className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                                style={{
                                    border: '1px solid var(--color-bg-elevated)',
                                    background: 'rgba(255,255,255,0.04)',
                                }}
                            >
                                <Ellipsis size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 pb-6 md:px-6 lg:px-8">
                <div className="overflow-x-auto">
                    <div className="min-w-[900px]">
                        <div
                            className="sticky top-0 z-20 grid items-center rounded-lg px-3 py-2 text-xs uppercase tracking-widest"
                            style={{
                                gridTemplateColumns: '52px minmax(0,2fr) minmax(0,1.2fr) 130px 90px 60px',
                                color: 'var(--color-text-muted)',
                                background: 'rgba(5,7,15,0.85)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                            }}
                        >
                            <span>#</span>
                            <span>Title</span>
                            <span>Album</span>
                            <span>Date Added</span>
                            <span>Time</span>
                            <span>Like</span>
                        </div>

                        <div className="mt-2 space-y-1.5">
                            {tracks.map((track, index) => {
                                const isActive = currentSong?._id === track._id;
                                const isHovered = hoveredTrackId === track._id;
                                const isLiked = likedTrackIds.includes(track._id);

                                return (
                                    <article
                                        key={track._id}
                                        onMouseEnter={() => setHoveredTrackId(track._id)}
                                        onMouseLeave={() => setHoveredTrackId(null)}
                                        className="grid items-center rounded-lg px-3 py-2 transition-colors duration-150"
                                        style={{
                                            gridTemplateColumns: '52px minmax(0,2fr) minmax(0,1.2fr) 130px 90px 60px',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            background: isHovered
                                                ? 'rgba(255,255,255,0.08)'
                                                : isActive
                                                    ? 'rgba(0,229,255,0.09)'
                                                    : 'rgba(255,255,255,0.03)',
                                        }}
                                    >
                                        <div className="flex items-center justify-center">
                                            {isHovered ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handlePlayTrack(track)}
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                                    style={{
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                        background: 'rgba(255,255,255,0.08)',
                                                        color: 'var(--color-text-primary)',
                                                    }}
                                                >
                                                    <Play size={14} className="ml-0.5" />
                                                </button>
                                            ) : (
                                                <span
                                                    style={{
                                                        color: 'var(--color-text-secondary)',
                                                        fontSize: 'var(--text-sm)',
                                                    }}
                                                >
                                                    {index + 1}
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handlePlayTrack(track)}
                                            className="flex min-w-0 items-center gap-3 text-left"
                                        >
                                            <div
                                                className="h-11 w-11 overflow-hidden rounded-md"
                                                style={{ background: 'var(--color-bg-elevated)' }}
                                            >
                                                {track.coverUrl ? (
                                                    <img
                                                        src={track.coverUrl}
                                                        alt={track.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-white/45">
                                                        <Play size={14} />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <p
                                                    className="truncate"
                                                    style={{
                                                        margin: 0,
                                                        fontWeight: 700,
                                                        fontSize: 'var(--text-sm)',
                                                        color: isActive
                                                            ? 'var(--color-accent-neon)'
                                                            : 'var(--color-text-primary)',
                                                    }}
                                                >
                                                    {track.title}
                                                </p>
                                                <p
                                                    className="truncate"
                                                    style={{
                                                        margin: 0,
                                                        color: 'var(--color-text-muted)',
                                                        fontSize: 'var(--text-xs)',
                                                    }}
                                                >
                                                    {track.artist}
                                                </p>
                                            </div>

                                            {isActive && (
                                                <span className="relative ml-2 inline-flex h-2.5 w-2.5">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300/80" />
                                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
                                                </span>
                                            )}
                                        </button>

                                        <p
                                            className="truncate px-1"
                                            style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}
                                        >
                                            {track.album || 'Single'}
                                        </p>

                                        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                            {formatDate(track.addedAt)}
                                        </p>

                                        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                            {formatTrackTime(track.duration)}
                                        </p>

                                        <button
                                            type="button"
                                            aria-label="Like track"
                                            onClick={() => toggleLikeTrack(track._id)}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                            style={{
                                                color: isLiked ? '#ff8ab2' : 'var(--color-text-secondary)',
                                                background: isLiked ? 'rgba(255, 64, 129, 0.12)' : 'transparent',
                                            }}
                                        >
                                            <Heart size={15} fill={isLiked ? 'currentColor' : 'none'} />
                                        </button>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-4 pb-10 md:px-6 lg:px-8">
                <div
                    className="rounded-2xl border p-4 md:p-5"
                    style={{
                        background: 'var(--color-bg-surface)',
                        borderColor: 'var(--color-bg-elevated)',
                    }}
                >
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 'var(--text-xl)',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                            }}
                        >
                            Recommended for this playlist
                        </h2>
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                            {recommendedSongs.length} suggestions
                        </span>
                    </div>

                    {recommendedSongs.length > 0 ? (
                        <div className="space-y-2">
                            {recommendedSongs.slice(0, 10).map((song) => (
                                <article
                                    key={song._id}
                                    className="grid items-center gap-3 rounded-xl px-3 py-2"
                                    style={{
                                        gridTemplateColumns: '44px minmax(0,1fr) 110px',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <div
                                        className="h-11 w-11 overflow-hidden rounded-md"
                                        style={{ background: 'var(--color-bg-elevated)' }}
                                    >
                                        {song.coverUrl ? (
                                            <img src={song.coverUrl} alt={song.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-white/45">
                                                <Clock3 size={15} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="truncate"
                                            style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-sm)' }}
                                        >
                                            {song.title}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const slug = toArtistSlug(song.artist);
                                                if (!slug) return;
                                                navigate(`/artist/${encodeURIComponent(slug)}`);
                                            }}
                                            className="truncate text-left"
                                            style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}
                                        >
                                            {song.artist}
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleAddRecommended(song)}
                                        className="inline-flex h-9 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold"
                                        style={{
                                            border: '1px solid rgba(0,229,255,0.45)',
                                            background: 'rgba(0,229,255,0.12)',
                                            color: 'var(--color-accent-neon)',
                                        }}
                                    >
                                        <ListPlus size={14} />
                                        Add
                                    </button>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                            We could not generate recommendations for this playlist yet.
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default PlaylistDetailPage;
