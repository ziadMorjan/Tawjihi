// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from './features/auth';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import OAuthSuccess from './pages/Auth/OAuthSuccess';
import CartList from './pages/CartList';
import Wishlist from './pages/Wishlist';
import MyCourses from './pages/MyCourses';
import NotFound from './pages/NotFound';
import VideoPage from './pages/VideoPage';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Teachers from './pages/Teachers';
import TeacherProfile from './pages/TeacherProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetails />} />

        <Route path="/auth/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/auth/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/auth/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teachers/:id" element={<TeacherProfile />} />
        {/* Protected */}
        <Route path="/cart" element={<ProtectedRoute><CartList /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/user/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
        <Route
          path="/learn/:id"
          element={
            <ProtectedRoute>
              <VideoPage />
            </ProtectedRoute>
          }
        />
        <Route path="/user/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/user/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/user/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}