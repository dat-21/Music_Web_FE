import { Routes, Route, useLocation } from 'react-router-dom';
import { Fragment, Suspense } from 'react';
import { PublicRoutes } from './routes/AppRoutes';
import DefaultLayout from './layouts/DefaultLayout';
import Player from './components/layouts/Player';
import ErrorPage from './pages/ErrorPage';

function App() {
  const location = useLocation();

  // Check if current route exists in PublicRoutes
  const isValidRoute = PublicRoutes.some(route => {
    if (route.path === location.pathname) return true;
    // Check for dynamic routes
    const routeRegex = new RegExp('^' + route.path.replace(/:[^/]+/g, '[^/]+') + '$');
    return routeRegex.test(location.pathname);
  });

  return (

    <div className="App">
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

      {/* Global Music Player - Hidden on error page */}
      {isValidRoute && <Player />}
    </div>


  );
}

export default App;
