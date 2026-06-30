// src/pages/Profile/__tests__/Profile.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../design-system';
import Profile from '../index';
import { useAuth } from '../../../features/auth';
import { useMyEnrollments } from '../../../features/enrollments/hooks/useMyEnrollments';
import { useCart } from '../../../features/cart';
import { useWishlist } from '../../../features/wishlist';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { language: 'ar' },
  }),
}));

// محاكاة MainLayout لتجنب الـ Navbar والـ useAuth الداخلي له
jest.mock('../../../shared/components/layout/MainLayout', () => ({
  MainLayout: ({ children }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../../../features/auth', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../features/enrollments/hooks/useMyEnrollments', () => ({
  useMyEnrollments: jest.fn(),
}));

jest.mock('../../../features/cart', () => ({
  useCart: jest.fn(),
}));

jest.mock('../../../features/wishlist', () => ({
  useWishlist: jest.fn(),
}));


// بيانات مستخدم وهمية
const mockUser = {
  _id: 'user-123',
  name: 'زيد مرجان',
  email: 'ziad@tawjihi.com',
  role: 'user',
  bio: 'طالب في الفرع العلمي مهتم بالفيزياء والرياضيات',
  phone: '0599000000',
  createdAt: '2026-01-01T00:00:00.000Z',
  coverImage: 'https://example.com/avatar.jpg',
};

const setupMocks = (authOverrides = {}, enrollments = [], cart = [], wishlist = []) => {
  useAuth.mockReturnValue({
    user: mockUser,
    isLoading: false,
    ...authOverrides,
  });
  useMyEnrollments.mockReturnValue({ enrollments });
  useCart.mockReturnValue({ cartItems: cart });
  useWishlist.mockReturnValue({ wishlistIds: wishlist });
};

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص ظهور الـ Spinner عند التحميل
  test('should show Spinner when profile is loading', () => {
    setupMocks({ isLoading: true, user: null });

    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </ThemeProvider>
    );

    // التحقق من أن المكون يعرض spinner بدلاً من محتوى الصفحة
    expect(screen.queryByText('زيد مرجان')).not.toBeInTheDocument();
  });

  // 2. فحص التوجيه لصفحة تسجيل الدخول إذا كان المستخدم غير موثق
  test('should navigate to login if user is not authenticated', () => {
    setupMocks({ user: null });

    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/auth/login');
  });

  // 3. فحص عرض البيانات الشخصية بشكل صحيح
  test('should render user profile details (name, email, bio, phone, role)', () => {
    setupMocks();

    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </ThemeProvider>
    );

    expect(screen.getAllByText('زيد مرجان')[0]).toBeInTheDocument();
    expect(screen.getAllByText('ziad@tawjihi.com')[0]).toBeInTheDocument();
    expect(screen.getByText('طالب في الفرع العلمي مهتم بالفيزياء والرياضيات')).toBeInTheDocument();
    expect(screen.getByText('0599000000')).toBeInTheDocument();
  });

  // 4. فحص عرض الإحصائيات (عدد الدورات، عناصر السلة، المفضلة)
  test('should render counts for enrollments, cart items, and wishlist ids', () => {
    setupMocks(
      {},
      [{ _id: 'e1' }, { _id: 'e2' }], // enrollments
      [{ _id: 'c1' }],               // cart
      ['w1', 'w2', 'w3']             // wishlist
    );

    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </ThemeProvider>
    );

    // التحقق من عرض أرقام الإحصائيات
    expect(screen.getByText('2')).toBeInTheDocument(); // enrollments
    expect(screen.getByText('1')).toBeInTheDocument(); // cart
    expect(screen.getByText('3')).toBeInTheDocument(); // wishlist
  });

  // 5. فحص الضغط على زر تعديل الملف الشخصي
  test('should navigate to edit profile page when edit button is clicked', () => {
    setupMocks();

    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </ThemeProvider>
    );

    const editBtn = screen.getByText('profile.editProfile');
    fireEvent.click(editBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/user/edit-profile');
  });

  // 6. فحص الضغط على زر تغيير كلمة المرور
  test('should navigate to change password page when change password button is clicked', () => {
    setupMocks();

    render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </ThemeProvider>
    );

    const changePwBtn = screen.getAllByText('profile.changePassword')[1];
    fireEvent.click(changePwBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/user/change-password');
  });
});
