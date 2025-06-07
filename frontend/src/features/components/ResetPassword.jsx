import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Components
import { LogoAndButton } from "../../components/LogoAndButton";
import { H3, Pargrahph } from "../../components/typography";

// Styled
import {
  FormGroup,
  Label,
  Input,
  Button,
  ErrorText,
  FormActions,
  FormForgetPassword,
} from "./style";

// Paths & Config
import { PATH } from "../../routes";
import { API_URL } from "../../config";
import { AuthContext } from "../../context/AuthContext";

// Password regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


// Validation schema
const schema = yup.object({
  newPassword: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .matches(passwordRegex, "invalid-password"),
  newConfirmPassword: yup
    .string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([yup.ref("newPassword")], "كلمتا المرور غير متطابقتين"),
});

export const ResetPassword = () => {
  const navigate = useNavigate();
  const { setIsAuth } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const passwordValue = watch("newPassword") || "";

  const passwordRules = [
    {
      label: "يجب أن تحتوي على حرف صغير (a-z)",
      isValid: /[a-z]/.test(passwordValue),
    },
    {
      label: "يجب أن تحتوي على حرف كبير (A-Z)",
      isValid: /[A-Z]/.test(passwordValue),
    },
    { label: "يجب أن تحتوي على رقم (0-9)", isValid: /\d/.test(passwordValue) },
    {
      label: "يجب أن تحتوي على رمز خاص مثل (@, $, !, %, *, ?, &)",
      isValid: /[@$!%*?&]/.test(passwordValue),
    },
    {
      label: "يجب أن تكون 8 أحرف على الأقل",
      isValid: passwordValue.length >= 8,
    },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await axios.patch(
        `${API_URL}/auth/resetPassword`,
        {
          newPassword: data.newPassword,
          newConfirmPassword: data.newConfirmPassword,
          email: localStorage.getItem("email"),
        },
        { withCredentials: true }
      );

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.removeItem("email");
        setIsAuth(true);
        reset();
        navigate(PATH.Main);
      } else {
        throw new Error("لم يتم استلام بيانات المستخدم.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء إعادة تعيين كلمة المرور.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LogoAndButton />
      <FormForgetPassword onSubmit={handleSubmit(onSubmit)}>
        <H3>إعادة تعيين كلمة المرور</H3>
        <Pargrahph size="16px">
          قم بإدخال كلمة المرور الجديدة الخاصة بك
        </Pargrahph>

        {serverError && <ErrorText>{serverError}</ErrorText>}

        <FormGroup>
          <Label>كلمة المرور</Label>
          <Input
            type="password"
            {...register("newPassword")}
            disabled={loading}
          />
          {errors.newPassword && (
            <ErrorText>
              {errors.newPassword.message === "invalid-password" ? (
                <ul style={{ paddingRight: "1rem", margin: "0.5rem 0" }}>
                  {passwordRules.map((rule, index) => (
                    <li
                      key={index}
                      style={{
                        color: rule.isValid ? "green" : "red",
                        fontWeight: rule.isValid ? "bold" : "normal",
                      }}
                    >
                      {rule.label}
                    </li>
                  ))}
                </ul>
              ) : (
                errors.newPassword.message
              )}
            </ErrorText>
          )}
        </FormGroup>

        <FormGroup>
          <Label>تأكيد كلمة المرور</Label>
          <Input
            type="password"
            {...register("newConfirmPassword")}
            disabled={loading}
          />
          {errors.newConfirmPassword && (
            <ErrorText>{errors.newConfirmPassword.message}</ErrorText>
          )}
        </FormGroup>

        <FormActions>
          <Button type="submit" disabled={loading}>
            {loading ? "جاري الإرسال..." : "إعادة تعيين"}
          </Button>
        </FormActions>
      </FormForgetPassword>
    </>
  );
};
