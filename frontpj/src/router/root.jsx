import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Loading = <div className="loading">Loading...</div>;
const MainLayout = lazy(() => import("../layout/MainLayout"));
const MainPage = lazy(() => import("../pages/MainPage"));
const MoviePage = lazy(() => import("../pages/movie/MoviePage"));
const MemberLoginPage = lazy(() => import("../pages/member/MemberLoginPage"));
const TrailerPage = lazy(() => import("../pages/movie/TrailerPage"));
const ScreeningPage = lazy(() => import("../pages/screening/ScreeningPage"));

const root = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={Loading}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={Loading}>
            <MainPage />
          </Suspense>
        ),
      },
      {
        path: "movie",
        element: (
          <Suspense fallback={Loading}>
            <MoviePage />
          </Suspense>
        ),
      },
      {
        path: "login",
        element: (
          <Suspense fallback={Loading}>
            <MemberLoginPage />
          </Suspense>
        ),
      },
      {
        path: "screening/:movieId",
        element: (
          <Suspense fallback={Loading}>
            <ScreeningPage />
          </Suspense>
        ),
      },
      {
        path: "movie/trailer",
        element: (
          <Suspense fallback={Loading}>
            <TrailerPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default root;
