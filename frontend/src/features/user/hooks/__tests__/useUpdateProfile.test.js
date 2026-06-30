// src/features/user/hooks/__tests__/useUpdateProfile.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUpdateProfile } from '../useUpdateProfile';
import { userApi } from '../../api/userApi';
import { AUTH_QUERY_KEY } from '../../../auth/context/AuthContext';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
jest.mock('../../api/userApi', () => ({
  userApi: {
    updateMe: jest.fn(),
  },
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// ── Wrapper ───────────────────────────────────────────────────────────────────
let queryClient;
const createWrapper = () => {
  queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useUpdateProfile Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص استدعاء الـ API بالـ FormData الصحيحة
  test('should call userApi.updateMe with form data on mutate', async () => {
    const mockUser = { _id: 'u1', name: 'أحمد الجديد', email: 'ahmed@example.com' };
    userApi.updateMe.mockResolvedValue({ status: 'success', data: { updatedDoc: mockUser } });

    const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });

    const formData = new FormData();
    formData.append('name', 'أحمد الجديد');

    act(() => {
      result.current.mutate(formData);
    });

    await waitFor(() => {
      expect(userApi.updateMe).toHaveBeenCalledWith(formData, expect.anything());
    });
  });

  // 2. فحص تحديث كاش المصادقة وإظهار رسالة النجاح عند نجاح التحديث
  test('should update auth query cache and show toast.success on success', async () => {
    const { toast } = require('react-toastify');
    const mockUser = { _id: 'u1', name: 'أحمد الجديد', email: 'ahmed@example.com' };
    userApi.updateMe.mockResolvedValue({ data: { updatedDoc: mockUser } });

    const wrapper = createWrapper();
    // إدخال مستخدم قديم في الكاش
    queryClient.setQueryData(AUTH_QUERY_KEY, { _id: 'u1', name: 'أحمد القديم' });

    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    act(() => {
      result.current.mutate(new FormData());
    });

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('تم تحديث الملف الشخصي بنجاح');
    });

    // التأكد أن الكاش تم تحديثه بالقيمة الجديدة مباشرة
    const cached = queryClient.getQueryData(AUTH_QUERY_KEY);
    expect(cached.name).toBe('أحمد الجديد');
  });

  // 3. فحص إظهار رسالة الخطأ عند فشل التحديث
  test('should show toast.error with message on update failure', async () => {
    const { toast } = require('react-toastify');
    const errorResponse = {
      response: {
        data: { message: 'البريد الإلكتروني مستخدم بالفعل' },
      },
    };
    userApi.updateMe.mockRejectedValue(errorResponse);

    const { result } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate(new FormData());
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('البريد الإلكتروني مستخدم بالفعل');
    });
  });
});
