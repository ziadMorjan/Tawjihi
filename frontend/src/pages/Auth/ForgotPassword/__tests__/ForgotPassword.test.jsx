import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../../design-system';
import ForgotPassword from '../index';
import { useForgotPassword } from '../../../../features/auth/hooks/useForgotPassword';

// 1. محاكاة هوك الصلاحيات والتحكم بحالات الواجهة لنسيان كلمة المرور
jest.mock('../../../../features/auth/hooks/useForgotPassword', () => ({
  useForgotPassword: jest.fn(),
}));

// 2. محاكاة الترجمة
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      if (key === 'validation.emailRequired') return 'Email is required';
      if (key === 'validation.codeRequired') return 'Code is required';
      if (key === 'validation.passwordRequired') return 'Password is required';
      return key;
    },
  }),
}));

describe('ForgotPassword Page Component', () => {
  const mockMutateEmail = jest.fn();
  const mockMutateCode = jest.fn();
  const mockMutatePassword = jest.fn();
  const mockSetStep = jest.fn();
  const mockSetErrorMessage = jest.fn();
  const mockSetShowPassword = jest.fn();

  const mockHookValues = {
    step: 1,
    setStep: mockSetStep,
    userEmail: 'ziad@example.com',
    showPassword: false,
    setShowPassword: mockSetShowPassword,
    errorMessage: null,
    setErrorMessage: mockSetErrorMessage,
    isRtl: false,
    forgotPasswordMutation: { mutate: mockMutateEmail, isPending: false },
    verifyCodeMutation: { mutate: mockMutateCode, isPending: false },
    resetPasswordMutation: { mutate: mockMutatePassword, isPending: false },
    t: (key) => key,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useForgotPassword.mockReturnValue(mockHookValues);
  });

  const renderForgotPassword = () => {
    return render(
      <ThemeProvider theme={lightTheme}>
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      </ThemeProvider>
    );
  };

  // 1. فحص الخطوة الأولى: إدخال البريد الإلكتروني
  test('should render Step 1 (Email Input) and submit successfully', async () => {
    renderForgotPassword();

    expect(screen.getByText('auth.forgotPasswordTitle')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.email')).toBeInTheDocument();

    // الكتابة والإرسال
    fireEvent.change(screen.getByLabelText('auth.email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('auth.sendCodeBtn'));

    await waitFor(() => {
      expect(mockMutateEmail).toHaveBeenCalledWith('test@example.com');
    });
  });

  // 2. فحص الخطوة الثانية: إدخال رمز التحقق والرجوع لتعديل البريد
  test('should render Step 2 (Verification Code) and handle submit and back actions', async () => {
    useForgotPassword.mockReturnValue({
      ...mockHookValues,
      step: 2,
    });

    renderForgotPassword();

    expect(screen.getByText('auth.verifyCodeTitle')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.verificationCodeLabel')).toBeInTheDocument();

    // إرسال الكود
    fireEvent.change(screen.getByLabelText('auth.verificationCodeLabel'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('auth.verifyCodeBtn'));

    await waitFor(() => {
      expect(mockMutateCode).toHaveBeenCalledWith('123456');
    });

    // الضغط على زر التعديل/الرجوع
    const backBtn = screen.getByText('auth.editEmail');
    fireEvent.click(backBtn);

    expect(mockSetStep).toHaveBeenCalledWith(1);
    expect(mockSetErrorMessage).toHaveBeenCalledWith(null);
  });

  // 3. فحص الخطوة الثالثة: إدخال كلمة المرور الجديدة وتغيير إظهارها
  test('should render Step 3 (Reset Password) and submit successfully', async () => {
    useForgotPassword.mockReturnValue({
      ...mockHookValues,
      step: 3,
    });

    renderForgotPassword();

    expect(screen.getByText('auth.newPasswordTitle')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.newPasswordLabel')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.newConfirmPasswordLabel')).toBeInTheDocument();

    // كتابة كلمة المرور وتأكيدها
    fireEvent.change(screen.getByLabelText('auth.newPasswordLabel'), { target: { value: 'NewPassword123!' } });
    fireEvent.change(screen.getByLabelText('auth.newConfirmPasswordLabel'), { target: { value: 'NewPassword123!' } });
    fireEvent.click(screen.getByText('auth.savePasswordBtn'));

    await waitFor(() => {
      expect(mockMutatePassword).toHaveBeenCalledWith({
        email: 'ziad@example.com',
        newPassword: 'NewPassword123!',
        newConfirmPassword: 'NewPassword123!',
      });
    });
  });
});
