import { Music } from 'lucide-react';
import { useState, useCallback, useMemo, memo } from 'react';
import { FaArrowRightToBracket, FaChevronLeft } from "react-icons/fa6";
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

// Memoized Song Item Component - tránh re-render
const SongItem = memo(({ song }: { song: typeof QUEUE_SONGS[0] }) => (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-800/50 transition-colors cursor-pointer group">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded flex-shrink-0 flex items-center justify-center">
            <Music size={16} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate group-hover:text-green-500 transition-colors">
                {song.title}
            </p>
            <p className="text-xs text-gray-400 truncate">{song.artist}</p>
        </div>
    </div>
));

SongItem.displayName = 'SongItem';

const QueueSidebar = () => {
    const [activeTab, setActiveTab] = useState<'queue' | 'recent'>('queue');
    const [isExpanded, setIsExpanded] = useState(true);

    // Memoized callbacks - tránh re-create functions
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
            {/* Collapsed State - Vertical Tab */}
            {!isExpanded && (
                <button
                    onClick={toggleExpanded}
                    className="absolute inset-0 flex items-center justify-center hover:bg-gray-800/30 transition-all duration-200"
                    title="Open queue"
                    aria-label="Open queue"
                >
                    <div className="p-2.5 rounded-lg group-hover:scale-110 transition-all duration-200 shadow-lg">
                        <FaChevronLeft size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                </button>
            )}

            {/* Expanded Sidebar */}
            {isExpanded && (
                <>

                    {/* Header */}
                    <div className="p-4 flex items-center justify-between flex-shrink-0">

                        <button
                            onClick={toggleExpanded}
                            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800/70 rounded"
                            title="Collapse queue"
                            aria-label="Collapse queue"
                        >
                            <FaArrowRightToBracket size={20} />
                        </button>
                        <div className="flex gap-4">
                            <button
                                onClick={setQueueTab}
                                className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors ${activeTab === 'queue'
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Queue
                            </button>
                            <button
                                onClick={setRecentTab}
                                className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors ${activeTab === 'recent'
                                    ? 'bg-gray-800 text-white'
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
                                <div className="p-4">
                                    <p className="text-xs text-gray-400 mb-2">Now playing</p>
                                    <div className="flex items-center gap-3 bg-gray-800/50 p-2 rounded">
                                        <div className="w-12 h-12 bg-gradient-to-br  from-blue-900 to-gray-600 rounded flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-green-500 truncate">
                                                Shouldn't Be
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">Luke Chiang</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Next Up - dùng memoized component */}
                                <div className="p-4">
                                    <p className="text-xs text-gray-400 mb-3">Next up</p>
                                    {nextUpSongs.map((song) => (
                                        <SongItem key={song.id} song={song} />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="p-4">
                                {RECENT_SONGS.map((song) => (
                                    <div
                                        key={song.id}
                                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-gray-600 rounded flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">
                                                {song.title}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default QueueSidebar;
