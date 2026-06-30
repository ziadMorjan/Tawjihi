// src/features/courses/components/CourseCard/__tests__/StarRating.test.jsx
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../../../../../design-system';
import { StarRating, calculateStars } from '../StarRating';

// ── دالة مساعدة لرسم المكون مع الـ Theme ─────────────────────────────────────
const renderStarRating = (props) =>
  render(
    <ThemeProvider theme={lightTheme}>
      <StarRating {...props} />
    </ThemeProvider>
  );

// ── اختبارات الـ Pure Function أولاً (calculateStars) ────────────────────────
describe('calculateStars (pure utility function)', () => {
  // 1. تقييم صفر — 5 نجوم فارغة
  test('should return 0 full, 0 half, 5 empty for rating 0', () => {
    expect(calculateStars(0)).toEqual({ full: 0, half: false, empty: 5 });
  });

  // 2. تقييم 5 — 5 نجوم كاملة
  test('should return 5 full, 0 half, 0 empty for rating 5', () => {
    expect(calculateStars(5)).toEqual({ full: 5, half: false, empty: 0 });
  });

  // 3. تقييم 3.5 — 3 كاملة + نصف + واحدة فارغة
  test('should return 3 full, 1 half, 1 empty for rating 3.5', () => {
    expect(calculateStars(3.5)).toEqual({ full: 3, half: true, empty: 1 });
  });

  // 4. تقييم 4.7 — يُعامَل كـ 4 نجوم كاملة + نصف
  test('should return 4 full, 1 half, 0 empty for rating 4.7', () => {
    expect(calculateStars(4.7)).toEqual({ full: 4, half: true, empty: 0 });
  });

  // 5. تقييم 2.3 — يُعامَل كـ 2 كاملة بدون نصف
  test('should return 2 full, 0 half, 3 empty for rating 2.3', () => {
    expect(calculateStars(2.3)).toEqual({ full: 2, half: false, empty: 3 });
  });

  // 6. تقييم 1 — نجمة كاملة واحدة
  test('should return 1 full, 0 half, 4 empty for rating 1', () => {
    expect(calculateStars(1)).toEqual({ full: 1, half: false, empty: 4 });
  });
});

// ── اختبارات المكون (StarRating) ─────────────────────────────────────────────
describe('StarRating Component', () => {
  // 7. فحص ظهور نص التقييم الرقمي بشكل افتراضي
  test('should render rating text by default (showText=true)', () => {
    renderStarRating({ rating: 4.5 });

    // المكون يعرض التقييم بين قوسين مثل: (4.5)
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
  });

  // 8. فحص إخفاء نص التقييم عند showText=false
  test('should hide rating text when showText is false', () => {
    renderStarRating({ rating: 4.5, showText: false });

    expect(screen.queryByText('(4.5)')).not.toBeInTheDocument();
  });

  // 9. فحص ظهور 5 نجوم عند تقييم صفر
  test('should render 5 star elements for rating 0', () => {
    renderStarRating({ rating: 0 });

    // يجب أن يكون هناك نجوم في الـ DOM
    const stars = document.querySelectorAll('svg');
    expect(stars.length).toBe(5);
  });

  // 10. فحص ظهور التقييم الافتراضي (0) عند عدم تمرير rating
  test('should render with default rating of 0 when no rating prop is passed', () => {
    renderStarRating({});

    expect(screen.getByText('(0.0)')).toBeInTheDocument();
  });

  // 11. فحص إجمالي النجوم دائماً يساوي 5
  test('should always render exactly 5 stars total for any rating', () => {
    const ratings = [0, 1, 2.5, 3, 4.5, 5];

    ratings.forEach((rating) => {
      const { full, half, empty } = calculateStars(rating);
      expect(full + (half ? 1 : 0) + empty).toBe(5);
    });
  });
});
