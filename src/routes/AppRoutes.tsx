import { lazy } from 'react';
import config from '../config';
import DefaultLayout from '../layouts/DefaultLayout';
// import config from '~/config';


const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const Homepage = lazy(() => import('../pages/Homepage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));


const PublicRoutes = [
    { path: config.routes.home, component: Homepage, layout: DefaultLayout },
    { path: config.routes.login, component: LoginPage, layout: null },
    { path: config.routes.register, component: RegisterPage, layout: null },
]


export { PublicRoutes }; // destructuring export