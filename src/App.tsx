import { Routes, Route, useLocation } from 'react-router-dom';
import { Fragment, Suspense, useEffect } from 'react';
import { PublicRoutes } from './routes/AppRoutes';
import DefaultLayout from './layouts/DefaultLayout';
import Player from './components/layouts/Player';
import ErrorPage from './pages/ErrorPage';
import { useAuthStore } from './store/auth.store';
import { PageLoader } from './components/ui/page-loader/page-loader';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  const location = useLocation();
  const { loadUser, isLoading } = useAuthStore();

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

  // Player chỉ hiện trên các trang có DefaultLayout (trang chính), ẩn ở login/register/etc.
  const showPlayer = PublicRoutes.some(route => {
    const matches = matchesRoutePath(route.path, location.pathname);
    return matches && route.layout !== null;
  });

  return (
    <ErrorBoundary>
      <div className="App">
        <Suspense fallback={<PageLoader fullscreen={false} className="min-h-screen" />}>
          <Routes>
            {PublicRoutes.map((route, index) => {
              const Page = route.component;
              let Layout: React.ComponentType<{ children: React.ReactNode }> | null = route.layout;

              if (Layout === null) {
                Layout = Fragment;
              } else if (!Layout) {
                Layout = DefaultLayout;
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
            {/* {privateRoutes.map((route, index) => {
              const Page = route.component;
              let Layout = route.layout;

              if (Layout === null) {
                Layout = Fragment;
              } else if (!Layout) {
                Layout = DefaultLayout;
              }

              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <ProtectedRoute allowedRoles={route.allowedRoles}>
                      <Layout>
                        <Page />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              );
            })} */}
            <Route
              path="*"
              element={<ErrorPage />}
            />
          </Routes>
        </Suspense>

        {/* Global Music Player - chỉ hiện trên trang chính (có layout) */}
        {showPlayer && (
          <ErrorBoundary fallback={null}>
            <Player />
          </ErrorBoundary>
        )}
      </div>
    </ErrorBoundary>

  );
}

export default App;
