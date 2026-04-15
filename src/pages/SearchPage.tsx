import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    AudioWaveform,
    Brain,
    Disc3,
    Dumbbell,
    Mic2,
    Moon,
    Music2,
    Podcast,
    Play,
    UserRound,
} from 'lucide-react';
import { getAllSongsApi } from '@/api/song.api';
import type { Song } from '@/types';
import { usePlayerStore } from '@/store';

type FilterTab = 'all' | 'songs' | 'artists' | 'albums' | 'playlists';

interface CategoryItem {
    name: string;
    icon: React.ComponentType<{ size?: number }>;
    colorVar: string;
}

interface AlbumItem {
    key: string;
    name: string;
    coverUrl: string;
    count: number;
}

interface ArtistItem {
    name: string;
    coverUrl: string;
    count: number;
}

const FILTER_TABS: Array<{ id: FilterTab; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'songs', label: 'Songs' },
    { id: 'artists', label: 'Artists' },
    { id: 'albums', label: 'Albums' },
    { id: 'playlists', label: 'Playlists' },
];

const BROWSE_CATEGORIES: CategoryItem[] = [
    { name: 'Pop', icon: Music2, colorVar: 'var(--color-neon-pop)' },
    { name: 'Hip-Hop', icon: Mic2, colorVar: 'var(--color-neon-hiphop)' },
    { name: 'Electronic', icon: Disc3, colorVar: 'var(--color-neon-electronic)' },
    { name: 'Chill', icon: Moon, colorVar: 'var(--color-neon-chill)' },
    { name: 'Workout', icon: Dumbbell, colorVar: 'var(--color-neon-workout)' },
    { name: 'Focus', icon: Brain, colorVar: 'var(--color-neon-focus)' },
    { name: 'Podcasts', icon: Podcast, colorVar: 'var(--color-neon-podcasts)' },
];

const toArtistSlug = (artistName: string) =>
    artistName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<FilterTab>('all');
    const [catalog, setCatalog] = useState<Song[]>([]);
    const [isFetchingCatalog, setIsFetchingCatalog] = useState(true);
    const [isFiltering, setIsFiltering] = useState(false);

    const currentSong = usePlayerStore((state) => state.currentSong);
    const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
    const togglePlay = usePlayerStore((state) => state.togglePlay);

    const query = (searchParams.get('q') ?? '').trim();
    const normalizedQuery = query.toLowerCase();
    const hasQuery = normalizedQuery.length > 0;

    useEffect(() => {
        setActiveTab('all');
    }, [normalizedQuery]);

    useEffect(() => {
        let mounted = true;

        const fetchCatalog = async () => {
            setIsFetchingCatalog(true);
            try {
                const response = await getAllSongsApi();
                if (!mounted) return;
                setCatalog(response.data.data?.songs ?? []);
            } catch (error) {
                console.error('Failed to load search catalog', error);
                if (!mounted) return;
                setCatalog([]);
            } finally {
                if (mounted) {
                    setIsFetchingCatalog(false);
                }
            }
        };

        fetchCatalog();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!hasQuery) {
            setIsFiltering(false);
            return;
        }

        setIsFiltering(true);
        const timer = window.setTimeout(() => {
            setIsFiltering(false);
        }, 220);

        return () => {
            window.clearTimeout(timer);
        };
    }, [hasQuery, normalizedQuery, activeTab]);

    const matchedSongs = useMemo(() => {
        if (!hasQuery) return [];

        return catalog.filter((song) => {
            const title = song.title?.toLowerCase() ?? '';
            const artist = song.artist?.toLowerCase() ?? '';
            const album = song.album?.toLowerCase() ?? '';
            return (
                title.includes(normalizedQuery) ||
                artist.includes(normalizedQuery) ||
                album.includes(normalizedQuery)
            );
        });
    }, [catalog, hasQuery, normalizedQuery]);

    const rankedSongs = useMemo(() => {
        if (!hasQuery) return [];

        const scoreSong = (song: Song) => {
            const title = song.title.toLowerCase();
            const artist = song.artist.toLowerCase();
            const album = (song.album ?? '').toLowerCase();

            let score = 0;
            if (title === normalizedQuery) score += 12;
            if (title.startsWith(normalizedQuery)) score += 7;
            if (title.includes(normalizedQuery)) score += 4;
            if (artist.startsWith(normalizedQuery)) score += 4;
            if (artist.includes(normalizedQuery)) score += 2;
            if (album.includes(normalizedQuery)) score += 1;

            return score;
        };

        return [...matchedSongs].sort((a, b) => scoreSong(b) - scoreSong(a));
    }, [hasQuery, matchedSongs, normalizedQuery]);

    const topResult = rankedSongs[0] ?? null;
    const topSongs = rankedSongs.slice(0, 4);

    const albumItems = useMemo<AlbumItem[]>(() => {
        const map = new Map<string, AlbumItem>();

        rankedSongs.forEach((song) => {
            const albumName = song.album?.trim();
            if (!albumName) return;

            const key = albumName.toLowerCase();
            const existing = map.get(key);

            if (existing) {
                existing.count += 1;
                return;
            }

            map.set(key, {
                key,
                name: albumName,
                coverUrl: song.coverUrl,
                count: 1,
            });
        });

        return Array.from(map.values()).slice(0, 8);
    }, [rankedSongs]);

    const artistItems = useMemo<ArtistItem[]>(() => {
        const map = new Map<string, ArtistItem>();

        rankedSongs.forEach((song) => {
            const artistName = song.artist.trim();
            const key = artistName.toLowerCase();
            const existing = map.get(key);

            if (existing) {
                existing.count += 1;
                return;
            }

            map.set(key, {
                name: artistName,
                coverUrl: song.coverUrl,
                count: 1,
            });
        });

        return Array.from(map.values()).slice(0, 8);
    }, [rankedSongs]);

    const playlistItems = useMemo(() => {
        if (!hasQuery) return [];

        const moodPlaylists = [
            { id: 'p1', name: 'Night Neon Run', tracks: 24 },
            { id: 'p2', name: 'Late Focus Session', tracks: 18 },
            { id: 'p3', name: 'Soft Wave Chill', tracks: 32 },
            { id: 'p4', name: 'Pulse Workout Mix', tracks: 20 },
        ];

        return moodPlaylists.filter((playlist) =>
            playlist.name.toLowerCase().includes(normalizedQuery)
        );
    }, [hasQuery, normalizedQuery]);

    const showSongBlock = activeTab === 'all' || activeTab === 'songs';
    const showAlbumBlock = activeTab === 'all' || activeTab === 'albums';
    const showArtistBlock = activeTab === 'all' || activeTab === 'artists';
    const showPlaylistBlock = activeTab === 'playlists';

    const isLoading = isFetchingCatalog || (hasQuery && isFiltering);

    const handlePlaySong = (song: Song) => {
        if (currentSong?._id === song._id) {
            togglePlay();
            return;
        }
        setCurrentSong(song);
    };

    const openArtistPage = (artistName: string) => {
        const slug = toArtistSlug(artistName);
        if (!slug) return;
        navigate(`/artist/${encodeURIComponent(slug)}`);
    };

    const renderBrowseSkeleton = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-28 rounded-xl animate-pulse" style={{ background: 'var(--color-bg-surface)' }} />
            ))}
        </div>
    );

    const renderResultsSkeleton = () => (
        <div className="space-y-5">
            <div className="h-10 w-full rounded-full animate-pulse" style={{ background: 'var(--color-bg-surface)' }} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="h-64 rounded-2xl animate-pulse" style={{ background: 'var(--color-bg-surface)' }} />
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-14 rounded-xl animate-pulse" style={{ background: 'var(--color-bg-surface)' }} />
                    ))}
                </div>
            </div>
            <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-36 w-40 shrink-0 rounded-xl animate-pulse" style={{ background: 'var(--color-bg-surface)' }} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full px-4 md:px-6 lg:px-8 py-4 md:py-6" style={{ color: 'var(--color-text-primary)' }}>
            {!hasQuery ? (
                <section className="space-y-4">
                    <h2
                        style={{
                            margin: 0,
                            fontSize: 'var(--text-2xl)',
                            fontWeight: 800,
                            fontFamily: 'var(--font-display)',
                        }}
                    >
                        Browse All
                    </h2>

                    {isLoading ? (
                        renderBrowseSkeleton()
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                            {BROWSE_CATEGORIES.map((category) => {
                                const Icon = category.icon;

                                return (
                                    <button
                                        key={category.name}
                                        type="button"
                                        className="relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-150"
                                        style={{
                                            background: 'var(--color-bg-surface)',
                                            borderColor: 'var(--color-bg-elevated)',
                                        }}
                                    >
                                        <div
                                            className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-25"
                                            style={{ background: category.colorVar }}
                                        />
                                        <div
                                            className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg"
                                            style={{
                                                background: 'var(--color-bg-elevated)',
                                                color: category.colorVar,
                                            }}
                                        >
                                            <Icon size={20} />
                                        </div>
                                        <p
                                            style={{
                                                margin: 0,
                                                fontSize: 'var(--text-lg)',
                                                fontWeight: 700,
                                                color: 'var(--color-text-primary)',
                                            }}
                                        >
                                            {category.name}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>
            ) : isLoading ? (
                renderResultsSkeleton()
            ) : (
                <section className="space-y-6">
                    <div>
                        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
                            Results for
                        </p>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: 'var(--text-2xl)',
                                fontWeight: 800,
                                fontFamily: 'var(--font-display)',
                            }}
                        >
                            {query}
                        </h2>
                    </div>

                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {FILTER_TABS.map((tab) => {
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150"
                                    style={{
                                        background: isActive ? 'var(--color-bg-elevated)' : 'var(--color-bg-surface)',
                                        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                        border: '1px solid var(--color-bg-elevated)',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {showSongBlock && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <article
                                className="rounded-2xl border p-4"
                                style={{
                                    background: 'var(--color-bg-surface)',
                                    borderColor: 'var(--color-bg-elevated)',
                                }}
                            >
                                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                    Top result
                                </p>

                                {topResult ? (
                                    <div className="mt-3">
                                        <div
                                            className="h-44 w-full overflow-hidden rounded-xl"
                                            style={{ background: 'var(--color-bg-elevated)' }}
                                        >
                                            {topResult.coverUrl ? (
                                                <img src={topResult.coverUrl} alt={topResult.title} className="h-full w-full object-cover" />
                                            ) : null}
                                        </div>
                                        <h3 style={{ margin: '0.75rem 0 0.25rem 0', fontSize: 'var(--text-xl)', fontWeight: 800 }}>
                                            {topResult.title}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => openArtistPage(topResult.artist)}
                                            className="text-left"
                                            style={{
                                                margin: 0,
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--text-sm)',
                                            }}
                                        >
                                            {topResult.artist}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlePlaySong(topResult)}
                                            className="mt-3 inline-flex h-10 w-10 items-center justify-center rounded-full"
                                            style={{ background: 'var(--color-accent-neon)', color: 'var(--color-bg-primary)' }}
                                        >
                                            <Play size={16} className="ml-0.5" />
                                        </button>
                                    </div>
                                ) : (
                                    <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        No clear top result.
                                    </p>
                                )}
                            </article>

                            <article
                                className="rounded-2xl border p-4"
                                style={{
                                    background: 'var(--color-bg-surface)',
                                    borderColor: 'var(--color-bg-elevated)',
                                }}
                            >
                                <p style={{ margin: 0, fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                    Songs
                                </p>
                                <div className="mt-3 space-y-2">
                                    {topSongs.map((song) => (
                                        <button
                                            key={song._id}
                                            type="button"
                                            onClick={() => navigate(`/song/${song._id}`)}
                                            className="w-full rounded-xl p-2 transition-colors duration-150"
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: '44px minmax(0, 1fr) 36px',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                background: 'var(--color-bg-elevated)',
                                            }}
                                        >
                                            <div className="h-11 w-11 overflow-hidden rounded-lg" style={{ background: 'var(--color-bg-surface)' }}>
                                                {song.coverUrl ? (
                                                    <img src={song.coverUrl} alt={song.title} className="h-full w-full object-cover" />
                                                ) : null}
                                            </div>
                                            <div className="min-w-0 text-left">
                                                <p className="truncate" style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                                                    {song.title}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        openArtistPage(song.artist);
                                                    }}
                                                    className="truncate text-left"
                                                    style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}
                                                >
                                                    {song.artist}
                                                </button>
                                            </div>
                                            <span
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    handlePlaySong(song);
                                                }}
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                                style={{
                                                    background: 'var(--color-bg-surface)',
                                                    color: 'var(--color-text-secondary)',
                                                }}
                                            >
                                                <Play size={14} className="ml-0.5" />
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </article>
                        </div>
                    )}

                    {showAlbumBlock && (
                        <div>
                            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: 'var(--text-lg)', fontWeight: 700 }}>Albums</h3>
                            {albumItems.length > 0 ? (
                                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                    {albumItems.map((album) => (
                                        <article
                                            key={album.key}
                                            className="w-40 shrink-0 rounded-xl border p-3"
                                            style={{
                                                background: 'var(--color-bg-surface)',
                                                borderColor: 'var(--color-bg-elevated)',
                                            }}
                                        >
                                            <div className="h-28 w-full overflow-hidden rounded-lg" style={{ background: 'var(--color-bg-elevated)' }}>
                                                {album.coverUrl ? (
                                                    <img src={album.coverUrl} alt={album.name} className="h-full w-full object-cover" />
                                                ) : null}
                                            </div>
                                            <p className="truncate" style={{ margin: '0.5rem 0 0 0', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                                                {album.name}
                                            </p>
                                            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                                                {album.count} songs
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>No albums matched.</p>
                            )}
                        </div>
                    )}

                    {showArtistBlock && (
                        <div>
                            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: 'var(--text-lg)', fontWeight: 700 }}>Artists</h3>
                            {artistItems.length > 0 ? (
                                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                    {artistItems.map((artist) => (
                                        <button
                                            key={artist.name}
                                            type="button"
                                            onClick={() => openArtistPage(artist.name)}
                                            className="w-40 shrink-0 rounded-xl border p-3 text-left"
                                            style={{
                                                background: 'var(--color-bg-surface)',
                                                borderColor: 'var(--color-bg-elevated)',
                                            }}
                                        >
                                            <div className="h-28 w-full overflow-hidden rounded-lg" style={{ background: 'var(--color-bg-elevated)' }}>
                                                {artist.coverUrl ? (
                                                    <img src={artist.coverUrl} alt={artist.name} className="h-full w-full object-cover" />
                                                ) : null}
                                            </div>
                                            <p className="truncate" style={{ margin: '0.5rem 0 0 0', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                                                {artist.name}
                                            </p>
                                            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                                                {artist.count} tracks
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>No artists matched.</p>
                            )}
                        </div>
                    )}

                    {showPlaylistBlock && (
                        <div>
                            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: 'var(--text-lg)', fontWeight: 700 }}>Playlists</h3>
                            {playlistItems.length > 0 ? (
                                <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                    {playlistItems.map((playlist) => (
                                        <article
                                            key={playlist.id}
                                            className="w-44 shrink-0 rounded-xl border p-3"
                                            style={{
                                                background: 'var(--color-bg-surface)',
                                                borderColor: 'var(--color-bg-elevated)',
                                            }}
                                        >
                                            <div
                                                className="h-24 w-full rounded-lg"
                                                style={{
                                                    background: 'var(--color-bg-elevated)',
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    color: 'var(--color-text-secondary)',
                                                }}
                                            >
                                                <AudioWaveform size={24} />
                                            </div>
                                            <p className="truncate" style={{ margin: '0.5rem 0 0 0', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                                                {playlist.name}
                                            </p>
                                            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                                                {playlist.tracks} tracks
                                            </p>
                                        </article>
                                    ))}
                                </div>
                            ) : (
                                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>No playlists matched.</p>
                            )}
                        </div>
                    )}

                    {!isLoading && rankedSongs.length === 0 && activeTab !== 'playlists' && (
                        <div
                            className="rounded-xl border px-4 py-6"
                            style={{
                                background: 'var(--color-bg-surface)',
                                borderColor: 'var(--color-bg-elevated)',
                                textAlign: 'center',
                            }}
                        >
                            <UserRound size={20} style={{ margin: '0 auto 0.5rem auto', color: 'var(--color-text-muted)' }} />
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                                No results found for this query.
                            </p>
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default SearchPage;
