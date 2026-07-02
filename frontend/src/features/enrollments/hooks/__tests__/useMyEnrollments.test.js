// src/features/enrollments/hooks/__tests__/useMyEnrollments.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useMyEnrollments } from '../useMyEnrollments';
import { useAuth } from '../../../auth';


// ── محاكاة الـ useAuth ────────────────────────────────────────────────────────
jest.mock('../../../auth', () => ({
  useAuth: jest.fn(),
}));

// ── بيانات وهمية ─────────────────────────────────────────────────────────────
const mockEnrollmentsResponse = {
  status: 'success',
  data: {
    docs: [
      { _id: 'e1', course: 'course-abc' },
      { _id: 'e2', course: { _id: 'course-def' } },
    ],
  },
};

// ── إعداد خادم MSW ───────────────────────────────────────────────────────────
const server = setupServer(
  http.get('*/enrollments', ({ request }) => {
    const url = new URL(request.url);
    const userId = url.searchParams.get('user');

    if (userId === 'user-empty') {
      return HttpResponse.json({ status: 'success', data: { docs: [] } });
    }
    if (userId === 'user-error') {
      return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

    return HttpResponse.json(mockEnrollmentsResponse);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── Wrapper مشترك ─────────────────────────────────────────────────────────────
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMyEnrollments Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. لا يبدأ التحميل إذا كان المستخدم غير مسجل
  test('should NOT fetch enrollments when user is not logged in', () => {
    useAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useMyEnrollments(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.enrollments).toEqual([]);
  });

  // 2. فحص حالة التحميل الابتدائي عند وجود مستخدم
  test('should start in loading state when user is logged in', () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });

    const { result } = renderHook(() => useMyEnrollments(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  // 3. فحص جلب الاشتراكات بنجاح وتوفير قائمة الكورسات
  test('should fetch and return enrollments list on success', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });

    const { result } = renderHook(() => useMyEnrollments(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.enrollments).toHaveLength(2);
    expect(result.current.enrollments[0]._id).toBe('e1');
  });

  // 4. فحص دالة isEnrolled مع كورس مشترك به (معرف كـ String أو Object ID)
  test('should return true for isEnrolled when courseId is enrolled (String or Object)', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });

    const { result } = renderHook(() => useMyEnrollments(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // كورس مشترك به كـ String
    expect(result.current.isEnrolled('course-abc')).toBe(true);
    // كورس مشترك به كـ Object ID
    expect(result.current.isEnrolled('course-def')).toBe(true);
    // كورس غير مشترك به
    expect(result.current.isEnrolled('course-xyz')).toBe(false);
  });

  // 5. فحص دالة isEnrolled بقيم فارغة أو غير صحيحة
  test('should return false for isEnrolled when courseId is empty or falsy', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });

    const { result } = renderHook(() => useMyEnrollments(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isEnrolled(null)).toBe(false);
    expect(result.current.isEnrolled(undefined)).toBe(false);
    expect(result.current.isEnrolled('')).toBe(false);
  });
});
