// src/features/courses/hooks/__tests__/useCourseCheckout.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCourseCheckout } from '../useCourseCheckout';
import { enrollmentsApi } from '../../../enrollments/api/enrollmentsApi';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
jest.mock('../../../enrollments/api/enrollmentsApi', () => ({
  enrollmentsApi: {
    createCheckoutSession: jest.fn(),
  },
}));

// محاكاة react-toastify لمنع أخطاء الـ DOM في بيئة الاختبار
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
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

describe('useCourseCheckout Hook', () => {
  // حفظ window.location الأصلي لاستعادته بعد كل فحص
  const originalLocation = window.location;

  beforeEach(() => {
    jest.clearAllMocks();
    // محاكاة window.location.href لأن JSDOM لا يدعم navigation
    delete window.location;
    window.location = { href: '' };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  // 1. فحص الحالة الابتدائية للهوك
  test('should initialize with isCheckoutLoading as false', () => {
    const { result } = renderHook(() => useCourseCheckout('course-123'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isCheckoutLoading).toBe(false);
    expect(typeof result.current.checkout).toBe('function');
  });

  // 2. فحص نجاح الـ Checkout والتوجيه لرابط الدفع
  test('should redirect to sessionUrl on successful checkout', async () => {
    const mockSessionUrl = 'https://stripe.com/pay/session-abc';
    enrollmentsApi.createCheckoutSession.mockResolvedValue({
      sessionUrl: mockSessionUrl,
    });

    const { result } = renderHook(() => useCourseCheckout('course-123'), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.checkout();
    });

    await waitFor(() => {
      expect(enrollmentsApi.createCheckoutSession).toHaveBeenCalledWith('course-123');
    });

    expect(window.location.href).toBe(mockSessionUrl);
  });

  // 3. فحص عدم التوجيه إذا لم يكن في الرد sessionUrl
  test('should not redirect if sessionUrl is missing from response', async () => {
    enrollmentsApi.createCheckoutSession.mockResolvedValue({ status: 'success' });

    const { result } = renderHook(() => useCourseCheckout('course-123'), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.checkout();
    });

    await waitFor(() => {
      expect(enrollmentsApi.createCheckoutSession).toHaveBeenCalledTimes(1);
    });

    // href يجب أن يبقى فارغاً
    expect(window.location.href).toBe('');
  });

  // 4. فحص استدعاء toast.error عند فشل الـ Checkout
  test('should call toast.error on checkout failure', async () => {
    const { toast } = require('react-toastify');
    enrollmentsApi.createCheckoutSession.mockRejectedValue(new Error('Payment Failed'));

    const { result } = renderHook(() => useCourseCheckout('course-123'), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.checkout();
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(1);
    });

    // التأكد أن الـ href لم يتغير
    expect(window.location.href).toBe('');
  });

  // 5. فحص تمرير courseId الصحيح للـ API
  test('should pass the correct courseId to createCheckoutSession', async () => {
    enrollmentsApi.createCheckoutSession.mockResolvedValue({ sessionUrl: 'https://stripe.com' });

    const { result } = renderHook(() => useCourseCheckout('specific-course-id'), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.checkout();
    });

    await waitFor(() => {
      expect(enrollmentsApi.createCheckoutSession).toHaveBeenCalledWith('specific-course-id');
    });
  });
});
