// src/features/reviews/hooks/__tests__/useDeleteReview.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteReview } from '../useDeleteReview';
import { reviewsApi } from '../../api/reviewsApi';
import { REVIEWS_QUERY_KEY } from '../useReviews';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
jest.mock('../../api/reviewsApi', () => ({
  reviewsApi: {
    deleteReview: jest.fn(),
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

describe('useDeleteReview Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const queryKey = [...REVIEWS_QUERY_KEY, 'course-123'];
  const mockReviews = [
    { _id: 'rev-1', comment: 'تقييم أول' },
    { _id: 'rev-2', comment: 'تقييم ثانٍ' },
  ];

  // 1. فحص الحذف التفاؤلي (Optimistic Update)
  test('should optimistically filter out the review from cache before server confirms', async () => {
    reviewsApi.deleteReview.mockResolvedValue();

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKey, mockReviews);

    const { result } = renderHook(() => useDeleteReview('course-123'), { wrapper });

    act(() => {
      result.current.mutate('rev-1');
    });

    // الانتظار حتى تنفيذ التحديث التفاؤلي بنجاح
    await waitFor(() => {
      const cached = queryClient.getQueryData(queryKey);
      expect(cached).toHaveLength(1);
      expect(cached[0]._id).toBe('rev-2');
    });
  });

  // 2. فحص التراجع عن التحديث التفاؤلي (Rollback) عند حدوث خطأ
  test('should rollback to previous reviews cache state if deleteReview fails', async () => {
    const { toast } = require('react-toastify');
    reviewsApi.deleteReview.mockRejectedValue(new Error('Delete failed'));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKey, mockReviews);

    const { result } = renderHook(() => useDeleteReview('course-123'), { wrapper });

    act(() => {
      result.current.mutate('rev-1');
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('حدث خطأ أثناء الحذف');
    });

    // يجب استرجاع التقييم المحذوف تفاؤلياً
    const cached = queryClient.getQueryData(queryKey);
    expect(cached).toHaveLength(2);
    expect(cached[0]._id).toBe('rev-1');
  });

  // 3. فحص إبطال الكاش وإظهار رسالة النجاح في النهاية (onSettled)
  test('should invalidate reviews cache query and show toast.success on settled', async () => {
    const { toast } = require('react-toastify');
    reviewsApi.deleteReview.mockResolvedValue();

    const wrapper = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    queryClient.setQueryData(queryKey, mockReviews);

    const { result } = renderHook(() => useDeleteReview('course-123'), { wrapper });

    act(() => {
      result.current.mutate('rev-1');
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: [...REVIEWS_QUERY_KEY, 'course-123'],
      });
      expect(toast.success).toHaveBeenCalledWith('تم حذف التقييم');
    });
  });
});
