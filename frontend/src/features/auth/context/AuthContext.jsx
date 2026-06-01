// src/features/auth/context/AuthContext.jsx

import { createContext, useContext } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

// Query key ثابت — نستخدمه في أي مكان نحتاج نعمل invalidate
export const AUTH_QUERY_KEY = ['auth', 'user'];

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  // 🟡 [تحسين] بدل localStorage، نستخدم TanStack Query
  // يعمل cache للبيانات، ويتحقق منها عند الحاجة
  const {
    data: user,
    isLoading,
  } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authApi.getMe,
    // لو فشل الـ request يعني المستخدم مش logged in — هذا طبيعي
    retry: false,
    // البيانات تبقى fresh لمدة 10 دقائق
    staleTime: 10 * 60 * 1000,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // بعد الـ login نحدث الـ cache مباشرة بدون request جديد
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // امسح كل الـ cache — مش بس بيانات المستخدم
      queryClient.clear();
      localStorage.removeItem('user');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
    },
  });

  const value = {
    // البيانات
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,

    // الـ role checks — بدل ما كل component يعمل if/else
    isStudent: user?.role === 'user',
    isTeacher: user?.role === 'teacher',
    isAdmin:   user?.role === 'admin',

    // الـ actions
    login:    loginMutation.mutateAsync,
    logout:   logoutMutation.mutate,
    register: registerMutation.mutateAsync,

    // الـ states
    isLoginLoading:    loginMutation.isPending,
    isLogoutLoading:   logoutMutation.isPending,
    isRegisterLoading: registerMutation.isPending,

    loginError:    loginMutation.error,
    registerError: registerMutation.error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// [تحسين] Custom hook بدل useContext مباشرة
// لو نسيت تحط AuthProvider فوق، يعطيك error واضح
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth يجب استخدامه داخل AuthProvider');
  }
  return context;
}