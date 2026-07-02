// src/features/reviews/hooks/__tests__/useReviews.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useReviews } from '../useReviews';

// ── بيانات وهمية ─────────────────────────────────────────────────────────────
const mockReviewsResponse = {
  status: 'success',
  data: {
    docs: [
      { _id: 'rev1', rating: 5, comment: 'دورة ممتازة جداً وشرح رائع', user: { name: 'علي' } },
      { _id: 'rev2', rating: 4, comment: 'محتوى قيم ومفيد', user: { name: 'فاطمة' } },
    ],
  },
};

// ── إعداد خادم MSW ───────────────────────────────────────────────────────────
const server = setupServer(
  http.get('*/reviews', ({ request }) => {
    const url = new URL(request.url);
    const courseId = url.searchParams.get('course');

    if (courseId === 'course-empty') {
      return HttpResponse.json({ status: 'success', data: { docs: [] } });
    }
    if (courseId === 'course-error') {
      return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

    return HttpResponse.json(mockReviewsResponse);
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

describe('useReviews Hook', () => {
  // 1. لا يبدأ التحميل إذا لم يتم تمرير courseId
  test('should NOT fetch reviews when courseId is undefined', () => {
    const { result } = renderHook(() => useReviews(undefined), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  // 2. فحص حالة التحميل الابتدائي
  test('should start in loading state when courseId is provided', () => {
    const { result } = renderHook(() => useReviews('course-123'), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  // 3. فحص نجاح جلب التقييمات
  test('should fetch and return reviews list on success', async () => {
    const { result } = renderHook(() => useReviews('course-123'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].comment).toBe('دورة ممتازة جداً وشرح رائع');
    expect(result.current.data[1].rating).toBe(4);
  });

  // 4. فحص إرجاع قائمة فارغة عند عدم وجود تقييمات للكورس
  test('should return empty array when course has no reviews', async () => {
    const { result } = renderHook(() => useReviews('course-empty'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  // 5. فحص حالة الخطأ عند فشل السيرفر
  test('should enter error state when API fails', async () => {
    const { result } = renderHook(() => useReviews('course-error'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
