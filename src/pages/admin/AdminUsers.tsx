import { useState } from 'react';
import { Users, Search, Trash2 } from 'lucide-react';

// ========== HARDCODED DATA ==========
const mockUsers = [
    { id: '1', username: 'admin_dat', email: 'dat@email.com', role: 'admin', isVerified: true, createdAt: '2025-12-01' },
    { id: '2', username: 'moderator_1', email: 'mod@email.com', role: 'moderator', isVerified: true, createdAt: '2025-12-15' },
    { id: '3', username: 'john_doe', email: 'john@email.com', role: 'user', isVerified: true, createdAt: '2026-01-05' },
    { id: '4', username: 'jane_smith', email: 'jane@email.com', role: 'user', isVerified: true, createdAt: '2026-01-12' },
    { id: '5', username: 'music_lover', email: 'lover@email.com', role: 'user', isVerified: false, createdAt: '2026-01-20' },
    { id: '6', username: 'dj_cool', email: 'dj@email.com', role: 'user', isVerified: true, createdAt: '2026-02-01' },
    { id: '7', username: 'rock_fan', email: 'rock@email.com', role: 'user', isVerified: false, createdAt: '2026-02-10' },
    { id: '8', username: 'pop_star', email: 'popstar@email.com', role: 'user', isVerified: true, createdAt: '2026-02-18' },
];

const AdminUsers = () => {
    const [users, setUsers] = useState(mockUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const handleDelete = (userId: string) => {
        // TODO: Call API - deleteSongApi hoặc deleteUserApi khi BE sẵn sàng
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        setDeleteConfirm(null);
    };

    const handleRoleChange = (userId: string, newRole: string) => {
        // TODO: Call API - updateUserRoleApi khi BE sẵn sàng
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    };

    const filteredUsers = users.filter((u) => {
        const matchSearch =
            u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'moderator': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-zinc-700/50 text-zinc-300 border-zinc-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Users size={24} className="text-green-400" />
                    User Management
                </h1>
                <p className="text-zinc-400 text-sm mt-1">{users.length} registered users (hardcoded data)</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by username or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'admin', 'moderator', 'user'].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${roleFilter === role
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-zinc-500 text-xs uppercase bg-zinc-900/50">
                                <th className="text-left px-5 py-3 font-medium">#</th>
                                <th className="text-left px-5 py-3 font-medium">User</th>
                                <th className="text-left px-5 py-3 font-medium">Email</th>
                                <th className="text-center px-5 py-3 font-medium">Role</th>
                                <th className="text-center px-5 py-3 font-medium">Verified</th>
                                <th className="text-center px-5 py-3 font-medium">Joined</th>
                                <th className="text-right px-5 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-12 text-zinc-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u, index) => (
                                    <tr
                                        key={u.id}
                                        className="border-t border-zinc-800/50 hover:bg-zinc-800/30 transition-colors group"
                                    >
                                        <td className="px-5 py-3 text-zinc-500 text-sm">{index + 1}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold">
                                                    {u.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm font-medium">{u.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-zinc-400 text-sm">{u.email}</td>
                                        <td className="px-5 py-3 text-center">
                                            <select
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className={`text-xs px-2 py-1 rounded-full font-medium border bg-transparent cursor-pointer focus:outline-none ${getRoleBadgeClass(u.role)}`}
                                            >
                                                <option value="user" className="bg-zinc-900 text-white">user</option>
                                                <option value="moderator" className="bg-zinc-900 text-white">moderator</option>
                                                <option value="admin" className="bg-zinc-900 text-white">admin</option>
                                            </select>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${u.isVerified
                                                        ? 'bg-green-500/20 text-green-400'
                                                        : 'bg-zinc-700 text-zinc-400'
                                                    }`}
                                            >
                                                {u.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center text-zinc-400 text-sm">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            {deleteConfirm === u.id ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDelete(u.id)}
                                                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : u.role !== 'admin' ? (
                                                <button
                                                    onClick={() => setDeleteConfirm(u.id)}
                                                    className="text-zinc-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete user"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Note */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                <p className="text-zinc-500 text-xs">
                    ⚠️ User data is currently hardcoded. Role changes and deletions are local only.
                    Connect to BE API endpoints to make them persistent.
                </p>
            </div>
        </div>
    );
};

export default AdminUsers;
