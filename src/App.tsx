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

  return (

    <div className="App">
      {/* ✅ Show loading khi đang check auth */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
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

      {/* Global Music Player - Hidden on error page */}
      {isValidRoute && <Player />}
    </div>


  );
}

export default App;
