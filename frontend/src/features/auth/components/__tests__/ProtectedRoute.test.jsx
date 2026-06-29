import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute, GuestRoute } from "../ProtectedRoute";
import { useAuth } from "../../context/AuthContext";

// محاكاة هوك useAuth لكي نتحكم بحالة تسجيل الدخول يدوياً في كل فحص
jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// محاكاة مكون الـ Spinner لتسهيل التحقق من ظهوره
jest.mock("../../../../shared/components", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

describe("Route Guards (ProtectedRoute & GuestRoute)", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // مسح أي محاكاة سابقة قبل بدء كل فحص جديد
  });

  // دالة مساعدة لتهيئة الروابط الافتراضية ورسم المكون
  const renderRoutes = (guardElement, initialPath) => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<div>Home Content</div>} />
          <Route path="/auth/login" element={<div>Login Content</div>} />
          <Route element={guardElement}>
            <Route path="/protected" element={<div>Protected Content</div>} />
            <Route path="/admin" element={<div>Admin Content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
  };

  describe("ProtectedRoute Layout", () => {
    // 1. حالة التحميل
    test("should render spinner if authentication is loading", () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
      });

      renderRoutes(<ProtectedRoute />, "/protected");
      expect(screen.getByTestId("spinner")).toBeInTheDocument();
    });

    // 2. حالة زائر غير مسجل يحاول الدخول
    test("should redirect to login if user is unauthenticated", () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });

      renderRoutes(<ProtectedRoute />, "/protected");
      expect(screen.getByText("Login Content")).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });

    // 3. حالة مستخدم مسجل وصلاحيته مطابقة
    test("should render content if user is authenticated and role is allowed", () => {
      useAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { role: "admin" },
      });

      renderRoutes(<ProtectedRoute allowedRoles={["admin"]} />, "/admin");
      expect(screen.getByText("Admin Content")).toBeInTheDocument();
    });

    // 4. حالة مستخدم مسجل وصلاحيته غير مطابقة
    test("should redirect to home if user is authenticated but role is disallowed", () => {
      // 1. نقول للاختبار: المستخدم مسجل ولكنه مستخدم عادي (user) وليس Admin
      useAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { role: "user" },
      });

      // 2. نحاول الدخول لصفحة الإدارة التي تتطلب أن يكون 'admin'
      renderRoutes(<ProtectedRoute allowedRoles={["admin"]} />, "/admin");

      // 3. نتأكد أن الحارس طرده ونقله للصفحة الرئيسية (Home Content)
      expect(screen.getByText("Home Content")).toBeInTheDocument();
      // 4. ونتأكد أن صفحة الإدارة لم تفتح له
      expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
    });
  });

  describe("GuestRoute Layout", () => {
    // 5. حالة زائر غير مسجل يدخل لصفحة عامة
    test("should render content if user is a guest (unauthenticated)", () => {
      useAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });

      renderRoutes(<GuestRoute />, "/protected");
      expect(screen.getByText("Protected Content")).toBeInTheDocument();
    });

    // 6. حالة مستخدم مسجل يحاول الدخول لصفحة خاصة بالضيوف
    test("should redirect to home if user is authenticated", () => {
      useAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { role: "user" },
      });

      renderRoutes(<GuestRoute />, "/protected");
      expect(screen.getByText("Home Content")).toBeInTheDocument();
      expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    });
  });
});
