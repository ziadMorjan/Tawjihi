// src/features/user/hooks/__tests__/useChangePassword.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useChangePassword } from '../useChangePassword';
import { userApi } from '../../api/userApi';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
jest.mock('../../api/userApi', () => ({
  userApi: {
    changePassword: jest.fn(),
  },
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// ── Wrapper ───────────────────────────────────────────────────────────────────
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useChangePassword Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص استدعاء الـ API بالمعاملات الصحيحة
  test('should call userApi.changePassword with correct data on mutate', async () => {
    userApi.changePassword.mockResolvedValue({ status: 'success' });

    const { result } = renderHook(() => useChangePassword(), { wrapper: createWrapper() });

    const changeData = {
      currentPassword: 'old-password',
      newPassword: 'new-password-123',
      newConfirmPassword: 'new-password-123',
    };

    act(() => {
      result.current.mutate(changeData);
    });

    await waitFor(() => {
      expect(userApi.changePassword).toHaveBeenCalledWith(changeData, expect.anything());
    });
  });

  // 2. فحص إظهار رسالة النجاح عند تغيير كلمة المرور بنجاح
  test('should show toast.success on successful password change', async () => {
    const { toast } = require('react-toastify');
    userApi.changePassword.mockResolvedValue({ status: 'success' });

    const { result } = renderHook(() => useChangePassword(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({
        currentPassword: 'old',
        newPassword: 'new12345',
        newConfirmPassword: 'new12345',
      });
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('تم تغيير كلمة المرور بنجاح');
    });
  });

  // 3. فحص إظهار رسالة الخطأ عند فشل تغيير كلمة المرور
  test('should show toast.error with server message on failure', async () => {
    const { toast } = require('react-toastify');
    const errorResponse = {
      response: {
        data: { message: 'كلمة المرور الحالية غير صحيحة' },
      },
    };
    userApi.changePassword.mockRejectedValue(errorResponse);

    const { result } = renderHook(() => useChangePassword(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({
        currentPassword: 'wrong-old',
        newPassword: 'new12345',
        newConfirmPassword: 'new12345',
      });
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('كلمة المرور الحالية غير صحيحة');
    });
  });
});
