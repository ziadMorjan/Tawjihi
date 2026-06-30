// src/features/courses/components/CourseCard/__tests__/CourseCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../../../design-system';
import { CourseCard } from '../index';
import { useCourseActions } from '../../../hooks/useCourseActions';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
const mockNavigate = jest.fn();
const mockToggleCart = jest.fn();
const mockToggleWishlist = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// محاكاة useCourseActions لأنه يعتمد على Cart/Wishlist contexts
jest.mock('../../../hooks/useCourseActions', () => ({
  useCourseActions: jest.fn(),
}));


// ── بيانات وهمية ──────────────────────────────────────────────────────────────
const mockCourse = {
  _id: 'course-abc',
  name: 'رياضيات للتوجيهي',
  coverImage: 'https://example.com/math.jpg',
  price: 120,
  priceAfterDiscount: 90,
  averageRating: 4.5,
  teacher: { name: 'أستاذ أحمد' },
  subject: { name: 'رياضيات' },
  branches: [{ name: 'علمي' }],
};

// ── Render Helper ─────────────────────────────────────────────────────────────
const renderCourseCard = (course = mockCourse, hookOverrides = {}) => {
  useCourseActions.mockReturnValue({
    isInCart: () => false,
    isInWishlist: () => false,
    toggleCart: mockToggleCart,
    toggleWishlist: mockToggleWishlist,
    isCartLoading: false,
    isWishlistLoading: false,
    ...hookOverrides,
  });

  return render(
    <ThemeProvider theme={lightTheme}>
      <MemoryRouter>
        <CourseCard course={course} />
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('CourseCard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص ظهور بيانات الكورس الأساسية
  test('should render course name, teacher, subject, and branch', () => {
    renderCourseCard();

    expect(screen.getByText('رياضيات للتوجيهي')).toBeInTheDocument();
    expect(screen.getByText('أستاذ أحمد')).toBeInTheDocument();
    expect(screen.getByText('رياضيات')).toBeInTheDocument();
    expect(screen.getByText('علمي')).toBeInTheDocument();
  });

  // 2. فحص عرض السعر بعد الخصم والسعر الأصلي مشطوباً
  test('should display discounted price and original price when discount exists', () => {
    renderCourseCard();

    expect(screen.getByText('90 ₪')).toBeInTheDocument();
    expect(screen.getByText('120 ₪')).toBeInTheDocument();
  });

  // 3. فحص عرض "مجاني" للكورس المجاني
  test('should display "مجاني" badge when course price is 0', () => {
    renderCourseCard({ ...mockCourse, price: 0 });

    expect(screen.getByText('مجاني')).toBeInTheDocument();
    expect(screen.queryByText('₪')).not.toBeInTheDocument();
  });

  // 4. فحص عرض السعر الأصلي بدون خصم عند غياب priceAfterDiscount
  test('should display only original price when no discount exists', () => {
    renderCourseCard({ ...mockCourse, priceAfterDiscount: null });

    expect(screen.getByText('120 ₪')).toBeInTheDocument();
    // لا يجب أن يظهر نفس الرقم مرتين
    expect(screen.queryAllByText('120 ₪')).toHaveLength(1);
  });

  // 5. فحص الضغط على الكارت يفتح صفحة تفاصيل الكورس
  test('should navigate to course details page on card click', () => {
    renderCourseCard();

    const card = screen.getByRole('article');
    fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining('course-abc')
    );
  });

  // 6. فحص زر السلة يستدعي toggleCart بدون فتح صفحة الكورس
  test('should call toggleCart and stop propagation on cart button click', () => {
    renderCourseCard();

    const cartBtn = screen.getByLabelText('إضافة للسلة');
    fireEvent.click(cartBtn);

    expect(mockToggleCart).toHaveBeenCalledWith('course-abc');
    // الكارت لم يُفتح
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // 7. فحص زر المفضلة يستدعي toggleWishlist بدون فتح صفحة الكورس
  test('should call toggleWishlist and stop propagation on wishlist button click', () => {
    renderCourseCard();

    const wishlistBtn = screen.getByLabelText('إضافة للمفضلة');
    fireEvent.click(wishlistBtn);

    expect(mockToggleWishlist).toHaveBeenCalledWith('course-abc');
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // 8. فحص تغيير aria-label لزر السلة عند وجود الكورس فيها
  test('should show correct aria-label for cart button when course is in cart', () => {
    renderCourseCard(mockCourse, {
      isInCart: (id) => id === 'course-abc',
    });

    expect(screen.getByLabelText('إزالة من السلة')).toBeInTheDocument();
    expect(screen.queryByLabelText('إضافة للسلة')).not.toBeInTheDocument();
  });

  // 9. فحص تغيير aria-label لزر المفضلة عند وجود الكورس فيها
  test('should show correct aria-label for wishlist button when course is in wishlist', () => {
    renderCourseCard(mockCourse, {
      isInWishlist: (id) => id === 'course-abc',
    });

    expect(screen.getByLabelText('إزالة من المفضلة')).toBeInTheDocument();
  });

  // 10. فحص استخدام صورة افتراضية عند غياب coverImage
  test('should use fallback image when coverImage is not provided', () => {
    renderCourseCard({ ...mockCourse, coverImage: null });

    const img = screen.getByAltText('رياضيات للتوجيهي');
    expect(img).toHaveAttribute('src', '/assets/img/logo.png');
  });

  // 11. فحص عدم ظهور اسم المعلم عند غيابه
  test('should not render teacher name if teacher is missing', () => {
    renderCourseCard({ ...mockCourse, teacher: null });

    expect(screen.queryByText('أستاذ أحمد')).not.toBeInTheDocument();
  });

  // 12. فحص عدم ظهور المادة عند غيابها
  test('should not render subject badge if subject is missing', () => {
    renderCourseCard({ ...mockCourse, subject: null });

    expect(screen.queryByText('رياضيات')).not.toBeInTheDocument();
  });
});
