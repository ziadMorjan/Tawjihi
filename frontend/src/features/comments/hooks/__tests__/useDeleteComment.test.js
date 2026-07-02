// src/features/comments/hooks/__tests__/useDeleteComment.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDeleteComment } from '../useDeleteComment';
import { commentsApi } from '../../api/commentsApi';
import { COMMENTS_QUERY_KEY } from '../useComments';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
jest.mock('../../api/commentsApi', () => ({
  commentsApi: {
    deleteComment: jest.fn(),
  },
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
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

describe('useDeleteComment Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const queryKey = [...COMMENTS_QUERY_KEY, 'lesson-123'];
  const mockComments = [
    { _id: 'comm-1', content: 'تعليق أول' },
    { _id: 'comm-2', content: 'تعليق ثانٍ' },
  ];

  // 1. فحص الحذف التفاؤلي (Optimistic Update)
  test('should optimistically filter out the comment from cache before server confirms', async () => {
    commentsApi.deleteComment.mockResolvedValue();

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKey, mockComments);

    const { result } = renderHook(() => useDeleteComment('lesson-123'), { wrapper });

    act(() => {
      result.current.mutate('comm-1');
    });

    // يجب حذف العنصر من الكاش فوراً تفاؤلياً
    await waitFor(() => {
      const cached = queryClient.getQueryData(queryKey);
      expect(cached).toHaveLength(1);
      expect(cached[0]._id).toBe('comm-2');
    });
  });

  // 2. فحص التراجع عن التحديث التفاؤلي (Rollback) عند حدوث خطأ
  test('should rollback to previous comments cache state if deleteComment fails', async () => {
    const { toast } = require('react-toastify');
    commentsApi.deleteComment.mockRejectedValue(new Error('Delete error'));

    const wrapper = createWrapper();
    queryClient.setQueryData(queryKey, mockComments);

    const { result } = renderHook(() => useDeleteComment('lesson-123'), { wrapper });

    act(() => {
      result.current.mutate('comm-1');
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('video.commentDeleteError');
    });

    // يجب استرجاع التعليق المحذوف في الكاش بعد الخطأ
    const cached = queryClient.getQueryData(queryKey);
    expect(cached).toHaveLength(2);
    expect(cached[0]._id).toBe('comm-1');
  });

  // 3. فحص إبطال الكاش وإظهار رسالة النجاح عند الحذف الفعلي
  test('should invalidate query cache with refetchType none and show toast.success on success', async () => {
    const { toast } = require('react-toastify');
    commentsApi.deleteComment.mockResolvedValue();

    const wrapper = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    queryClient.setQueryData(queryKey, mockComments);

    const { result } = renderHook(() => useDeleteComment('lesson-123'), { wrapper });

    act(() => {
      result.current.mutate('comm-1');
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: [...COMMENTS_QUERY_KEY, 'lesson-123'],
        refetchType: 'none',
      });
      expect(toast.success).toHaveBeenCalledWith('video.commentDeleted');
    });
  });
});
