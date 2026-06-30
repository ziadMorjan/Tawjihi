// src/features/courses/hooks/__tests__/useFiltersData.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useSubjects, useBranches } from '../useFiltersData';

// ── بيانات وهمية ─────────────────────────────────────────────────────────────
const mockSubjects = [
  { _id: 's1', name: 'رياضيات' },
  { _id: 's2', name: 'فيزياء' },
  { _id: 's3', name: 'كيمياء' },
];

const mockBranches = [
  { _id: 'b1', name: 'علمي' },
  { _id: 'b2', name: 'أدبي' },
];

// ── إعداد خادم MSW ───────────────────────────────────────────────────────────
const server = setupServer(
  http.get('*/subjects', () =>
    HttpResponse.json({ status: 'success', data: mockSubjects })
  ),
  http.get('*/branches', () =>
    HttpResponse.json({ status: 'success', data: mockBranches })
  )
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

describe('useFiltersData Hooks', () => {
  describe('useSubjects', () => {
    // 1. فحص التحميل الابتدائي
    test('should start in loading state', () => {
      const { result } = renderHook(() => useSubjects(), { wrapper: createWrapper() });
      expect(result.current.isLoading).toBe(true);
    });

    // 2. فحص جلب المواد الدراسية بنجاح
    test('should fetch and return subjects list on success', async () => {
      const { result } = renderHook(() => useSubjects(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toHaveLength(3);
      expect(result.current.data[0].name).toBe('رياضيات');
      expect(result.current.data[1].name).toBe('فيزياء');
    });

    // 3. فحص حالة الفشل عند خطأ في السيرفر
    test('should enter error state when subjects API fails', async () => {
      server.use(
        http.get('*/subjects', () =>
          HttpResponse.json({ message: 'Server Error' }, { status: 500 })
        )
      );

      const { result } = renderHook(() => useSubjects(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('useBranches', () => {
    // 4. فحص جلب الفروع بنجاح
    test('should fetch and return branches list on success', async () => {
      const { result } = renderHook(() => useBranches(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data[0].name).toBe('علمي');
      expect(result.current.data[1].name).toBe('أدبي');
    });

    // 5. فحص حالة الفشل عند خطأ في سيرفر الفروع
    test('should enter error state when branches API fails', async () => {
      server.use(
        http.get('*/branches', () =>
          HttpResponse.json({ message: 'Server Error' }, { status: 500 })
        )
      );

      const { result } = renderHook(() => useBranches(), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    // 6. فحص أن المواد والفروع يجلبان بشكل مستقل (cache منفصل)
    test('should cache subjects and branches independently', async () => {
      const wrapper = createWrapper();

      const { result: subjectsResult } = renderHook(() => useSubjects(), { wrapper });
      const { result: branchesResult } = renderHook(() => useBranches(), { wrapper });

      await waitFor(() => expect(subjectsResult.current.isSuccess).toBe(true));
      await waitFor(() => expect(branchesResult.current.isSuccess).toBe(true));

      expect(subjectsResult.current.data).toHaveLength(3);
      expect(branchesResult.current.data).toHaveLength(2);
    });
  });
});
