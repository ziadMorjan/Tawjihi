import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useForgotPassword } from '../useForgotPassword';
import { PATH } from '../../../../constants';

// ── 1. محاكاة التنقل والترجمة ────────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'ar', changeLanguage: jest.fn() },
  }),
}));

// ── 2. إعداد خادم محاكاة الشبكة (MSW) محلياً داخل الملف ───────────────────────
const server = setupServer(
  // الخطوة 1: طلب كود استعادة كلمة المرور
  http.post('*/auth/forgetPassword', async ({ request }) => {
    const { email } = await request.json();
    if (email === 'fail@example.com') {
      return HttpResponse.json(
        { message: 'البريد الإلكتروني غير مسجل' },
        { status: 400 }
      );
    }
    return HttpResponse.json({ message: 'تم إرسال كود التحقق بنجاح' });
  }),

  // الخطوة 2: التحقق من كود الاستعادة
  http.post('*/auth/verifyResetCode', async ({ request }) => {
    const { resetCode } = await request.json();
    if (resetCode === '000000') {
      return HttpResponse.json(
        { message: 'كود التحقق غير صحيح أو منتهي الصلاحية' },
        { status: 400 }
      );
    }
    return HttpResponse.json({ message: 'تم التحقق من الكود بنجاح' });
  }),

  // الخطوة 3: تعيين كلمة المرور الجديدة
  http.patch('*/auth/resetPassword', async ({ request }) => {
    const { email } = await request.json();
    if (email === 'error@example.com') {
      return HttpResponse.json(
        { message: 'فشلت عملية إعادة تعيين كلمة المرور' },
        { status: 400 }
      );
    }
    return HttpResponse.json({ message: 'تم تغيير كلمة المرور بنجاح' });
  })
);

// تشغيل الخادم الوهمي قبل اختبارات الملف وإغلاقه بعدها
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── 3. تهيئة بيئة React Query المفرغة لكل فحص ──────────────────────────────
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

describe('useForgotPassword Custom Hook', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    mockNavigate.mockClear();
  });

  // المغلف الوهمي لتقديم الـ Contexts اللازمة للهوك
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  // 1. فحص الحالة الابتدائية للهوك
  test('should initialize with step 1, empty email, and no error', () => {
    const { result } = renderHook(() => useForgotPassword(), { wrapper });

    expect(result.current.step).toBe(1);
    expect(result.current.userEmail).toBe('');
    expect(result.current.errorMessage).toBeNull();
  });

  // 2. فحص نجاح إرسال البريد الإلكتروني والانتقال للخطوة التالية
  test('should transition to step 2 on successful request code submit', async () => {
    const { result } = renderHook(() => useForgotPassword(), { wrapper });

    // تشغيل الـ Mutation
    act(() => {
      result.current.forgotPasswordMutation.mutate('success@example.com');
    });

    // الانتظار بذكاء حتى يتغير رقم الخطوة لـ 2
    await waitFor(() => {
      expect(result.current.step).toBe(2);
    });

    expect(result.current.userEmail).toBe('success@example.com');
    expect(result.current.errorMessage).toBeNull();
  });

  // 3. فحص فشل إرسال البريد الإلكتروني وظهور رسالة الخطأ
  test('should set error message on failed request code submit', async () => {
    const { result } = renderHook(() => useForgotPassword(), { wrapper });

    act(() => {
      result.current.forgotPasswordMutation.mutate('fail@example.com');
    });

    // الانتظار بذكاء حتى تظهر رسالة الخطأ المتوقعة
    await waitFor(() => {
      expect(result.current.errorMessage).toBe('البريد الإلكتروني غير مسجل');
    });

    expect(result.current.step).toBe(1);
  });

  // 4. فحص نجاح التحقق من كود الاستعادة والانتقال للخطوة الثالثة
  test('should transition to step 3 on successful code verification', async () => {
    const { result } = renderHook(() => useForgotPassword(), { wrapper });

    act(() => {
      result.current.verifyCodeMutation.mutate('123456');
    });

    // الانتظار بذكاء حتى ينتقل للخطوة 3
    await waitFor(() => {
      expect(result.current.step).toBe(3);
    });

    expect(result.current.errorMessage).toBeNull();
  });

  // 5. فحص فشل كود الاستعادة وظهور الخطأ
  test('should set error message on invalid code verification', async () => {
    const { result } = renderHook(() => useForgotPassword(), { wrapper });

    act(() => {
      result.current.verifyCodeMutation.mutate('000000');
    });

    // الانتظار بذكاء حتى تظهر رسالة الخطأ
    await waitFor(() => {
      expect(result.current.errorMessage).toBe('كود التحقق غير صحيح أو منتهي الصلاحية');
    });
  });

  // 6. فحص نجاح تغيير كلمة المرور والتوجيه لصفحة تسجيل الدخول
  test('should redirect to login on successful password reset', async () => {
    const { result } = renderHook(() => useForgotPassword(), { wrapper });

    act(() => {
      result.current.resetPasswordMutation.mutate({
        email: 'success@example.com',
        newPassword: 'Password123!',
        newConfirmPassword: 'Password123!',
      });
    });

    // الانتظار بذكاء حتى يتم استدعاء دالة التوجيه لصفحة تسجيل الدخول
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(PATH.login, { replace: true });
    });

    expect(result.current.errorMessage).toBeNull();
  });
});