import { lazy } from 'react';
import config from '@/config';
import FloatingLayout from '@/layouts/FloatingLayout';
import AdminLayout from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { GuestRoute } from '@/components/auth/GuestRoute';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const Homepage = lazy(() => import('@/pages/Homepage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const LibraryPage = lazy(() => import('@/pages/LibraryPage'));
const PlaylistDetailPage = lazy(() => import('@/pages/PlaylistDetailPage'));
const ArtistPage = lazy(() => import('@/pages/ArtistPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const SongDetail = lazy(() => import('@/pages/song/SongDetail'));
const ForbiddenPage = lazy(() => import('@/pages/errors/ForbiddenPage'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminSongs = lazy(() => import('@/pages/admin/AdminSongs'));
const AdminUpload = lazy(() => import('@/pages/admin/AdminUpload'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));

// Dev-only
const ShadcnDemo = lazy(() => import('@/pages/ShadcnDemo'));

export type AppRoute = {
    path: string;
    component: React.LazyExoticComponent<React.ComponentType<object>>;
    layout: React.ComponentType<{ children: React.ReactNode }> | null;
    wrapper?: React.ComponentType<{ children: React.ReactNode }>;
};

// ─── Guest-only routes (đã login → redirect về home) ───────────────────────
const GuestRoutes: AppRoute[] = [
    {
        path: config.routes.landing,
        component: LandingPage,
        layout: null,
        wrapper: ({ children }) => <GuestRoute>{children}</GuestRoute>,
    },
    {
        path: config.routes.login,
        component: LoginPage,
        layout: null,
        wrapper: ({ children }) => <GuestRoute>{children}</GuestRoute>,
    },
    {
        path: config.routes.register,
        component: RegisterPage,
        layout: null,
        wrapper: ({ children }) => <GuestRoute>{children}</GuestRoute>,
    },
];

// ─── Protected routes (phải login) ─────────────────────────────────────────
const UserRoutes: AppRoute[] = [
    {
        path: config.routes.home,
        component: Homepage,
        layout: FloatingLayout,
        wrapper: ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>,
    },
    {
        path: config.routes.search,
        component: SearchPage,
        layout: FloatingLayout,
        wrapper: ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>,
    },
    {
        path: config.routes.library,
        component: LibraryPage,
        layout: FloatingLayout,
        wrapper: ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>,
    },
    {
        path: config.routes.playlistDetail,
        component: PlaylistDetailPage,
        layout: FloatingLayout,
        wrapper: ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>,
    },
    {
        path: config.routes.artist,
        component: ArtistPage,
        layout: FloatingLayout,
        wrapper: ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>,
    },
    {
        path: config.routes.song,
        component: SongDetail,
        layout: FloatingLayout,
        wrapper: ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>,
    },
];

// ─── Admin routes (phải login + role ADMIN) ─────────────────────────────────
const AdminRoutes: AppRoute[] = [
    {
        path: config.routes.admin,
        component: AdminDashboard,
        layout: AdminLayout,
        wrapper: ({ children }) => (
            <ProtectedRoute requiredRole={config.roles.ADMIN}>
                {children}
            </ProtectedRoute>
        ),
    },
    {
        path: config.routes.adminSongs,
        component: AdminSongs,
        layout: AdminLayout,
        wrapper: ({ children }) => (
            <ProtectedRoute requiredRole={config.roles.ADMIN}>
                {children}
            </ProtectedRoute>
        ),
    },
    {
        path: config.routes.adminUpload,
        component: AdminUpload,
        layout: AdminLayout,
        wrapper: ({ children }) => (
            <ProtectedRoute requiredRole={config.roles.ADMIN}>
                {children}
            </ProtectedRoute>
        ),
    },
    {
        path: config.routes.adminUsers,
        component: AdminUsers,
        layout: AdminLayout,
        wrapper: ({ children }) => (
            <ProtectedRoute requiredRole={config.roles.ADMIN}>
                {children}
            </ProtectedRoute>
        ),
    },
];

// ─── Dev-only routes ─────────────────────────────────────────────────────────
const DevRoutes: AppRoute[] = import.meta.env.DEV
    ? [
        {
            path: config.routes.shadcnDemo,
            component: ShadcnDemo,
            layout: null,
        },
    ]
    : [];

// ─── Error routes ─────────────────────────────────────────────────────────────
const ErrorRoutes: AppRoute[] = [
    {
        path: '/403',
        component: ForbiddenPage,
        layout: null,
    },
];

// ─── Export tổng hợp ──────────────────────────────────────────────────────────
export const PublicRoutes: AppRoute[] = [
    ...GuestRoutes,
    ...UserRoutes,
    ...AdminRoutes,
    ...DevRoutes,
    ...ErrorRoutes,
];