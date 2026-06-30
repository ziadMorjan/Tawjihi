// src/pages/ChangePassword/__tests__/ChangePassword.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "../../../design-system";
import ChangePassword from "../index";

// ── محاكاة الـ Dependencies ───────────────────────────────────────────────────
const mockNavigate = jest.fn();
const mockMutateAsync = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock("../../../shared/components/layout/MainLayout", () => ({
  MainLayout: ({ children }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock("../../../features/user", () => ({
  useChangePassword: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}));

const renderChangePassword = () => {
  return render(
    <ThemeProvider theme={lightTheme}>
      <MemoryRouter>
        <ChangePassword />
      </MemoryRouter>
    </ThemeProvider>,
  );
};

describe("ChangePassword Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. التحقق من صحة المدخلات عند تقديم حقول فارغة
  test("should display validation errors when fields are empty", async () => {
    renderChangePassword();

    const changeBtn = screen.getAllByText("profile.changePassword")[1];
    fireEvent.click(changeBtn);

    await waitFor(() => {
      expect(
        screen.getByText("profile.currentPasswordRequired"),
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("profile.minChar")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByText("profile.confirmPasswordRequired"),
      ).toBeInTheDocument();
    });
  });

  // 2. التحقق من مطابقة كلمتي المرور الجديدة وتأكيدها
  test("should display validation error when confirm password does not match new password", async () => {
    renderChangePassword();

    const currentPw = screen.getByLabelText("profile.currentPassword");
    const newPw = screen.getByLabelText("profile.newPassword");
    const confirmNewPw = screen.getByLabelText("profile.confirmNewPassword");

    fireEvent.change(currentPw, { target: { value: "oldpass123" } });
    fireEvent.change(newPw, { target: { value: "newpass123" } });
    fireEvent.change(confirmNewPw, { target: { value: "differentpass123" } });

    const changeBtn = screen.getAllByText("profile.changePassword")[1];
    fireEvent.click(changeBtn);

    await waitFor(() => {
      expect(
        screen.getByText("profile.passwordsMustMatch"),
      ).toBeInTheDocument();
    });
  });

  // 3. التحقق من صحة طول كلمة المرور (أقل من 8 أحرف)
  test("should show error if new password is less than 8 characters", async () => {
    renderChangePassword();

    const newPw = screen.getByLabelText("profile.newPassword");
    fireEvent.change(newPw, { target: { value: "short" } });

    const changeBtn = screen.getAllByText("profile.changePassword")[1];
    fireEvent.click(changeBtn);

    await waitFor(() => {
      expect(screen.getByText("profile.minChar")).toBeInTheDocument();
    });
  });

  // 4. فحص التوجيه لصفحة الملف الشخصي عند الإلغاء
  test("should navigate to profile page on cancel click", () => {
    renderChangePassword();

    const cancelBtn = screen.getByText("profile.cancel");
    fireEvent.click(cancelBtn);

    expect(mockNavigate).toHaveBeenCalledWith("/user/profile");
  });

  // 5. فحص استدعاء mutateAsync والتوجيه للخلف عند إدخال بيانات صحيحة بالكامل
  test("should call mutation and navigate to profile page on success", async () => {
    mockMutateAsync.mockResolvedValue({ status: "success" });
    renderChangePassword();

    const currentPw = screen.getByLabelText("profile.currentPassword");
    const newPw = screen.getByLabelText("profile.newPassword");
    const confirmNewPw = screen.getByLabelText("profile.confirmNewPassword");

    fireEvent.change(currentPw, { target: { value: "oldpass123" } });
    fireEvent.change(newPw, { target: { value: "newpass123" } });
    fireEvent.change(confirmNewPw, { target: { value: "newpass123" } });

    const changeBtn = screen.getAllByText("profile.changePassword")[1];
    fireEvent.click(changeBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        currentPassword: "oldpass123",
        newPassword: "newpass123",
        newConfirmPassword: "newpass123",
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith("/user/profile");
  });
});
