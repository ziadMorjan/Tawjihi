// src/features/comments/hooks/__tests__/useAddComment.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAddComment } from '../useAddComment';
import { commentsApi } from '../../api/commentsApi';
import { COMMENTS_QUERY_KEY } from '../useComments';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
jest.mock('../../api/commentsApi', () => ({
  commentsApi: {
    addComment: jest.fn(),
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

describe('useAddComment Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص استدعاء الـ API بالمعطيات الصحيحة
  test('should call commentsApi.addComment with correct parameters', async () => {
    commentsApi.addComment.mockResolvedValue({ status: 'success' });

    const { result } = renderHook(() => useAddComment('lesson-123'), { wrapper: createWrapper() });

    const payload = { lessonId: 'lesson-123', content: 'تعليق تجريبي' };

    act(() => {
      result.current.mutate(payload);
    });

    await waitFor(() => {
      expect(commentsApi.addComment).toHaveBeenCalledWith(payload, expect.anything());
    });
  });

  // 2. فحص إبطال كاش التعليقات وإظهار toast.success عند النجاح
  test('should invalidate comments cache and show toast.success on success', async () => {
    const { toast } = require('react-toastify');
    commentsApi.addComment.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useAddComment('lesson-123'), { wrapper });

    act(() => {
      result.current.mutate({ lessonId: 'lesson-123', content: 'تعليق تجريبي' });
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: [...COMMENTS_QUERY_KEY, 'lesson-123'],
      });
      expect(toast.success).toHaveBeenCalledWith('video.commentAdded');
    });
  });

  // 3. فحص إظهار toast.error عند الفشل
  test('should show toast.error on failure', async () => {
    const { toast } = require('react-toastify');
    const errorResponse = {
      response: {
        data: { message: 'فشل إضافة التعليق بسبب السيرفر' },
      },
    };
    commentsApi.addComment.mockRejectedValue(errorResponse);

    const { result } = renderHook(() => useAddComment('lesson-123'), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate({ lessonId: 'lesson-123', content: 'تعليق' });
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('فشل إضافة التعليق بسبب السيرفر');
    });
  });
});
