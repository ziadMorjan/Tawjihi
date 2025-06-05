// react
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

// yup
import * as yup from "yup";

// axios
import axios from "axios";

// context
import { AuthContext } from "../../context/AuthContext";

// config
import { API_URL } from "../../config";
import { PATH } from "../../routes";

// styled components
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorText,
  PasswordRulesList,
  PasswordRuleItem,
  FormActions,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
} from "./style";

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// Validation schema
const schema = yup.object({
  name: yup
    .string()
    .required("الاسم الأول مطلوب")
    .min(3, "ادخل الاسم كامل"),
  phone: yup
    .string()
    .required("رقم الهاتف مطلوب")
    .matches(/^\d{10}$/, "رقم الهاتف غير صالح، يجب أن يكون 10 أرقام"),
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("ادخل البريد الالكتروني بشكل صحيح"),
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .matches(passwordRegex, "invalid-password"),
  confirmPassword: yup
    .string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([yup.ref("password")], "كلمتا المرور غير متطابقتين"),
  terms: yup.boolean().oneOf([true], "يجب الموافقة على الشروط والأحكام"),
});

export const RegisterForm = () => {
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
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";

  const passwordRules = [
    { label: "يجب أن تحتوي على حرف صغير (a-z)", isValid: /[a-z]/.test(passwordValue) },
    { label: "يجب أن تحتوي على حرف كبير (A-Z)", isValid: /[A-Z]/.test(passwordValue) },
    { label: "يجب أن تحتوي على رقم (0-9)", isValid: /\d/.test(passwordValue) },
    { label: "يجب أن تحتوي على رمز خاص مثل (@, $, !, %, *, ?, &)", isValid: /[@$!%*?&]/.test(passwordValue) },
    { label: "يجب أن تكون 8 أحرف على الأقل", isValid: passwordValue.length >= 8 },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, data, { withCredentials: true });

      // Optionally store user if returned
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      // Set auth context and redirect
      setIsAuth(true);
      reset();
      navigate(PATH.Main);
    } catch (error) {
      const message =
        error.response?.data?.message || "حدث خطأ أثناء التسجيل. حاول مرة أخرى.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {serverError && <ErrorText>{serverError}</ErrorText>}

      <FormGroup>
        <Label>الاسم كامل</Label>
        <Input type="text" {...register("name")} />
        {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>البريد الإلكتروني</Label>
        <Input type="email" {...register("email")} />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>رقم الهاتف</Label>
        <Input type="tel" {...register("phone")} />
        {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>كلمة المرور</Label>
        <Input type="password" {...register("password")} />
        {errors.password && (
          <ErrorText>
            {errors.password.message === "invalid-password" ? (
              <PasswordRulesList>
                {passwordRules.map((rule, i) => (
                  <PasswordRuleItem key={i} $valid={rule.isValid}>
                    {rule.label}
                  </PasswordRuleItem>
                ))}
              </PasswordRulesList>
            ) : (
              errors.password.message
            )}
          </ErrorText>
        )}
      </FormGroup>

      <FormGroup>
        <Label>تأكيد كلمة المرور</Label>
        <Input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <ErrorText>{errors.confirmPassword.message}</ErrorText>
        )}
      </FormGroup>

      <FormGroup>
        <CheckboxContainer>
          <Checkbox {...register("terms")} id="terms" />
          <CheckboxLabel htmlFor="terms">
            أوافق على الشروط والأحكام
          </CheckboxLabel>
        </CheckboxContainer>
        {errors.terms && <ErrorText>{errors.terms.message}</ErrorText>}
      </FormGroup>

      <FormActions>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري التسجيل..." : "تسجيل"}
        </Button>
      </FormActions>
    </Form>
  );
};
