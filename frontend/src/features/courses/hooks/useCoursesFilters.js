// src/features/courses/hooks/useCoursesFilters.js
//
// 🔴 [مشكلة في الكود القديم] الـ filtering كان عبر 3 contexts منفصلة
// SearchContext + NewOldContext + DataCourses
// الحل: كل شيء في الـ URL — قابل للمشاركة، قابل للـ back button

import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useCoursesFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // قراءة القيم الحالية من الـ URL
  const filters = {
    keyword:  searchParams.get('keyword')  || '',
    subject:  searchParams.get('subject')  || '',
    branch:   searchParams.get('branch')   || '',
    sort:     searchParams.get('sort')     || '-createdAt',
    page:     parseInt(searchParams.get('page') || '1', 10),
    limit:    12,
  };

  // تحديث param واحد مع إعادة الـ page للأول
  const setFilter = useCallback((key, value) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      // أي تغيير في الفلتر يرجعنا للصفحة الأولى
      if (key !== 'page') next.set('page', '1');
      return next;
    });
  }, [setSearchParams]);

  const setPage = useCallback((page) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('page', String(page));
      return next;
    });
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  const hasActiveFilters = !!(
    filters.keyword ||
    filters.subject ||
    filters.branch  ||
    filters.sort !== '-createdAt'
  );

  return {
    filters,
    setFilter,
    setPage,
    clearFilters,
    hasActiveFilters,
  };
}