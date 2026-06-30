// src/features/cart/hooks/__tests__/useCartActions.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCartActions } from '../useCartActions';
import { cartApi } from '../../api/cartApi';
import { CART_QUERY_KEY } from '../useCart';

// ── محاكاة Dependencies ───────────────────────────────────────────────────────
jest.mock('../../api/cartApi', () => ({
  cartApi: {
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    clearCart: jest.fn(),
    applyCoupon: jest.fn(),
    checkout: jest.fn(),
  },
}));

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

describe('useCartActions Hook', () => {
  beforeEach(() => jest.clearAllMocks());

  // ── addToCart ─────────────────────────────────────────────────────────────

  // 1. يستدعي cartApi.addToCart بالـ courseId الصحيح
  test('should call cartApi.addToCart with correct courseId on addToCart', async () => {
    cartApi.addToCart.mockResolvedValue({ status: 'success' });

    const { result } = renderHook(() => useCartActions(), { wrapper: createWrapper() });

    act(() => { result.current.addToCart('course-1'); });

    await waitFor(() => {
      expect(cartApi.addToCart).toHaveBeenCalledWith('course-1', expect.anything());
    });
  });

  // 2. يظهر toast.success عند نجاح الإضافة
  test('should show toast.success when addToCart succeeds', async () => {
    const { toast } = require('react-toastify');
    cartApi.addToCart.mockResolvedValue({ status: 'success' });

    const { result } = renderHook(() => useCartActions(), { wrapper: createWrapper() });

    act(() => { result.current.addToCart('course-1'); });

    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));
  });

  // 3. يظهر toast.error عند فشل الإضافة
  test('should show toast.error when addToCart fails', async () => {
    const { toast } = require('react-toastify');
    cartApi.addToCart.mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useCartActions(), { wrapper: createWrapper() });

    act(() => { result.current.addToCart('course-1'); });

    await waitFor(() => expect(toast.error).toHaveBeenCalledTimes(1));
  });

  // ── removeFromCart (Optimistic Update) ───────────────────────────────────

  // 4. يطبق Optimistic Update — يحذف الكورس من الكاش فوراً قبل تأكيد السيرفر
  test('should apply optimistic removal from cache before server confirms', async () => {
    cartApi.removeFromCart.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();

    // نضع بيانات ابتدائية في الكاش
    queryClient.setQueryData(CART_QUERY_KEY, {
      courses: ['course-1', 'course-2'],
      totalPrice: 250,
    });

    const { result } = renderHook(() => useCartActions(), { wrapper });

    act(() => { result.current.removeFromCart('course-1'); });

    // فوراً بعد الاستدعاء — الكورس يجب أن يُحذف من الكاش
    await waitFor(() => {
      const cached = queryClient.getQueryData(CART_QUERY_KEY);
      expect(cached?.courses).not.toContain('course-1');
    });
  });

  // 5. يُظهر toast.info عند نجاح الحذف
  test('should show toast.info after successful removeFromCart', async () => {
    const { toast } = require('react-toastify');
    cartApi.removeFromCart.mockResolvedValue({ status: 'success' });

    queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    queryClient.setQueryData(CART_QUERY_KEY, { courses: ['course-1'], totalPrice: 100 });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useCartActions(), { wrapper });
    act(() => { result.current.removeFromCart('course-1'); });

    await waitFor(() => expect(toast.info).toHaveBeenCalledTimes(1));
  });

  // ── clearCart ─────────────────────────────────────────────────────────────

  // 6. يستدعي cartApi.clearCart ويظهر toast.info
  test('should call cartApi.clearCart and show toast.info on success', async () => {
    const { toast } = require('react-toastify');
    cartApi.clearCart.mockResolvedValue({ status: 'success' });

    const { result } = renderHook(() => useCartActions(), { wrapper: createWrapper() });

    act(() => { result.current.clearCart(); });

    await waitFor(() => {
      expect(cartApi.clearCart).toHaveBeenCalledTimes(1);
      expect(toast.info).toHaveBeenCalledTimes(1);
    });
  });

  // ── applyCoupon ───────────────────────────────────────────────────────────

  // 7. يستدعي cartApi.applyCoupon بالكود الصحيح
  test('should call cartApi.applyCoupon with the coupon code', async () => {
    cartApi.applyCoupon.mockResolvedValue({
      cart: { totalPrice: 200, totalPriceAfterDiscount: 160 },
    });

    const { result } = renderHook(() => useCartActions(), { wrapper: createWrapper() });

    act(() => { result.current.applyCoupon('DISCOUNT20'); });

    await waitFor(() => {
      expect(cartApi.applyCoupon).toHaveBeenCalledWith('DISCOUNT20', expect.anything());
    });
  });

  // 8. يُظهر toast.success مع توفير المبلغ عند نجاح الكوبون
  test('should show toast.success with saved amount on valid coupon', async () => {
    const { toast } = require('react-toastify');
    cartApi.applyCoupon.mockResolvedValue({
      cart: { totalPrice: 200, totalPriceAfterDiscount: 160 },
    });

    const { result } = renderHook(() => useCartActions(), { wrapper: createWrapper() });

    act(() => { result.current.applyCoupon('SAVE40'); });

    await waitFor(() => expect(toast.success).toHaveBeenCalledTimes(1));
  });

  // ── toggleCart ────────────────────────────────────────────────────────────

  // 9. toggleCart يُضيف الكورس إذا لم يكن في السلة
  test('should call addToCart via toggleCart when course is NOT in cart', async () => {
    cartApi.addToCart.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();
    queryClient.setQueryData(CART_QUERY_KEY, { courses: [], totalPrice: 0 });

    const { result } = renderHook(() => useCartActions(), { wrapper });

    act(() => { result.current.toggleCart('new-course'); });

    await waitFor(() => {
      expect(cartApi.addToCart).toHaveBeenCalledWith('new-course', expect.anything());
    });
  });

  // 10. toggleCart يُزيل الكورس إذا كان موجوداً في السلة
  test('should call removeFromCart via toggleCart when course IS in cart', async () => {
    cartApi.removeFromCart.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();
    queryClient.setQueryData(CART_QUERY_KEY, { courses: ['existing-course'], totalPrice: 100 });

    const { result } = renderHook(() => useCartActions(), { wrapper });

    act(() => { result.current.toggleCart('existing-course'); });

    await waitFor(() => {
      expect(cartApi.removeFromCart).toHaveBeenCalledWith('existing-course', expect.anything());
    });
  });

  // ── checkout ──────────────────────────────────────────────────────────────

  // 11. checkout — يوجه لـ sessionUrl عند النجاح
  test('should redirect to sessionUrl on successful checkout', async () => {
    cartApi.checkout.mockResolvedValue({ sessionUrl: 'https://stripe.com/pay/abc' });

    const originalLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    const { result } = renderHook(() => useCartActions(), { wrapper: createWrapper() });

    act(() => { result.current.checkout(['c1', 'c2']); });

    await waitFor(() => {
      expect(window.location.href).toBe('https://stripe.com/pay/abc');
    });

    window.location = originalLocation;
  });
});
