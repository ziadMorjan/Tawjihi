// src/features/lessons/components/AISummary/__tests__/AISummary.test.jsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../../../design-system';
import AISummary from '../index';

// ── محاكاة الترجمة ────────────────────────────────────────────────────────────
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);

const renderAISummary = (props) =>
  render(
    <ThemeProvider theme={lightTheme}>
      <AISummary {...props} />
    </ThemeProvider>
  );

describe('AISummary Component', () => {
  const originalClipboard = navigator.clipboard;

  beforeAll(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
      writable: true,
    });
  });

  afterAll(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // 1. فحص حالة توليد الملخص (التحميل الذكي)
  test('should render spinner and generating text when isGenerating is true', () => {
    renderAISummary({ isGenerating: true });

    expect(screen.getByText('aiSummary.generating')).toBeInTheDocument();
    expect(screen.queryByText('aiSummary.generateBtn')).not.toBeInTheDocument();
  });

  // 2. فحص حالة الملخص الفارغ (زر التوليد)
  test('should render generate button when summary is empty and isGenerating is false', () => {
    const mockOnGenerate = jest.fn();
    renderAISummary({ summary: '', isGenerating: false, onGenerate: mockOnGenerate });

    const btn = screen.getByText('aiSummary.generateBtn');
    expect(btn).toBeInTheDocument();

    fireEvent.click(btn);
    expect(mockOnGenerate).toHaveBeenCalledTimes(1);
  });

  // 3. فحص عرض الملخص المكتوب بـ Markdown
  test('should render markdown summary when summary is provided', () => {
    const markdownSummary = '# مقدمة\n* نقطة 1\n* نقطة 2';
    renderAISummary({ summary: markdownSummary, isGenerating: false });

    expect(screen.getByText('aiSummary.title')).toBeInTheDocument();
    expect(screen.getByText(/مقدمة/)).toBeInTheDocument();
    expect(screen.getByText(/نقطة 1/)).toBeInTheDocument();
  });

  // 4. فحص زر نسخ النص ونسخ محتوى الحافظة
  test('should copy summary text to clipboard and change button state', async () => {
    const mockSummary = 'هذا النص ملخص للدرس';
    renderAISummary({ summary: mockSummary, isGenerating: false });

    const copyBtn = screen.getByText('aiSummary.copyBtn');
    expect(copyBtn).toBeInTheDocument();

    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockSummary);
    expect(screen.getByText('aiSummary.copied')).toBeInTheDocument();

    // فحص عودة الزر لحالته بعد ثانيتين
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('aiSummary.copyBtn')).toBeInTheDocument();
  });
});
