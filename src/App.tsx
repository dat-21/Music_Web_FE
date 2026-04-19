import { Routes, Route } from 'react-router-dom';
import { Fragment, Suspense, useEffect } from 'react';
import { PublicRoutes } from './routes/AppRoutes';
import FloatingLayout from './layouts/FloatingLayout';
import PlayerEngine from './components/layouts/Player';
import ErrorPage from './pages/ErrorPage';
import { useAuthStore } from './store/auth.store';
import { PageLoader } from './components/ui/page-loader/page-loader';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const { loadUser, isLoading } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  // Chờ check auth xong mới render — tránh flash redirect
  if (isLoading) return <PageLoader />;

  // Player chỉ hiện trên route có layout
  const matchesRoutePath = (routePath: string, pathname: string) => {
    if (routePath === pathname) return true;
    const routeRegex = new RegExp('^' + routePath.replace(/:[^/]+/g, '[^/]+') + '$');
    return routeRegex.test(pathname);
  };

  const showPlayer = PublicRoutes.some((route) => {
    return matchesRoutePath(route.path, location.pathname) && route.layout !== null;
  });

  return (
    <ErrorBoundary>
      <div className="App">
        <Suspense fallback={<PageLoader fullscreen={false} className="min-h-screen bg-black" />}>
          <Routes>
            {PublicRoutes.map((route, index) => {
              const Page = route.component;
              const Wrapper = route.wrapper ?? Fragment; // ← KEY FIX

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
                    <Wrapper>        {/* ProtectedRoute / GuestRoute / Fragment */}
                      <Layout>
                        <ErrorBoundary fallback={<ErrorPage />}>
                          <Page />
                        </ErrorBoundary>
                      </Layout>
                    </Wrapper>
                  }
                />
              );
            })}

            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>

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