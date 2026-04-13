import { lazy } from 'react';
import config from '../config';
import FloatingLayout from '../layouts/FloatingLayout';
import AdminLayout from '../layouts/AdminLayout';


const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const Homepage = lazy(() => import('../pages/Homepage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const SongDetail = lazy(() => import('../pages/song/SongDetail'));
const ShadcnDemo = lazy(() => import('../pages/ShadcnDemo'));

// Admin pages
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminSongs = lazy(() => import('../pages/admin/AdminSongs'));
const AdminUpload = lazy(() => import('../pages/admin/AdminUpload'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));


const PublicRoutes = [
    { path: config.routes.home, component: Homepage, layout: FloatingLayout },
    { path: config.routes.login, component: LoginPage, layout: null },
    { path: config.routes.register, component: RegisterPage, layout: null },
    { path: config.routes.song, component: SongDetail, layout: FloatingLayout },
    { path: config.routes.shadcnDemo, component: ShadcnDemo, layout: null },

    // Admin routes
    { path: config.routes.admin, component: AdminDashboard, layout: AdminLayout },
    { path: config.routes.adminSongs, component: AdminSongs, layout: AdminLayout },
    { path: config.routes.adminUpload, component: AdminUpload, layout: AdminLayout },
    { path: config.routes.adminUsers, component: AdminUsers, layout: AdminLayout },
]


export { PublicRoutes }; // destructuring export 