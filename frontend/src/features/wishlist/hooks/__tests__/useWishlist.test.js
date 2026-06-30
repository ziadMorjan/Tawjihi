// src/features/wishlist/hooks/__tests__/useWishlist.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useWishlist } from '../useWishlist';

// ── محاكاة AuthContext ────────────────────────────────────────────────────────
jest.mock('../../../auth', () => ({
  useAuth: jest.fn(),
}));
import { useAuth } from '../../../auth';

// ── بيانات وهمية ─────────────────────────────────────────────────────────────
const mockWishlistIds = ['course-1', 'course-2'];
const mockCourse1 = { _id: 'course-1', name: 'رياضيات', price: 100 };
const mockCourse2 = { _id: 'course-2', name: 'فيزياء', price: 150 };

// ── MSW Server ────────────────────────────────────────────────────────────────
const server = setupServer(
  http.get('*/wishlist', () =>
    HttpResponse.json({ status: 'success', wishlist: mockWishlistIds })
  ),
  http.get('*/courses/course-1', () =>
    HttpResponse.json({ status: 'success', data: { doc: mockCourse1 } })
  ),
  http.get('*/courses/course-2', () =>
    HttpResponse.json({ status: 'success', data: { doc: mockCourse2 } })
  )
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});
afterAll(() => server.close());

// ── Wrapper ───────────────────────────────────────────────────────────────────
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useWishlist Hook', () => {
  // 1. لا يشتغل الـ query عند غياب المستخدم
  test('should NOT fetch wishlist when user is not logged in', () => {
    useAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

    expect(result.current.isIdsLoading).toBe(false);
    expect(result.current.wishlistIds).toEqual([]);
  });

  // 2. يجلب الـ IDs عند وجود مستخدم
  test('should fetch wishlist IDs when user is logged in', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });

    const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isIdsLoading).toBe(false));

    expect(result.current.wishlistIds).toEqual(['course-1', 'course-2']);
  });

  // 3. يجلب تفاصيل الكورسات بعد جلب الـ IDs
  test('should fetch course details for each wishlist ID', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });

    const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isCoursesSuccess).toBe(true));

    expect(result.current.courses).toHaveLength(2);
    expect(result.current.courses[0].name).toBe('رياضيات');
    expect(result.current.courses[1].name).toBe('فيزياء');
  });

  // 4. يعيد wishlistIds فارغة عند قائمة مفضلة فارغة
  test('should return empty wishlistIds when wishlist is empty', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });
    server.use(
      http.get('*/wishlist', () =>
        HttpResponse.json({ status: 'success', wishlist: [] })
      )
    );

    const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isIdsLoading).toBe(false));

    expect(result.current.wishlistIds).toEqual([]);
    expect(result.current.courses).toEqual([]);
  });

  // 5. isInWishlist يعيد true لكورس موجود في القائمة
  test('should return true from isInWishlist for a course in the wishlist', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });

    const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isIdsLoading).toBe(false));

    expect(result.current.isInWishlist('course-1')).toBe(true);
  });

  // 6. isInWishlist يعيد false لكورس غير موجود
  test('should return false from isInWishlist for a course NOT in the wishlist', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });

    const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isIdsLoading).toBe(false));

    expect(result.current.isInWishlist('course-99')).toBe(false);
  });

  // 7. يتعامل مع كورسات تفشل في الجلب ويتجاهلها (filter null)
  test('should filter out null results from failed course fetches', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });
    server.use(
      // course-2 يفشل
      http.get('*/courses/course-2', () =>
        HttpResponse.json({ message: 'Not Found' }, { status: 404 })
      )
    );

    const { result } = renderHook(() => useWishlist(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isCoursesSuccess).toBe(true));

    // يعيد فقط الكورسات التي نجح جلبها
    expect(result.current.courses).toHaveLength(1);
    expect(result.current.courses[0].name).toBe('رياضيات');
  });
});
