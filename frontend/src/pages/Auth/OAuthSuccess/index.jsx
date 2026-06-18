// src/pages/Auth/OAuthSuccess/index.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '../../../constants';
import { useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../../features/auth';
import { AUTH_QUERY_KEY } from '../../../features/auth/context/AuthContext';
import { Spinner } from '../../../shared/components';

export default function OAuthSuccess() {
  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // الـ cookie موجودة الآن — نجلب بيانات المستخدم
        const data = await authApi.getMe();
        const user = data?.data ?? data?.user ?? data;
        // نحدث الـ cache
        queryClient.setQueryData(AUTH_QUERY_KEY, user);
        navigate(PATH.home, { replace: true });
      } catch {
        // فشل — نرجع للـ login
        navigate(PATH.login, { replace: true });
      }
    };

    fetchUser();
  }, [navigate, queryClient]);

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
    }}>
      <Spinner size="lg" />
      <p style={{ color: '#475569', fontSize: 14 }}>
        جارٍ تسجيل الدخول...
      </p>
    </div>
  );
}