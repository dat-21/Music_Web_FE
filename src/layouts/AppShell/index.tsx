import {
    type ChangeEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';
import {
    Bell,
    Compass,
    Heart,
    Home,
    Library,
    ListMusic,
    Maximize2,
    Mic2,
    Pause,
    Play,
    Search,
    Settings,
    SkipBack,
    SkipForward,
    User,
    Volume2,
    VolumeX,
} from 'lucide-react';
import { useAuthStore, usePlayerStore } from '@/store';

interface AppShellProps {
    children: ReactNode;
}

interface NavItem {
    key: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
}

const DESKTOP_SIDEBAR_WIDTH = 240;
const HEADER_HEIGHT = 64;
const DESKTOP_PLAYER_HEIGHT = 80;
const MOBILE_PLAYER_HEIGHT = 64;
const MOBILE_NAV_HEIGHT = 56;

const DESKTOP_NAV_ITEMS: NavItem[] = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'discover', label: 'Discover', icon: Compass },
    { key: 'library', label: 'Library', icon: Library },
    { key: 'queue', label: 'Queue', icon: ListMusic },
    { key: 'settings', label: 'Settings', icon: Settings },
];

const MOBILE_NAV_ITEMS: NavItem[] = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'discover', label: 'Discover', icon: Compass },
    { key: 'library', label: 'Library', icon: Library },
    { key: 'queue', label: 'Queue', icon: ListMusic },
    { key: 'profile', label: 'Profile', icon: User },
];

const AppShell = ({ children }: AppShellProps) => {
    const [isMobile, setIsMobile] = useState(false);
    const [activeNav, setActiveNav] = useState('home');
    const [searchValue, setSearchValue] = useState('');
    const [isHeaderBlurred, setIsHeaderBlurred] = useState(false);

    const { user } = useAuthStore();
    const currentSong = usePlayerStore((state) => state.currentSong);
    const isPlaying = usePlayerStore((state) => state.isPlaying);
    const togglePlay = usePlayerStore((state) => state.togglePlay);
    const currentTime = usePlayerStore((state) => state.currentTime);
    const duration = usePlayerStore((state) => state.duration);
    const volume = usePlayerStore((state) => state.volume);
    const setVolume = usePlayerStore((state) => state.setVolume);
    const seek = usePlayerStore((state) => state.seek);

    const mainScrollRef = useRef<HTMLElement | null>(null);
    const scrollSentinelRef = useRef<HTMLDivElement | null>(null);

    const trackDuration = useMemo(() => {
        if (duration > 0) return duration;
        return currentSong?.duration ?? 0;
    }, [duration, currentSong?.duration]);

    const progress = useMemo(() => {
        if (!trackDuration || trackDuration <= 0) return 0;
        return Math.min(100, Math.max(0, (currentTime / trackDuration) * 100));
    }, [currentTime, trackDuration]);

    const formattedCurrentTime = useMemo(() => {
        const total = Number.isFinite(currentTime) ? Math.max(0, Math.floor(currentTime)) : 0;
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, [currentTime]);

    const formattedDuration = useMemo(() => {
        const total = Number.isFinite(trackDuration) ? Math.max(0, Math.floor(trackDuration)) : 0;
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, [trackDuration]);

    const handleProgressChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!trackDuration || trackDuration <= 0) return;
        const nextPercent = Number(event.target.value);
        const nextTime = (nextPercent / 100) * trackDuration;
        seek(nextTime);
    };

    const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = Number(event.target.value);
        setVolume(nextValue / 100);
    };

    const handleToggleMute = () => {
        setVolume(volume <= 0 ? 0.8 : 0);
    };

    const handleToggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                return;
            }
            await document.exitFullscreen();
        } catch {
            // Ignore browser-specific fullscreen errors.
        }
    };

    const username = user?.username?.trim() || 'Guest';
    const avatarLabel = username.charAt(0).toUpperCase();

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');

        const syncMediaState = () => {
            setIsMobile(mediaQuery.matches);
        };

        syncMediaState();

        const handleChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
        };

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    useEffect(() => {
        const rootNode = mainScrollRef.current;
        const targetNode = scrollSentinelRef.current;

        if (!rootNode || !targetNode) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsHeaderBlurred(!entry.isIntersecting);
            },
            {
                root: rootNode,
                threshold: 1,
            }
        );

        observer.observe(targetNode);

        return () => {
            observer.disconnect();
        };
    }, [isMobile]);

    const shellStyles: CSSProperties = isMobile
        ? {
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr)',
            gridTemplateRows: `${HEADER_HEIGHT}px minmax(0, 1fr) ${MOBILE_PLAYER_HEIGHT}px ${MOBILE_NAV_HEIGHT}px`,
            gridTemplateAreas: '"header" "main" "player" "bottomnav"',
            height: '100vh',
            minHeight: '100vh',
            overflow: 'hidden',
            fontFamily: 'var(--font-body)',
            background: 'linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-mid) 100%)',
            color: 'var(--color-text-primary)',
        }
        : {
            display: 'grid',
            gridTemplateColumns: `${DESKTOP_SIDEBAR_WIDTH}px minmax(0, 1fr)`,
            gridTemplateRows: `${HEADER_HEIGHT}px minmax(0, 1fr) ${DESKTOP_PLAYER_HEIGHT}px`,
            gridTemplateAreas: '"sidebar header" "sidebar main" "sidebar player"',
            height: '100vh',
            minHeight: '100vh',
            overflow: 'hidden',
            fontFamily: 'var(--font-body)',
            background: 'linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-mid) 100%)',
            color: 'var(--color-text-primary)',
        };

    return (
        <div style={shellStyles}>
            <aside
                style={{
                    gridArea: 'sidebar',
                    display: isMobile ? 'none' : 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-lg)',
                    minHeight: 0,
                    padding: 'var(--space-lg)',
                    background: 'var(--color-bg-surface)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRight: '1px solid var(--color-bg-elevated)',
                    boxShadow: 'inset -1px 0 0 var(--color-bg-elevated), 18px 0 36px -28px var(--color-accent-neon)',
                    zIndex: 3,
                }}
            >
                <div
                    style={{
                        fontSize: 'var(--text-xl)',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        color: 'var(--color-text-primary)',
                    }}
                >
                    Melody
                </div>

                <nav
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-sm)',
                    }}
                >
                    {DESKTOP_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeNav === item.key;

                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => setActiveNav(item.key)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-sm)',
                                    height: '40px',
                                    padding: '0 var(--space-md)',
                                    border: '1px solid var(--color-bg-elevated)',
                                    borderRadius: 'var(--radius-md)',
                                    background: isActive ? 'var(--color-bg-elevated)' : 'transparent',
                                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                    transition: 'var(--transition-base)',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                }}
                            >
                                <Icon size={18} />
                                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            <header
                style={{
                    gridArea: 'header',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 'var(--space-lg)',
                    padding: '0 var(--space-lg)',
                    borderBottom: isHeaderBlurred ? '1px solid var(--color-bg-elevated)' : '1px solid transparent',
                    background: isHeaderBlurred ? 'var(--color-bg-surface)' : 'transparent',
                    backdropFilter: isHeaderBlurred ? 'blur(20px)' : 'blur(0px)',
                    WebkitBackdropFilter: isHeaderBlurred ? 'blur(20px)' : 'blur(0px)',
                    transition: 'var(--transition-base)',
                    zIndex: 4,
                }}
            >
                <div style={{ position: 'relative', width: 'min(560px, 100%)', flex: 1 }}>
                    <Search
                        size={16}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: 'var(--space-md)',
                            transform: 'translateY(-50%)',
                            color: 'var(--color-text-muted)',
                            pointerEvents: 'none',
                        }}
                    />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder="Search songs, artists, playlists"
                        style={{
                            width: '100%',
                            height: '40px',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--color-bg-elevated)',
                            padding: '0 var(--space-lg) 0 40px',
                            background: 'var(--color-bg-surface)',
                            color: 'var(--color-text-primary)',
                            outline: 'none',
                        }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <button
                        type="button"
                        aria-label="Notifications"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--color-bg-elevated)',
                            background: 'var(--color-bg-surface)',
                            color: 'var(--color-text-secondary)',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                            transition: 'var(--transition-fast)',
                        }}
                    >
                        <Bell size={18} />
                    </button>

                    <button
                        type="button"
                        aria-label="User profile"
                        style={{
                            height: '40px',
                            minWidth: '40px',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--color-bg-elevated)',
                            background: 'var(--color-bg-surface)',
                            color: 'var(--color-text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-sm)',
                            padding: '0 var(--space-sm)',
                            cursor: 'pointer',
                        }}
                    >
                        <span
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--color-bg-elevated)',
                                display: 'grid',
                                placeItems: 'center',
                                fontSize: 'var(--text-sm)',
                                fontWeight: 700,
                            }}
                        >
                            {avatarLabel}
                        </span>
                        {!isMobile && (
                            <span
                                style={{
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 600,
                                    color: 'var(--color-text-secondary)',
                                    maxWidth: '140px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {username}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            <main
                ref={mainScrollRef}
                style={{
                    gridArea: 'main',
                    minHeight: 0,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: 'var(--space-lg)',
                    position: 'relative',
                    zIndex: 2,
                }}
            >
                <div ref={scrollSentinelRef} style={{ height: 1 }} />
                {children}
            </main>

            <div
                style={{
                    gridArea: 'player',
                    position: 'relative',
                    background: 'var(--color-bg-elevated)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '1px solid var(--color-bg-elevated)',
                    boxShadow: '0 -8px 36px -24px var(--color-bg-primary)',
                    zIndex: 5,
                    minHeight: 0,
                }}
            >
                {!isMobile ? (
                    <div
                        style={{
                            height: '100%',
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 30%) minmax(360px, 40%) minmax(0, 30%)',
                            alignItems: 'center',
                            gap: 'var(--space-md)',
                            padding: '0 var(--space-lg)',
                        }}
                    >
                        <div
                            style={{
                                minWidth: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-md)',
                            }}
                        >
                            <div
                                style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    border: '1px solid var(--color-bg-elevated)',
                                    background: 'var(--color-bg-surface)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    color: 'var(--color-text-muted)',
                                    flexShrink: 0,
                                    boxShadow: '0 0 14px -8px var(--color-accent-neon)',
                                }}
                            >
                                {currentSong?.coverUrl ? (
                                    <img
                                        src={currentSong.coverUrl}
                                        alt={currentSong.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <ListMusic size={18} />
                                )}
                            </div>

                            <div style={{ minWidth: 0, flex: 1 }}>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: 'var(--text-sm)',
                                        fontWeight: 700,
                                        color: 'var(--color-text-primary)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {currentSong?.title || 'Select a track to start listening'}
                                </p>
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-text-muted)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {currentSong?.artist || 'Melody Player'}
                                </p>
                            </div>

                            <button
                                type="button"
                                aria-label="Like"
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid var(--color-bg-elevated)',
                                    background: 'var(--color-bg-surface)',
                                    color: 'var(--color-text-secondary)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Heart size={15} />
                            </button>
                        </div>

                        <div
                            style={{
                                minWidth: 0,
                                display: 'grid',
                                gap: 'var(--space-xs)',
                                justifyItems: 'center',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                                <button
                                    type="button"
                                    aria-label="Previous"
                                    onClick={() => seek(Math.max(0, currentTime - 10))}
                                    style={{
                                        width: 34,
                                        height: 34,
                                        borderRadius: 'var(--radius-full)',
                                        border: '1px solid var(--color-bg-elevated)',
                                        background: 'var(--color-bg-surface)',
                                        color: 'var(--color-text-secondary)',
                                        display: 'grid',
                                        placeItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <SkipBack size={16} />
                                </button>

                                <button
                                    type="button"
                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                    onClick={togglePlay}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 'var(--radius-full)',
                                        border: '1px solid var(--color-bg-elevated)',
                                        background: 'var(--color-accent-neon)',
                                        color: 'var(--color-bg-primary)',
                                        display: 'grid',
                                        placeItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                </button>

                                <button
                                    type="button"
                                    aria-label="Next"
                                    onClick={() => seek(Math.min(trackDuration || 0, currentTime + 10))}
                                    style={{
                                        width: 34,
                                        height: 34,
                                        borderRadius: 'var(--radius-full)',
                                        border: '1px solid var(--color-bg-elevated)',
                                        background: 'var(--color-bg-surface)',
                                        color: 'var(--color-text-secondary)',
                                        display: 'grid',
                                        placeItems: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <SkipForward size={16} />
                                </button>
                            </div>

                            <div
                                style={{
                                    width: '100%',
                                    display: 'grid',
                                    gridTemplateColumns: '40px minmax(0, 1fr) 40px',
                                    gap: 'var(--space-sm)',
                                    alignItems: 'center',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-text-muted)',
                                        textAlign: 'right',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {formattedCurrentTime}
                                </span>

                                <label className="melody-progress-wrap" style={{ width: '100%' }}>
                                    <div className="melody-progress-rail">
                                        <div className="melody-progress-fill" style={{ width: `${progress}%` }} />
                                        <span
                                            className="melody-progress-thumb"
                                            style={{ left: `calc(${progress}% - 5px)` }}
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min={0}
                                        max={100}
                                        step={0.1}
                                        value={progress}
                                        onChange={handleProgressChange}
                                        className="melody-progress-input"
                                        aria-label="Seek"
                                    />
                                </label>

                                <span
                                    style={{
                                        fontSize: 'var(--text-xs)',
                                        color: 'var(--color-text-muted)',
                                        fontVariantNumeric: 'tabular-nums',
                                    }}
                                >
                                    {formattedDuration}
                                </span>
                            </div>
                        </div>

                        <div
                            style={{
                                minWidth: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: 'var(--space-sm)',
                            }}
                        >
                            <button
                                type="button"
                                aria-label="Queue"
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid var(--color-bg-elevated)',
                                    background: 'var(--color-bg-surface)',
                                    color: 'var(--color-text-secondary)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <ListMusic size={16} />
                            </button>

                            <button
                                type="button"
                                aria-label="Lyrics"
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid var(--color-bg-elevated)',
                                    background: 'var(--color-bg-surface)',
                                    color: 'var(--color-text-secondary)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Mic2 size={16} />
                            </button>

                            <button
                                type="button"
                                aria-label={volume <= 0 ? 'Unmute' : 'Mute'}
                                onClick={handleToggleMute}
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid var(--color-bg-elevated)',
                                    background: 'var(--color-bg-surface)',
                                    color: 'var(--color-text-secondary)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                {volume <= 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                            </button>

                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={Math.round(volume * 100)}
                                onChange={handleVolumeChange}
                                className="melody-volume-slider"
                                aria-label="Volume"
                            />

                            <button
                                type="button"
                                aria-label="Toggle fullscreen"
                                onClick={handleToggleFullscreen}
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid var(--color-bg-elevated)',
                                    background: 'var(--color-bg-surface)',
                                    color: 'var(--color-text-secondary)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                <Maximize2 size={16} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            height: '100%',
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            alignItems: 'center',
                            gap: 'var(--space-sm)',
                            padding: '0 var(--space-md)',
                        }}
                    >
                        <div
                            style={{
                                minWidth: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-sm)',
                            }}
                        >
                            <div
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    border: '1px solid var(--color-bg-elevated)',
                                    background: 'var(--color-bg-surface)',
                                    display: 'grid',
                                    placeItems: 'center',
                                    color: 'var(--color-text-muted)',
                                    flexShrink: 0,
                                    boxShadow: '0 0 12px -8px var(--color-accent-neon)',
                                }}
                            >
                                {currentSong?.coverUrl ? (
                                    <img
                                        src={currentSong.coverUrl}
                                        alt={currentSong.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <ListMusic size={16} />
                                )}
                            </div>

                            <p
                                style={{
                                    margin: 0,
                                    fontSize: 'var(--text-sm)',
                                    fontWeight: 700,
                                    color: 'var(--color-text-primary)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {currentSong?.title || 'No track selected'}
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                            onClick={togglePlay}
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid var(--color-bg-elevated)',
                                background: 'var(--color-accent-neon)',
                                color: 'var(--color-bg-primary)',
                                display: 'grid',
                                placeItems: 'center',
                                cursor: 'pointer',
                            }}
                        >
                            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                    </div>
                )}

                <style>{`
          .melody-progress-wrap {
            position: relative;
            display: flex;
            align-items: center;
            height: 18px;
            cursor: pointer;
          }

          .melody-progress-rail {
            position: relative;
            width: 100%;
            height: 4px;
            border-radius: var(--radius-full);
            background: var(--color-bg-surface);
            transition: height var(--transition-fast);
          }

          .melody-progress-fill {
            height: 100%;
            border-radius: var(--radius-full);
            background: var(--color-accent-neon);
          }

          .melody-progress-thumb {
            position: absolute;
            top: 50%;
            width: 10px;
            height: 10px;
            border-radius: var(--radius-full);
            background: var(--color-accent-neon);
            transform: translateY(-50%) scale(0.65);
            opacity: 0;
            transition: opacity var(--transition-fast), transform var(--transition-fast);
            pointer-events: none;
          }

          .melody-progress-wrap:hover .melody-progress-rail {
            height: 6px;
          }

          .melody-progress-wrap:hover .melody-progress-thumb {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }

          .melody-progress-input {
            position: absolute;
            inset: 0;
            opacity: 0;
            width: 100%;
            cursor: pointer;
          }

          .melody-volume-slider {
            width: 80px;
            appearance: none;
            -webkit-appearance: none;
            height: 4px;
            border-radius: var(--radius-full);
            background: linear-gradient(
              to right,
              var(--color-accent-neon) 0%,
              var(--color-accent-neon) ${Math.round(volume * 100)}%,
              var(--color-bg-surface) ${Math.round(volume * 100)}%,
              var(--color-bg-surface) 100%
            );
            outline: none;
            cursor: pointer;
          }

          .melody-volume-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 10px;
            height: 10px;
            border-radius: var(--radius-full);
            border: none;
            background: var(--color-accent-neon);
          }

          .melody-volume-slider::-moz-range-thumb {
            width: 10px;
            height: 10px;
            border-radius: var(--radius-full);
            border: none;
            background: var(--color-accent-neon);
          }

          .melody-volume-slider::-moz-range-track {
            height: 4px;
            border-radius: var(--radius-full);
            background: var(--color-bg-surface);
          }
        `}</style>
            </div>

            <nav
                aria-label="Mobile navigation"
                style={{
                    gridArea: 'bottomnav',
                    display: isMobile ? 'grid' : 'none',
                    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                    borderTop: '1px solid var(--color-bg-elevated)',
                    background: 'var(--color-bg-surface)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    zIndex: 6,
                }}
            >
                {MOBILE_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.key;

                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => setActiveNav(item.key)}
                            style={{
                                display: 'grid',
                                placeItems: 'center',
                                gap: 2,
                                border: 'none',
                                background: 'transparent',
                                color: isActive ? 'var(--color-accent-neon)' : 'var(--color-text-muted)',
                                fontSize: 'var(--text-xs)',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default AppShell;
