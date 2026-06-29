import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../AuthContext';
import { authApi } from '../../api/authApi';

// محاكاة واجهة برمجة تطبيقات authApi للتحكم الكامل بردود السيرفر
jest.mock('../../api/authApi', () => ({
  authApi: {
    getMe: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  },
}));

describe('AuthContext (AuthProvider & useAuth)', () => {
  let queryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );

  // 1. فحص محاولة استدعاء useAuth خارج الـ Provider
  test('should throw error if useAuth is used outside AuthProvider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth يجب استخدامه داخل AuthProvider');

    consoleErrorSpy.mockRestore();
  });

  // 2. فحص تحميل بيانات الملف الشخصي بنجاح وحساب الصلاحيات
  test('should load user profile successfully and calculate roles', async () => {
    const mockUser = { id: 1, name: 'Ziad', role: 'admin' };
    authApi.getMe.mockResolvedValue({ data: mockUser });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // التأكد من حالة التحميل في البداية
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);

    // الانتظار حتى ينتهي التحميل
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isStudent).toBe(false);
    expect(result.current.isTeacher).toBe(false);
  });

  // 3. فحص فشل تحميل الملف الشخصي
  test('should handle failed profile load gracefully', async () => {
    authApi.getMe.mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  // 4. فحص نجاح عملية تسجيل الدخول وتحديث الكاش واستلام كود الترحيب
  test('should login user and set query data and welcomeReward', async () => {
    authApi.getMe.mockRejectedValue(new Error('Unauthorized'));
    const mockUser = { id: 1, name: 'Ziad', role: 'user' };
    authApi.login.mockResolvedValue({
      user: mockUser,
      welcomeReward: { coupon: 'WELCOME10', discount: 10 }
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let loginPromise;
    act(() => {
      loginPromise = result.current.login({ email: 'test@example.com', password: 'password' });
    });

    await act(async () => {
      await loginPromise;
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isStudent).toBe(true);
    expect(result.current.welcomeReward).toEqual({ coupon: 'WELCOME10', discount: 10 });

    // تصفير جائزة الترحيب
    act(() => {
      result.current.clearWelcomeReward();
    });
    expect(result.current.welcomeReward).toBeNull();
  });

  // 5. فحص نجاح تسجيل حساب جديد وتحديث الصلاحيات
  test('should register user and set user state', async () => {
    authApi.getMe.mockRejectedValue(new Error('Unauthorized'));
    const mockUser = { id: 2, name: 'Teacher', role: 'teacher' };
    authApi.register.mockResolvedValue({ user: mockUser });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    let registerPromise;
    act(() => {
      registerPromise = result.current.register({ name: 'Teacher', email: 'teacher@example.com' });
    });

    await act(async () => {
      await registerPromise;
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isTeacher).toBe(true);
  });

  // 6. فحص تسجيل الخروج وتصفير الكاش
  test('should logout user and clear query cache', async () => {
    const mockUser = { id: 1, name: 'Ziad', role: 'admin' };
    authApi.getMe.mockResolvedValue({ data: mockUser });
    authApi.logout.mockResolvedValue({});

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    // نغير الاستجابة الوهمية لـ getMe لترجع خطأ عند محاولة إعادة الاستعلام بعد تسجيل الخروج
    authApi.getMe.mockRejectedValue(new Error('Unauthorized'));

    act(() => {
      result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.user).toBeNull();
    });

    expect(result.current.isAuthenticated).toBe(false);
  });
});
