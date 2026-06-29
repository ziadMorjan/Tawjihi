import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useCoursesFilters } from '../useCoursesFilters';

// ── المغلف الوهمي — يحتاج MemoryRouter لأن الهوك يستخدم useSearchParams ──
const wrapper = ({ children }) => (
  <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
);

describe('useCoursesFilters Hook', () => {
  // 1. فحص القيم الافتراضية عند بدء الهوك
  test('should initialize with default filter values', () => {
    const { result } = renderHook(() => useCoursesFilters(), { wrapper });

    expect(result.current.filters.keyword).toBe('');
    expect(result.current.filters.subject).toBe('');
    expect(result.current.filters.branch).toBe('');
    expect(result.current.filters.sort).toBe('-createdAt');
    expect(result.current.filters.page).toBe(1);
    expect(result.current.filters.limit).toBe(9);
  });

  // 2. فحص أن hasActiveFilters يرجع false بالقيم الافتراضية
  test('should return hasActiveFilters as false when no filters are set', () => {
    const { result } = renderHook(() => useCoursesFilters(), { wrapper });

    expect(result.current.hasActiveFilters).toBe(false);
  });

  // 3. فحص setFilter — تغيير الـ keyword ويرجع الـ page للأول
  test('should update keyword filter and reset page to 1', () => {
    const { result } = renderHook(() => useCoursesFilters(), { wrapper });

    act(() => {
      result.current.setFilter('page', '3'); // نروح للصفحة 3 أولاً
    });

    act(() => {
      result.current.setFilter('keyword', 'رياضيات'); // ثم نغير الـ keyword
    });

    expect(result.current.filters.keyword).toBe('رياضيات');
    // أي تغيير في الفلتر يرجع الـ page للأول
    expect(result.current.filters.page).toBe(1);
  });

  // 4. فحص setFilter — تغيير الـ sort
  test('should update sort filter', () => {
    const { result } = renderHook(() => useCoursesFilters(), { wrapper });

    act(() => {
      result.current.setFilter('sort', 'price');
    });

    expect(result.current.filters.sort).toBe('price');
  });

  // 5. فحص setFilter بقيمة فارغة — يحذف الـ param من الـ URL
  test('should remove filter param from URL when value is empty', () => {
    const { result } = renderHook(() => useCoursesFilters(), { wrapper });

    act(() => {
      result.current.setFilter('keyword', 'فيزياء');
    });
    expect(result.current.filters.keyword).toBe('فيزياء');

    act(() => {
      result.current.setFilter('keyword', ''); // تفريغ الفلتر
    });
    expect(result.current.filters.keyword).toBe('');
  });

  // 6. فحص hasActiveFilters يرجع true عند وجود keyword
  test('should return hasActiveFilters as true when keyword is set', () => {
    const { result } = renderHook(() => useCoursesFilters(), { wrapper });

    act(() => {
      result.current.setFilter('keyword', 'كيمياء');
    });

    expect(result.current.hasActiveFilters).toBe(true);
  });

  // 7. فحص hasActiveFilters يرجع true عند تغيير الـ sort
  test('should return hasActiveFilters as true when sort is changed', () => {
    const { result } = renderHook(() => useCoursesFilters(), { wrapper });

    act(() => {
      result.current.setFilter('sort', 'price');
    });

    expect(result.current.hasActiveFilters).toBe(true);
  });

  // 8. فحص setPage — تغيير الـ page مباشرة
  test('should update page correctly using setPage', () => {
    const { result } = renderHook(() => useCoursesFilters(), { wrapper });

    act(() => {
      result.current.setPage(4);
    });

    expect(result.current.filters.page).toBe(4);
  });

  // 9. فحص clearFilters — مسح كل الفلاتر وإعادة الحالة الافتراضية
  test('should clear all filters and reset to defaults on clearFilters', () => {
    const { result } = renderHook(() => useCoursesFilters(), { wrapper });

    // نضع فلاتر متعددة
    act(() => {
      result.current.setFilter('keyword', 'فيزياء');
    });
    act(() => {
      result.current.setFilter('subject', '123');
    });
    act(() => {
      result.current.setFilter('sort', 'price');
    });

    // نتأكد أن الفلاتر ضُبطت
    expect(result.current.hasActiveFilters).toBe(true);

    // الآن نمسح كل شيء
    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters.keyword).toBe('');
    expect(result.current.filters.subject).toBe('');
    expect(result.current.filters.sort).toBe('-createdAt');
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
