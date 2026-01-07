import { lazy } from 'react';
import config from '../config';
import DefaultLayout from '../layouts/DefaultLayout';


const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const Homepage = lazy(() => import('../pages/Homepage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const SongDetail = lazy(() => import('../pages/song/SongDetail'));
const ShadcnDemo = lazy(() => import('../pages/ShadcnDemo'));


const PublicRoutes = [
    { path: config.routes.home, component: Homepage, layout: DefaultLayout },
    { path: config.routes.login, component: LoginPage, layout: null },
    { path: config.routes.register, component: RegisterPage, layout: null },
    { path: config.routes.song, component: SongDetail, layout: DefaultLayout },
    { path: config.routes.shadcnDemo, component: ShadcnDemo, layout: null }
]


export { PublicRoutes }; // destructuring export 