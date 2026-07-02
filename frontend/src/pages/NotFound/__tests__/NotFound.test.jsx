// src/pages/NotFound/__tests__/NotFound.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../design-system';
import NotFound from '../index';

import { PATH } from '../../../constants';

// ── محاكاة الـ react-router-dom ──────────────────────────────────────────────
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// ── محاكاة الـ react-i18next ──────────────────────────────────────────────────
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'common.notFound': 'الصفحة غير موجودة',
        'search.noResultsSub': 'عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.',
        'nav.home': 'الرئيسية',
        'common.back': 'رجوع',
        'nav.courses': 'الدورات',
        'nav.teachers': 'المعلمون',
        'nav.login': 'تسجيل الدخول',
      };
      return translations[key] || key;
    },
  }),
}));

// ── محاكاة الـ framer-motion لتفادي مشاكل الأنماط المتحركة في الاختبارات ──────────
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
}));

// ── Wrapper مشترك ─────────────────────────────────────────────────────────────
const renderNotFound = () =>
  render(
    <ThemeProvider theme={lightTheme}>
      <NotFound />
    </ThemeProvider>
  );

describe('NotFound Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص عرض محتوى الصفحة الأساسي (الرقم 404 ورسائل الخطأ)
  test('should render 404 visual number and error messages correctly', () => {
    renderNotFound();

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('الصفحة غير موجودة')).toBeInTheDocument();
    expect(screen.getByText('عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها.')).toBeInTheDocument();
  });

  // 2. فحص محاكي الـ Terminal
  test('should render terminal diagnostic error simulation', () => {
    renderNotFound();

    expect(screen.getByText(/Error: Route not found/)).toBeInTheDocument();
    expect(screen.getByText(/tawjihi navigate --path/)).toBeInTheDocument();
  });

  // 3. فحص زر الانتقال للرئيسية والعودة للخلف
  test('should navigate to home on home button click and navigate back on back click', () => {
    renderNotFound();

    const homeBtn = screen.getByText('الرئيسية');
    fireEvent.click(homeBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/');

    const backBtn = screen.getByText('رجوع');
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  // 4. فحص روابط الانتقال السريع المتعددة
  test('should navigate to correct routes on quick links click', () => {
    renderNotFound();

    const coursesLink = screen.getByText('الدورات');
    fireEvent.click(coursesLink);
    expect(mockNavigate).toHaveBeenCalledWith('/courses');

    const teachersLink = screen.getByText('المعلمون');
    fireEvent.click(teachersLink);
    expect(mockNavigate).toHaveBeenCalledWith('/teachers');

    const loginLink = screen.getByText('تسجيل الدخول');
    fireEvent.click(loginLink);
    expect(mockNavigate).toHaveBeenCalledWith(PATH.login);
  });
});
