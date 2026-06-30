// src/features/courses/hooks/__tests__/useCourseActions.test.js
import { renderHook } from '@testing-library/react';
import { useCourseActions } from '../useCourseActions';

// ── محاكاة Cart و Wishlist ────────────────────────────────────────────────────
const mockToggleCart = jest.fn();
const mockToggleWishlist = jest.fn();

jest.mock('../../../cart', () => ({
  useCart: () => ({
    cartItems: [{ _id: 'course-1' }, { _id: 'course-2' }],
    isLoading: false,
  }),
  useCartActions: () => ({
    toggleCart: mockToggleCart,
  }),
}));

jest.mock('../../../wishlist', () => ({
  useWishlist: () => ({
    wishlistIds: ['course-3', 'course-4'],
    isLoading: false,
  }),
  useWishlistActions: () => ({
    toggleWishlist: mockToggleWishlist,
  }),
}));

describe('useCourseActions Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص إرجاع البيانات الصحيحة من الهوك
  test('should return cartItems, wishlistIds, and action functions', () => {
    const { result } = renderHook(() => useCourseActions());

    expect(result.current.cartItems).toHaveLength(2);
    expect(result.current.wishlistIds).toHaveLength(2);
    expect(typeof result.current.isInCart).toBe('function');
    expect(typeof result.current.isInWishlist).toBe('function');
    expect(typeof result.current.toggleCart).toBe('function');
    expect(typeof result.current.toggleWishlist).toBe('function');
  });

  // 2. فحص isInCart — كورس موجود في السلة
  test('should return true from isInCart if courseId is in cartItems', () => {
    const { result } = renderHook(() => useCourseActions());

    expect(result.current.isInCart('course-1')).toBe(true);
    expect(result.current.isInCart('course-2')).toBe(true);
  });

  // 3. فحص isInCart — كورس غير موجود في السلة
  test('should return false from isInCart if courseId is NOT in cartItems', () => {
    const { result } = renderHook(() => useCourseActions());

    expect(result.current.isInCart('course-99')).toBe(false);
  });

  // 4. فحص isInWishlist — كورس موجود في المفضلة
  test('should return true from isInWishlist if courseId is in wishlistIds', () => {
    const { result } = renderHook(() => useCourseActions());

    expect(result.current.isInWishlist('course-3')).toBe(true);
    expect(result.current.isInWishlist('course-4')).toBe(true);
  });

  // 5. فحص isInWishlist — كورس غير موجود في المفضلة
  test('should return false from isInWishlist if courseId is NOT in wishlistIds', () => {
    const { result } = renderHook(() => useCourseActions());

    expect(result.current.isInWishlist('course-99')).toBe(false);
  });

  // 6. فحص استدعاء toggleCart عند الاستدعاء
  test('should call toggleCart with the correct courseId', () => {
    const { result } = renderHook(() => useCourseActions());

    result.current.toggleCart('course-1');

    expect(mockToggleCart).toHaveBeenCalledTimes(1);
    expect(mockToggleCart).toHaveBeenCalledWith('course-1');
  });

  // 7. فحص استدعاء toggleWishlist عند الاستدعاء
  test('should call toggleWishlist with the correct courseId', () => {
    const { result } = renderHook(() => useCourseActions());

    result.current.toggleWishlist('course-3');

    expect(mockToggleWishlist).toHaveBeenCalledTimes(1);
    expect(mockToggleWishlist).toHaveBeenCalledWith('course-3');
  });
});
