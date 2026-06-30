// src/features/wishlist/hooks/__tests__/useWishlistActions.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useWishlistActions } from '../useWishlistActions';
import { wishlistApi } from '../../api/wishlistApi';
import { WISHLIST_QUERY_KEY } from '../useWishlist';

// ── محاكاة Dependencies ───────────────────────────────────────────────────────
jest.mock('../../api/wishlistApi', () => ({
  wishlistApi: {
    addToWishlist: jest.fn(),
    removeFromWishlist: jest.fn(),
  },
}));

jest.mock('../../../auth', () => ({
  useAuth: jest.fn(),
}));
import { useAuth } from '../../../auth';

jest.mock('react-toastify', () => ({
  toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// ── Wrapper ───────────────────────────────────────────────────────────────────
let queryClient;
const createWrapper = () => {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useWishlistActions Hook', () => {
  beforeEach(() => jest.clearAllMocks());

  // 1. يُظهر toast.info ويوقف إذا المستخدم غير مسجل
  test('should show toast.info and NOT add to wishlist when user is not logged in', async () => {
    const { toast } = require('react-toastify');
    useAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useWishlistActions(), { wrapper: createWrapper() });

    act(() => { result.current.toggleWishlist('course-1'); });

    expect(toast.info).toHaveBeenCalledTimes(1);
    expect(wishlistApi.addToWishlist).not.toHaveBeenCalled();
  });

  // 2. toggleWishlist يُضيف إذا الكورس غير موجود في المفضلة
  test('should call addToWishlist via toggleWishlist when course is NOT in wishlist', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });
    wishlistApi.addToWishlist.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();
    queryClient.setQueryData(WISHLIST_QUERY_KEY, []); // مفضلة فارغة

    const { result } = renderHook(() => useWishlistActions(), { wrapper });

    act(() => { result.current.toggleWishlist('course-new'); });

    await waitFor(() => {
      expect(wishlistApi.addToWishlist).toHaveBeenCalledWith('course-new', expect.anything());
    });
  });

  // 3. toggleWishlist يُزيل إذا الكورس موجود بالفعل (Optimistic Update)
  test('should call removeFromWishlist via toggleWishlist when course IS in wishlist', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });
    wishlistApi.removeFromWishlist.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();
    queryClient.setQueryData(WISHLIST_QUERY_KEY, ['course-existing']);

    const { result } = renderHook(() => useWishlistActions(), { wrapper });

    act(() => { result.current.toggleWishlist('course-existing'); });

    await waitFor(() => {
      expect(wishlistApi.removeFromWishlist).toHaveBeenCalledWith('course-existing', expect.anything());
    });
  });

  // 4. يُطبق Optimistic Update — يحذف فوراً من الكاش قبل تأكيد السيرفر
  test('should optimistically remove courseId from cache on removeFromWishlist', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });
    wishlistApi.removeFromWishlist.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();
    queryClient.setQueryData(WISHLIST_QUERY_KEY, ['course-1', 'course-2']);

    const { result } = renderHook(() => useWishlistActions(), { wrapper });

    act(() => { result.current.toggleWishlist('course-1'); });

    await waitFor(() => {
      const cached = queryClient.getQueryData(WISHLIST_QUERY_KEY);
      expect(cached).not.toContain('course-1');
    });
  });

  // 5. يعيد الكاش للحالة السابقة عند فشل الحذف (Rollback)
  test('should rollback cache to previous state if removeFromWishlist fails', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });
    wishlistApi.removeFromWishlist.mockRejectedValue(new Error('Server Error'));

    const wrapper = createWrapper();
    queryClient.setQueryData(WISHLIST_QUERY_KEY, ['course-1', 'course-2']);

    const { result } = renderHook(() => useWishlistActions(), { wrapper });

    act(() => { result.current.toggleWishlist('course-1'); });

    await waitFor(() => {
      const cached = queryClient.getQueryData(WISHLIST_QUERY_KEY);
      // بعد الفشل يرجع للحالة الأصلية
      expect(cached).toContain('course-1');
    });
  });

  // 6. يظهر toast.success عند نجاح الإضافة
  test('should show toast.success when addToWishlist succeeds', async () => {
    const { toast } = require('react-toastify');
    useAuth.mockReturnValue({ user: { _id: 'u1' } });
    wishlistApi.addToWishlist.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();
    queryClient.setQueryData(WISHLIST_QUERY_KEY, []);

    const { result } = renderHook(() => useWishlistActions(), { wrapper });

    act(() => { result.current.toggleWishlist('course-new'); });

    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));
  });

  // 7. يظهر toast.info عند نجاح الحذف
  test('should show toast.info when removeFromWishlist succeeds', async () => {
    const { toast } = require('react-toastify');
    useAuth.mockReturnValue({ user: { _id: 'u1' } });
    wishlistApi.removeFromWishlist.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();
    queryClient.setQueryData(WISHLIST_QUERY_KEY, ['course-1']);

    const { result } = renderHook(() => useWishlistActions(), { wrapper });

    act(() => { result.current.toggleWishlist('course-1'); });

    await waitFor(() => expect(toast.info).toHaveBeenCalledTimes(1));
  });
});
