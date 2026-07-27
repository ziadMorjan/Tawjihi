// src/constants/index.js
// ─── Single source of truth for all application route paths ───────────────────
// Usage: import { PATH } from '../constants';
//        navigate(PATH.home)
//        <Route path={PATH.courses} ... />

export const PATH = {
  // ── Public ──────────────────────────────────────────────────────────────────
  home:            '/',
  courses:         '/courses',
  courseDetails:   (id = ':id') => `/courses/${id}`,
  teachers:        '/teachers',
  teacherProfile:  (id = ':id') => `/teachers/${id}`,
  oauthSuccess:    '/oauth-success',

  // ── Auth (guest-only) ────────────────────────────────────────────────────────
  login:           '/auth/login',
  register:        '/auth/register',
  forgotPassword:  '/auth/forgot-password',

  // ── Protected ────────────────────────────────────────────────────────────────
  cart:            '/cart',
  wishlist:        '/wishlist',
  myCourses:       '/user/my-courses',
  learn:           (id = ':id') => `/learn/${id}`,
  profile:         '/user/profile',
  editProfile:     '/user/edit-profile',
  changePassword:  '/user/change-password',

  // ── Notifications ────────────────────────────────────────────────────────────
  notifications:   '/notifications',

  // ── Admin ────────────────────────────────────────────────────────────────────
  adminDashboard:  '/admin/dashboard',

  // ── Teacher ──────────────────────────────────────────────────────────────────
  teacherDashboard: '/teacher/dashboard',
  teacherCourseLessons: (id = ':courseId') => `/teacher/dashboard/courses/${id}/lessons`,

  // ── Search ───────────────────────────────────────────────────────────────────
  search:          '/search',

  // ── Fallback ─────────────────────────────────────────────────────────────────
  notFound:        '*',
};
