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
          <Route path={PATH.login}          element={<GuestRoute><Login /></GuestRoute>} />
          <Route path={PATH.register}       element={<GuestRoute><Register /></GuestRoute>} />
          <Route path={PATH.forgotPassword} element={<GuestRoute><ForgotPassword /></GuestRoute>} />

          {/* ── Protected (require authentication) ── */}
          <Route path={PATH.cart}           element={<ProtectedRoute><CartList /></ProtectedRoute>} />
          <Route path={PATH.wishlist}       element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path={PATH.myCourses}      element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path={PATH.learn()}        element={<ProtectedRoute><VideoPage /></ProtectedRoute>} />
          <Route path={PATH.profile}        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path={PATH.editProfile}    element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path={PATH.changePassword} element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

          {/* ── 404 ── */}
          <Route path={PATH.notFound}       element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Welcome popup — shown once after first login */}
      <WelcomeModal />
    </>
  );
}
