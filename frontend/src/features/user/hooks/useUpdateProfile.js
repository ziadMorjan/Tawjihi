import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { userApi } from '../api/userApi';
import { AUTH_QUERY_KEY } from '../../auth/context/AuthContext';

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: (data) => {
      // نحدث الـ cache مباشرة بدون request جديد
      const updatedUser = data?.data?.updatedDoc ?? data?.data ?? data;
      queryClient.setQueryData(AUTH_QUERY_KEY, updatedUser);
      toast.success('تم تحديث الملف الشخصي بنجاح');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'حدث خطأ، حاول مجدداً');
    },
  });
}