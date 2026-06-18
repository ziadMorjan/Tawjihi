// src/routes/index.js
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from '../features/auth';
import { WelcomeModal } from '../features/auth/components/WelcomeModal';

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
          <Route path="/"                    element={<Home />} />
          <Route path="/courses"             element={<Courses />} />
          <Route path="/courses/:id"         element={<CourseDetails />} />
          <Route path="/teachers"            element={<Teachers />} />
          <Route path="/teachers/:id"        element={<TeacherProfile />} />
          <Route path="/oauth-success"       element={<OAuthSuccess />} />

          {/* ── Guest-only (redirect if already logged in) ── */}
          <Route path="/auth/login"          element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/auth/register"       element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/auth/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />

          {/* ── Protected (require authentication) ── */}
          <Route path="/cart"                element={<ProtectedRoute><CartList /></ProtectedRoute>} />
          <Route path="/wishlist"            element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/user/my-courses"     element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/learn/:id"           element={<ProtectedRoute><VideoPage /></ProtectedRoute>} />
          <Route path="/user/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/user/edit-profile"   element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/user/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

          {/* ── 404 ── */}
          <Route path="*"                    element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Welcome popup — shown once after first login */}
      <WelcomeModal />
    </>
  );
}
