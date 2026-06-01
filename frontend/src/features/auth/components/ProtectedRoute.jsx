// src/features/auth/components/ProtectedRoute.jsx

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // لسا بيتحقق من الـ session — لا تعمل redirect قبل ما تعرف
  if (isLoading) {
    return null; // أو Spinner component لاحقاً
  }

  // مش logged in
  if (!isAuthenticated) {
    //  نحفظ الصفحة اللي كان رايح عليها
    // بعد الـ login نرجعه لنفس المكان
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // logged in بس مش عنده صلاحية
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}