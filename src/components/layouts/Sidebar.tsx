import { Heart, Home, Library, Plus, Search, Settings } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAuthStore } from '@/store';

type MainNavItemKey =
    | 'home'
    | 'search'
    | 'library'
    | 'create-playlist'
    | 'liked-songs';

interface MainNavItem {
    key: MainNavItemKey;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
}

interface LibraryItem {
    id: number;
    name: string;
    type: string;
}

const NAV_ITEMS: MainNavItem[] = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'search', label: 'Search', icon: Search },
    { key: 'library', label: 'Your Library', icon: Library },
    { key: 'create-playlist', label: 'Create Playlist', icon: Plus },
    { key: 'liked-songs', label: 'Liked Songs', icon: Heart },
];

const LIBRARY_ITEMS: LibraryItem[] = [
    { id: 1, name: 'Deep Focus Night', type: 'Playlist' },
    { id: 2, name: 'Lo-fi Coding Session', type: 'Playlist' },
    { id: 3, name: 'After Midnight', type: 'Album' },
    { id: 4, name: 'Morning Signal', type: 'Playlist' },
    { id: 5, name: 'Dream Pop Tapes', type: 'Playlist' },
    { id: 6, name: 'Acoustic Drift', type: 'Playlist' },
    { id: 7, name: 'Neo Soul Wave', type: 'Playlist' },
    { id: 8, name: 'Offline Favorites', type: 'Collection' },
];

const Sidebar = () => {
    const [activeNav, setActiveNav] = useState<MainNavItemKey>('home');
    const [activeLibrary, setActiveLibrary] = useState<number | null>(1);
    const { user } = useAuthStore();

    const displayName = user?.username?.trim() || 'Guest';
    const avatarLabel = useMemo(() => displayName.slice(0, 2).toUpperCase(), [displayName]);

    return (
        <aside
            className="flex h-full min-h-0 flex-col overflow-hidden"
            style={{
                width: '100%',
                background: 'var(--color-bg-surface)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRight: '1px solid var(--color-bg-elevated)',
            }}
        >
            <div className="px-4 pt-4 pb-3">
                <h2
                    style={{
                        margin: 0,
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-xl)',
                        color: 'var(--color-text-secondary)',
                        letterSpacing: '0.03em',
                    }}
                >
                    Melody
                </h2>
            </div>

            <nav className="px-2 pb-3">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.key;

                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => setActiveNav(item.key)}
                              className="flex h-11 w-full items-center gap-3 rounded-md px-3 text-left transition-colors duration-150 hover:bg-(--color-bg-elevated)"
                            style={{
                                borderLeft: isActive
                                    ? '2px solid var(--color-accent-neon)'
                                    : '2px solid transparent',
                                color: isActive
                                    ? 'var(--color-text-primary)'
                                    : 'var(--color-text-secondary)',
                            }}
                        >
                            <Icon size={18} />
                            <span
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: isActive ? 700 : 600,
                                }}
                            >
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </nav>

            <section
                className="mx-3 mt-1 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md"
                style={{
                    background: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-bg-elevated)',
                }}
            >
                <div className="flex items-center justify-between px-3 py-2.5">
                    <p
                        style={{
                            margin: 0,
                            fontSize: 'var(--text-sm)',
                            fontWeight: 700,
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Your Library
                    </p>

                    <button
                        type="button"
                        aria-label="Create new playlist"
                        className="grid h-8 w-8 place-items-center rounded-full transition-colors duration-150 hover:bg-(--color-bg-elevated)"
                        style={{ color: 'var(--color-text-secondary)' }}
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <div
                    className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-2 pb-2"
                    style={{ overscrollBehavior: 'contain' }}
                >
                    {LIBRARY_ITEMS.map((item) => {
                        const isActive = activeLibrary === item.id;

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveLibrary(item.id)}
                                className="mb-1 flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors duration-150 hover:bg-(--color-bg-elevated)"
                                style={{
                                    background: isActive ? 'var(--color-bg-elevated)' : 'transparent',
                                }}
                            >
                                <div
                                    className="grid h-10 w-10 shrink-0 place-items-center rounded-md"
                                    style={{
                                        background: 'var(--color-bg-elevated)',
                                        color: 'var(--color-text-secondary)',
                                        border: '1px solid var(--color-bg-elevated)',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 'var(--text-xs)',
                                            fontWeight: 700,
                                            letterSpacing: '0.06em',
                                        }}
                                    >
                                        {item.name.slice(0, 2).toUpperCase()}
                                    </span>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p
                                        className="truncate"
                                        style={{
                                            margin: 0,
                                            fontSize: 'var(--text-sm)',
                                            fontWeight: isActive ? 700 : 600,
                                            color: isActive
                                                ? 'var(--color-text-primary)'
                                                : 'var(--color-text-secondary)',
                                        }}
                                    >
                                        {item.name}
                                    </p>
                                    <p
                                        className="truncate"
                                        style={{
                                            margin: 0,
                                            fontSize: 'var(--text-xs)',
                                            color: 'var(--color-text-muted)',
                                        }}
                                    >
                                        {item.type}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </section>

            <footer
                className="mt-3 flex items-center justify-between px-3 py-3"
                style={{
                    borderTop: '1px solid var(--color-bg-elevated)',
                    background: 'var(--color-bg-surface)',
                }}
            >
                <div className="flex min-w-0 items-center gap-2.5">
                    <div
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                        style={{
                            background: 'var(--color-bg-elevated)',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>{avatarLabel}</span>
                    </div>

                    <span
                        className="truncate"
                        style={{
                            fontSize: 'var(--text-sm)',
                            fontWeight: 600,
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        {displayName}
                    </span>
                </div>

                <button
                    type="button"
                    aria-label="Open settings"
                      className="grid h-8 w-8 place-items-center rounded-full transition-colors duration-150 hover:bg-(--color-bg-elevated)"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    <Settings size={16} />
                </button>
            </footer>
        </aside>
    );
};

export default Sidebar;
