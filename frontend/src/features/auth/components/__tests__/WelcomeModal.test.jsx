import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { WelcomeModal } from '../WelcomeModal';
import { useAuth } from '../../context/AuthContext';
import { welcomeApi } from '../../api/welcomeApi';
import { PATH } from '../../../../constants';

// 1. محاكاة التوجيه (react-router-dom)
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 2. محاكاة Framer Motion لتفادي مشاكل الأنميشن في بيئة الاختبار
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 3. محاكاة هوك اللغة والترجمة
jest.mock('../../../../shared/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key, options) => {
      if (key === 'welcomeModal.title') return `Welcome${options?.name || ''}`;
      if (key === 'welcomeModal.discountBadge') return `${options?.discount}% OFF`;
      if (key === 'welcomeModal.expire') return `Expires: ${options?.date}`;
      return key;
    },
    isAr: false,
  }),
}));

// 4. محاكاة هوك الصلاحيات useAuth
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// 5. محاكاة الـ API الخاص بترحيب المستخدم
jest.mock('../../api/welcomeApi', () => ({
  welcomeApi: {
    markWelcomeSeen: jest.fn(),
  },
}));

describe('WelcomeModal Component', () => {
  const mockClearWelcomeReward = jest.fn();
  const mockWelcomeReward = {
    coupon: 'Tawjihi10',
    discount: 10,
    expire: '2026-12-31T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // إعداد محاكاة الحافظة (Clipboard)
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  // 1. فحص عدم ظهور المودال في حال لا توجد جائزة
  test('should not render anything when welcomeReward is null', () => {
    useAuth.mockReturnValue({
      user: { name: 'Ziad' },
      welcomeReward: null,
      clearWelcomeReward: mockClearWelcomeReward,
    });

    const { container } = render(
      <MemoryRouter>
        <WelcomeModal />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  // 2. فحص ظهور بيانات الجائزة بالكامل للمستخدم
  test('should render welcome title, coupon, discount, and expire date', () => {
    useAuth.mockReturnValue({
      user: { name: 'Ziad' },
      welcomeReward: mockWelcomeReward,
      clearWelcomeReward: mockClearWelcomeReward,
    });

    render(
      <MemoryRouter>
        <WelcomeModal />
      </MemoryRouter>
    );

    expect(screen.getByText('Welcome, Ziad')).toBeInTheDocument();
    expect(screen.getByText('Tawjihi10')).toBeInTheDocument();
    expect(screen.getByText('10% OFF')).toBeInTheDocument();
    // نتحقق من وجود تاريخ انتهاء الصلاحية المنسق
    expect(screen.getByText(/Expires:/)).toBeInTheDocument();
  });

  // 3. فحص نسخ الكود للمحافظة عند الضغط عليه
  test('should copy coupon to clipboard on coupon click', async () => {
    useAuth.mockReturnValue({
      user: { name: 'Ziad' },
      welcomeReward: mockWelcomeReward,
      clearWelcomeReward: mockClearWelcomeReward,
    });

    render(
      <MemoryRouter>
        <WelcomeModal />
      </MemoryRouter>
    );

    const couponElement = screen.getByText('Tawjihi10');
    fireEvent.click(couponElement);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Tawjihi10');
    // التأكد من ظهور كلمة تم النسخ (welcomeModal.copiedHint)
    expect(screen.getByText('welcomeModal.copiedHint')).toBeInTheDocument();
  });

  // 4. فحص إغلاق المودال من زر الإغلاق ودعوة الـ API
  test('should close modal, mark welcome seen, and clear reward on close click', async () => {
    useAuth.mockReturnValue({
      user: { name: 'Ziad' },
      welcomeReward: mockWelcomeReward,
      clearWelcomeReward: mockClearWelcomeReward,
    });
    welcomeApi.markWelcomeSeen.mockResolvedValue({});

    render(
      <MemoryRouter>
        <WelcomeModal />
      </MemoryRouter>
    );

    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);

    expect(welcomeApi.markWelcomeSeen).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(mockClearWelcomeReward).toHaveBeenCalledTimes(1);
    });
  });

  // 5. فحص الإغلاق عند الضغط على زر الهروب (Escape)
  test('should close modal on Escape key press', async () => {
    useAuth.mockReturnValue({
      user: { name: 'Ziad' },
      welcomeReward: mockWelcomeReward,
      clearWelcomeReward: mockClearWelcomeReward,
    });
    welcomeApi.markWelcomeSeen.mockResolvedValue({});

    render(
      <MemoryRouter>
        <WelcomeModal />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });

    expect(welcomeApi.markWelcomeSeen).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(mockClearWelcomeReward).toHaveBeenCalledTimes(1);
    });
  });

  // 6. فحص الانتقال لصفحة المسارات عند الضغط على الزر الرئيسي
  test('should redirect to courses, mark welcome seen, and clear reward on primary action', async () => {
    useAuth.mockReturnValue({
      user: { name: 'Ziad' },
      welcomeReward: mockWelcomeReward,
      clearWelcomeReward: mockClearWelcomeReward,
    });
    welcomeApi.markWelcomeSeen.mockResolvedValue({});

    render(
      <MemoryRouter>
        <WelcomeModal />
      </MemoryRouter>
    );

    const primaryBtn = screen.getByText('welcomeModal.primaryBtn');
    fireEvent.click(primaryBtn);

    expect(welcomeApi.markWelcomeSeen).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(mockClearWelcomeReward).toHaveBeenCalledTimes(1);
    });
    expect(mockNavigate).toHaveBeenCalledWith(PATH.courses);
  });
});
