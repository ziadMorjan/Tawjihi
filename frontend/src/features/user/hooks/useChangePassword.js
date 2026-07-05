import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { userApi } from '../api/userApi';

export function useChangePassword() {
  return useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      toast.success('تم تغيير كلمة المرور بنجاح');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message ?? 'حدث خطأ، حاول مجدداً');
    },
  });
}