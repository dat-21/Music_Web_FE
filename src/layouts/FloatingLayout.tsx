import { useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Home, Library, LogOut, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularPlayer } from '@/components/player/CircularPlayer';
import { MiniPlayer } from '@/components/player/MiniPlayer';
import { usePlayerStore } from '@/store';
import { useAuthStore } from '@/store/auth.store';
import config from '@/config';

interface HeaderNavItem {
  label: string;
  path: string;
  icon: ComponentType<{ size?: number }>;
}

const NAV_ITEMS: HeaderNavItem[] = [
  { label: 'Home', path: config.routes.home, icon: Home },
  { label: 'Search', path: config.routes.search, icon: Search },
  { label: 'Library', path: config.routes.library, icon: Library },
];

const toArtistSlug = (artistName: string) =>
  artistName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const isNavItemActive = (pathname: string, path: string) => {
  if (path === config.routes.home) return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
};

const FloatingLayout = ({ children }: { children: ReactNode }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const currentSong = usePlayerStore(s => s.currentSong);
  const isPlaying = usePlayerStore(s => s.isPlaying);
  const togglePlay = usePlayerStore(s => s.togglePlay);
  const currentTime = usePlayerStore(s => s.currentTime);
  const duration = usePlayerStore(s => s.duration);
  const seek = usePlayerStore(s => s.seek);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const activeArtistSlug = useMemo(() => {
    if (!currentSong?.artist) return '';
    return toArtistSlug(currentSong.artist);
  }, [currentSong?.artist]);

  const username = user?.username?.trim() || 'User';
  const avatarFallback = username.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate(config.routes.landing, { replace: true });
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden selection:bg-universe-primary/30"
      style={{ background: 'linear-gradient(180deg, var(--color-bg-primary) 0%, var(--color-bg-mid) 50%, var(--color-bg-primary) 100%)' }}
    >

      {/* ── Ambient depth layers (behind everything) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Top-center cyan glow — gives depth to the "sky" */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full"
             style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.07) 0%, transparent 65%)' }} />
        {/* Center violet glow — behind the main content area */}
        <div className="absolute top-[30%] left-[40%] w-[700px] h-[700px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(179,136,255,0.05) 0%, transparent 60%)' }} />
        {/* Bottom accent glow */}
        <div className="absolute bottom-[-100px] right-[20%] w-[500px] h-[400px] rounded-full"
             style={{ background: 'radial-gradient(circle, rgba(255,64,129,0.04) 0%, transparent 60%)' }} />
      </div>

      <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[#050710]/72 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 md:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate(config.routes.home)}
            className="inline-flex items-center gap-2"
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{
                background: 'var(--color-accent-neon)',
                boxShadow: '0 0 12px rgba(0,229,255,0.72)',
              }}
            />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: '0.04em' }}>Melody</span>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(location.pathname, item.path);

              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold"
                  style={{
                    color: isActive ? 'var(--color-accent-neon)' : 'var(--color-text-secondary)',
                    background: isActive ? 'rgba(0,229,255,0.12)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? 'rgba(0,229,255,0.35)' : 'rgba(255,255,255,0.12)'}`,
                  }}
                >
                  <Icon size={14} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {currentSong && (
              <button
                type="button"
                onClick={() => setIsPlayerOpen(true)}
                className="hidden max-w-[220px] items-center gap-2 rounded-full border px-2.5 py-1.5 text-left sm:inline-flex"
                style={{
                  borderColor: 'rgba(255,255,255,0.14)',
                  background: 'rgba(5,7,15,0.55)',
                }}
              >
                <span className="h-6 w-6 overflow-hidden rounded-full" style={{ background: 'var(--color-bg-elevated)' }}>
                  {currentSong.coverUrl ? (
                    <img src={currentSong.coverUrl} alt={currentSong.title} className="h-full w-full object-cover" />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-white">{currentSong.title}</span>
                  <span className="block truncate text-[11px] text-white/55">{currentSong.artist}</span>
                </span>
              </button>
            )}

            {activeArtistSlug && (
              <button
                type="button"
                onClick={() => navigate(`/artist/${encodeURIComponent(activeArtistSlug)}`)}
                className="hidden rounded-full border px-3 py-1.5 text-xs font-semibold md:inline-flex"
                style={{
                  borderColor: 'rgba(179,136,255,0.35)',
                  color: '#d5baff',
                  background: 'rgba(179,136,255,0.12)',
                }}
              >
                Artist
              </button>
            )}

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5"
              style={{
                borderColor: 'rgba(255,255,255,0.14)',
                background: 'rgba(5,7,15,0.55)',
              }}
            >
              <span
                className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: 'var(--color-bg-elevated)' }}
              >
                {avatarFallback}
              </span>
              <span className="hidden max-w-[140px] truncate text-sm text-white/85 lg:inline">{username}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold"
              style={{
                borderColor: 'rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.03)',
                color: 'var(--color-text-secondary)',
              }}
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="relative z-10 h-screen w-full overflow-y-auto overflow-x-hidden pb-32 pt-20 no-scrollbar scroll-smooth md:pt-24">
        <div className="mx-auto w-full max-w-[1400px]">
          {children}
        </div>
      </main>

      {/* ── MiniPlayer ── */}
      <AnimatePresence>
        {currentSong && !isPlayerOpen && (
          <MiniPlayer
            currentSong={currentSong}
            isPlaying={isPlaying}
            togglePlay={togglePlay}
            onExpand={() => setIsPlayerOpen(true)}
            progress={progress}
          />
        )}
      </AnimatePresence>

      {/* ── CircularPlayer ── */}
      {currentSong && (
        <CircularPlayer
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          currentSong={currentSong}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
        />
      )}
    </div>
  );
};

export default FloatingLayout;
