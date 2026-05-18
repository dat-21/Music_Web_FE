import { Search, Bell, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';

const TopBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return (
        <div className="flex items-center justify-between px-6 py-2  border-b ">
            {/* Logo */}
            <Link to="/" className="flex items-center">
                <img
                    src="/logo_web.svg"
                    alt="Melody Logo"
                    className="h-14 w-14 invert hover:scale-105 transition-transform"
                />
            </Link>

            {/* Search Bar */}
            < div className="flex-1 max-w-md mx-8" >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="What do you want to play?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/90 rounded-full py-2 pl-10 pr-4 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                </div>
            </ div>

            {/* User Actions */}
            < div className="flex items-center gap-3" >
                <button className="text-white hover:text-gray-300 transition-colors">
                    <Bell size={18} />
                </button>
                {
                    isAuthenticated ? (
                        <>
                            <button className="flex items-center gap-2 bg-black/70 rounded-full px-3 py-1.5 hover:bg-black transition-colors">
                                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                                    <User size={14} className="text-white" />
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
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-white text-black px-5 py-1.5 rounded-full font-semibold text-sm hover:scale-105 transition-transform"
                        >
                            Log in
                        </button>
                    )
                }
            </ div>
        </div >
    );
};

export default TopBar;
