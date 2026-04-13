import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllSongsApi } from '../api/song.api';
import type { Song } from '../types';
import MadeForUser from '../components/homepage/MadeForUser';
import JumpBackIn from '../components/homepage/JumpBackIn';
import { usePlayerStore } from '../store';
import { FaPlay, FaPause, FaArrowRight } from 'react-icons/fa';
import SongCardSkeleton from '../components/skeletons/SongCardSkeleton';
import SectionSkeleton from '../components/skeletons/SectionSkeleton';
import { MoodWheel } from '../components/mood/MoodWheel';

const Homepage = () => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const currentSong    = usePlayerStore(s => s.currentSong);
    const isPlaying      = usePlayerStore(s => s.isPlaying);
    const setCurrentSong = usePlayerStore(s => s.setCurrentSong);
    const togglePlay     = usePlayerStore(s => s.togglePlay);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const res = await getAllSongsApi();
                setSongs(res.data.data?.songs || []);
            } catch (error) {
                console.error("Error fetching songs", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSongs();
    }, []);

    const handlePlayPause = useCallback((e: React.MouseEvent, song: Song) => {
        e.stopPropagation();
        if (currentSong?._id === song._id) togglePlay();
        else setCurrentSong(song);
    }, [currentSong, togglePlay, setCurrentSong]);

    const handleSongClick = useCallback((songId: string) => {
        navigate(`/song/${songId}`);
    }, [navigate]);

    const featured = songs.slice(0, 8);
    const discover = songs.slice(8, 16);

    return (
        <div className="w-full">

            {/* ═══════════════════════════════════════
                HERO: Mood Wheel
            ═══════════════════════════════════════ */}
            <section className="relative w-full pt-2 pb-4 overflow-hidden">
                {/* Hero glow */}
                <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
                     style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.08) 0%, transparent 65%)' }} />
                <p className="label-neon text-center mb-1">Your vibe, your universe</p>
                <h2 className="text-3xl md:text-4xl font-black text-center text-white mb-0">
                    How are you feeling?
                </h2>
                <MoodWheel />
            </section>

            {/* ═══════════════════════════════════════
                TRENDING
            ═══════════════════════════════════════ */}
            <section className="relative w-full px-6 md:px-10 mt-2 mb-14">
                {/* Section glow */}
                <div className="absolute top-0 left-1/4 w-[400px] h-[300px] rounded-full pointer-events-none -z-10"
                     style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 60%)' }} />

                <div className="flex items-center justify-between mb-5">
                    <div>
                        <p className="label-neon mb-1">From the cosmos</p>
                        <h3 className="section-heading">Trending Now</h3>
                    </div>
                    <button className="flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-[#00e5ff] transition-colors tracking-[0.2em] uppercase">
                        See all <FaArrowRight size={9} />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, i) => <SongCardSkeleton key={i} />)
                    ) : (
                        featured.map((song, idx) => {
                            const active  = currentSong?._id === song._id;
                            const playing = active && isPlaying;

                            return (
                                <div
                                    key={song._id}
                                    onClick={() => handleSongClick(song._id)}
                                    className="glass-card p-3.5 flex items-center gap-4 cursor-pointer group"
                                    style={{
                                        animationDelay: `${idx * 60}ms`,
                                        ...(active ? {
                                            borderColor: 'rgba(0,229,255,0.25)',
                                            boxShadow: '0 0 40px rgba(0,229,255,0.12), 0 4px 20px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,229,255,0.15)',
                                        } : {}),
                                    }}
                                >
                                    {/* Artwork */}
                                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-1 ring-white/8">
                                        {song.coverUrl ? (
                                            <img
                                                src={song.coverUrl}
                                                alt={song.title}
                                                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${playing ? 'animate-orbit-slow' : ''}`}
                                                style={{
                                                    borderRadius: playing ? '50%' : '12px',
                                                    transition: 'border-radius 0.5s',
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"
                                                 style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(179,136,255,0.15))' }}>
                                                <span className="text-[10px] font-bold text-white/20">♪</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={e => handlePlayPause(e, song)}
                                            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                            style={{ background: 'rgba(5,7,15,0.50)', backdropFilter: 'blur(4px)' }}
                                        >
                                            {playing
                                                ? <FaPause size={16} style={{ color: '#00e5ff', filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.7))' }} />
                                                : <FaPlay  size={16} className="text-white/90 ml-0.5" />
                                            }
                                        </button>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                                        <p className="text-xs text-white/50 truncate mt-0.5">{song.artist}</p>
                                    </div>

                                    {/* Equalizer */}
                                    {playing && (
                                        <div className="flex gap-[3px] items-end h-4 shrink-0 mr-1">
                                            <div className="w-[3px] rounded-full bg-[#00e5ff] animate-eq"   style={{ height: '55%', boxShadow: '0 0 6px #00e5ff' }} />
                                            <div className="w-[3px] rounded-full bg-[#00e5ff] animate-eq-2" style={{ height: '100%', boxShadow: '0 0 6px #00e5ff' }} />
                                            <div className="w-[3px] rounded-full bg-[#b388ff] animate-eq-3" style={{ height: '70%', boxShadow: '0 0 6px #b388ff' }} />
                                            <div className="w-[3px] rounded-full bg-[#00e5ff] animate-eq-4" style={{ height: '85%', boxShadow: '0 0 6px #00e5ff' }} />
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* ═══════════════════════════════════════
                MADE FOR YOU
            ═══════════════════════════════════════ */}
            <section className="px-6 md:px-10 mb-12">
                <div className="mb-5">
                    <p className="label-neon mb-1">Curated for you</p>
                    <h3 className="section-heading">Your Constellation</h3>
                </div>
                {isLoading ? <SectionSkeleton /> : <MadeForUser />}
            </section>

            {/* ═══════════════════════════════════════
                JUMP BACK IN
            ═══════════════════════════════════════ */}
            <section className="px-6 md:px-10 mb-14">
                <div className="mb-5">
                    <p className="label-neon mb-1">Continue the journey</p>
                    <h3 className="section-heading">Jump Back In</h3>
                </div>
                {isLoading ? <SectionSkeleton /> : <JumpBackIn />}
            </section>

            {/* ═══════════════════════════════════════
                DISCOVER
            ═══════════════════════════════════════ */}
            {discover.length > 0 && (
                <section className="px-6 md:px-10 mb-24">
                    {/* Section glow */}
                    <div className="absolute right-[10%] w-[300px] h-[300px] rounded-full pointer-events-none -z-10"
                         style={{ background: 'radial-gradient(circle, rgba(179,136,255,0.04) 0%, transparent 60%)' }} />

                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="label-neon mb-1">Explore the unknown</p>
                            <h3 className="section-heading">Discover New Vibes</h3>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-bold text-white/30 hover:text-[#00e5ff] transition-colors tracking-[0.2em] uppercase">
                            Explore <FaArrowRight size={9} />
                        </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                        {discover.map(song => {
                            const active  = currentSong?._id === song._id;
                            const playing = active && isPlaying;
                            return (
                                <div
                                    key={song._id}
                                    onClick={() => handleSongClick(song._id)}
                                    className="glass-card shrink-0 w-44 p-3.5 cursor-pointer group"
                                >
                                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3 ring-1 ring-white/6">
                                        {song.coverUrl ? (
                                            <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center"
                                                 style={{ background: 'linear-gradient(135deg, rgba(179,136,255,0.20), rgba(255,64,129,0.15))' }}>
                                                <span className="text-2xl text-white/15">♪</span>
                                            </div>
                                        )}
                                        <button
                                            onClick={e => handlePlayPause(e, song)}
                                            className={`absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110
                                                ${playing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'}
                                            `}
                                            style={{
                                                background: 'linear-gradient(135deg, #00e5ff, #2979ff)',
                                                color: '#05070f',
                                                boxShadow: '0 0 20px rgba(0,229,255,0.4)',
                                            }}
                                        >
                                            {playing ? <FaPause size={13} /> : <FaPlay size={13} className="ml-0.5" />}
                                        </button>
                                    </div>
                                    <p className="text-sm font-semibold text-white truncate">{song.title}</p>
                                    <p className="text-[10px] text-white/40 truncate mt-1 uppercase tracking-[0.15em]">{song.artist}</p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};

export default Homepage;