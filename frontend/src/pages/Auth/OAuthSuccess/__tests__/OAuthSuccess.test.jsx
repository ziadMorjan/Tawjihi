import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import OAuthSuccess from '../index';
import { authApi } from '../../../../features/auth';
import { PATH } from '../../../../constants';

// 1. محاكاة التوجيه
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 2. محاكاة React Query
const mockSetQueryData = jest.fn();
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    setQueryData: mockSetQueryData,
  }),
}));

// 3. محاكاة authApi والسياق
jest.mock('../../../../features/auth', () => ({
  authApi: {
    getMe: jest.fn(),
  },
}));

jest.mock('../../../../features/auth/context/AuthContext', () => ({
  AUTH_QUERY_KEY: 'auth_user_query_key',
}));

// 4. محاكاة Spinner لتجنب مشاكل الرندر
jest.mock('../../../../shared/components', () => ({
  Spinner: () => <div data-testid="mock-spinner" />,
}));

describe('OAuthSuccess Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص جلب بيانات المستخدم بنجاح بعد الـ OAuth وتحديث الكاش
  test('should fetch user successfully, update cache, and redirect to home', async () => {
    const mockUser = { id: 1, name: 'Ziad Google', role: 'user' };
    authApi.getMe.mockResolvedValue({ data: mockUser });

    render(
      <MemoryRouter>
        <OAuthSuccess />
      </MemoryRouter>
    );

    // التأكد من ظهور رمز التحميل والرسالة
    expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
    expect(screen.getByText('جارٍ تسجيل الدخول...')).toBeInTheDocument();

    await waitFor(() => {
      expect(authApi.getMe).toHaveBeenCalledTimes(1);
    });

    expect(mockSetQueryData).toHaveBeenCalledWith('auth_user_query_key', mockUser);
    expect(mockNavigate).toHaveBeenCalledWith(PATH.home, { replace: true });
  });

  // 2. فحص فشل الجلب والتحويل لصفحة تسجيل الدخول
  test('should redirect to login page if fetch user fails', async () => {
    authApi.getMe.mockRejectedValue(new Error('Unauthorized'));

    render(
      <MemoryRouter>
        <OAuthSuccess />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(authApi.getMe).toHaveBeenCalledTimes(1);
    });

    expect(mockSetQueryData).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(PATH.login, { replace: true });
  });
});
