import { X, Music } from 'lucide-react';
import { useState } from 'react';

const QueueSidebar = () => {
    const [activeTab, setActiveTab] = useState<'queue' | 'recent'>('queue');
    const [isOpen, setIsOpen] = useState(true);

    const queueSongs = [
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

    const recentSongs = [
        { id: 1, title: "Shouldn't Be", artist: 'Luke Chiang' },
    ];

    if (!isOpen) return null;

    return (
        <div className="w-96 bg-black text-white flex flex-col h-screen border-l border-gray-800">
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-gray-800">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('queue')}
                        className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors ${
                            activeTab === 'queue'
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Queue
                    </button>
                    <button
                        onClick={() => setActiveTab('recent')}
                        className={`text-sm font-semibold px-3 py-1 rounded-full transition-colors ${
                            activeTab === 'recent'
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Recently played
                    </button>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'queue' ? (
                    <div>
                        {/* Now Playing */}
                        <div className="p-4 border-b border-gray-800">
                            <p className="text-xs text-gray-400 mb-2">Now playing</p>
                            <div className="flex items-center gap-3 bg-gray-800/50 p-2 rounded">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-green-500 truncate">
                                        Shouldn't Be
                                    </p>
                                    <p className="text-xs text-gray-400 truncate">Luke Chiang</p>
                                </div>
                            </div>
                        </div>

                        {/* Next Up */}
                        <div className="p-4">
                            <p className="text-xs text-gray-400 mb-3">Next up</p>
                            {queueSongs.slice(1).map((song) => (
                                <div
                                    key={song.id}
                                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-800/50 transition-colors cursor-pointer group"
                                >
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
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-4">
                        {recentSongs.map((song) => (
                            <div
                                key={song.id}
                                className="flex items-center gap-3 p-2 rounded hover:bg-gray-800/50 transition-colors cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex-shrink-0"></div>
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
        </div>
    );
};

export default QueueSidebar;
