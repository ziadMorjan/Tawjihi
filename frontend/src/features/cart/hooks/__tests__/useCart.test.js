// src/features/cart/hooks/__tests__/useCart.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useCart } from '../useCart';

// ── محاكاة AuthContext — الهوك يحتاج user لتفعيل الـ query ──────────────────
jest.mock('../../../auth', () => ({
  useAuth: jest.fn(),
}));
import { useAuth } from '../../../auth';

// ── بيانات وهمية ─────────────────────────────────────────────────────────────
const mockCart = {
  _id: 'cart-123',
  courses: [
    { _id: 'c1', name: 'رياضيات', price: 100, priceAfterDiscount: 80 },
    { _id: 'c2', name: 'فيزياء', price: 150 },
  ],
  totalPrice: 250,
  totalPriceAfterDiscount: null,
};

// ── إعداد MSW ────────────────────────────────────────────────────────────────
const server = setupServer(
  http.get('*/cart', () =>
    HttpResponse.json({ status: 'success', cart: mockCart })
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

describe('useCart Hook', () => {
  // 1. لا يشتغل الـ query عند غياب المستخدم
  test('should NOT fetch cart when user is not logged in', () => {
    useAuth.mockReturnValue({ user: null });

    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    // enabled: !!user = false → الـ query لم يُنفَّذ
    expect(result.current.cart).toBeNull();
    expect(result.current.cartItems).toEqual([]);
  });

  // 2. يبدأ التحميل عند وجود مستخدم
  test('should start fetching when user is logged in', () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });

    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
  });

  // 3. يعيد بيانات السلة بعد النجاح
  test('should return cartItems and totalPrice on success', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });

    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.cartItems).toHaveLength(2);
    expect(result.current.totalPrice).toBe(250);
    expect(result.current.totalPriceAfterDiscount).toBeNull();
  });

  // 4. يعيد cartItems فارغة عند سلة فارغة
  test('should return empty cartItems when cart has no courses', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });
    server.use(
      http.get('*/cart', () =>
        HttpResponse.json({
          status: 'success',
          cart: { _id: 'cart-empty', courses: [], totalPrice: 0 },
        })
      )
    );

    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.cartItems).toEqual([]);
    expect(result.current.totalPrice).toBe(0);
  });

  // 5. يعيد cart كـ null عند خطأ في السيرفر
  test('should return null cart when API fails', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });
    server.use(
      http.get('*/cart', () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
      )
    );

    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.cart).toBeNull();
    expect(result.current.cartItems).toEqual([]);
  });

  // 6. يعيد totalPriceAfterDiscount عند وجود كوبون مطبّق
  test('should return totalPriceAfterDiscount when coupon is applied', async () => {
    useAuth.mockReturnValue({ user: { _id: 'u1' } });
    server.use(
      http.get('*/cart', () =>
        HttpResponse.json({
          status: 'success',
          cart: { ...mockCart, totalPriceAfterDiscount: 200 },
        })
      )
    );

    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.totalPriceAfterDiscount).toBe(200);
  });
});
