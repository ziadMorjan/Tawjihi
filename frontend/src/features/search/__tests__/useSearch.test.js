// src/features/search/__tests__/useSearch.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useSearch } from '../useSearch';

// ── بيانات وهمية ─────────────────────────────────────────────────────────────
const mockCoursesResponse = {
  status: 'success',
  data: {
    docs: [
      { _id: 'c1', title: 'رياضيات التوجيهي العلمي' },
    ],
  },
};

const mockTeachersResponse = {
  status: 'success',
  data: {
    docs: [
      { _id: 't1', name: 'أ. أحمد علي', role: 'teacher' },
    ],
  },
};

// ── إعداد خادم MSW ───────────────────────────────────────────────────────────
const server = setupServer(
  http.get('*/courses', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');

    if (keyword === 'no-results') {
      return HttpResponse.json({ status: 'success', data: { docs: [] } });
    }
    if (keyword === 'error') {
      return HttpResponse.json({ message: 'Error' }, { status: 500 });
    }

    return HttpResponse.json(mockCoursesResponse);
  }),

  http.get('*/users', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');

    if (keyword === 'no-results') {
      return HttpResponse.json({ status: 'success', data: { docs: [] } });
    }
    if (keyword === 'error') {
      return HttpResponse.json({ message: 'Error' }, { status: 500 });
    }

    return HttpResponse.json(mockTeachersResponse);
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

describe('useSearch Hook', () => {
  // 1. لا يبدأ البحث إذا كانت الكلمة فارغة أو مسافات فقط
  test('should NOT search when keyword is empty or whitespace', () => {
    const { result, rerender } = renderHook(({ kw }) => useSearch(kw), {
      initialProps: { kw: '' },
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.courses).toEqual([]);
    expect(result.current.teachers).toEqual([]);

    rerender({ kw: '   ' });
    expect(result.current.isLoading).toBe(false);
  });

  // 2. فحص حالة التحميل الابتدائي للبحث المتوازي
  test('should start in loading state when search keyword is valid', () => {
    const { result } = renderHook(() => useSearch('رياضيات'), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
  });

  // 3. فحص نجاح جلب نتائج الكورسات والمعلمين معاً
  test('should fetch and return parallel search results on success', async () => {
    const { result } = renderHook(() => useSearch('رياضيات'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.courses).toHaveLength(1);
    expect(result.current.courses[0].title).toBe('رياضيات التوجيهي العلمي');
    expect(result.current.teachers).toHaveLength(1);
    expect(result.current.teachers[0].name).toBe('أ. أحمد علي');
    expect(result.current.hasResults).toBe(true);
  });

  // 4. فحص سلوك Hook عند عدم وجود نتائج تطابق الكلمة الدلالية
  test('should return empty results and hasResults false when no match found', async () => {
    const { result } = renderHook(() => useSearch('no-results'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.courses).toEqual([]);
    expect(result.current.teachers).toEqual([]);
    expect(result.current.hasResults).toBe(false);
  });

  // 5. فحص التعامل مع أخطاء الشبكة أو فشل الـ API
  test('should handle network/API errors gracefully', async () => {
    const { result } = renderHook(() => useSearch('error'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.courses).toEqual([]);
    expect(result.current.teachers).toEqual([]);
    expect(result.current.hasResults).toBe(false);
  });
});
