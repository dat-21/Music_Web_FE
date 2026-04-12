import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import {
    LayoutDashboard,
    Music,
    Users,
    Upload,
    LogOut,
    ChevronLeft,
    Settings,
    BarChart3,
} from 'lucide-react';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const sidebarItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/songs', icon: Music, label: 'Songs' },
    { path: '/admin/upload', icon: Upload, label: 'Upload Song' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/stats', icon: BarChart3, label: 'Statistics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-zinc-950 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
                {/* Logo / Back */}
                <div className="p-4 border-b border-zinc-800">
                    <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-3">
                        <ChevronLeft size={16} />
                        <span className="text-sm">Back to App</span>
                    </Link>
                    <h1 className="text-xl font-bold text-white flex items-center gap-2">
                        <Settings size={20} className="text-blue-500" />
                        Admin Panel
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                                    }`}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                            {user?.username?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.username}</p>
                            <p className="text-xs text-zinc-500 truncate">{user?.role || 'admin'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors text-sm w-full"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
