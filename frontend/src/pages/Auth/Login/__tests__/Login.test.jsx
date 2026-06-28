import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../../design-system';
import Login from '../index';
import { useAuth, authApi } from '../../../../features/auth';

// 1. محاكاة التوجيه
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: { from: { pathname: '/dashboard' } }
  }),
}));

// 2. محاكاة الترجمة
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'validation.emailRequired') return 'Email is required';
      if (key === 'validation.passwordRequired') return 'Password is required';
      return key;
    },
  }),
}));

// 3. محاكاة هوك useAuth ودوال API الخاصة بـ auth
jest.mock('../../../../features/auth', () => {
  const original = jest.requireActual('../../../../features/auth');
  return {
    ...original,
    useAuth: jest.fn(),
    authApi: {
      ...original.authApi,
      googleAuth: jest.fn(),
    },
  };
});

describe('Login Page Component', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      login: mockLogin,
      isLoginLoading: false,
      loginError: null,
    });
  });

  // دالة مساعدة لرسم الصفحة مغلفة بالسياقات المطلوبة والتصميم
  const renderLogin = () => {
    return render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  // 1. فحص ظهور عناصر الواجهة الأساسية
  test('should render email and password inputs and headers', () => {
    renderLogin();

    expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
    expect(screen.getByText('auth.loginTitle')).toBeInTheDocument();
  });

  // 2. فحص التحقق من صحة الحقول الفارغة عند الإرسال
  test('should display validation error messages on empty submit', async () => {
    renderLogin();

    const submitBtn = screen.getByText('auth.loginBtn');
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  // 3. فحص تغيير نوع حقل كلمة المرور لرؤيتها وإخفائها
  test('should toggle password visibility on eye button click', () => {
    renderLogin();

    const passwordInput = screen.getByLabelText('auth.password');
    expect(passwordInput.type).toBe('password');

    // الضغط على زر العين
    const eyeBtn = screen.getByRole('button', { name: '' });
    fireEvent.click(eyeBtn);
    expect(passwordInput.type).toBe('text');

    fireEvent.click(eyeBtn);
    expect(passwordInput.type).toBe('password');
  });

  // 4. فحص الإرسال الناجح للنموذج واستدعاء دالة login
  test('should call login function and redirect on successful submit', async () => {
    mockLogin.mockResolvedValue({});

    renderLogin();

    const emailInput = screen.getByLabelText('auth.email');
    const passwordInput = screen.getByLabelText('auth.password');
    const submitBtn = screen.getByText('auth.loginBtn');

    fireEvent.change(emailInput, { target: { value: 'ziad@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'ziad@example.com',
        password: 'Password123!',
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  // 5. فحص ظهور بنر الخطأ عند فشل تسجيل الدخول
  test('should render error banner if loginError is provided by context', () => {
    useAuth.mockReturnValue({
      login: mockLogin,
      isLoginLoading: false,
      loginError: {
        response: {
          data: { message: 'بيانات الاعتماد غير صالحة' }
        }
      },
    });

    renderLogin();

    expect(screen.getByText('بيانات الاعتماد غير صالحة')).toBeInTheDocument();
  });

  // 6. فحص تسجيل الدخول بجوجل
  test('should trigger googleAuth API on Google button click', () => {
    renderLogin();

    const googleBtn = screen.getByText('auth.continueWithGoogle');
    fireEvent.click(googleBtn);

    expect(authApi.googleAuth).toHaveBeenCalledTimes(1);
  });
});
