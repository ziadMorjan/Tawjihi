// src/features/teachers/hooks/__tests__/useTeacher.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { useTeacher, useTeacherCourses } from '../useTeacher';

// ── بيانات وهمية ─────────────────────────────────────────────────────────────
const mockTeacherDetail = {
  status: 'success',
  data: {
    doc: { _id: 'teacher-123', name: 'أ. محمد أحمد', role: 'teacher', bio: 'معلم مادة الرياضيات' },
  },
};

const mockCoursesList = {
  status: 'success',
  data: {
    docs: [
      { _id: 'course-1', title: 'رياضيات علمي' },
      { _id: 'course-2', title: 'رياضيات أدبي' },
    ],
  },
};

// ── إعداد خادم MSW ───────────────────────────────────────────────────────────
const server = setupServer(
  http.get('*/users/:id', ({ params }) => {
    const { id } = params;

    if (id === 'teacher-error') {
      return HttpResponse.json({ message: 'Internal Error' }, { status: 500 });
    }

    return HttpResponse.json(mockTeacherDetail);
  }),

  http.get('*/courses', ({ request }) => {
    const url = new URL(request.url);
    const teacherId = url.searchParams.get('teacher');

    if (teacherId === 'teacher-empty') {
      return HttpResponse.json({ status: 'success', data: { docs: [] } });
    }

    return HttpResponse.json(mockCoursesList);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ── Wrapper مشترك ─────────────────────────────────────────────────────────────
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTeacher & useTeacherCourses Hooks', () => {
  // ── اختبارات useTeacher ────────────────────────────────────────────────────
  describe('useTeacher Hook', () => {
    // 1. لا يبدأ جلب البيانات إذا لم يتم تمرير id
    test('should NOT fetch teacher detail when id is undefined', () => {
      const { result } = renderHook(() => useTeacher(undefined), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    // 2. فحص حالة التحميل الابتدائي
    test('should start in loading state when id is provided', () => {
      const { result } = renderHook(() => useTeacher('teacher-123'), { wrapper: createWrapper() });
      expect(result.current.isLoading).toBe(true);
    });

    // 3. فحص نجاح جلب تفاصيل المعلم
    test('should fetch and return teacher details on success', async () => {
      const { result } = renderHook(() => useTeacher('teacher-123'), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data._id).toBe('teacher-123');
      expect(result.current.data.name).toBe('أ. محمد أحمد');
      expect(result.current.data.bio).toBe('معلم مادة الرياضيات');
    });

    // 4. فحص حالة الخطأ عند الفشل
    test('should enter error state when API fails', async () => {
      const { result } = renderHook(() => useTeacher('teacher-error'), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.data).toBeUndefined();
    });
  });

  // ── اختبارات useTeacherCourses ─────────────────────────────────────────────
  describe('useTeacherCourses Hook', () => {
    // 1. لا يبدأ جلب البيانات إذا لم يتم تمرير teacherId
    test('should NOT fetch courses when teacherId is undefined', () => {
      const { result } = renderHook(() => useTeacherCourses(undefined), { wrapper: createWrapper() });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
    });

    // 2. فحص نجاح جلب كورسات المعلم
    test('should fetch and return courses list on success', async () => {
      const { result } = renderHook(() => useTeacherCourses('teacher-123'), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(2);
      expect(result.current.data[0].title).toBe('رياضيات علمي');
      expect(result.current.data[1].title).toBe('رياضيات أدبي');
    });

    // 3. فحص إرجاع قائمة فارغة عند عدم وجود كورسات للمعلم
    test('should return empty list when teacher has no courses', async () => {
      const { result } = renderHook(() => useTeacherCourses('teacher-empty'), { wrapper: createWrapper() });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual([]);
    });
  });
});
