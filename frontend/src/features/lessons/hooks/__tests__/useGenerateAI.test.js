// src/features/lessons/hooks/__tests__/useGenerateAI.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGenerateAI } from '../useGenerateAI';
import { lessonsApi } from '../../api/lessonsApi';
import { LESSONS_QUERY_KEY } from '../useLessons';

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
jest.mock('../../api/lessonsApi', () => ({
  lessonsApi: {
    getAIContent: jest.fn(),
  },
}));

jest.mock('react-toastify', () => ({
  toast: {
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

describe('useGenerateAI Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. فحص استدعاء الـ API بمعرف الدرس الصحيح
  test('should call lessonsApi.getAIContent with correct lessonId', async () => {
    lessonsApi.getAIContent.mockResolvedValue({ status: 'success' });

    const { result } = renderHook(() => useGenerateAI('course-123'), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate('lesson-456');
    });

    await waitFor(() => {
      expect(lessonsApi.getAIContent).toHaveBeenCalledWith('lesson-456');
    });
  });

  // 2. فحص إلغاء كاش الدروس التابع للكورس عند النجاح لتحديث الـ UI
  test('should invalidate course lessons query cache on success', async () => {
    lessonsApi.getAIContent.mockResolvedValue({ status: 'success' });

    const wrapper = createWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useGenerateAI('course-123'), { wrapper });

    act(() => {
      result.current.mutate('lesson-456');
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: [...LESSONS_QUERY_KEY, 'course-123'],
      });
    });
  });

  // 3. فحص إظهار toast.error عند فشل توليد المحتوى الذكي
  test('should display toast.error on failure', async () => {
    const { toast } = require('react-toastify');
    const errorResponse = {
      response: {
        data: { message: 'فشل خادم الذكاء الاصطناعي' },
      },
    };
    lessonsApi.getAIContent.mockRejectedValue(errorResponse);

    const { result } = renderHook(() => useGenerateAI('course-123'), { wrapper: createWrapper() });

    act(() => {
      result.current.mutate('lesson-456');
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('فشل خادم الذكاء الاصطناعي');
    });
  });
});
