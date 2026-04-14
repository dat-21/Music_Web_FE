import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Fragment, Suspense, useEffect } from 'react';
import { PublicRoutes } from './routes/AppRoutes';
import FloatingLayout from './layouts/FloatingLayout';
import PlayerEngine from './components/layouts/Player';
import ErrorPage from './pages/ErrorPage';
import { useAuthStore } from './store/auth.store';
import { PageLoader } from './components/ui/page-loader/page-loader';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import config from './config';

function App() {
  const location = useLocation();
  const { loadUser, isLoading, isAuthenticated } = useAuthStore();

  const matchesRoutePath = (routePath: string, pathname: string) => {
    if (routePath === pathname) return true;
    const routeRegex = new RegExp('^' + routePath.replace(/:[^/]+/g, '[^/]+') + '$');
    return routeRegex.test(pathname);
  };

  // ✅ Check authentication khi app mount
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toàn trang — khi app đang check auth
  if (isLoading) return <PageLoader />;

  const guestOnlyPaths = [config.routes.landing, config.routes.login, config.routes.register];
  const isGuestOnlyRoute = guestOnlyPaths.some((routePath) =>
    matchesRoutePath(routePath, location.pathname)
  );

  const currentRoute = PublicRoutes.find((route) =>
    matchesRoutePath(route.path, location.pathname)
  );

  const isProtectedRoute = Boolean(
    currentRoute &&
    !isGuestOnlyRoute &&
    currentRoute.path !== config.routes.shadcnDemo
  );

  if (!isAuthenticated && isProtectedRoute) {
    return <Navigate to={config.routes.landing} replace />;
  }

  if (isAuthenticated && isGuestOnlyRoute) {
    return <Navigate to={config.routes.home} replace />;
  }

  // Player chỉ hiện trên các trang có layout (trang chính), ẩn ở login/register/etc.
  const showPlayer = PublicRoutes.some(route => {
    const matches = matchesRoutePath(route.path, location.pathname);
    return matches && route.layout !== null;
  });

  return (
    <ErrorBoundary>
      <div className="App">
        <Suspense fallback={<PageLoader fullscreen={false} className="min-h-screen bg-black" />}>
          <Routes>
            {PublicRoutes.map((route, index) => {
              const Page = route.component;
              let Layout: React.ComponentType<{ children: React.ReactNode }> | null = route.layout;

              if (Layout === null) {
                Layout = Fragment;
              } else if (!Layout) {
                Layout = FloatingLayout;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <ErrorBoundary fallback={<ErrorPage />}>
                        <Page />
                      </ErrorBoundary>
                    </Layout>
                  }
                />
              );
            })}
            <Route
              path="*"
              element={<ErrorPage />}
            />
          </Routes>
        </Suspense>

        {/* Global Invisible Audio Engine */}
        {showPlayer && (
          <ErrorBoundary fallback={null}>
            <PlayerEngine />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>

  );
}

export default App;
