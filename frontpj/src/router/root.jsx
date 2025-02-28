import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Loading = <div className="loading">Loading...</div>;
const MainLayout = lazy(() => import("../layout/MainLayout"));
const MainPage = lazy(() => import("../pages/MainPage"));
const MoviePage = lazy(() => import("../pages/movie/MoviePage"));
const ScreeningPage = lazy(() => import("../pages/screening/ScreeningPage"));
const ScreeningSeatPage = lazy(() => import("../pages/screeningSeat/ScreeningSeatPage"));
const MovieDetail = lazy(() => import("../pages/movie/MovieDetail"));
const MapPage = lazy(() => import("../pages/map/MapPage"));
const JoinPage = lazy(() => import("../pages/member/JoinPage"));
const LoginPage = lazy(() => import("../pages/member/LoginPage"));
const MyMemberInfoPage = lazy(() => import("../pages/member/MyMemberInfoPage"));
const CartPage = lazy(() => import("../pages/cart/CartPage"));
const PaymentPage = lazy(() => import("../pages/payment/PaymentPage"));
const TestPage = lazy(() => import("../pages/test/TestPage"));
const ChatRoomPage = lazy(() => import("../pages/ws/ChatRoomPage"));
const ChatBot = lazy(() => import("../pages/ws/ChatBotPage"));
const Komoran = lazy(() => import("../pages/ws/KomoranPage"));
const KakaoRedirectPage = lazy(() => import("../pages/member/KakaoRedirectPage"));


const AdminPage = lazy(() => import("../pages/admin/AdminPage"));
const CalendarPage = lazy(() => import("../pages/calendar/CalendarPage"));
const AdminLayout = lazy(() => import("../components/admin/AdminLayout"));
const MemberList = lazy(() => import("../components/admin/member/MemberList"));
const Cinemas = lazy(() => import("../components/admin/cinema/Cinemas"));

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
        path: "movie/map",
        element: (
          <Suspense fallback={Loading}>
            <MapPage />
          </Suspense>
        ),
      },
      {
        path: "movie/detail/:movieCd",
        element: (
          <Suspense fallback={Loading}>
            <MovieDetail />
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
      {
        path: "member/join",
        element: (
          <Suspense fallback={Loading}>
            <JoinPage />
          </Suspense>
        ),
      },
      {
        path: "member/login",
        element: (
          <Suspense fallback={Loading}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "member/kakao",
        element: (
          <Suspense fallback={Loading}>
            <KakaoRedirectPage />
          </Suspense>
        ),
      },
      {
        path: "member/detail",
        element: (
          <Suspense fallback={Loading}>
            <MyMemberInfoPage />
          </Suspense>
        ),
      },
      {
        path: "/cart/myCartList",
        element: (
          <Suspense fallback={Loading}>
            <CartPage />
          </Suspense>
        ),
      },
      {
        path: "/chatBot",
        element: (
          <Suspense fallback={Loading}>
            <ChatBot />
          </Suspense>
        ),
      },
      {
        path: "admin",
        element: (
          <Suspense fallback={Loading}>
            <AdminLayout />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={Loading}>
                <AdminPage />
              </Suspense>
            ),
          },
          {
            path: "memberList",
            element: (
              <Suspense fallback={Loading}>
                <MemberList />
              </Suspense>
            ),
          },
          {
            path: "calendar",
            element: (
              <Suspense fallback={Loading}>
                <CalendarPage />
              </Suspense>
            ),
          },
          {
            path: "cinemas",
            element: (
              <Suspense fallback={Loading}>
                <Cinemas />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "/Komoran",
        element: (
          <Suspense fallback={Loading}>
            <Komoran />
          </Suspense>
        ),
      },
      {
        path: "/payment/orderSettlement",
        element: (
          <Suspense fallback={Loading}>
            <PaymentPage />
          </Suspense>
        ),
      },
      {
        path: "/chatRoom",
        element: (
          <Suspense fallback={Loading}>
            <ChatRoomPage />
          </Suspense>
        ),
      },
      {
        path: "/test",
        element: (
          <Suspense fallback={Loading}>
            <TestPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default root;
