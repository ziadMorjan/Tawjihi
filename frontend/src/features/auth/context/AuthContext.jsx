import { createContext, useContext } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);
export const AUTH_QUERY_KEY = ['auth', 'user'];

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const data = await authApi.getMe();
      return data?.data ?? data?.user ?? data;
    },
    retry: false,

    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,  
    refetchOnReconnect: false,
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const userData = data?.user ?? data?.data?.user ?? data;
      queryClient.setQueryData(AUTH_QUERY_KEY, userData);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      const userData = data?.user ?? data?.data?.user;
      if (userData) queryClient.setQueryData(AUTH_QUERY_KEY, userData);
    },
  });

  const value = {
    user:            user ?? null,
    isAuthenticated: !!user,
    isLoading,
    isStudent: user?.role === 'user',
    isTeacher: user?.role === 'teacher',
    isAdmin:   user?.role === 'admin',

    login:    loginMutation.mutateAsync,
    logout:   logoutMutation.mutate,
    register: registerMutation.mutateAsync,

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth يجب استخدامه داخل AuthProvider');
  return context;
}