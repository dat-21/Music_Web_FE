import { Home, Search, Library, Plus, Heart, Clock } from 'lucide-react';

const Sidebar = () => {
    const playlists = [
        { id: 1, name: 'Liked Songs', icon: Heart, count: '46 songs' },
        { id: 2, name: 'Your Episodes', count: 'Saved & downloaded ep...' },
        { id: 3, name: 'No One Noticed', by: 'Đạt' },
        { id: 4, name: 'Ráp rừng', by: 'Đạt' },
        { id: 5, name: 'Hustlang Robber', by: 'Artist' },
        { id: 6, name: 'Coffee Relaxing Jazz - Relaxing...', by: 'ViM Media' },
        { id: 7, name: 'Camm Podcast', by: 'Camm Podcast' },
        { id: 8, name: 'Travis Scott', by: 'Artist' },
        { id: 9, name: 'Si', by: 'Đạt' },
        { id: 10, name: 'Ngo Mix', by: 'Spotify' },
        { id: 11, name: 'Mm' },
        { id: 12, name: 'Dreams From Bunker Hill', by: 'Cigarettes After Sex' },
    ];

    return (
        <div className="w-[26rem] text-white flex flex-col h-full bg-zinc-950 overflow-y-auto rounded-lg no-scrollbar">


            {/* Main Navigation */}
            <nav className="px-2">
                <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white transition-colors">
                    <Home size={24} />
                    <span className="font-semibold">Home</span>
                </button>
                <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-300 hover:text-white transition-colors">
                    <Search size={24} />
                    <span className="font-semibold">Search</span>
                </button>
            </nav>

            {/* Your Library */}
            <div className="mt-6 flex-1 flex flex-col overflow-hidden">
                <div className="px-6 flex items-center justify-between mb-4">
                    <button className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                        <Library size={24} />
                        <span className="font-semibold">Your Library</span>
                    </button>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <Plus size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 flex gap-2 mb-4">
                    <button className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors">
                        Playlists
                    </button>
                    <button className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors">
                        Artists
                    </button>
                    <button className="px-3 py-1 bg-gray-800 rounded-full text-sm hover:bg-gray-700 transition-colors">
                        Podcasts & Shows
                    </button>
                </div>

                {/* Search & Sort */}
                <div className="px-6 flex items-center justify-between mb-4">
                    <button className="text-gray-400 hover:text-white">
                        <Search size={20} />
                    </button>
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
                        <span>Recents</span>
                        <Clock size={16} />
                    </button>
                </div>

                {/* Playlists */}
                <div className="flex-1 overflow-y-auto px-2 no-scrollbar">
                    {playlists.map((playlist) => (
                        <button
                            key={playlist.id}
                            className="w-full flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded flex items-center justify-center flex-shrink-0">
                                {playlist.icon ? (
                                    <playlist.icon size={20} fill="white" />
                                ) : (
                                    <span className="text-xs font-bold">
                                        {playlist.name.substring(0, 2).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div className="text-left flex-1 min-w-0">
                                <p className="text-white font-medium text-sm truncate">
                                    {playlist.name}
                                </p>
                                <p className="text-gray-400 text-xs truncate">
                                    {playlist.count || `Playlist • ${playlist.by || 'You'}`}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
