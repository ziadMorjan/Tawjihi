// src/pages/EditProfile/__tests__/EditProfile.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../design-system';
import EditProfile from '../index';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
const mockNavigate = jest.fn();
const mockMutateAsync = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('../../../shared/components/layout/MainLayout', () => ({
  MainLayout: ({ children }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('../../../features/auth', () => ({
  useAuth: () => ({
    user: {
      name: 'زيد مرجان',
      email: 'ziad@tawjihi.com',
      phone: '0599000000',
      bio: 'طالب علمي',
      coverImage: null,
    },
  }),
}));

jest.mock('../../../features/user', () => ({
  useUpdateProfile: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

const renderEditProfile = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <MemoryRouter>
        <EditProfile />
      </MemoryRouter>
    </ThemeProvider>
  );
};

describe('EditProfile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص تعبئة قيم الإدخال الافتراضية ببيانات المستخدم الحالية
  test('should pre-populate form fields with current user data', () => {
    renderEditProfile();

    expect(screen.getByLabelText('auth.name')).toHaveValue('زيد مرجان');
    expect(screen.getByLabelText('auth.email')).toHaveValue('ziad@tawjihi.com');
    expect(screen.getByLabelText('profile.phoneLabel')).toHaveValue('0599000000');
    expect(screen.getByLabelText('profile.bioLabel')).toHaveValue('طالب علمي');
  });

  // 2. فحص التحقق من صحة المدخلات المطلوبة (الاسم والبريد الإلكتروني)
  test('should show validation errors when required fields are cleared', async () => {
    renderEditProfile();

    const nameInput = screen.getByLabelText('auth.name');
    const emailInput = screen.getByLabelText('auth.email');

    // تفريغ الحقول المطلوبة
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: '' } });

    const saveBtn = screen.getByText('profile.saveChanges');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.getByText('profile.nameRequired')).toBeInTheDocument();
    });

        await waitFor(() => {
      expect(screen.getByText('profile.emailRequired')).toBeInTheDocument();
    });
  });

  

  // 3. فحص التوجيه للخلف عند الضغط على زر إلغاء الأمر
  test('should navigate to profile page on cancel click', () => {
    renderEditProfile();

    const cancelBtn = screen.getByText('profile.cancel');
    fireEvent.click(cancelBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/user/profile');
  });

  // 4. فحص استدعاء mutateAsync عند الضغط على زر حفظ التغييرات بقيم صحيحة
  test('should call update mutation with FormData and redirect on valid submit', async () => {
    mockMutateAsync.mockResolvedValue({ status: 'success' });
    renderEditProfile();

    const nameInput = screen.getByLabelText('auth.name');
    fireEvent.change(nameInput, { target: { value: 'زيد مرجان المعدل' } });

    const saveBtn = screen.getByText('profile.saveChanges');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1);
    });

    // التأكد من تمرير FormData يحتوي على الاسم المعدل
    const fd = mockMutateAsync.mock.calls[0][0];
    expect(fd).toBeInstanceOf(FormData);
    expect(fd.get('name')).toBe('زيد مرجان المعدل');
    expect(fd.get('email')).toBe('ziad@tawjihi.com');

    // التوجيه التلقائي للملف الشخصي بعد النجاح
    expect(mockNavigate).toHaveBeenCalledWith('/user/profile');
  });
});
