import { useEffect, useMemo, useState } from 'react';
import type { AxiosError } from 'axios';
import {
    Ellipsis,
    Grid2X2,
    List,
    ListMusic,
    Music2,
    PlusCircle,
    Share2,
    Trash2,
    UserRound,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { deletePlaylistApi, getMyPlaylistsApi, type LibraryPlaylist } from '@/api/playlist.api';
import { usePlayerStore } from '@/store';
import useNotification from '@/hooks/useNotification';
import { getApiErrorMessage } from '@/utils/apiError.utils';
import type { Song } from '@/types';

type FilterTab = 'playlists' | 'albums' | 'artists' | 'podcasts';
type SortMode = 'recent' | 'alphabetical' | 'creator';
type ViewMode = 'list' | 'grid';
type LibraryItemType = 'Playlist' | 'Album' | 'Artist' | 'Podcast';

interface LibraryItem {
    id: string;
    sourcePlaylistId?: string;
    name: string;
    type: LibraryItemType;
    metricValue: number;
    metricLabel: 'songs' | 'followers';
    creator: string;
    addedAt: string;
    coverUrl: string;
    songs: Song[];
}

interface ActionMenuState {
    item: LibraryItem;
    x: number;
    y: number;
}

const FILTER_TABS: Array<{ id: FilterTab; label: string }> = [
    { id: 'playlists', label: 'Playlists' },
    { id: 'albums', label: 'Albums' },
    { id: 'artists', label: 'Artists' },
    { id: 'podcasts', label: 'Podcasts' },
];

const SORT_OPTIONS: Array<{ id: SortMode; label: string }> = [
    { id: 'recent', label: 'Recently added' },
    { id: 'alphabetical', label: 'Alphabetical' },
    { id: 'creator', label: 'Creator' },
];

const MENU_WIDTH = 216;
const MENU_HEIGHT = 148;

const formatAddedDate = (isoDate: string) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return 'Unknown';

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

const resolveCreatorName = (owner: LibraryPlaylist['user']) => {
    if (!owner) return 'You';
    if (typeof owner === 'string') return 'You';

    return owner.username?.trim() || owner.name?.trim() || 'You';
};

const toSong = (value: Partial<Song> | string): Song | null => {
    if (!value || typeof value === 'string') return null;

    const title = value.title?.trim();
    const artist = value.artist?.trim();
    if (!title || !artist) return null;

    const fallbackId = `${title.toLowerCase().replace(/\s+/g, '-')}-${artist
        .toLowerCase()
        .replace(/\s+/g, '-')}`;

    return {
        _id: value._id || fallbackId,
        title,
        artist,
        album: value.album,
        coverUrl: value.coverUrl || '',
        fileUrl: value.fileUrl || '',
        duration: value.duration,
        genres: value.genres,
    };
};

const countLabel = (item: LibraryItem) => {
    const value = new Intl.NumberFormat('en-US').format(item.metricValue);
    return `${value} ${item.metricLabel}`;
};

const clampMenuPosition = (x: number, y: number) => {
    const maxX = Math.max(12, window.innerWidth - MENU_WIDTH - 12);
    const maxY = Math.max(12, window.innerHeight - MENU_HEIGHT - 12);

    return {
        x: Math.max(12, Math.min(x, maxX)),
        y: Math.max(12, Math.min(y, maxY)),
    };
};

const LibraryPage = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState<FilterTab>('playlists');
    const [sortMode, setSortMode] = useState<SortMode>('recent');
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [libraryPlaylists, setLibraryPlaylists] = useState<LibraryPlaylist[]>([]);
    const [hiddenItemIds, setHiddenItemIds] = useState<string[]>([]);
    const [menuState, setMenuState] = useState<ActionMenuState | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
    const { showSuccess, showInfo, showError } = useNotification();

    useEffect(() => {
        let mounted = true;

        const fetchLibrary = async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const response = await getMyPlaylistsApi();
                if (!mounted) return;

                setLibraryPlaylists(response.data?.playlists ?? []);
            } catch (error) {
                const message = getApiErrorMessage(
                    error as AxiosError<{ message?: string }> | Error,
                    'Unable to load your library right now.'
                );

                if (!mounted) return;
                setLibraryPlaylists([]);
                setErrorMessage(message);
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchLibrary();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const handleWindowClose = () => setMenuState(null);
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuState(null);
            }
        };

        window.addEventListener('click', handleWindowClose);
        window.addEventListener('resize', handleWindowClose);
        window.addEventListener('scroll', handleWindowClose, true);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('click', handleWindowClose);
            window.removeEventListener('resize', handleWindowClose);
            window.removeEventListener('scroll', handleWindowClose, true);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const playlistItems = useMemo<LibraryItem[]>(() => {
        return libraryPlaylists.map((playlist, index) => {
            const songs = (playlist.songs ?? [])
                .map((song) => toSong(song))
                .filter((song): song is Song => song !== null);

            const playlistId = playlist._id || playlist.id || `playlist-${index}`;
            const addedAt =
                playlist.createdAt ||
                playlist.updatedAt ||
                new Date(Date.now() - index * 60_000).toISOString();

            return {
                id: `playlist:${playlistId}`,
                sourcePlaylistId: playlistId,
                name: playlist.name?.trim() || 'Untitled Playlist',
                type: 'Playlist',
                metricValue: songs.length,
                metricLabel: 'songs',
                creator: resolveCreatorName(playlist.user),
                addedAt,
                coverUrl: songs[0]?.coverUrl || '',
                songs,
            };
        });
    }, [libraryPlaylists]);

    const albumItems = useMemo<LibraryItem[]>(() => {
        const albumMap = new Map<
            string,
            {
                name: string;
                songs: Song[];
                creator: string;
                addedAt: string;
                coverUrl: string;
            }
        >();

        playlistItems.forEach((playlistItem) => {
            playlistItem.songs.forEach((song) => {
                const albumName = song.album?.trim();
                if (!albumName) return;

                const key = albumName.toLowerCase();
                const existing = albumMap.get(key);

                if (existing) {
                    existing.songs.push(song);
                    if (new Date(playlistItem.addedAt).getTime() > new Date(existing.addedAt).getTime()) {
                        existing.addedAt = playlistItem.addedAt;
                    }
                    if (!existing.coverUrl && song.coverUrl) {
                        existing.coverUrl = song.coverUrl;
                    }
                    return;
                }

                albumMap.set(key, {
                    name: albumName,
                    songs: [song],
                    creator: song.artist,
                    addedAt: playlistItem.addedAt,
                    coverUrl: song.coverUrl || '',
                });
            });
        });

        return Array.from(albumMap.entries()).map(([key, entry]) => ({
            id: `album:${key}`,
            name: entry.name,
            type: 'Album',
            metricValue: entry.songs.length,
            metricLabel: 'songs',
            creator: entry.creator,
            addedAt: entry.addedAt,
            coverUrl: entry.coverUrl,
            songs: entry.songs,
        }));
    }, [playlistItems]);

    const artistItems = useMemo<LibraryItem[]>(() => {
        const artistMap = new Map<
            string,
            {
                name: string;
                songs: Song[];
                playlists: Set<string>;
                addedAt: string;
                coverUrl: string;
            }
        >();

        playlistItems.forEach((playlistItem) => {
            playlistItem.songs.forEach((song) => {
                const artistName = song.artist.trim();
                const key = artistName.toLowerCase();
                const existing = artistMap.get(key);

                if (existing) {
                    existing.songs.push(song);
                    existing.playlists.add(playlistItem.id);
                    if (new Date(playlistItem.addedAt).getTime() > new Date(existing.addedAt).getTime()) {
                        existing.addedAt = playlistItem.addedAt;
                    }
                    if (!existing.coverUrl && song.coverUrl) {
                        existing.coverUrl = song.coverUrl;
                    }
                    return;
                }

                artistMap.set(key, {
                    name: artistName,
                    songs: [song],
                    playlists: new Set([playlistItem.id]),
                    addedAt: playlistItem.addedAt,
                    coverUrl: song.coverUrl || '',
                });
            });
        });

        return Array.from(artistMap.entries()).map(([key, entry]) => {
            const followersEstimate = entry.songs.length * 147 + entry.playlists.size * 280;

            return {
                id: `artist:${key}`,
                name: entry.name,
                type: 'Artist',
                metricValue: followersEstimate,
                metricLabel: 'followers',
                creator: entry.name,
                addedAt: entry.addedAt,
                coverUrl: entry.coverUrl,
                songs: entry.songs,
            };
        });
    }, [playlistItems]);

    const podcastItems = useMemo<LibraryItem[]>(() => {
        return playlistItems
            .filter((playlistItem) => {
                const fromTitle = playlistItem.name.toLowerCase().includes('podcast');
                const fromGenre = playlistItem.songs.some((song) =>
                    (song.genres ?? []).some((genre) => genre.toLowerCase().includes('podcast'))
                );

                return fromTitle || fromGenre;
            })
            .map((playlistItem) => ({
                id: `podcast:${playlistItem.sourcePlaylistId || playlistItem.id}`,
                sourcePlaylistId: playlistItem.sourcePlaylistId,
                name: playlistItem.name,
                type: 'Podcast',
                metricValue: playlistItem.songs.length,
                metricLabel: 'songs',
                creator: playlistItem.creator,
                addedAt: playlistItem.addedAt,
                coverUrl: playlistItem.coverUrl,
                songs: playlistItem.songs,
            }));
    }, [playlistItems]);

    const filteredItems = useMemo(() => {
        if (activeFilter === 'playlists') return playlistItems;
        if (activeFilter === 'albums') return albumItems;
        if (activeFilter === 'artists') return artistItems;
        return podcastItems;
    }, [activeFilter, playlistItems, albumItems, artistItems, podcastItems]);

    const hiddenSet = useMemo(() => new Set(hiddenItemIds), [hiddenItemIds]);

    const sortedItems = useMemo(() => {
        const visibleItems = filteredItems.filter((item) => !hiddenSet.has(item.id));
        const sorted = [...visibleItems];

        if (sortMode === 'recent') {
            sorted.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
            return sorted;
        }

        if (sortMode === 'alphabetical') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            return sorted;
        }

        sorted.sort((a, b) => {
            const creatorCompare = a.creator.localeCompare(b.creator);
            if (creatorCompare !== 0) return creatorCompare;
            return a.name.localeCompare(b.name);
        });

        return sorted;
    }, [filteredItems, hiddenSet, sortMode]);

    const openItemMenu = (clientX: number, clientY: number, item: LibraryItem) => {
        const position = clampMenuPosition(clientX, clientY);
        setMenuState({
            item,
            x: position.x,
            y: position.y,
        });
    };

    const handleItemContextMenu = (event: React.MouseEvent, item: LibraryItem) => {
        event.preventDefault();
        event.stopPropagation();
        openItemMenu(event.clientX, event.clientY, item);
    };

    const handleMoreButtonClick = (event: React.MouseEvent<HTMLButtonElement>, item: LibraryItem) => {
        event.preventDefault();
        event.stopPropagation();

        const rect = event.currentTarget.getBoundingClientRect();
        openItemMenu(rect.right - MENU_WIDTH + 6, rect.bottom + 6, item);
    };

    const handleAddToQueue = () => {
        if (!menuState) return;

        const playableSong = menuState.item.songs.find((song) => song.fileUrl);
        if (playableSong) {
            setCurrentSong(playableSong);
            showSuccess(`${menuState.item.name} added to queue.`);
        } else {
            showInfo('Queue updated. Playable metadata is not available for this item yet.');
        }

        setMenuState(null);
    };

    const handleShare = async () => {
        if (!menuState) return;

        const shareText = `${menuState.item.name} • ${menuState.item.type} • Melody`;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareText);
                showSuccess('Share text copied to clipboard.');
            } else {
                showInfo(shareText);
            }
        } catch {
            showError('Unable to copy to clipboard.');
        }

        setMenuState(null);
    };

    const handleRemoveFromLibrary = async () => {
        if (!menuState) return;

        const { item } = menuState;

        if (item.type === 'Playlist' && item.sourcePlaylistId) {
            try {
                await deletePlaylistApi(item.sourcePlaylistId);
                setLibraryPlaylists((prev) =>
                    prev.filter((playlist, index) => {
                        const playlistId = playlist._id || playlist.id || `playlist-${index}`;
                        return playlistId !== item.sourcePlaylistId;
                    })
                );
                showSuccess(`${item.name} removed from your library.`);
            } catch (error) {
                showError(
                    getApiErrorMessage(
                        error as AxiosError<{ message?: string }> | Error,
                        'Failed to remove this playlist from your library.'
                    )
                );
            }
        } else {
            setHiddenItemIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
            showInfo(`${item.name} removed from this library view.`);
        }

        setMenuState(null);
    };

    const handleOpenDetail = (item: LibraryItem) => {
        if (item.type !== 'Playlist' || !item.sourcePlaylistId) return;
        navigate(`/library/${item.sourcePlaylistId}`);
    };

    const renderLoadingState = () => (
        <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
                <div
                    key={index}
                    className="h-16 rounded-xl animate-pulse"
                    style={{ background: 'var(--color-bg-surface)' }}
                />
            ))}
        </div>
    );

    const renderEmptyState = () => (
        <section
            className="rounded-2xl border px-5 py-10 text-center"
            style={{
                background: 'var(--color-bg-surface)',
                borderColor: 'var(--color-bg-elevated)',
            }}
        >
            <div className="relative mx-auto mb-5 h-36 w-36">
                <div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background:
                            'radial-gradient(circle, rgba(0,229,255,0.24) 0%, rgba(179,136,255,0.18) 42%, transparent 74%)',
                    }}
                />
                <div
                    className="absolute inset-4 flex items-center justify-center rounded-full border"
                    style={{
                        borderColor: 'rgba(0,229,255,0.35)',
                        background: 'rgba(5,7,15,0.78)',
                        boxShadow: '0 0 28px rgba(0,229,255,0.20), inset 0 0 20px rgba(179,136,255,0.12)',
                    }}
                >
                    <Music2 size={36} style={{ color: 'var(--color-accent-neon)' }} />
                </div>
            </div>

            <h3
                style={{
                    margin: 0,
                    fontSize: 'var(--text-xl)',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                }}
            >
                Your {FILTER_TABS.find((item) => item.id === activeFilter)?.label.toLowerCase()} is empty
            </h3>
            <p
                style={{
                    margin: '0.5rem 0 1.25rem 0',
                    color: 'var(--color-text-secondary)',
                }}
            >
                Save favorite music here and build your personal neon collection.
            </p>

            <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                style={{
                    background: 'var(--gradient-accent-neon)',
                    color: 'var(--color-bg-primary)',
                }}
                onClick={() => showInfo('Playlist creation flow can be wired here.')}
            >
                <PlusCircle size={16} />
                Create your first playlist
            </button>
        </section>
    );

    return (
        <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8" style={{ color: 'var(--color-text-primary)' }}>
            <div className="space-y-5">
                <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p
                            style={{
                                margin: 0,
                                fontSize: 'var(--text-xs)',
                                color: 'var(--color-text-muted)',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Your collection
                        </p>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: 'var(--text-2xl)',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                            }}
                        >
                            Library
                        </h1>
                    </div>

                    <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                        {new Intl.NumberFormat('en-US').format(sortedItems.length)} items
                    </p>
                </header>

                <section
                    className="rounded-2xl border p-3 md:p-4"
                    style={{
                        background: 'var(--color-bg-surface)',
                        borderColor: 'var(--color-bg-elevated)',
                    }}
                >
                    <div className="flex flex-wrap items-center gap-2">
                        {FILTER_TABS.map((tab) => {
                            const isActive = tab.id === activeFilter;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveFilter(tab.id)}
                                    className="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-150"
                                    style={{
                                        background: isActive ? 'var(--color-bg-elevated)' : 'rgba(255,255,255,0.02)',
                                        border: '1px solid var(--color-bg-elevated)',
                                        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                        <label className="inline-flex items-center gap-2 text-sm">
                            <span style={{ color: 'var(--color-text-muted)' }}>Sort</span>
                            <select
                                value={sortMode}
                                onChange={(event) => setSortMode(event.target.value as SortMode)}
                                className="rounded-full px-3 py-1.5 text-sm"
                                style={{
                                    background: 'var(--color-bg-elevated)',
                                    color: 'var(--color-text-primary)',
                                    border: '1px solid var(--color-bg-elevated)',
                                }}
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.id} value={option.id}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div
                            className="inline-flex overflow-hidden rounded-full border"
                            style={{ borderColor: 'var(--color-bg-elevated)' }}
                        >
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold"
                                style={{
                                    background: viewMode === 'list' ? 'var(--color-bg-elevated)' : 'transparent',
                                    color:
                                        viewMode === 'list'
                                            ? 'var(--color-text-primary)'
                                            : 'var(--color-text-secondary)',
                                }}
                            >
                                <List size={15} />
                                List view
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-semibold"
                                style={{
                                    background: viewMode === 'grid' ? 'var(--color-bg-elevated)' : 'transparent',
                                    color:
                                        viewMode === 'grid'
                                            ? 'var(--color-text-primary)'
                                            : 'var(--color-text-secondary)',
                                }}
                            >
                                <Grid2X2 size={15} />
                                Grid view
                            </button>
                        </div>
                    </div>
                </section>

                {errorMessage && (
                    <section
                        className="rounded-xl border px-4 py-3"
                        style={{
                            background: 'rgba(255, 64, 129, 0.08)',
                            borderColor: 'rgba(255, 64, 129, 0.3)',
                            color: 'var(--color-text-primary)',
                        }}
                    >
                        {errorMessage}
                    </section>
                )}

                {isLoading ? (
                    renderLoadingState()
                ) : sortedItems.length === 0 ? (
                    renderEmptyState()
                ) : viewMode === 'list' ? (
                    <section className="space-y-2">
                        <div
                            className="hidden rounded-xl border px-3 py-2 text-xs uppercase tracking-widest text-white/55 md:grid"
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                borderColor: 'var(--color-bg-elevated)',
                                gridTemplateColumns: '48px minmax(0,1.4fr) 100px 140px 130px 40px',
                                gap: '0.75rem',
                            }}
                        >
                            <span />
                            <span>Title</span>
                            <span>Type</span>
                            <span>Songs/Followers</span>
                            <span>Date added</span>
                            <span />
                        </div>

                        {sortedItems.map((item) => (
                            <article
                                key={item.id}
                                onClick={() => handleOpenDetail(item)}
                                onContextMenu={(event) => handleItemContextMenu(event, item)}
                                className="rounded-xl border px-3 py-2 transition-colors duration-150"
                                style={{
                                    background: 'var(--color-bg-surface)',
                                    borderColor: 'var(--color-bg-elevated)',
                                    cursor: item.type === 'Playlist' && item.sourcePlaylistId ? 'pointer' : 'default',
                                }}
                            >
                                <div
                                    className="grid items-center gap-3 md:gap-3"
                                    style={{
                                        gridTemplateColumns: '48px minmax(0,1fr) 36px',
                                    }}
                                >
                                    <div
                                        className="h-12 w-12 overflow-hidden rounded-md"
                                        style={{
                                            background: 'var(--color-bg-elevated)',
                                            boxShadow: item.coverUrl
                                                ? '0 0 12px rgba(0,229,255,0.16)'
                                                : 'none',
                                        }}
                                    >
                                        {item.coverUrl ? (
                                            <img
                                                src={item.coverUrl}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-white/45">
                                                <ListMusic size={16} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p
                                            className="truncate"
                                            style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 700 }}
                                        >
                                            {item.name}
                                        </p>
                                        <p
                                            className="truncate md:hidden"
                                            style={{
                                                margin: 0,
                                                color: 'var(--color-text-muted)',
                                                fontSize: 'var(--text-xs)',
                                            }}
                                        >
                                            {item.type} • {countLabel(item)} • {formatAddedDate(item.addedAt)}
                                        </p>

                                        <div
                                            className="hidden md:grid"
                                            style={{
                                                marginTop: '0.1rem',
                                                gridTemplateColumns: '100px 140px 130px',
                                                gap: '0.75rem',
                                                color: 'var(--color-text-secondary)',
                                                fontSize: 'var(--text-xs)',
                                            }}
                                        >
                                            <span>{item.type}</span>
                                            <span>{countLabel(item)}</span>
                                            <span>{formatAddedDate(item.addedAt)}</span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        aria-label="More actions"
                                        onClick={(event) => handleMoreButtonClick(event, item)}
                                        className="inline-flex h-9 w-9 items-center justify-center rounded-full"
                                        style={{
                                            border: '1px solid var(--color-bg-elevated)',
                                            color: 'var(--color-text-secondary)',
                                            background: 'rgba(255,255,255,0.02)',
                                        }}
                                    >
                                        <Ellipsis size={16} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                ) : (
                    <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                        {sortedItems.map((item) => (
                            <article
                                key={item.id}
                                onClick={() => handleOpenDetail(item)}
                                onContextMenu={(event) => handleItemContextMenu(event, item)}
                                className="rounded-2xl border p-3"
                                style={{
                                    background: 'var(--color-bg-surface)',
                                    borderColor: 'var(--color-bg-elevated)',
                                    cursor: item.type === 'Playlist' && item.sourcePlaylistId ? 'pointer' : 'default',
                                }}
                            >
                                <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-xl">
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: 'var(--color-bg-elevated)',
                                            boxShadow: item.coverUrl
                                                ? '0 0 20px rgba(0,229,255,0.18)'
                                                : 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                                        }}
                                    />
                                    {item.coverUrl ? (
                                        <img
                                            src={item.coverUrl}
                                            alt={item.name}
                                            className="relative h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="relative flex h-full w-full items-center justify-center text-white/45">
                                            {item.type === 'Artist' ? <UserRound size={32} /> : <Music2 size={32} />}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        aria-label="More actions"
                                        onClick={(event) => handleMoreButtonClick(event, item)}
                                        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full"
                                        style={{
                                            border: '1px solid rgba(255,255,255,0.18)',
                                            color: 'var(--color-text-primary)',
                                            background: 'rgba(5,7,15,0.68)',
                                        }}
                                    >
                                        <Ellipsis size={15} />
                                    </button>
                                </div>

                                <p
                                    className="truncate"
                                    style={{
                                        margin: '0.75rem 0 0 0',
                                        fontWeight: 700,
                                        fontSize: 'var(--text-sm)',
                                    }}
                                >
                                    {item.name}
                                </p>
                                <p
                                    className="truncate"
                                    style={{
                                        margin: 0,
                                        color: 'var(--color-text-secondary)',
                                        fontSize: 'var(--text-xs)',
                                    }}
                                >
                                    {item.type} • {countLabel(item)}
                                </p>
                            </article>
                        ))}
                    </section>
                )}
            </div>

            {menuState && (
                <div className="fixed inset-0 z-80" onClick={() => setMenuState(null)}>
                    <div
                        className="absolute rounded-xl border p-1.5"
                        style={{
                            top: menuState.y,
                            left: menuState.x,
                            width: MENU_WIDTH,
                            background: 'rgba(8,12,22,0.95)',
                            borderColor: 'rgba(255,255,255,0.12)',
                            boxShadow: '0 14px 42px rgba(0,0,0,0.55)',
                            backdropFilter: 'blur(18px)',
                            WebkitBackdropFilter: 'blur(18px)',
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={handleAddToQueue}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            <ListMusic size={15} />
                            Add to queue
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                void handleShare();
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            <Share2 size={15} />
                            Share
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                void handleRemoveFromLibrary();
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm"
                            style={{ color: '#ff8ea8' }}
                        >
                            <Trash2 size={15} />
                            Remove from library
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LibraryPage;
