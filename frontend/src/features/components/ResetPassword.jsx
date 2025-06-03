//react
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//yup
import * as yup from "yup";
//axios
import axios from "axios";

//hooks
import { useNavigate } from "react-router-dom";

// Components
import { LogoAndButton } from "../../components/LogoAndButton";
import { H3, Pargrahph } from "../../components/typography";

//styled
import {
  FormGroup,
  Label,
  Input,
  Button,
  ErrorText,
  FormActions,
  FormForgetPassword,
} from "./style";

// Paths

import { PATH } from "../../routes";

// Password validation regex
const fullPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validation schema
const schema = yup.object({
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .matches(fullPasswordRegex, "invalid-password"),
  rePassword: yup
    .string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([yup.ref("password")], "كلمتا المرور غير متطابقتين"),
});

export const ResetPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: yupResolver(schema) });

  const passwordValue = watch("password");

  const passwordRules = [
    {
      label: "يجب أن تحتوي على حرف صغير (a-z)",
      isValid: /[a-z]/.test(passwordValue || ""),
    },
    {
      label: "يجب أن تحتوي على حرف كبير (A-Z)",
      isValid: /[A-Z]/.test(passwordValue || ""),
    },
    {
      label: "يجب أن تحتوي على رقم (0-9)",
      isValid: /\d/.test(passwordValue || ""),
    },
    {
      label: "يجب أن تحتوي على رمز خاص مثل (@, $, !, %, *, ?, &)",
      isValid: /[@$!%*?&]/.test(passwordValue || ""),
    },
    {
      label: "يجب أن تكون 8 أحرف على الأقل",
      isValid: (passwordValue || "").length >= 8,
    },
  ];

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/reset-password",
        {
          password: data.password,
        }
      );
      console.log("Password reset:", response.data);
      navigate(`/${PATH.VerificationCode}`);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <>
      <LogoAndButton />
      <FormForgetPassword onSubmit={handleSubmit(onSubmit)}>
        <H3>إعادة تعيين كلمة المرور</H3>
        <Pargrahph size='16px'>قم بإدخال كلمة المرور الجديدة الخاصة بك</Pargrahph>

        <FormGroup>
          <Label>كلمة المرور</Label>
          <Input type="password" {...register("password")} />
          {errors.password && (
            <ErrorText>
              {errors.password.message === "invalid-password" ? (
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
                errors.password.message
              )}
            </ErrorText>
          )}
        </FormGroup>

        <FormGroup>
          <Label>تأكيد كلمة المرور</Label>
          <Input type="password" {...register("rePassword")} />
          {errors.rePassword && (
            <ErrorText>{errors.rePassword.message}</ErrorText>
          )}
        </FormGroup>

        <FormActions>
          <Button type="submit">إعادة تعيين</Button>
        </FormActions>
      </FormForgetPassword>
    </>
  );
};
