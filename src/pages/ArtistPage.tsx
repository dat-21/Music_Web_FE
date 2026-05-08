import { useEffect, useMemo, useRef, useState } from 'react';
import type { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';
import {
    CirclePlus,
    Pause,
    Play,
    Sparkles,
} from 'lucide-react';
import { getAllSongsApi } from '@/api/song.api';
import { getMyPlaylistsApi, type LibraryPlaylist } from '@/api/playlist.api';
import type { Song } from '@/types';
import { usePlayerStore } from '@/store';
import useNotification from '@/hooks/useNotification';
import { getApiErrorMessage } from '@/utils/apiError.utils';

type DiscographyTab = 'albums' | 'singles' | 'compilations';

interface DiscographyItem {
    id: string;
    title: string;
    type: DiscographyTab;
    coverUrl: string;
    trackCount: number;
    year: number;
}

interface FeaturingItem {
    id: string;
    title: string;
    subtitle: string;
    coverUrl: string;
}

interface ArtistCard {
    name: string;
    coverUrl: string;
    listeners: number;
}

const DISC_TABS: Array<{ id: DiscographyTab; label: string }> = [
    { id: 'albums', label: 'Albums' },
    { id: 'singles', label: 'Singles' },
    { id: 'compilations', label: 'Compilations' },
];

const slugify = (text: string) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(Math.max(0, Math.floor(value)));

const formatTrackTime = (seconds?: number) => {
    const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds || 0)) : 0;
    const minutes = Math.floor(total / 60);
    const remain = total % 60;
    return `${minutes}:${remain.toString().padStart(2, '0')}`;
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
        likes: value.likes,
        plays: value.plays,
        createdAt: value.createdAt,
        updatedAt: value.updatedAt,
    };
};

const classifyDiscographyType = (albumName: string): DiscographyTab => {
    const normalized = albumName.toLowerCase();
    if (
        normalized.includes('compilation') ||
        normalized.includes('collection') ||
        normalized.includes('best of')
    ) {
        return 'compilations';
    }
    if (normalized.includes('single') || normalized.includes(' - ')) {
        return 'singles';
    }
    return 'albums';
};

const findScrollableParent = (element: HTMLElement | null): HTMLElement | Window => {
    let current = element?.parentElement || null;

    while (current) {
        const style = window.getComputedStyle(current);
        const canScroll = /(auto|scroll)/.test(style.overflowY) && current.scrollHeight > current.clientHeight;
        if (canScroll) return current;
        current = current.parentElement;
    }

    return window;
};

const ArtistPage = () => {
    const { artistSlug } = useParams<{ artistSlug: string }>();
    const pageRef = useRef<HTMLDivElement | null>(null);

    const [catalog, setCatalog] = useState<Song[]>([]);
    const [playlistCatalog, setPlaylistCatalog] = useState<LibraryPlaylist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [activeDiscTab, setActiveDiscTab] = useState<DiscographyTab>('albums');
    const [showAllPopular, setShowAllPopular] = useState(false);
    const [isFollowed, setIsFollowed] = useState(false);
    const [scrollTop, setScrollTop] = useState(0);

    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
    const togglePlay = usePlayerStore((state) => state.togglePlay);
    const { showInfo, showSuccess } = useNotification();

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            setIsLoading(true);
            setErrorMessage(null);

            try {
                const [songResponse, playlistResponse] = await Promise.all([
                    getAllSongsApi(),
                    getMyPlaylistsApi().catch(() => null),
                ]);

                if (!mounted) return;

                setCatalog(songResponse.data?.songs ?? []);
                setPlaylistCatalog(playlistResponse?.data?.playlists ?? []);
            } catch (error) {
                if (!mounted) return;

                setCatalog([]);
                setPlaylistCatalog([]);
                setErrorMessage(
                    getApiErrorMessage(
                        error as AxiosError<{ message?: string }> | Error,
                        'Unable to load artist profile right now.',
                    ),
                );
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchData();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const scrollParent = findScrollableParent(pageRef.current);

        const onScroll = () => {
            const nextScroll = scrollParent === window ? window.scrollY : (scrollParent as HTMLElement).scrollTop;
            setScrollTop(nextScroll);
        };

        onScroll();
        scrollParent.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            scrollParent.removeEventListener('scroll', onScroll);
        };
    }, []);

    const songsByArtist = useMemo(() => {
        const map = new Map<string, Song[]>();

        catalog.forEach((song) => {
            const artistName = song.artist?.trim();
            if (!artistName) return;

            const existing = map.get(artistName) || [];
            existing.push(song);
            map.set(artistName, existing);
        });

        return map;
    }, [catalog]);

    const selectedArtist = useMemo(() => {
        const artistNames = Array.from(songsByArtist.keys());
        if (artistNames.length === 0) return '';

        const normalizedSlug = decodeURIComponent(artistSlug || '').toLowerCase().trim();
        if (!normalizedSlug) return artistNames[0];

        const exact = artistNames.find((name) => slugify(name) === normalizedSlug);
        if (exact) return exact;

        const fuzzy = artistNames.find((name) => name.toLowerCase() === normalizedSlug.replace(/-/g, ' '));
        if (fuzzy) return fuzzy;

        return artistNames[0];
    }, [songsByArtist, artistSlug]);

    const artistSongs = useMemo(() => {
        const songs = songsByArtist.get(selectedArtist) ?? [];
        return [...songs].sort((a, b) => (b.plays ?? 0) - (a.plays ?? 0));
    }, [songsByArtist, selectedArtist]);

    const topSongs = useMemo(() => {
        const visibleCount = showAllPopular ? 10 : 5;
        return artistSongs.slice(0, visibleCount);
    }, [artistSongs, showAllPopular]);

    const monthlyListeners = useMemo(() => {
        const plays = artistSongs.reduce((sum, song) => sum + (song.plays ?? 0), 0);
        const baseline = artistSongs.length * 8200;
        return Math.max(18000, Math.round(plays * 0.28 + baseline));
    }, [artistSongs]);

    const followers = useMemo(() => Math.round(monthlyListeners * 0.62), [monthlyListeners]);

    const totalLikes = useMemo(
        () => artistSongs.reduce((sum, song) => sum + (song.likes ?? 0), 0),
        [artistSongs],
    );

    const artistGenres = useMemo(() => {
        const set = new Set<string>();
        artistSongs.forEach((song) => {
            (song.genres ?? []).forEach((genre) => {
                if (genre.trim()) set.add(genre.trim());
            });
        });
        return Array.from(set);
    }, [artistSongs]);

    const discography = useMemo(() => {
        const map = new Map<string, DiscographyItem>();

        artistSongs.forEach((song, index) => {
            const title = song.album?.trim() || `${song.title} (Single)`;
            const type = classifyDiscographyType(title);
            const year = Number(new Date(song.createdAt || Date.now()).getFullYear());
            const key = `${type}:${title.toLowerCase()}`;

            const existing = map.get(key);
            if (existing) {
                existing.trackCount += 1;
                return;
            }

            map.set(key, {
                id: `${key}-${index}`,
                title,
                type,
                coverUrl: song.coverUrl,
                trackCount: 1,
                year,
            });
        });

        const byType: Record<DiscographyTab, DiscographyItem[]> = {
            albums: [],
            singles: [],
            compilations: [],
        };

        Array.from(map.values()).forEach((item) => {
            byType[item.type].push(item);
        });

        Object.values(byType).forEach((items) => {
            items.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
        });

        return byType;
    }, [artistSongs]);

    const featuringItems = useMemo<FeaturingItem[]>(() => {
        const items: FeaturingItem[] = [];

        playlistCatalog.forEach((playlist, index) => {
            const songs = (playlist.songs ?? [])
                .map((song) => toSong(song))
                .filter((song): song is Song => song !== null);

            const featuringSongs = songs.filter(
                (song) => song.artist.toLowerCase() === selectedArtist.toLowerCase(),
            );

            if (featuringSongs.length === 0) return;

            const playlistId = playlist._id || playlist.id || `feature-${index}`;
            items.push({
                id: playlistId,
                title: playlist.name || 'Untitled Playlist',
                subtitle: `${featuringSongs.length} tracks featuring ${selectedArtist}`,
                coverUrl: featuringSongs[0]?.coverUrl || songs[0]?.coverUrl || '',
            });
        });

        if (items.length > 0) return items;

        return artistSongs.slice(0, 4).map((song, index) => ({
            id: `collab-${song._id}`,
            title: `${selectedArtist} Collab Session ${index + 1}`,
            subtitle: song.album ? `From ${song.album}` : 'Featured in editorial playlist',
            coverUrl: song.coverUrl,
        }));
    }, [playlistCatalog, artistSongs, selectedArtist]);

    const fansAlsoLike = useMemo<ArtistCard[]>(() => {
        const selectedGenres = new Set(artistGenres.map((genre) => genre.toLowerCase()));
        const groups = new Map<string, Song[]>();

        catalog.forEach((song) => {
            if (song.artist === selectedArtist) return;

            const existing = groups.get(song.artist) || [];
            existing.push(song);
            groups.set(song.artist, existing);
        });

        const scored = Array.from(groups.entries()).map(([name, songs]) => {
            const listenersEstimate = Math.max(
                10000,
                Math.round(songs.reduce((sum, song) => sum + (song.plays ?? 0), 0) * 0.24 + songs.length * 5200),
            );

            const matchingGenres = songs
                .flatMap((song) => song.genres ?? [])
                .map((genre) => genre.toLowerCase())
                .filter((genre) => selectedGenres.has(genre)).length;

            return {
                card: {
                    name,
                    coverUrl: songs[0]?.coverUrl || '',
                    listeners: listenersEstimate,
                },
                score: matchingGenres * 3 + songs.length,
            };
        });

        return scored
            .sort((a, b) => b.score - a.score)
            .slice(0, 12)
            .map((entry) => entry.card);
    }, [catalog, artistGenres, selectedArtist]);

    const headerImage = useMemo(() => {
        if (artistSongs[0]?.coverUrl) return artistSongs[0].coverUrl;
        return '';
    }, [artistSongs]);

    const isCurrentArtistPlaying = currentSong?.artist === selectedArtist;

    const handlePlayArtist = () => {
        const song = artistSongs[0];
        if (!song) return;

        if (currentSong?._id === song._id) {
            togglePlay();
            return;
        }

        setCurrentSong(song);
    };

    const parallaxOffset = Math.min(scrollTop * 0.28, 92);
    const stickyNameVisible = scrollTop > 250;

    const shortBio = `${selectedArtist} blends ${artistGenres.slice(0, 2).join(' and ') || 'dream-pop textures'} with a cinematic sound design. Their catalog balances emotional vocals, late-night rhythms, and polished collaborations.`;

    if (isLoading) {
        return (
            <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8">
                <div className="space-y-3">
                    <div className="h-[52vh] min-h-[340px] rounded-3xl animate-pulse" style={{ background: 'var(--color-bg-surface)' }} />
                    <div className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--color-bg-surface)' }} />
                    <div className="h-56 rounded-xl animate-pulse" style={{ background: 'var(--color-bg-surface)' }} />
                    <div className="h-56 rounded-xl animate-pulse" style={{ background: 'var(--color-bg-surface)' }} />
                </div>
            </div>
        );
    }

    if (errorMessage || !selectedArtist) {
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
                        Artist unavailable
                    </h2>
                    <p style={{ margin: '0.65rem 0 0 0', color: 'var(--color-text-secondary)' }}>
                        {errorMessage || 'Unable to load artist profile.'}
                    </p>
                </section>
            </div>
        );
    }

    return (
        <div ref={pageRef} className="w-full" style={{ color: 'var(--color-text-primary)' }}>
            <header className="relative h-[56vh] min-h-[340px] max-h-[560px] overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        transform: `translateY(${parallaxOffset}px) scale(1.08)`,
                        transformOrigin: 'center top',
                        backgroundImage: headerImage
                            ? `url(${headerImage})`
                            : 'linear-gradient(135deg, rgba(0,229,255,0.25), rgba(179,136,255,0.35))',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        willChange: 'transform',
                    }}
                />

                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(180deg, rgba(5,7,15,0.12) 0%, rgba(5,7,15,0.34) 40%, rgba(5,7,15,0.88) 100%)',
                    }}
                />

                <div className="relative z-10 flex h-full items-end px-4 pb-8 md:px-6 md:pb-10 lg:px-8">
                    <div className="max-w-5xl">
                        <p
                            style={{
                                margin: 0,
                                fontSize: 'var(--text-xs)',
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                color: 'rgba(240,244,255,0.82)',
                            }}
                        >
                            Artist
                        </p>

                        <h1
                            style={{
                                margin: '0.35rem 0 0.4rem 0',
                                fontFamily: 'var(--font-display)',
                                fontWeight: 800,
                                fontSize: 'clamp(2rem, 7vw, 5rem)',
                                lineHeight: 1,
                            }}
                        >
                            {selectedArtist}
                        </h1>

                        <p style={{ margin: 0, color: 'rgba(240,244,255,0.86)' }}>
                            {formatNumber(monthlyListeners)} monthly listeners
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2.5">
                            <button
                                type="button"
                                onClick={handlePlayArtist}
                                className="inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-bold"
                                style={{
                                    background: 'var(--gradient-accent-neon)',
                                    color: 'var(--color-bg-primary)',
                                    boxShadow: '0 10px 24px rgba(0,229,255,0.3)',
                                }}
                            >
                                {isCurrentArtistPlaying && isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                                Play
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsFollowed((prev) => !prev)}
                                className="inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold"
                                style={{
                                    border: isFollowed
                                        ? '1px solid rgba(0,229,255,0.5)'
                                        : '1px solid rgba(255,255,255,0.36)',
                                    background: isFollowed ? 'rgba(0,229,255,0.14)' : 'rgba(5,7,15,0.36)',
                                    color: isFollowed ? 'var(--color-accent-neon)' : 'var(--color-text-primary)',
                                }}
                            >
                                {isFollowed ? 'Following' : 'Follow'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="sticky top-2 z-30 px-4 md:px-6 lg:px-8">
                <div
                    className="mt-2 inline-flex items-center gap-3 rounded-full px-4 py-2 transition-all duration-200"
                    style={{
                        background: 'rgba(5,7,15,0.82)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        opacity: stickyNameVisible ? 1 : 0,
                        transform: stickyNameVisible ? 'translateY(0px)' : 'translateY(-8px)',
                        pointerEvents: stickyNameVisible ? 'auto' : 'none',
                    }}
                >
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700 }}>{selectedArtist}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                        {formatNumber(monthlyListeners)} monthly listeners
                    </span>
                </div>
            </div>

            <main className="space-y-8 px-4 py-6 md:px-6 lg:px-8">
                <section
                    className="rounded-2xl border p-4 md:p-5"
                    style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-bg-elevated)' }}
                >
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <h2
                            style={{
                                margin: 0,
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                fontSize: 'var(--text-xl)',
                            }}
                        >
                            Popular
                        </h2>
                        {artistSongs.length > 5 && (
                            <button
                                type="button"
                                onClick={() => setShowAllPopular((prev) => !prev)}
                                className="rounded-full px-3 py-1 text-sm font-semibold"
                                style={{
                                    border: '1px solid var(--color-bg-elevated)',
                                    background: 'rgba(255,255,255,0.04)',
                                }}
                            >
                                {showAllPopular ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        {topSongs.map((song, index) => {
                            const isActive = currentSong?._id === song._id;

                            return (
                                <article
                                    key={song._id}
                                    className="grid items-center gap-3 rounded-lg px-3 py-2"
                                    style={{
                                        gridTemplateColumns: '34px 44px minmax(0,1fr) 110px 40px',
                                        background: isActive ? 'rgba(0,229,255,0.11)' : 'rgba(255,255,255,0.03)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                    }}
                                >
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{index + 1}</span>

                                    <div className="h-11 w-11 overflow-hidden rounded-md" style={{ background: 'var(--color-bg-elevated)' }}>
                                        {song.coverUrl ? (
                                            <img src={song.coverUrl} alt={song.title} className="h-full w-full object-cover" />
                                        ) : null}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (currentSong?._id === song._id) {
                                                togglePlay();
                                                return;
                                            }
                                            setCurrentSong(song);
                                        }}
                                        className="min-w-0 text-left"
                                    >
                                        <p
                                            className="truncate"
                                            style={{
                                                margin: 0,
                                                fontWeight: 700,
                                                color: isActive ? 'var(--color-accent-neon)' : 'var(--color-text-primary)',
                                            }}
                                        >
                                            {song.title}
                                        </p>
                                        <p className="truncate" style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                                            {song.album || 'Single'}
                                        </p>
                                    </button>

                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                                        {formatTrackTime(song.duration)}
                                    </span>

                                    <button
                                        type="button"
                                        className="inline-flex h-8 w-8 items-center justify-center rounded-full"
                                        style={{
                                            color: isActive ? 'var(--color-accent-neon)' : 'var(--color-text-secondary)',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.12)',
                                        }}
                                        onClick={() => {
                                            if (currentSong?._id === song._id) {
                                                togglePlay();
                                                return;
                                            }
                                            setCurrentSong(song);
                                        }}
                                    >
                                        {isActive && isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                </section>

                <section
                    className="rounded-2xl border p-4 md:p-5"
                    style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-bg-elevated)' }}
                >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <h2
                            style={{
                                margin: 0,
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                fontSize: 'var(--text-xl)',
                            }}
                        >
                            Discography
                        </h2>

                        <div className="inline-flex overflow-hidden rounded-full border" style={{ borderColor: 'var(--color-bg-elevated)' }}>
                            {DISC_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveDiscTab(tab.id)}
                                    className="px-3 py-1.5 text-sm font-semibold"
                                    style={{
                                        background: activeDiscTab === tab.id ? 'var(--color-bg-elevated)' : 'transparent',
                                        color:
                                            activeDiscTab === tab.id
                                                ? 'var(--color-text-primary)'
                                                : 'var(--color-text-secondary)',
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 2xl:grid-cols-5">
                        {discography[activeDiscTab].map((item) => (
                            <article
                                key={item.id}
                                className="rounded-xl border p-2.5"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    borderColor: 'rgba(255,255,255,0.08)',
                                }}
                            >
                                <div className="h-36 overflow-hidden rounded-lg" style={{ background: 'var(--color-bg-elevated)' }}>
                                    {item.coverUrl ? (
                                        <img src={item.coverUrl} alt={item.title} className="h-full w-full object-cover" />
                                    ) : null}
                                </div>
                                <p className="truncate" style={{ margin: '0.55rem 0 0 0', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                                    {item.title}
                                </p>
                                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                                    {item.year} • {item.trackCount} tracks
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <section
                    className="rounded-2xl border p-4 md:p-5"
                    style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-bg-elevated)' }}
                >
                    <h2
                        style={{
                            margin: '0 0 0.85rem 0',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: 'var(--text-xl)',
                        }}
                    >
                        Featuring
                    </h2>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {featuringItems.map((item) => (
                            <article
                                key={item.id}
                                className="flex items-center gap-3 rounded-xl border p-2.5"
                                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                            >
                                <div className="h-14 w-14 overflow-hidden rounded-md" style={{ background: 'var(--color-bg-elevated)' }}>
                                    {item.coverUrl ? (
                                        <img src={item.coverUrl} alt={item.title} className="h-full w-full object-cover" />
                                    ) : null}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate" style={{ margin: 0, fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                                        {item.title}
                                    </p>
                                    <p className="truncate" style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                                        {item.subtitle}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section
                    className="rounded-2xl border p-4 md:p-5"
                    style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-bg-elevated)' }}
                >
                    <h2
                        style={{
                            margin: '0 0 0.85rem 0',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: 'var(--text-xl)',
                        }}
                    >
                        About
                    </h2>

                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                        <div>
                            <p style={{ margin: 0, color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{shortBio}</p>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                                <div
                                    className="rounded-full px-3 py-1.5 text-xs font-semibold"
                                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-primary)' }}
                                >
                                    {formatNumber(followers)} followers
                                </div>
                                <div
                                    className="rounded-full px-3 py-1.5 text-xs font-semibold"
                                    style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--color-text-primary)' }}
                                >
                                    {formatNumber(totalLikes)} likes
                                </div>
                                {artistGenres.slice(0, 3).map((genre) => (
                                    <div
                                        key={genre}
                                        className="rounded-full px-3 py-1.5 text-xs font-semibold"
                                        style={{
                                            background: 'rgba(0,229,255,0.12)',
                                            color: 'var(--color-accent-neon)',
                                        }}
                                    >
                                        {genre}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div
                                className="h-48 overflow-hidden rounded-xl"
                                style={{ background: 'var(--color-bg-elevated)' }}
                            >
                                {headerImage ? (
                                    <img src={headerImage} alt={selectedArtist} className="h-full w-full object-cover" />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="rounded-2xl border p-4 md:p-5"
                    style={{ background: 'var(--color-bg-surface)', borderColor: 'var(--color-bg-elevated)' }}
                >
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2
                            style={{
                                margin: 0,
                                fontFamily: 'var(--font-display)',
                                fontWeight: 700,
                                fontSize: 'var(--text-xl)',
                            }}
                        >
                            Fans also like
                        </h2>

                        <button
                            type="button"
                            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                            style={{ border: '1px solid var(--color-bg-elevated)', color: 'var(--color-text-secondary)' }}
                            onClick={() => showInfo('Artist recommendation actions can be wired here.')}
                        >
                            <Sparkles size={13} />
                            Explore
                        </button>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-1">
                        {fansAlsoLike.map((artist) => (
                            <article
                                key={artist.name}
                                className="w-40 shrink-0 rounded-xl border p-2.5"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    borderColor: 'rgba(255,255,255,0.08)',
                                }}
                            >
                                <div className="h-28 overflow-hidden rounded-lg" style={{ background: 'var(--color-bg-elevated)' }}>
                                    {artist.coverUrl ? (
                                        <img src={artist.coverUrl} alt={artist.name} className="h-full w-full object-cover" />
                                    ) : null}
                                </div>
                                <p className="truncate" style={{ margin: '0.55rem 0 0 0', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                                    {artist.name}
                                </p>
                                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>
                                    {formatNumber(artist.listeners)} listeners
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                <div className="flex justify-center pb-2">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                        style={{
                            border: '1px solid rgba(0,229,255,0.45)',
                            background: 'rgba(0,229,255,0.12)',
                            color: 'var(--color-accent-neon)',
                        }}
                        onClick={() => showSuccess(`${selectedArtist} added to your follow collection.`)}
                    >
                        <CirclePlus size={15} />
                        Add Artist to Library
                    </button>
                </div>
            </main>
        </div>
    );
};

export default ArtistPage;
