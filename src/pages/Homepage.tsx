import { useCallback, useMemo, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, Search, Sparkles } from 'lucide-react';
import type { Song, SongCardProps } from '../types';
import MadeForUser from '../components/homepage/MadeForUser';
import JumpBackIn from '../components/homepage/JumpBackIn';
import SectionHeader from '../components/homepage/SectionHeader';
import { usePlayerStore } from '../store';
import { useAuthStore } from '../store/auth.store';
import config from '../config';
import { FaPause, FaPlay } from 'react-icons/fa';
import SongCardSkeleton from '../components/skeletons/SongCardSkeleton';
import SectionSkeleton from '../components/skeletons/SectionSkeleton';
import { MoodWheel } from '../components/mood/MoodWheel';
import { useAllSongs } from '@/hooks/queries/useSongs';


const toArtistSlug = (artistName: string) =>
    artistName
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const SongCard = ({
    song,
    isActive,
    isPlaying,
    onOpen,
    onTogglePlay,
}: SongCardProps) => {
    return (
        <article
            onClick={onOpen}
            className="glass-card h-full cursor-pointer p-3 transition-all duration-300 group"
            style={isActive ? {
                borderColor: 'rgba(0,229,255,0.25)',
                boxShadow: '0 0 24px rgba(0,229,255,0.10), 0 4px 16px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,229,255,0.14)',
            } : undefined}
        >
            <div className="relative w-40 h-40 mx-auto rounded-xl overflow-hidden ring-1 ring-white/8">
                {song.coverUrl ? (
                    <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div
                        className="h-full w-full flex items-center justify-center"
                        style={{ background: 'var(--color-bg-surface)' }}
                    >
                        <span className="text-2xl text-white/20">♪</span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={onTogglePlay}
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
                        }`}
                    style={{ background: 'rgba(5,7,15,0.46)', backdropFilter: 'blur(3px)' }}
                >
                    <span
                        className="h-10 w-10 rounded-full grid place-items-center"
                        style={{
                            background: 'var(--color-accent-neon)',
                            color: 'var(--color-bg-primary)',
                        }}
                    >
                        {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-0.5" />}
                    </span>
                </button>
            </div>

            <div className="mt-3">
                <p
                    style={{
                        margin: 0,
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        color: 'var(--color-text-primary)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.25,
                        minHeight: '2.5em',
                    }}
                >
                    {song.title}
                </p>
                <p
                    className="truncate"
                    style={{
                        marginTop: '0.25rem',
                        marginBottom: 0,
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-text-muted)',
                    }}
                >
                    {song.artist}
                </p>
            </div>
        </article>
    );
};

const Homepage = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const currentSong = usePlayerStore(s => s.currentSong);
    const isPlaying = usePlayerStore(s => s.isPlaying);
    const setCurrentSong = usePlayerStore(s => s.setCurrentSong);
    const togglePlay = usePlayerStore(s => s.togglePlay);
    const { data: songs = [], isLoading } = useAllSongs();


    const handlePlayPause = useCallback((e: MouseEvent, song: Song) => {
        e.stopPropagation();
        if (currentSong?._id === song._id) togglePlay();
        else setCurrentSong(song);
    }, [currentSong, togglePlay, setCurrentSong]);

    const handleSongClick = useCallback((songId: string) => {
        navigate(`/song/${songId}`);
    }, [navigate]);

    const featured = songs.slice(0, 8);
    const discover = songs.slice(8, 16);

    const greetingName = user?.username?.trim() || 'Listener';

    const topArtistSlug = useMemo(() => {
        if (songs.length === 0) return '';

        const artistCount = new Map<string, number>();

        songs.forEach((song) => {
            const artist = song.artist?.trim();
            if (!artist) return;
            artistCount.set(artist, (artistCount.get(artist) || 0) + 1);
        });

        const topArtist = Array.from(artistCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
        return topArtist ? toArtistSlug(topArtist) : '';
    }, [songs]);

    const summaryStats = useMemo(
        () => [
            { label: 'Songs loaded', value: `${songs.length}` },
            { label: 'Trending picks', value: `${featured.length}` },
            { label: 'Discover slots', value: `${discover.length}` },
        ],
        [songs.length, featured.length, discover.length],
    );

    return (
        <div className="w-full pb-6">
            <section className="px-4 pt-3 mb-6">
                <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
                    <article
                        className="rounded-2xl border p-4 md:p-5"
                        style={{
                            background: 'var(--color-bg-surface)',
                            borderColor: 'var(--color-bg-elevated)',
                        }}
                    >
                        <p className="label-neon mb-1">Daily Flow</p>
                        <h1
                            style={{
                                margin: 0,
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(1.2rem, 2.8vw, 1.7rem)',
                                fontWeight: 700,
                            }}
                        >
                            Welcome, {greetingName}
                        </h1>
                        <p style={{ margin: '0.35rem 0 0 0', color: 'var(--color-text-secondary)' }}>
                            Pick a section and keep your listening flow smooth.
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => navigate(config.routes.search)}
                                className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold"
                                style={{
                                    border: '1px solid rgba(0,229,255,0.4)',
                                    color: 'var(--color-accent-neon)',
                                    background: 'rgba(0,229,255,0.08)',
                                }}
                            >
                                <Search size={14} />
                                Search
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate(config.routes.library)}
                                className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold"
                                style={{
                                    border: '1px solid rgba(255,255,255,0.16)',
                                    color: 'var(--color-text-primary)',
                                    background: 'rgba(255,255,255,0.04)',
                                }}
                            >
                                <Library size={14} />
                                Your library
                            </button>

                            <button
                                type="button"
                                disabled={!topArtistSlug}
                                onClick={() => navigate(`/artist/${topArtistSlug}`)}
                                className="inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold disabled:opacity-50"
                                style={{
                                    border: '1px solid rgba(179,136,255,0.35)',
                                    color: '#d7c1ff',
                                    background: 'rgba(179,136,255,0.12)',
                                }}
                            >
                                <Sparkles size={14} />
                                Explore artist
                            </button>
                        </div>
                    </article>

                    <aside
                        className="rounded-2xl border p-3 md:p-4"
                        style={{
                            background: 'rgba(5,7,15,0.55)',
                            borderColor: 'rgba(255,255,255,0.14)',
                        }}
                    >
                        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/55">Session Pulse</p>
                        <div className="grid grid-cols-3 gap-2">
                            {summaryStats.map((stat) => (
                                <article
                                    key={stat.label}
                                    className="rounded-lg border px-2 py-2 text-center"
                                    style={{
                                        borderColor: 'rgba(255,255,255,0.14)',
                                        background: 'rgba(255,255,255,0.03)',
                                    }}
                                >
                                    <p style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 800 }}>{stat.value}</p>
                                    <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '10px' }}>{stat.label}</p>
                                </article>
                            ))}
                        </div>
                        <p className="mt-2 text-xs text-white/50">Your discovery and library updates are synced.</p>
                    </aside>
                </div>
            </section>

            <section className="relative px-4 pt-2 mb-8 overflow-hidden">
                <div
                    className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.08) 0%, transparent 65%)' }}
                />
                <p className="label-neon text-center mb-1">Your vibe, your universe</p>
                <h2 className="text-3xl md:text-4xl font-black text-center text-white mb-0">How are you feeling?</h2>
                <MoodWheel />
            </section>

            <section className="relative px-4 mb-8">
                <SectionHeader title="Trending Now" />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {isLoading
                        ? Array.from({ length: 8 }).map((_, index) => <SongCardSkeleton key={index} />)
                        : featured.map((song) => {
                            const active = currentSong?._id === song._id;
                            const playing = active && isPlaying;

                            return (
                                <SongCard
                                    key={song._id}
                                    song={song}
                                    isActive={active}
                                    isPlaying={playing}
                                    onOpen={() => handleSongClick(song._id)}
                                    onTogglePlay={(event) => handlePlayPause(event, song)}
                                />
                            );
                        })}
                </div>
            </section>

            <section className="px-4 mb-8">
                <SectionHeader title="Your Constellation" />
                {isLoading ? <SectionSkeleton showHeader={false} /> : <MadeForUser showHeader={false} />}
            </section>

            <section className="px-4 mb-8">
                <SectionHeader title="Jump Back In" />
                {isLoading ? <SectionSkeleton showHeader={false} /> : <JumpBackIn showHeader={false} />}
            </section>

            {discover.length > 0 && (
                <section className="px-4 mb-8">
                    <SectionHeader title="Discover New Vibes" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {discover.map((song) => {
                            const active = currentSong?._id === song._id;
                            const playing = active && isPlaying;

                            return (
                                <SongCard
                                    key={song._id}
                                    song={song}
                                    isActive={active}
                                    isPlaying={playing}
                                    onOpen={() => handleSongClick(song._id)}
                                    onTogglePlay={(event) => handlePlayPause(event, song)}
                                />
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Homepage;