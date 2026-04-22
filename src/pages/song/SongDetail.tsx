import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSongByIdApi } from '../../api/song.api';
import type { Song } from '../../types';
import { usePlayerStore } from '../../store';
import {
  FaPlay, FaPause, FaArrowLeft, FaClock, FaMusic,
  FaHeart, FaRegHeart, FaShareAlt, FaEllipsisH,
  FaCompactDisc, FaCalendarAlt, FaDatabase, FaHeadphones, FaThumbsUp
} from 'react-icons/fa';
import { PageLoader } from '@/components/ui/page-loader/page-loader';

const SongDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [song, setSong] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const currentSong  = usePlayerStore(s => s.currentSong);
    const isPlaying    = usePlayerStore(s => s.isPlaying);
    const setCurrentSong = usePlayerStore(s => s.setCurrentSong);
    const togglePlay   = usePlayerStore(s => s.togglePlay);

    useEffect(() => {
        if (!id) return;
        const fetchSongDetail = async () => {
            try {
                setLoading(true);
                setImageLoaded(false);
                const res = await getSongByIdApi(id);
                setSong(res.data ?? null);
            } catch (error) {
                console.error('Error fetching song detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSongDetail();
    }, [id]);

    const handlePlayPause = useCallback(() => {
        if (!song) return;
        if (currentSong?._id === song._id) togglePlay();
        else setCurrentSong(song);
    }, [song, currentSong, togglePlay, setCurrentSong]);

    const isCurrentSong = currentSong?._id === song?._id;
    const isSongPlaying = isCurrentSong && isPlaying;

    const formatDuration = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    if (loading) {
        return <PageLoader fullscreen={false} className="min-h-screen" message="Loading song..." />;
    }

    if (!song) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center">
                    <FaMusic size={28} className="text-white/20" />
                </div>
                <p className="text-white/50 text-lg">Song not found</p>
                <button onClick={() => navigate(-1)} className="btn-primary px-8 py-3 text-sm">Go Back</button>
            </div>
        );
    }

    const infoCards = [
        { label: 'Artist', value: song.artist, icon: <FaMusic size={14} /> },
        song.album && { label: 'Album', value: song.album, icon: <FaCompactDisc size={14} /> },
        song.duration && { label: 'Duration', value: formatDuration(song.duration), icon: <FaClock size={14} /> },
        typeof song.plays === 'number' && { label: 'Plays', value: song.plays.toLocaleString(), icon: <FaHeadphones size={14} /> },
        typeof song.likes === 'number' && { label: 'Likes', value: song.likes.toLocaleString(), icon: <FaThumbsUp size={14} /> },
        song.size && { label: 'Size', value: `${(song.size / (1024 * 1024)).toFixed(1)} MB`, icon: <FaDatabase size={14} /> },
        song.createdAt && {
            label: 'Uploaded',
            value: new Date(song.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' }),
            icon: <FaCalendarAlt size={14} />
        },
    ].filter(Boolean) as { label: string; value: string; icon: React.ReactNode }[];

    return (
        <div className="w-full max-w-5xl mx-auto px-6 pb-32">

            {/* ── Back ── */}
            <button
                onClick={() => navigate(-1)}
                className="mb-8 w-11 h-11 rounded-full glass-card flex items-center justify-center text-white/30 hover:text-white hover:shadow-glow-sm transition-all"
            >
                <FaArrowLeft size={16} />
            </button>

            {/* ── Hero ── */}
            <div className="relative flex flex-col md:flex-row items-center md:items-end gap-8 mb-10">
                {/* Artwork */}
                <div className="relative group shrink-0">
                    <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden"
                         style={{ boxShadow: '0 20px 80px rgba(0,0,0,0.8), 0 0 40px rgba(0,229,255,0.06)' }}>
                        {song.coverUrl ? (
                            <img
                                src={song.coverUrl} alt={song.title}
                                onLoad={() => setImageLoaded(true)}
                                className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center"
                                 style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(179,136,255,0.15))' }}>
                                <FaMusic size={48} className="text-white/15" />
                            </div>
                        )}
                        <button onClick={handlePlayPause}
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                 style={{ background: 'var(--color-accent-neon)', boxShadow: '0 0 40px rgba(0,229,255,0.5)' }}>
                                {isSongPlaying ? <FaPause size={24} className="text-[var(--color-bg-primary)]" /> : <FaPlay size={24} className="text-[var(--color-bg-primary)] ml-1" />}
                            </div>
                        </button>
                    </div>
                    {/* Album glow */}
                    {song.coverUrl && (
                        <img src={song.coverUrl} alt=""
                            className="absolute -inset-10 w-[calc(100%+5rem)] h-[calc(100%+5rem)] object-cover blur-[80px] opacity-25 -z-10 scale-110 pointer-events-none" />
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left animate-fade-up">
                    <p className="label-neon mb-2">Song</p>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">{song.title}</h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-white/60">
                        <span className="font-semibold text-white">{song.artist}</span>
                        {song.album && (<><span className="text-white/20">•</span><span>{song.album}</span></>)}
                        {song.duration && (<><span className="text-white/20">•</span><span className="flex items-center gap-1"><FaClock size={11} />{formatDuration(song.duration)}</span></>)}
                    </div>
                    {(typeof song.plays === 'number' || typeof song.likes === 'number') && (
                        <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm text-white/45">
                            {typeof song.plays === 'number' && <span>{song.plays.toLocaleString()} plays</span>}
                            {typeof song.likes === 'number' && <span>{song.likes.toLocaleString()} likes</span>}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Actions ── */}
            <div className="flex items-center gap-4 mb-10">
                <button onClick={handlePlayPause} className="btn-primary px-7 py-3 flex items-center gap-2.5 text-sm">
                    {isSongPlaying ? <FaPause size={15} /> : <FaPlay size={15} className="ml-0.5" />}
                    {isSongPlaying ? 'Pause' : 'Play'}
                </button>

                <button onClick={() => setIsLiked(!isLiked)}
                    className={`w-11 h-11 rounded-full glass-card flex items-center justify-center transition-all duration-300 hover:scale-110 ${isLiked ? '' : 'text-white/30 hover:text-white'}`}
                    style={isLiked ? { color: 'var(--color-accent-love)', boxShadow: '0 0 20px rgba(255,64,129,0.3)' } : {}}>
                    {isLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
                </button>

                <button className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-white/30 hover:text-white transition-all hover:scale-110">
                    <FaShareAlt size={15} />
                </button>
                <button className="w-11 h-11 rounded-full glass-card flex items-center justify-center text-white/30 hover:text-white transition-all hover:scale-110">
                    <FaEllipsisH size={15} />
                </button>

                {isSongPlaying && (
                    <div className="ml-auto flex items-center gap-2.5">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--color-accent-neon)', textShadow: '0 0 10px rgba(0,229,255,0.5)' }}>Now Playing</span>
                        <div className="flex gap-[3px] items-end h-4">
                            <div className="w-[3px] rounded-full bg-[var(--color-accent-neon)] animate-eq"   style={{ height: '55%', boxShadow: '0 0 6px var(--color-accent-neon)' }} />
                            <div className="w-[3px] rounded-full bg-[var(--color-accent-neon)] animate-eq-2" style={{ height: '100%', boxShadow: '0 0 6px var(--color-accent-neon)' }} />
                            <div className="w-[3px] rounded-full bg-[var(--color-accent-neon)] animate-eq-3" style={{ height: '50%', boxShadow: '0 0 6px var(--color-accent-neon)' }} />
                            <div className="w-[3px] rounded-full bg-[var(--color-accent-neon)] animate-eq-4" style={{ height: '80%', boxShadow: '0 0 6px var(--color-accent-neon)' }} />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Genres ── */}
            {song.genres && song.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-10">
                    {song.genres.map((genre, i) => (
                        <span key={i} className="glass-card px-4 py-1.5 text-xs font-semibold text-white/50 hover:text-[var(--color-accent-neon)] hover:border-[rgba(0,229,255,0.2)] transition-all cursor-pointer">
                            {genre}
                        </span>
                    ))}
                </div>
            )}

            {/* ── Info Cards ── */}
            <div className="mb-10">
                <h2 className="section-heading mb-4">About this track</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {infoCards.map((card, i) => (
                        <div key={i} className="glass-card p-4 group">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-white/15 group-hover:text-[var(--color-accent-neon)]/50 transition-colors">{card.icon}</span>
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">{card.label}</p>
                            </div>
                            <p className="text-white font-semibold text-sm truncate">{card.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Lyrics ── */}
            <div className="mb-10">
                <h2 className="section-heading mb-4">Lyrics</h2>
                <div className="glass-card p-6">
                    <p className="text-white/30 text-sm italic">Lyrics not available for this song.</p>
                </div>
            </div>

            {/* ── ID ── */}
            {song._id && (
                <div className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-[10px] text-white/15 font-mono tracking-wider">ID: {song._id}</p>
                </div>
            )}
        </div>
    );
};

export default SongDetail;
