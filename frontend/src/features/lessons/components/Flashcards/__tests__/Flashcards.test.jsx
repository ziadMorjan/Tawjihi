// src/features/lessons/components/Flashcards/__tests__/Flashcards.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../../../design-system';
import Flashcards from '../index';

// ── محاكاة الـ useLanguage hook ──────────────────────────────────────────────
let mockIsAr = true;
jest.mock('../../../../../shared/hooks/useLanguage', () => ({
  useLanguage: () => ({
    t: (key, options) => {
      if (key === 'flashcards.progress') {
        return `Progress: ${options?.current}/${options?.total}`;
      }
      return key;
    },
    isAr: mockIsAr,
  }),
}));

const renderFlashcards = (props) =>
  render(
    <ThemeProvider theme={lightTheme}>
      <Flashcards {...props} />
    </ThemeProvider>
  );

// بطاقات تجريبية
const mockFlashcards = [
  { front: 'ما هو التفاضل؟', back: 'حساب معدل التغير اللحظي للدالة.' },
  { front: 'ما هو التكامل؟', back: 'حساب المساحة تحت المنحنى.' },
];

describe('Flashcards Component', () => {
  beforeEach(() => {
    mockIsAr = true;
    jest.clearAllMocks();
  });

  // 1. فحص حالة عدم وجود بطاقات
  test('should render empty state when flashcards list is empty', () => {
    renderFlashcards({ flashcards: [] });

    expect(screen.getByText('flashcards.generateFirst')).toBeInTheDocument();
  });

  // 2. فحص تحميل البطاقة الأولى والواجهة الأمامية بشكل افتراضي
  test('should display front side of the first card by default', () => {
    renderFlashcards({ flashcards: mockFlashcards });

    expect(screen.getByText('ما هو التفاضل؟')).toBeInTheDocument();
    expect(screen.getByText('Progress: 1/2')).toBeInTheDocument();
  });

  // 3. فحص قلب البطاقة عند الضغط عليها لعرض الواجهة الخلفية
  test('should flip card to show back content when clicked', () => {
    renderFlashcards({ flashcards: mockFlashcards });

    const card = screen.getByText('ما هو التفاضل؟');

    // الضغط لقلب البطاقة
    fireEvent.click(card);

    // التحقق من ظهور النص الخلفي
    expect(screen.getByText('حساب معدل التغير اللحظي للدالة.')).toBeInTheDocument();
  });

  // 4. فحص زر التالي والسابق في الواجهة العربية (RTL)
  test('should navigate between cards correctly using control buttons in RTL', () => {
    mockIsAr = true;
    renderFlashcards({ flashcards: mockFlashcards });

    // في RTL: الزر الأيمن ينقل للتالي (index 1) والزر الأيسر يرجع للسابق
    // الزر الأيمن هو ChevronRight (مفتوح للتالي)
    const nextBtn = screen.getAllByRole('button')[0]; // الزر الأول (ChevronRight)
    const prevBtn = screen.getAllByRole('button')[1]; // الزر الثاني (ChevronLeft)

    expect(prevBtn).toBeDisabled(); // لا يوجد سابق في البداية

    fireEvent.click(nextBtn);

    expect(screen.getByText('ما هو التكامل؟')).toBeInTheDocument();
    expect(screen.getByText('Progress: 2/2')).toBeInTheDocument();

    expect(nextBtn).toBeDisabled(); // لا يوجد تالي الآن
    expect(prevBtn).not.toBeDisabled();

    // العودة للوراء
    fireEvent.click(prevBtn);
    expect(screen.getByText('ما هو التفاضل؟')).toBeInTheDocument();
  });

  // 5. فحص إلغاء حالة القلب (Flipped) تلقائياً عند الانتقال لبطاقة جديدة
  test('should reset flip state when moving to next card', () => {
    renderFlashcards({ flashcards: mockFlashcards });

    const card = screen.getByText('ما هو التفاضل؟');
    fireEvent.click(card); // flipped = true

    // الانتقال للبطاقة التالية
    const nextBtn = screen.getAllByRole('button')[0];
    fireEvent.click(nextBtn);

    // التأكد من أن البطاقة التالية تبدأ بـ flipped = false
    const currentCardContainer = document.querySelector('.flipped');
    expect(currentCardContainer).toBeNull();
  });
});
