// src/features/lessons/hooks/__tests__/useLessons.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useLessons } from '../useLessons';

// ── بيانات وهمية ─────────────────────────────────────────────────────────────
const mockLessonsResponse = {
  status: 'success',
  data: {
    docs: [
      { _id: 'l1', title: 'الدرس الأول: مقدمة في التفاضل', duration: 600, video: 'https://ex.com/v1.mp4' },
      { _id: 'l2', title: 'الدرس الثاني: قواعد الاشتقاق', duration: 900, video: 'https://ex.com/v2.mp4' },
    ],
  },
};

// ── إعداد خادم MSW ───────────────────────────────────────────────────────────
const server = setupServer(
  http.get('*/lessons', ({ request }) => {
    const url = new URL(request.url);
    const courseId = url.searchParams.get('course');

    if (courseId === 'course-empty') {
      return HttpResponse.json({ status: 'success', data: { docs: [] } });
    }
    if (courseId === 'course-error') {
      return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

    return HttpResponse.json(mockLessonsResponse);
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

describe('useLessons Hook', () => {
  // 1. لا يبدأ التحميل إذا لم يتم تمرير courseId
  test('should NOT fetch lessons when courseId is undefined', () => {
    const { result } = renderHook(() => useLessons(undefined), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  // 2. فحص حالة التحميل الابتدائي
  test('should start in loading state when courseId is provided', () => {
    const { result } = renderHook(() => useLessons('course-123'), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  // 3. فحص نجاح جلب الدروس
  test('should fetch and return lessons list on success', async () => {
    const { result } = renderHook(() => useLessons('course-123'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].title).toBe('الدرس الأول: مقدمة في التفاضل');
    expect(result.current.data[1].duration).toBe(900);
  });

  // 4. فحص إرجاع قائمة فارغة عند عدم وجود دروس للكورس
  test('should return empty array when course has no lessons', async () => {
    const { result } = renderHook(() => useLessons('course-empty'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  // 5. فحص حالة الخطأ عند فشل السيرفر
  test('should enter error state when API fails', async () => {
    const { result } = renderHook(() => useLessons('course-error'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
