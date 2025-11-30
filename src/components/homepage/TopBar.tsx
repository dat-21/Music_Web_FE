import { ChevronLeft, ChevronRight, Search, Bell, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-gray-900/90 to-transparent">
            {/* Navigation Arrows */}
            <div className="flex items-center gap-4">
                <button className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center hover:bg-black transition-colors">
                    <ChevronLeft size={20} className="text-white" />
                </button>
                <button className="w-8 h-8 bg-black/70 rounded-full flex items-center justify-center hover:bg-black transition-colors">
                    <ChevronRight size={20} className="text-white" />
                </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="What do you want to play?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white rounded-full py-3 pl-12 pr-4 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
                <button className="text-white hover:text-gray-300 transition-colors">
                    <Bell size={20} />
                </button>
                {isAuthenticated ? (
                    <>
                        <button className="flex items-center gap-2 bg-black/70 rounded-full px-4 py-2 hover:bg-black transition-colors">
                            <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                                <User size={16} className="text-white" />
                            </div>
                            <span className="text-white text-sm font-semibold">
                                {user?.username || 'Guest'}
                            </span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-white hover:text-gray-300 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-white text-black px-6 py-2 rounded-full font-semibold text-sm hover:scale-105 transition-transform"
                    >
                        Log in
                    </button>
                )}
            </div>
        </div>
    );
};

export default TopBar;
