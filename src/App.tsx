import { Routes, Route } from 'react-router-dom';
import { Fragment, Suspense } from 'react';
import { PublicRoutes } from './routes/AppRoutes';
import DefaultLayout from './layouts/DefaultLayout';


// const ErrorPage = lazy(() => import('~/pages/Error/Error'));

function App() {
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
            element={
              <>
                {/* <ErrorPage /> */}
              </>
            }
          />
        </Routes>
      </Suspense>
    </div>


  );
}

export default App;
