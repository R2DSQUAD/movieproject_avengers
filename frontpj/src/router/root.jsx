import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Loading = <div className="loading">Loading...</div>;
const MainLayout = lazy(() => import("../layout/MainLayout"));
const MainPage = lazy(() => import("../pages/MainPage"));
const MoviePage = lazy(() => import("../pages/movie/MoviePage"));
const MemberLoginPage = lazy(() => import("../pages/member/MemberLoginPage"));
const ScreeningPage = lazy(() => import("../pages/screening/ScreeningPage"));
const ScreeningSeatPage = lazy(() => import("../pages/screeningSeat/ScreeningSeatPage"));
const MovieDetail = lazy(() => import("../pages/movie/MovieDetail"));
const MapPage = lazy(() => import("../pages/map/MapPage")); 
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
        path: "/movie/map",
        element: (
          <Suspense fallback={Loading}>
            <MapPage />
          </Suspense>
        ),

      },
      {
        path: "movie/detail/:movieId",
        element: (
          <Suspense fallback={Loading}>
            <MovieDetail />
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
        path: "seatSelection/:screeningId",
        element: (
          <Suspense fallback={Loading}>
            <ScreeningSeatPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default root;
