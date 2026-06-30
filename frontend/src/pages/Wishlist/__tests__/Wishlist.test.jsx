// src/pages/Wishlist/__tests__/Wishlist.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../design-system';
import Wishlist from '../index';

// ── محاكاة Dependencies ───────────────────────────────────────────────────────
const mockNavigate = jest.fn();

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

// محاكاة useWishlist
jest.mock('../../../features/wishlist', () => ({
  useWishlist: jest.fn(),
}));
import { useWishlist } from '../../../features/wishlist';


// محاكاة CourseCard و CourseCardSkeleton لتبسيط الاختبار
jest.mock('../../../features/courses/components/CourseCard', () => ({
  CourseCard: ({ course }) => <div data-testid="course-card">{course.name}</div>,
}));

jest.mock('../../../features/courses/components/CourseCard/CourseCardSkeleton', () => ({
  CourseCardSkeleton: () => <div data-testid="skeleton" />,
}));

// ── بيانات وهمية ─────────────────────────────────────────────────────────────
const mockCourses = [
  { _id: 'c1', name: 'رياضيات للتوجيهي' },
  { _id: 'c2', name: 'فيزياء تطبيقية' },
];

// ── Render Helper ─────────────────────────────────────────────────────────────
const renderWishlist = (overrides = {}) => {
  useWishlist.mockReturnValue({
    wishlistIds: ['c1', 'c2'],
    courses: mockCourses,
    isLoading: false,
    isCoursesSuccess: true,
    ...overrides,
  });

  return render(
    <ThemeProvider theme={lightTheme}>
      <MemoryRouter>
        <Wishlist />
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('Wishlist Page', () => {
  beforeEach(() => jest.clearAllMocks());

  // 1. يعرض Skeletons أثناء التحميل
  test('should render skeleton cards while loading', () => {
    renderWishlist({ isLoading: true, courses: [], isCoursesSuccess: false });

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  // 2. يعرض الـ EmptyState عند قائمة مفضلة فارغة
  test('should show empty state when wishlist is empty', () => {
    renderWishlist({
      wishlistIds: [],
      courses: [],
      isCoursesSuccess: true,
    });

    expect(screen.getByText('wishlist.empty')).toBeInTheDocument();
    expect(screen.getByText('wishlist.browseBtn')).toBeInTheDocument();
  });

  // 3. زر التصفح في الـ EmptyState يُوجه للكورسات
  test('should navigate to courses page on browse button click in empty state', () => {
    renderWishlist({ wishlistIds: [], courses: [], isCoursesSuccess: true });

    fireEvent.click(screen.getByText('wishlist.browseBtn'));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  // 4. يعرض قائمة الكورسات المفضلة
  test('should render all wishlist courses', () => {
    renderWishlist();

    expect(screen.getAllByTestId('course-card')).toHaveLength(2);
    expect(screen.getByText('رياضيات للتوجيهي')).toBeInTheDocument();
    expect(screen.getByText('فيزياء تطبيقية')).toBeInTheDocument();
  });

  // 5. يعرض الهيدر مع عنوان القائمة وعدد الكورسات
  test('should render header with wishlist title and course count badge', () => {
    renderWishlist();

    expect(screen.getByText('wishlist.title')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // عدد الكورسات في البadge
  });

  // 6. لا يعرض الهيدر عند قائمة فارغة
  test('should NOT render header when wishlist is empty', () => {
    renderWishlist({ wishlistIds: [], courses: [], isCoursesSuccess: true });

    expect(screen.queryByText('wishlist.title')).not.toBeInTheDocument();
  });

  // 7. يعرض Skeletons بعدد الـ IDs الموجودة أثناء التحميل
  test('should render skeletons matching wishlistIds count during loading', () => {
    renderWishlist({
      wishlistIds: ['c1', 'c2', 'c3'],
      courses: [],
      isLoading: true,
      isCoursesSuccess: false,
    });

    const skeletons = screen.getAllByTestId('skeleton');
    expect(skeletons).toHaveLength(3);
  });

  // 8. زر "تصفح الدورات" في الهيدر يُوجه للكورسات
  test('should navigate to courses page on browse button click in header', () => {
    renderWishlist();

    // يوجد زران "wishlist.browseBtn" — في الهيدر فقط عند الحالة غير الفارغة
    const browseBtn = screen.getByText('wishlist.browseBtn');
    fireEvent.click(browseBtn);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
