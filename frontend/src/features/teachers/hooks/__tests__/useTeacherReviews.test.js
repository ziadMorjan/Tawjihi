// src/features/teachers/hooks/__tests__/useTeacherReviews.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useTeacherReviews, useAddTeacherReview, useDeleteTeacherReview } from '../useTeacherReviews';
import { teachersApi } from '../../api/teachersApi';

// ── محاكاة الـ API ────────────────────────────────────────────────────────────
jest.mock('../../api/teachersApi', () => ({
  teachersApi: {
    getReviews: jest.fn(),
    addReview: jest.fn(),
    deleteReview: jest.fn(),
  },
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// ── Wrapper مشترك ─────────────────────────────────────────────────────────────
let queryClient;
const createWrapper = () => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTeacherReviews Hooks Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const teacherId = 'teacher-123';
  const queryKey = ['teacherReviews', teacherId];
  const mockReviews = [
    { _id: 'rev-1', rating: 5, comment: 'شرح ممتاز' },
    { _id: 'rev-2', rating: 4, comment: 'جيد جداً' },
  ];

  // ── 1. اختبارات useTeacherReviews ───────────────────────────────────────────
  describe('useTeacherReviews Hook', () => {
    test('should NOT fetch reviews when teacherId is undefined', () => {
      const { result } = renderHook(() => useTeacherReviews(undefined), { wrapper: createWrapper() });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    test('should fetch and return reviews list on success', async () => {
      teachersApi.getReviews.mockResolvedValue({
        status: 'success',
        data: { docs: mockReviews },
      });

      const { result } = renderHook(() => useTeacherReviews(teacherId), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(2);
      expect(result.current.data[0].comment).toBe('شرح ممتاز');
    });
  });

  // ── 2. اختبارات useAddTeacherReview ──────────────────────────────────────────
  describe('useAddTeacherReview Hook', () => {
    test('should call addReview, invalidate queries, and show toast.success on success', async () => {
      const { toast } = require('react-toastify');
      teachersApi.addReview.mockResolvedValue({ status: 'success' });

      const wrapper = createWrapper();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useAddTeacherReview(teacherId), { wrapper });

      act(() => {
        result.current.mutate({ rating: 5, comment: 'رائع' });
      });

      await waitFor(() => {
        expect(teachersApi.addReview).toHaveBeenCalledWith({ teacherId, rating: 5, comment: 'رائع' });
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['teacherReviews', teacherId] });
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['teachers', teacherId] });
        expect(toast.success).toHaveBeenCalledWith('تم إضافة تقييمك بنجاح');
      });
    });

    test('should show toast.error on failure', async () => {
      const { toast } = require('react-toastify');
      const errResponse = { response: { data: { message: 'لقد قمت بالتقييم سابقاً' } } };
      teachersApi.addReview.mockRejectedValue(errResponse);

      const { result } = renderHook(() => useAddTeacherReview(teacherId), { wrapper: createWrapper() });

      act(() => {
        result.current.mutate({ rating: 5, comment: 'رائع' });
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('لقد قمت بالتقييم سابقاً');
      });
    });
  });

  // ── 3. اختبارات useDeleteTeacherReview ───────────────────────────────────────
  describe('useDeleteTeacherReview Hook', () => {
    test('should optimistically filter out review from cache on delete', async () => {
      teachersApi.deleteReview.mockReturnValue(new Promise(() => {}));

      const wrapper = createWrapper();
      queryClient.setQueryData(queryKey, mockReviews);

      // Register active observer to prevent garbage collection (due to gcTime: 0)
      renderHook(() => useTeacherReviews(teacherId), { wrapper });

      const { result } = renderHook(() => useDeleteTeacherReview(teacherId), { wrapper });

      act(() => {
        result.current.mutate('rev-1');
      });

      await waitFor(() => {
        const cached = queryClient.getQueryData(queryKey);
        expect(cached).toHaveLength(1);
        expect(cached[0]._id).toBe('rev-2');
      });
    });

    test('should rollback cache if deleteReview fails', async () => {
      const { toast } = require('react-toastify');
      teachersApi.deleteReview.mockRejectedValue(new Error('Delete error'));

      const wrapper = createWrapper();
      queryClient.setQueryData(queryKey, mockReviews);
      
      // Register active observer to keep query in cache during invalidation
      renderHook(() => useTeacherReviews(teacherId), { wrapper });

      const { result } = renderHook(() => useDeleteTeacherReview(teacherId), { wrapper });

      act(() => {
        result.current.mutate('rev-1');
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('حدث خطأ أثناء الحذف');
      });

      const cached = queryClient.getQueryData(queryKey);
      expect(cached).toHaveLength(2);
      expect(cached[0]._id).toBe('rev-1');
    });

    test('should invalidate reviews query cache and show toast.success on settled', async () => {
      const { toast } = require('react-toastify');
      teachersApi.deleteReview.mockResolvedValue();

      const wrapper = createWrapper();
      const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
      queryClient.setQueryData(queryKey, mockReviews);

      // Register active observer
      renderHook(() => useTeacherReviews(teacherId), { wrapper });

      const { result } = renderHook(() => useDeleteTeacherReview(teacherId), { wrapper });

      act(() => {
        result.current.mutate('rev-1');
      });

      await waitFor(() => {
        expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['teacherReviews', teacherId] });
        expect(toast.success).toHaveBeenCalledWith('تم حذف التقييم');
      });
    });
  });
});
