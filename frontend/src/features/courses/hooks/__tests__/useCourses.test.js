// src/features/courses/hooks/__tests__/useCourses.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import useCourses from '../useCourses';

// ── إعداد خادم محاكاة الشبكة ────────────────────────────────────────────────
const mockCourses = [
  { _id: '1', name: 'رياضيات متقدمة', price: 100, subject: { name: 'رياضيات' } },
  { _id: '2', name: 'فيزياء تطبيقية', price: 150, subject: { name: 'فيزياء' } },
];

const server = setupServer(
  http.get('*/courses', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');

    // محاكاة فلترة بالـ keyword
    if (keyword === 'FAIL') {
      return HttpResponse.json({ message: 'Server Error' }, { status: 500 });
    }

    const filtered = keyword
      ? mockCourses.filter((c) => c.name.includes(keyword))
      : mockCourses;

    return HttpResponse.json({
      status: 'success',
      data: { docs: filtered, totalDocs: filtered.length, totalPages: 1 },
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── إعداد بيئة React Query ───────────────────────────────────────────────────
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

describe('useCourses Hook', () => {
  // 1. فحص حالة التحميل الابتدائية
  test('should start in loading state', () => {
    const { result } = renderHook(() => useCourses(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  // 2. فحص جلب الكورسات بنجاح بدون فلاتر
  test('should fetch and return all courses on success', async () => {
    const { result } = renderHook(() => useCourses(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const docs = result.current.data?.data?.docs;
    expect(docs).toHaveLength(2);
    expect(docs[0].name).toBe('رياضيات متقدمة');
  });

  // 3. فحص إرسال params للـ API عند تمرير فلاتر
  test('should pass query params to the API and return filtered results', async () => {
    const { result } = renderHook(() => useCourses({ keyword: 'رياضيات' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const docs = result.current.data?.data?.docs;
    expect(docs).toHaveLength(1);
    expect(docs[0].name).toBe('رياضيات متقدمة');
  });

  // 4. فحص حالة الفشل عند خطأ في السيرفر
  test('should enter error state when the server returns an error', async () => {
    const { result } = renderHook(() => useCourses({ keyword: 'FAIL' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  // 5. فحص أن queryKey يتغير عند تغيير الـ params (cache منفصل لكل فلتر)
  test('should use different cache entries for different params', async () => {
    const wrapper = createWrapper();

    const { result: result1 } = renderHook(() => useCourses({ keyword: 'رياضيات' }), { wrapper });
    const { result: result2 } = renderHook(() => useCourses({ keyword: 'فيزياء' }), { wrapper });

    await waitFor(() => expect(result1.current.isSuccess).toBe(true));
    await waitFor(() => expect(result2.current.isSuccess).toBe(true));

    const docs1 = result1.current.data?.data?.docs;
    const docs2 = result2.current.data?.data?.docs;

    expect(docs1[0].name).toBe('رياضيات متقدمة');
    expect(docs2[0].name).toBe('فيزياء تطبيقية');
  });
});
