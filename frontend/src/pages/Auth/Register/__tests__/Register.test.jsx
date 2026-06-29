import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../../design-system';
import Register from '../index';
import { useAuth } from '../../../../features/auth';
import { PATH } from '../../../../constants';

// 1. محاكاة التوجيه
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 2. محاكاة الترجمة والتحقق
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'validation.nameRequired') return 'Name is required';
      if (key === 'validation.emailRequired') return 'Email is required';
      if (key === 'validation.passwordRequired') return 'Password is required';
      if (key === 'validation.cvRequired') return 'CV is required';
      return key;
    },
  }),
}));

// 3. محاكاة هوك الصلاحيات والاتصال بـ auth
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

describe('Register Page Component', () => {
  const mockRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      register: mockRegister,
      isRegisterLoading: false,
      registerError: null,
    });
  });

  const renderRegister = () => {
    return render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  // 1. فحص ظهور عناصر الواجهة الافتراضية للطلاب
  test('should render registration form fields for student by default', () => {
    renderRegister();

    expect(screen.getByLabelText('auth.name')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.email')).toBeInTheDocument();
    expect(screen.getByLabelText('profile.phoneLabel')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.password')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.confirmPassword')).toBeInTheDocument();
    expect(screen.queryByText('auth.uploadCv')).not.toBeInTheDocument();
  });

  // 2. فحص التحويل لدور معلم وظهور حقل الـ CV
  test('should show CV upload field and warning badge when teacher role is selected', () => {
    renderRegister();

    const teacherBtn = screen.getByText('auth.teacherRole');
    fireEvent.click(teacherBtn);

    expect(screen.getByText('auth.teacherPendingApproval')).toBeInTheDocument();
    expect(screen.getByText('auth.uploadCv')).toBeInTheDocument();
  });

  // 3. فحص إظهار رسائل التحقق عند إرسال نموذج فارغ
  test('should display validation error messages on empty submit', async () => {
    renderRegister();

    const submitBtn = screen.getByText('auth.registerBtn');
    fireEvent.click(submitBtn);

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  // 4. فحص نجاح تسجيل حساب طالب والتوجيه للصفحة الرئيسية
  test('should call registerUser and redirect to home on successful student submit', async () => {
    mockRegister.mockResolvedValue({});

    renderRegister();

    fireEvent.change(screen.getByLabelText('auth.name'), { target: { value: 'Ziad Student' } });
    fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'student@example.com' } });
    fireEvent.change(screen.getByLabelText('profile.phoneLabel'), { target: { value: '0599111222' } });
    fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('auth.confirmPassword'), { target: { value: 'Password123!' } });

    const submitBtn = screen.getByText('auth.registerBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Ziad Student',
        email: 'student@example.com',
        phone: '0599111222',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        role: 'user',
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // 5. فحص نجاح تسجيل معلم مع رفع ملف CV والتوجيه لصفحة تسجيل الدخول
  test('should call registerUser with FormData and redirect on successful teacher submit', async () => {
    mockRegister.mockResolvedValue({});

    renderRegister();

    // اختيار دور المعلم
    const teacherBtn = screen.getByText('auth.teacherRole');
    fireEvent.click(teacherBtn);

    fireEvent.change(screen.getByLabelText('auth.name'), { target: { value: 'Ziad Teacher' } });
    fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'teacher@example.com' } });
    fireEvent.change(screen.getByLabelText('profile.phoneLabel'), { target: { value: '0599222333' } });
    fireEvent.change(screen.getByLabelText('auth.password'), { target: { value: 'Password123!' } });
    fireEvent.change(screen.getByLabelText('auth.confirmPassword'), { target: { value: 'Password123!' } });

    // محاكاة رفع ملف PDF
    const file = new File(['dummy content'], 'cv.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText('auth.uploadCv');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const submitBtn = screen.getByText('auth.registerBtn');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });

    // نتأكد من أن المعامل الممرر هو FormData يحتوي على الملف والدور
    const passedArg = mockRegister.mock.calls[0][0];
    expect(passedArg).toBeInstanceOf(FormData);
    expect(passedArg.get('name')).toBe('Ziad Teacher');
    expect(passedArg.get('role')).toBe('teacher');
    expect(passedArg.get('cv')).toBeDefined();

    expect(mockNavigate).toHaveBeenCalledWith(PATH.login, {
      state: { message: 'auth.teacherRequestSent' },
    });
  });
});
