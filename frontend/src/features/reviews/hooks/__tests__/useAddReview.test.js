// src/features/reviews/hooks/__tests__/useAddReview.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAddReview } from '../useAddReview';
import { reviewsApi } from '../../api/reviewsApi';
import { REVIEWS_QUERY_KEY } from '../useReviews';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
jest.mock('../../api/reviewsApi', () => ({
  reviewsApi: {
    addReview: jest.fn(),
  },
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// ── Wrapper ───────────────────────────────────────────────────────────────────
let queryClient;
const createWrapper = () => {
  queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAddReview Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص استدعاء الـ API بالمعطيات الصحيحة
  test('should call reviewsApi.addReview with correct parameters', async () => {
    reviewsApi.addReview.mockResolvedValue({ status: 'success' });

    const { result } = renderHook(() => useAddReview('course-123'), { wrapper: createWrapper() });

    const payload = { courseId: 'course-123', rating: 5, review: 'تقييم رائع' };

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(reviewsApi.addReview).toHaveBeenCalledWith(payload, expect.anything());
    });
  });

  // 2. فحص إبطال كاش التقييمات وإظهار toast.success عند النجاح
  test('should invalidate reviews cache and show toast.success on success', async () => {
    const { toast } = require('react-toastify');
    reviewsApi.addReview.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useAddReview('course-123'), { wrapper });

    act(() => {
      result.current.mutate({ courseId: 'course-123', rating: 5, review: 'تقييم رائع' });
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: [...REVIEWS_QUERY_KEY, 'course-123'],
      });
      expect(toast.success).toHaveBeenCalledWith('تم إضافة تقييمك بنجاح');
    });
  });

  // 3. فحص إظهار toast.error عند الفشل
  test('should show toast.error on failure', async () => {
    const { toast } = require('react-toastify');
    const errorResponse = {
      response: {
        data: { message: 'لقد قمت بتقييم هذه الدورة مسبقاً' },
      },
    };
    reviewsApi.addReview.mockRejectedValue(errorResponse);

    const { result } = renderHook(() => useAddReview('course-123'), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ courseId: 'course-123', rating: 5, review: 'تقييم' });
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('لقد قمت بتقييم هذه الدورة مسبقاً');
    });
  });
});
