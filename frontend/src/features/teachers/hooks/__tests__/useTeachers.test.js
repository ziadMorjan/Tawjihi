// src/features/teachers/hooks/__tests__/useTeachers.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useTeachers } from '../useTeachers';

// ── بيانات وهمية ─────────────────────────────────────────────────────────────
const mockTeachersResponse = {
  status: 'success',
  data: {
    docs: [
      { _id: 't1', name: 'أ. محمد أحمد', role: 'teacher' },
      { _id: 't2', name: 'أ. سارة خالد', role: 'teacher' },
    ],
    pagination: { page: 1, limit: 10, total: 2 },
  },
};

// ── إعداد خادم MSW ───────────────────────────────────────────────────────────
const server = setupServer(
  http.get('*/users', ({ request }) => {
    const url = new URL(request.url);
    const role = url.searchParams.get('role');
    const page = url.searchParams.get('page');

    if (role !== 'teacher') {
      return HttpResponse.json({ message: 'Invalid role parameter' }, { status: 400 });
    }

    if (page === 'empty') {
      return HttpResponse.json({ status: 'success', data: { docs: [] } });
    }

    if (page === 'error') {
      return HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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

describe('useTeachers Hook', () => {
  // 1. فحص حالة التحميل الابتدائي
  test('should start in loading state when querying teachers', () => {
    const { result } = renderHook(() => useTeachers(), { wrapper: createWrapper() });
    expect(result.current.isLoading).toBe(true);
  });

  // 2. فحص جلب المدرسين بنجاح
  test('should fetch and return teachers list and pagination info on success', async () => {
    const { result } = renderHook(() => useTeachers({ page: 1 }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data.teachers).toHaveLength(2);
    expect(result.current.data.teachers[0].name).toBe('أ. محمد أحمد');
    expect(result.current.data.pagination).toEqual({ page: 1, limit: 10, total: 2 });
  });

  // 3. فحص إرجاع قائمة فارغة عند عدم وجود مدرسين
  test('should return empty teachers array if none found', async () => {
    const { result } = renderHook(() => useTeachers({ page: 'empty' }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data.teachers).toEqual([]);
    expect(result.current.data.pagination).toBeNull();
  });

  // 4. فحص حالة الخطأ عند فشل الـ API
  test('should enter error state when API fails', async () => {
    const { result } = renderHook(() => useTeachers({ page: 'error' }), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
