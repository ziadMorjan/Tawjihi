// src/features/courses/hooks/__tests__/useCourse.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useCourse } from '../useCourse';

// ── إعداد خادم MSW ───────────────────────────────────────────────────────────
const mockCourse = {
  _id: 'course-123',
  name: 'رياضيات للتوجيهي',
  price: 120,
  priceAfterDiscount: 90,
  teacher: { name: 'أستاذ أحمد' },
  subject: { name: 'رياضيات' },
  averageRating: 4.5,
};

const server = setupServer(
  http.get('*/courses/:id', ({ params }) => {
    if (params.id === 'not-found') {
      return HttpResponse.json({ message: 'Course not found' }, { status: 404 });
    }
    return HttpResponse.json({
      status: 'success',
      data: { doc: mockCourse },
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── إعداد Wrapper ────────────────────────────────────────────────────────────
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

describe('useCourse Hook', () => {
  // 1. فحص أن الهوك لا يطلب شيئاً عند غياب الـ id
  test('should not fetch when id is undefined', () => {
    const { result } = renderHook(() => useCourse(undefined), {
      wrapper: createWrapper(),
    });

    // enabled: !!id = false → لن يشتغل الـ query
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
  });

  // 2. فحص حالة التحميل عند وجود id صحيح
  test('should start loading when a valid id is provided', () => {
    const { result } = renderHook(() => useCourse('course-123'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  // 3. فحص جلب بيانات الكورس بنجاح وتطبيق الـ select
  test('should fetch course data and return the doc via select transformer', async () => {
    const { result } = renderHook(() => useCourse('course-123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // الـ select في الهوك يستخرج doc من data.data.doc
    expect(result.current.data).toEqual(mockCourse);
    expect(result.current.data.name).toBe('رياضيات للتوجيهي');
    expect(result.current.data.teacher.name).toBe('أستاذ أحمد');
  });

  // 4. فحص حالة الفشل عند id غير موجود
  test('should enter error state when course is not found', async () => {
    const { result } = renderHook(() => useCourse('not-found'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  // 5. فحص تغيير الـ id يجلب كورس جديد
  test('should refetch when id changes', async () => {
    const wrapper = createWrapper();
    const { result, rerender } = renderHook(({ id }) => useCourse(id), {
      wrapper,
      initialProps: { id: 'course-123' },
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCourse);

    // تغيير الـ id لـ not-found
    rerender({ id: 'not-found' });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
