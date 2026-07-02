// src/features/comments/hooks/__tests__/useComments.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useComments } from '../useComments';

// ── بيانات وهمية ─────────────────────────────────────────────────────────────
const mockCommentsResponse = {
  status: 'success',
  data: {
    docs: [
      { _id: 'comm1', content: 'شرح ممتاز جداً ومبسط', user: { _id: 'u1', name: 'أحمد' } },
      { _id: 'comm2', content: 'هل هناك ملف PDF للدرس؟', user: { _id: 'u2', name: 'سارة' } },
    ],
  },
};

// ── إعداد خادم MSW ───────────────────────────────────────────────────────────
const server = setupServer(
  http.get('*/comments', ({ request }) => {
    const url = new URL(request.url);
    const lessonId = url.searchParams.get('lesson');

    if (lessonId === 'lesson-empty') {
      return HttpResponse.json({ status: 'success', data: { docs: [] } });
    }
    if (lessonId === 'lesson-error') {
      return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }

    return HttpResponse.json(mockCommentsResponse);
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

describe('useComments Hook', () => {
  // 1. لا يبدأ التحميل إذا لم يتم تمرير lessonId
  test('should NOT fetch comments when lessonId is undefined', () => {
    const { result } = renderHook(() => useComments(undefined), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  // 2. فحص حالة التحميل الابتدائي
  test('should start in loading state when lessonId is provided', () => {
    const { result } = renderHook(() => useComments('lesson-123'), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  // 3. فحص نجاح جلب التعليقات
  test('should fetch and return comments list on success', async () => {
    const { result } = renderHook(() => useComments('lesson-123'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].content).toBe('شرح ممتاز جداً ومبسط');
    expect(result.current.data[1].user.name).toBe('سارة');
  });

  // 4. فحص إرجاع قائمة فارغة عند عدم وجود تعليقات للدرس
  test('should return empty array when lesson has no comments', async () => {
    const { result } = renderHook(() => useComments('lesson-empty'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  // 5. فحص حالة الخطأ عند فشل السيرفر
  test('should enter error state when API fails', async () => {
    const { result } = renderHook(() => useComments('lesson-error'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
