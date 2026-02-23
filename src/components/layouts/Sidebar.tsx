import { Search, Library, Plus, Heart, Clock, ChevronRight } from 'lucide-react';
import { useState, useCallback } from 'react';

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState<'playlists' | 'artists' | 'podcasts'>('playlists');
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const playlists = [
        { id: 1, name: 'Liked Songs', icon: Heart, count: '46 songs', pinned: true },
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

    const tabs = [
        { key: 'playlists' as const, label: 'Playlists' },
        { key: 'artists' as const, label: 'Artists' },
        { key: 'podcasts' as const, label: 'Podcasts & Shows' },
    ];

    const filteredPlaylists = searchQuery
        ? playlists.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : playlists;

    const toggleSearch = useCallback(() => {
        setSearchOpen(prev => !prev);
        if (searchOpen) setSearchQuery('');
    }, [searchOpen]);

    return (
        <div className="w-26rem text-white flex flex-col h-full bg-zinc-950 overflow-hidden rounded-lg">

            {/* Your Library Header */}
            <div className="pt-5 pb-2 px-5 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-200 group">
                        <Library size={22} className="group-hover:scale-110 transition-transform duration-200" />
                        <span className="font-bold text-base">Your Library</span>
                    </button>
                    <button className="text-gray-400 hover:text-white hover:bg-gray-800/60 transition-all duration-200 p-2 rounded-full hover:rotate-90 active:scale-90">
                        <Plus size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab.key
                                    ? 'bg-white text-black hover:scale-105'
                                    : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700/70 hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search & Sort */}
                <div className="flex items-center justify-between gap-2">
                    <div className={`flex items-center transition-all duration-300 ${searchOpen ? 'flex-1' : ''}`}>
                        <button
                            onClick={toggleSearch}
                            className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800/50 rounded-full transition-all duration-200"
                        >
                            <Search size={18} />
                        </button>
                        {searchOpen && (
                            <input
                                type="text"
                                placeholder="Search in Your Library"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                className="flex-1 bg-gray-800/60 text-white text-xs rounded-md px-3 py-1.5 ml-1 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-600 transition-all duration-200"
                            />
                        )}
                    </div>
                    <button className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs font-medium transition-colors duration-200 whitespace-nowrap">
                        <span>Recents</span>
                        <Clock size={14} />
                    </button>
                </div>
            </div>

            {/* Playlists List */}
            <div className="flex-1 overflow-y-auto px-2 pt-2 no-scrollbar">
                {filteredPlaylists.map((playlist) => (
                    <button
                        key={playlist.id}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200 group active:scale-[0.98]"
                    >
                        {/* Playlist Cover */}
                        <div className={`w-12 h-12 rounded-md flex items-center justify-center shrink-0 shadow-md transition-all duration-200 group-hover:shadow-lg ${playlist.pinned
                                ? 'bg-linear-to-br from-indigo-500 to-purple-600'
                                : 'bg-linear-to-br from-gray-700 to-gray-800'
                            }`}>
                            {playlist.icon ? (
                                <playlist.icon size={18} fill="white" className="drop-shadow-sm" />
                            ) : (
                                <span className="text-xs font-bold text-white/80">
                                    {playlist.name.substring(0, 2).toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Info */}
                        <div className="text-left flex-1 min-w-0">
                            <p className={`font-medium text-sm truncate transition-colors duration-200 ${playlist.pinned ? 'text-white' : 'text-gray-200 group-hover:text-white'
                                }`}>
                                {playlist.name}
                            </p>
                            <p className="text-gray-500 text-xs truncate">
                                {playlist.count || `Playlist · ${playlist.by || 'You'}`}
                            </p>
                        </div>

                        {/* Hover arrow */}
                        <ChevronRight
                            size={14}
                            className="text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0"
                        />
                    </button>
                ))}

                {filteredPlaylists.length === 0 && searchQuery && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-sm">No results found for "{searchQuery}"</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
