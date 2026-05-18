import { Music, GripVertical } from 'lucide-react';
import { useState, useCallback, useMemo, memo } from 'react';
import { FaArrowRightToBracket, FaChevronLeft } from "react-icons/fa6";
import { usePlayerStore } from '../../store';

// Mock data - move outside component để tránh re-create
const QUEUE_SONGS = [
    { id: 1, title: "Shouldn't Be", artist: 'Luke Chiang', playing: true },
    { id: 2, title: 'Dreams From Bunker Hill', artist: 'Cigarettes After Sex' },
    { id: 3, title: 'PIXELATED KISSES', artist: 'Joji' },
    { id: 4, title: "it's just you, my dear", artist: 'sagun' },
    { id: 5, title: 'So Easy (To Fall In Love)', artist: 'GO Music video・Olivia Dean' },
    { id: 6, title: 'Love You Anyway', artist: 'The Marias' },
    { id: 7, title: 'Serenity', artist: 'HY₿S' },
    { id: 8, title: 'Pills', artist: 'Joji' },
    { id: 9, title: 'Sunsetz', artist: 'Cigarettes After Sex' },
    { id: 10, title: '404: HOME NOT FOUND', artist: 'Paul Fontohop' },
    { id: 11, title: 'Is there free breakfast here?', artist: 'Hotel Ugly' },
    { id: 12, title: 'Paranoia', artist: 'The Marias' },
    { id: 13, title: 'Glimpse of Us', artist: 'Joji' },
];

const RECENT_SONGS = [
    { id: 1, title: "Shouldn't Be", artist: 'Luke Chiang' },
];

// Memoized Song Item Component
const SongItem = memo(({ song, index }: { song: typeof QUEUE_SONGS[0]; index: number }) => (
    <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group active:scale-[0.98]">
        {/* Index / Drag handle */}
        <div className="w-5 text-center shrink-0">
            <span className="text-xs text-gray-600 group-hover:hidden font-mono">{index + 1}</span>
            <GripVertical size={14} className="text-gray-500 hidden group-hover:block mx-auto" />
        </div>

        {/* Song cover */}
        <div className="w-10 h-10 bg-linear-to-br from-gray-700 to-gray-800 rounded-md shrink-0 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
            <Music size={14} className="text-gray-400" />
        </div>

        {/* Song info */}
        <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-200 truncate group-hover:text-white transition-colors duration-200">
                {song.title}
            </p>
            <p className="text-xs text-gray-500 truncate">{song.artist}</p>
        </div>
    </div>
));

SongItem.displayName = 'SongItem';

const QueueSidebar = () => {
    const [activeTab, setActiveTab] = useState<'queue' | 'recent'>('queue');
    const [isExpanded, setIsExpanded] = useState(true);

    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);

    // Memoized callbacks
    const toggleExpanded = useCallback(() => setIsExpanded(prev => !prev), []);
    const setQueueTab = useCallback(() => setActiveTab('queue'), []);
    const setRecentTab = useCallback(() => setActiveTab('recent'), []);

    // Memoized computed data
    const nextUpSongs = useMemo(() => QUEUE_SONGS.slice(1), []);

    return (
        <div
            className={`bg-zinc-950 text-white flex flex-col h-full transition-all duration-300 ease-in-out relative rounded-lg ${isExpanded ? 'w-[26rem]' : 'w-16 hover:w-20'
                } group`}
        >
            {/* Collapsed State */}
            {!isExpanded && (
                <button
                    onClick={toggleExpanded}
                    className="absolute inset-0 flex items-center justify-center hover:bg-gray-800/20 transition-all duration-200 rounded-lg"
                    title="Open queue"
                    aria-label="Open queue"
                >
                    <div className="p-2.5 rounded-lg group-hover:scale-110 transition-transform duration-200">
                        <FaChevronLeft size={16} className="text-gray-500 group-hover:text-white transition-colors duration-200" />
                    </div>
                </button>
            )}

            {/* Expanded Sidebar */}
            {isExpanded && (
                <>
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between shrink-0 border-b border-white/5">
                        <button
                            onClick={toggleExpanded}
                            className="text-gray-400 hover:text-white transition-all duration-200 p-1.5 hover:bg-gray-800/60 rounded-md active:scale-90"
                            title="Collapse queue"
                            aria-label="Collapse queue"
                        >
                            <FaArrowRightToBracket size={18} />
                        </button>
                        <div className="flex bg-gray-800/40 rounded-full p-0.5">
                            <button
                                onClick={setQueueTab}
                                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${activeTab === 'queue'
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Queue
                            </button>
                            <button
                                onClick={setRecentTab}
                                className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 ${activeTab === 'recent'
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Recently played
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto no-scrollbar">
                        {activeTab === 'queue' ? (
                            <div>
                                {/* Now Playing */}
                                <div className="p-4 pb-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Now playing</p>
                                    <div className="flex items-center gap-3 bg-gray-800/40 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-200 group/now">
                                        {/* Cover */}
                                        <div className="w-12 h-12 bg-linear-to-br from-spotify-blue to-gray-700 rounded-lg shrink-0 overflow-hidden shadow-lg relative">
                                            {currentSong?.coverUrl ? (
                                                <img src={currentSong.coverUrl} alt="" className="w-full h-full object-cover" />
                                            ) : null}

                                            {/* Animated overlay when playing */}
                                            {isPlaying && (
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <div className="flex gap-[2px] items-end h-3">
                                                        <div className="w-[2px] rounded-full bg-spotify-green animate-[equalizer_0.8s_ease-in-out_infinite]" style={{ height: '50%' }} />
                                                        <div className="w-[2px] rounded-full bg-spotify-green animate-[equalizer_0.8s_ease-in-out_infinite_0.2s]" style={{ height: '100%' }} />
                                                        <div className="w-[2px] rounded-full bg-spotify-green animate-[equalizer_0.8s_ease-in-out_infinite_0.4s]" style={{ height: '70%' }} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Song info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-spotify-green truncate">
                                                {currentSong?.title || "Shouldn't Be"}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">
                                                {currentSong?.artist || 'Luke Chiang'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Up */}
                                <div className="px-4 pb-4">
                                    <div className="flex items-center justify-between mb-2 mt-2">
                                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Next up</p>
                                        <span className="text-xs text-gray-600">{nextUpSongs.length} songs</span>
                                    </div>
                                    <div className="space-y-0.5">
                                        {nextUpSongs.map((song, index) => (
                                            <SongItem key={song.id} song={song} index={index} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Recently played</p>
                                {RECENT_SONGS.map((song) => (
                                    <div
                                        key={song.id}
                                        className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-800/50 transition-all duration-200 cursor-pointer group active:scale-[0.98]"
                                    >
                                        <div className="w-12 h-12 bg-linear-to-br from-spotify-blue to-gray-700 rounded-lg shrink-0 shadow-sm" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-200 truncate group-hover:text-white transition-colors duration-200">
                                                {song.title}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                                        </div>
                                    </div>
                                ))}

                                {RECENT_SONGS.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Music size={32} className="text-gray-700 mb-3" />
                                        <p className="text-gray-500 text-sm">No recently played songs</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default QueueSidebar;
