// src/features/comments/hooks/__tests__/useEditComment.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEditComment } from '../useEditComment';
import { commentsApi } from '../../api/commentsApi';
import { COMMENTS_QUERY_KEY } from '../useComments';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
jest.mock('../../api/commentsApi', () => ({
  commentsApi: {
    updateComment: jest.fn(),
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

describe('useEditComment Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص استدعاء الـ API بمعرف التعليق والمحتوى الجديد
  test('should call commentsApi.updateComment with correct parameters', async () => {
    commentsApi.updateComment.mockResolvedValue({ status: 'success' });

    const { result } = renderHook(() => useEditComment('lesson-123'), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ commentId: 'comm-789', content: 'تعليق معدل' });
    });

    await waitFor(() => {
      expect(commentsApi.updateComment).toHaveBeenCalledWith('comm-789', { content: 'تعليق معدل' });
    });
  });

  // 2. فحص إبطال كاش التعليقات وإظهار toast.success عند النجاح
  test('should invalidate comments cache and show toast.success on success', async () => {
    const { toast } = require('react-toastify');
    commentsApi.updateComment.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useEditComment('lesson-123'), { wrapper });

    act(() => {
      result.current.mutate({ commentId: 'comm-789', content: 'تعليق معدل' });
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: [...COMMENTS_QUERY_KEY, 'lesson-123'],
      });
      expect(toast.success).toHaveBeenCalledWith('video.commentEdited');
    });
  });

  // 3. فحص إظهار toast.error عند الفشل
  test('should show toast.error on failure', async () => {
    const { toast } = require('react-toastify');
    commentsApi.updateComment.mockRejectedValue(new Error('Update failed'));

    const { result } = renderHook(() => useEditComment('lesson-123'), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ commentId: 'comm-789', content: 'تعليق معدل' });
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('video.commentEditError');
    });
  });
});
