import {
    Music,
    Users,
    PlayCircle,
    TrendingUp,
    Upload,
    Clock,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ========== HARDCODED STATS ==========
const stats = [
    {
        label: 'Total Songs',
        value: '2,847',
        change: '+12%',
        trend: 'up' as const,
        icon: Music,
        color: 'bg-blue-500/20 text-blue-400',
    },
    {
        label: 'Total Users',
        value: '1,234',
        change: '+8%',
        trend: 'up' as const,
        icon: Users,
        color: 'bg-green-500/20 text-green-400',
    },
    {
        label: 'Total Plays',
        value: '45.2K',
        change: '+23%',
        trend: 'up' as const,
        icon: PlayCircle,
        color: 'bg-purple-500/20 text-purple-400',
    },
    {
        label: 'Active Today',
        value: '342',
        change: '-5%',
        trend: 'down' as const,
        icon: TrendingUp,
        color: 'bg-orange-500/20 text-orange-400',
    },
];

const recentSongs = [
    { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', plays: 1243, uploadedAt: '2 hours ago' },
    { id: 2, title: 'Shape of You', artist: 'Ed Sheeran', plays: 986, uploadedAt: '5 hours ago' },
    { id: 3, title: 'Someone Like You', artist: 'Adele', plays: 2104, uploadedAt: '1 day ago' },
    { id: 4, title: 'Bohemian Rhapsody', artist: 'Queen', plays: 3421, uploadedAt: '2 days ago' },
    { id: 5, title: 'Hotel California', artist: 'Eagles', plays: 1876, uploadedAt: '3 days ago' },
];

const recentUsers = [
    { id: 1, username: 'john_doe', email: 'john@email.com', role: 'user', joinedAt: '1 hour ago' },
    { id: 2, username: 'jane_smith', email: 'jane@email.com', role: 'user', joinedAt: '3 hours ago' },
    { id: 3, username: 'music_lover', email: 'lover@email.com', role: 'moderator', joinedAt: '1 day ago' },
    { id: 4, username: 'admin_pro', email: 'admin@email.com', role: 'admin', joinedAt: '2 days ago' },
];

const topGenres = [
    { name: 'Pop', percentage: 35, color: 'bg-blue-500' },
    { name: 'Rock', percentage: 25, color: 'bg-red-500' },
    { name: 'Hip Hop', percentage: 20, color: 'bg-yellow-500' },
    { name: 'R&B', percentage: 12, color: 'bg-purple-500' },
    { name: 'Jazz', percentage: 8, color: 'bg-green-500' },
];

// ========== COMPONENT ==========
const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-zinc-400 text-sm mt-1">Overview of your music platform</p>
                </div>
                <Link
                    to="/admin/upload"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    <Upload size={16} />
                    Upload Song
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span
                                className={`text-xs font-medium flex items-center gap-0.5 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                                    }`}
                            >
                                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-zinc-500 text-sm mt-1">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Songs - 2 cols */}
                <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Music size={18} className="text-blue-400" />
                            Recent Songs
                        </h2>
                        <Link to="/admin/songs" className="text-blue-400 hover:text-blue-300 text-sm">
                            View All →
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
                                    <th className="text-left pb-3 font-medium">#</th>
                                    <th className="text-left pb-3 font-medium">Title</th>
                                    <th className="text-left pb-3 font-medium">Artist</th>
                                    <th className="text-right pb-3 font-medium">Plays</th>
                                    <th className="text-right pb-3 font-medium">Uploaded</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentSongs.map((song, index) => (
                                    <tr
                                        key={song.id}
                                        className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                                    >
                                        <td className="py-3 text-zinc-500 text-sm">{index + 1}</td>
                                        <td className="py-3 font-medium text-sm">{song.title}</td>
                                        <td className="py-3 text-zinc-400 text-sm">{song.artist}</td>
                                        <td className="py-3 text-right text-zinc-400 text-sm">
                                            {song.plays.toLocaleString()}
                                        </td>
                                        <td className="py-3 text-right text-zinc-500 text-sm flex items-center justify-end gap-1">
                                            <Clock size={12} />
                                            {song.uploadedAt}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Genres - 1 col */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                    <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                        <BarChart3 size={18} className="text-purple-400" />
                        Top Genres
                    </h2>

                    <div className="space-y-4">
                        {topGenres.map((genre) => (
                            <div key={genre.name}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium">{genre.name}</span>
                                    <span className="text-xs text-zinc-400">{genre.percentage}%</span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-2">
                                    <div
                                        className={`${genre.color} h-2 rounded-full transition-all duration-500`}
                                        style={{ width: `${genre.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Users */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <Users size={18} className="text-green-400" />
                        Recent Users
                    </h2>
                    <Link to="/admin/users" className="text-blue-400 hover:text-blue-300 text-sm">
                        View All →
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-zinc-500 text-xs uppercase border-b border-zinc-800">
                                <th className="text-left pb-3 font-medium">User</th>
                                <th className="text-left pb-3 font-medium">Email</th>
                                <th className="text-left pb-3 font-medium">Role</th>
                                <th className="text-right pb-3 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentUsers.map((u) => (
                                <tr
                                    key={u.id}
                                    className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
                                >
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold">
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-medium">{u.username}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-zinc-400 text-sm">{u.email}</td>
                                    <td className="py-3">
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'admin'
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : u.role === 'moderator'
                                                        ? 'bg-yellow-500/20 text-yellow-400'
                                                        : 'bg-zinc-700 text-zinc-300'
                                                }`}
                                        >
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right text-zinc-500 text-sm">{u.joinedAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
