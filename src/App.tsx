import { Routes, Route, useLocation } from 'react-router-dom';
import { Fragment, Suspense, useEffect } from 'react';
import { PublicRoutes } from './routes/AppRoutes';
import DefaultLayout from './layouts/DefaultLayout';
import Player from './components/layouts/Player';
import ErrorPage from './pages/ErrorPage';
import { useAuthStore } from './store/auth.store';

function App() {
  const location = useLocation();
  const { loadUser, isLoading } = useAuthStore();

  // ✅ Check authentication khi app mount
  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if current route exists in PublicRoutes
  const isValidRoute = PublicRoutes.some(route => {
    if (route.path === location.pathname) return true;
    // Check for dynamic routes
    const routeRegex = new RegExp('^' + route.path.replace(/:[^/]+/g, '[^/]+') + '$');
    return routeRegex.test(location.pathname);
  });

  // Player chỉ hiện trên các trang có DefaultLayout (trang chính), ẩn ở login/register/etc.
  const showPlayer = PublicRoutes.some(route => {
    const matches = route.path === location.pathname ||
      new RegExp('^' + route.path.replace(/:[^/]+/g, '[^/]+') + '$').test(location.pathname);
    return matches && route.layout !== null;
  });

  return (

    <div className="App">
      {/* ✅ Show loading khi đang check auth */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 gap-4">
          {/* Spotify-style loading spinner */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-zinc-700" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-spotify-blue animate-spin" />
          </div>
          <div className="flex gap-1 items-end h-5">
            <span className="w-1 bg-spotify-blue rounded-full animate-bounce" style={{ height: '40%', animationDelay: '0ms', animationDuration: '0.6s' }} />
            <span className="w-1 bg-spotify-blue rounded-full animate-bounce" style={{ height: '70%', animationDelay: '0.15s', animationDuration: '0.6s' }} />
            <span className="w-1 bg-spotify-blue rounded-full animate-bounce" style={{ height: '50%', animationDelay: '0.3s', animationDuration: '0.6s' }} />
            <span className="w-1 bg-spotify-blue rounded-full animate-bounce" style={{ height: '80%', animationDelay: '0.45s', animationDuration: '0.6s' }} />
          </div>
        </div>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
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
                      <Page />
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
      )}

      {/* Global Music Player - chỉ hiện trên trang chính (có layout) */}
      {showPlayer && <Player />}
    </div>


  );
}

export default App;
