// src/features/theme/__tests__/ThemeContext.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeModeProvider, useThemeMode } from '../ThemeContext';

// ── مكون تجريبي لاستخدام الهوك ────────────────────────────────────────────────
const ThemeTestComponent = () => {
  const { isDark, toggle } = useThemeMode();
  return (
    <div>
      <span data-testid="theme-status">{isDark ? 'dark' : 'light'}</span>
      <button onClick={toggle}>Toggle Theme</button>
    </div>
  );
};

describe('ThemeContext (ThemeModeProvider & useThemeMode)', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  // 1. فحص القيمة الافتراضية (light) عند غياب القيمة في localStorage
  test('should default to light theme when localStorage is empty', () => {
    render(
      <ThemeModeProvider>
        <ThemeTestComponent />
      </ThemeModeProvider>
    );

    expect(screen.getByTestId('theme-status').textContent).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  // 2. فحص قراءة القيمة من localStorage عند البداية
  test('should initialize with dark theme if stored in localStorage', () => {
    localStorage.setItem('tawjihi-theme', 'dark');

    render(
      <ThemeModeProvider>
        <ThemeTestComponent />
      </ThemeModeProvider>
    );

    expect(screen.getByTestId('theme-status').textContent).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  // 3. فحص تغيير الوضع وحفظه في الـ localStorage وتحديث السمة بالصفحة
  test('should toggle theme and update localStorage and document attributes', () => {
    render(
      <ThemeModeProvider>
        <ThemeTestComponent />
      </ThemeModeProvider>
    );

    const btn = screen.getByText('Toggle Theme');

    // التغيير إلى dark
    fireEvent.click(btn);
    expect(screen.getByTestId('theme-status').textContent).toBe('dark');
    expect(localStorage.getItem('tawjihi-theme')).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // العودة إلى light
    fireEvent.click(btn);
    expect(screen.getByTestId('theme-status').textContent).toBe('light');
    expect(localStorage.getItem('tawjihi-theme')).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  // 4. فحص إرجاع خطأ عند استدعاء الهوك خارج الـ Provider
  test('should throw error when useThemeMode is used outside ThemeModeProvider', () => {
    // كتم خطأ console.error المتوقع أثناء فحص رمي الاستثناء
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ThemeTestComponent />);
    }).toThrow('useThemeMode must be used within ThemeModeProvider');

    consoleErrorSpy.mockRestore();
  });
});
