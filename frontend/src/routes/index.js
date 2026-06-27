// src/routes/index.js
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from '../features/auth';
import { WelcomeModal } from '../features/auth/components/WelcomeModal';
import { PATH } from '../constants';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
const Home           = lazy(() => import('../pages/Home'));
const Courses        = lazy(() => import('../pages/Courses'));
const CourseDetails  = lazy(() => import('../pages/CourseDetails'));
const Login          = lazy(() => import('../pages/Auth/Login'));
const Register       = lazy(() => import('../pages/Auth/Register'));
const OAuthSuccess   = lazy(() => import('../pages/Auth/OAuthSuccess'));
const ForgotPassword = lazy(() => import('../pages/Auth/ForgotPassword'));
const Teachers       = lazy(() => import('../pages/Teachers'));
const TeacherProfile = lazy(() => import('../pages/TeacherProfile'));
const CartList       = lazy(() => import('../pages/CartList'));
const Wishlist       = lazy(() => import('../pages/Wishlist'));
const MyCourses      = lazy(() => import('../pages/MyCourses'));
const VideoPage      = lazy(() => import('../pages/VideoPage'));
const Profile        = lazy(() => import('../pages/Profile'));
const EditProfile    = lazy(() => import('../pages/EditProfile'));
const ChangePassword = lazy(() => import('../pages/ChangePassword'));
const NotFound       = lazy(() => import('../pages/NotFound'));
const Search         = lazy(() => import('../pages/Search'));

// ─── Fallback spinner shown while a lazy chunk is loading ─────────────────────
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}>
      <span className="loader" />
    </div>
  );
}

// ─── App routes ───────────────────────────────────────────────────────────────
export default function AppRoutes() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public ── */}
          <Route path={PATH.home}                         element={<Home />} />
          <Route path={PATH.courses}                      element={<Courses />} />
          <Route path={PATH.courseDetails()}              element={<CourseDetails />} />
          <Route path={PATH.teachers}                     element={<Teachers />} />
          <Route path={PATH.teacherProfile()}             element={<TeacherProfile />} />
          <Route path={PATH.oauthSuccess}                 element={<OAuthSuccess />} />

          {/* ── Guest-only (redirect if already logged in) ── */}
          <Route element={<GuestRoute />}>
            <Route path={PATH.login}          element={<Login />} />
            <Route path={PATH.register}       element={<Register />} />
            <Route path={PATH.forgotPassword} element={<ForgotPassword />} />
          </Route>

          {/* ── Protected (require authentication) ── */}
          <Route element={<ProtectedRoute />}>
            <Route path={PATH.cart}           element={<CartList />} />
            <Route path={PATH.wishlist}       element={<Wishlist />} />
            <Route path={PATH.myCourses}      element={<MyCourses />} />
            <Route path={PATH.learn()}        element={<VideoPage />} />
            <Route path={PATH.profile}        element={<Profile />} />
            <Route path={PATH.editProfile}    element={<EditProfile />} />
            <Route path={PATH.changePassword} element={<ChangePassword />} />
          </Route>

          {/* ── Search ── */}
          <Route path={PATH.search}       element={<Search />} />

          {/* ── 404 ── */}
          <Route path={PATH.notFound}       element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Welcome popup — shown once after first login */}
      <WelcomeModal />
    </>
  );
}
