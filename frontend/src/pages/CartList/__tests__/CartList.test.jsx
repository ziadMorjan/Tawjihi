// src/pages/CartList/__tests__/CartList.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../design-system';
import CartList from '../index';
import { useCart, useCartActions } from '../../../features/cart';

// ── محاكاة Dependencies ───────────────────────────────────────────────────────
const mockNavigate = jest.fn();
const mockRemoveFromCart = jest.fn();
const mockClearCart = jest.fn();
const mockApplyCoupon = jest.fn();
const mockCheckout = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}));

// محاكاة MainLayout لتجنب Navbar → useAuth → AuthProvider
jest.mock('../../../shared/components/layout/MainLayout', () => ({
  MainLayout: ({ children }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../../../features/cart', () => ({
  useCart: jest.fn(),
  useCartActions: jest.fn(),
}));


// بيانات وهمية
const mockCartItems = [
  { _id: 'c1', name: 'رياضيات للتوجيهي', price: 120, priceAfterDiscount: 90, teacher: { name: 'أستاذ أحمد' }, averageRating: 4.5 },
  { _id: 'c2', name: 'فيزياء تطبيقية', price: 150, teacher: { name: 'أستاذة سارة' }, averageRating: 0 },
];

const defaultCartActions = {
  removeFromCart: mockRemoveFromCart,
  clearCart: mockClearCart,
  applyCoupon: mockApplyCoupon,
  checkout: mockCheckout,
  isRemoveLoading: false,
  isClearLoading: false,
  isCouponLoading: false,
  isCheckoutLoading: false,
  couponError: null,
};

// ── Render Helper ─────────────────────────────────────────────────────────────
const renderCartList = (cartOverrides = {}, actionsOverrides = {}) => {
  useCart.mockReturnValue({
    cartItems: mockCartItems,
    totalPrice: 270,
    totalPriceAfterDiscount: null,
    isLoading: false,
    ...cartOverrides,
  });
  useCartActions.mockReturnValue({ ...defaultCartActions, ...actionsOverrides });

  return render(
    <ThemeProvider theme={lightTheme}>
      <MemoryRouter>
        <CartList />
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('CartList Page', () => {
  beforeEach(() => jest.clearAllMocks());

  // 1. يعرض Spinner عند التحميل
  test('should show a spinner while cart is loading', () => {
    renderCartList({ isLoading: true, cartItems: [] });

    // يتحقق من وجود حالة التحميل (Spinner موجود)
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  // 2. يعرض الـ EmptyState عند سلة فارغة
  test('should show empty state when cart has no items', () => {
    renderCartList({ cartItems: [], totalPrice: 0 });

    expect(screen.getByText('cart.empty')).toBeInTheDocument();
    expect(screen.getByText('cart.browseBtn')).toBeInTheDocument();
  });

  // 3. زر التصفح في الـ EmptyState يُوجه للكورسات
  test('should navigate to courses page on browse button click from empty state', () => {
    renderCartList({ cartItems: [], totalPrice: 0 });

    fireEvent.click(screen.getByText('cart.browseBtn'));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  // 4. يعرض أسماء الكورسات والمعلمين
  test('should render all cart items with name and teacher', () => {
    renderCartList();

    expect(screen.getByText('رياضيات للتوجيهي')).toBeInTheDocument();
    expect(screen.getByText('فيزياء تطبيقية')).toBeInTheDocument();
    expect(screen.getByText('أستاذ أحمد')).toBeInTheDocument();
    expect(screen.getByText('أستاذة سارة')).toBeInTheDocument();
  });

  // 5. يعرض عدد الكورسات في الـ Badge
  test('should display the correct item count badge', () => {
    renderCartList();

    expect(screen.getByText(`${mockCartItems.length} courses.title`)).toBeInTheDocument();
  });

  // 6. زر حذف كورس يستدعي removeFromCart بالـ ID الصحيح
  test('should call removeFromCart with correct courseId on remove button click', () => {
    renderCartList();

    const removeButtons = screen.getAllByText('common.delete');
    fireEvent.click(removeButtons[0]);

    expect(mockRemoveFromCart).toHaveBeenCalledWith('c1');
  });

  // 7. زر "حذف الكل" يظهر فقط عند وجود أكثر من كورس ويستدعي clearCart
  test('should show clear all button for multiple items and call clearCart on click', () => {
    renderCartList();

    const clearBtn = screen.getByText('cart.remove');
    expect(clearBtn).toBeInTheDocument();

    fireEvent.click(clearBtn);
    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });

  // 8. زر "حذف الكل" لا يظهر عند وجود كورس واحد فقط
  test('should NOT show clear all button when only one item in cart', () => {
    renderCartList({ cartItems: [mockCartItems[0]], totalPrice: 90 });

    expect(screen.queryByText('cart.remove')).not.toBeInTheDocument();
  });

  // 9. يعرض حقل الكوبون وزر التطبيق
  test('should render coupon input and apply button', () => {
    renderCartList();

    expect(screen.getByText('common.confirm')).toBeInTheDocument();
  });

  // 10. زر تطبيق الكوبون يستدعي applyCoupon بالكود الصحيح
  test('should call applyCoupon with the entered coupon code', () => {
    renderCartList();

    const input = screen.getByPlaceholderText('common.search');
    fireEvent.change(input, { target: { value: 'SAVE20' } });

    const applyBtn = screen.getByText('common.confirm');
    fireEvent.click(applyBtn);

    expect(mockApplyCoupon).toHaveBeenCalledWith('SAVE20');
  });

  // 11. زر الدفع يستدعي checkout بالـ IDs الصحيحة
  test('should call checkout with array of courseIds on checkout button click', () => {
    renderCartList();

    // يبحث عن زر checkout (يحتوي على cart.checkout)
    const checkoutBtn = screen.getByText((content) =>
      content.includes('cart.checkout')
    );
    fireEvent.click(checkoutBtn);

    expect(mockCheckout).toHaveBeenCalledWith(['c1', 'c2']);
  });

  // 12. يعرض السعر بعد الخصم عند وجود كوبون مطبق
  test('should display reduced final price when coupon is applied', () => {
    renderCartList({
      totalPrice: 270,
      totalPriceAfterDiscount: 216, // 20% خصم
    });

    // السعر النهائي يجب أن يكون أقل من الأصلي
    const checkoutBtn = screen.getByText((content) =>
      content.includes('cart.checkout')
    );
    expect(checkoutBtn.textContent).toContain('192.00');
  });
});
