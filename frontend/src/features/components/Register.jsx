//react
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

//yup
import * as yup from "yup";
//axios
import axios from "axios";

//styled
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

// Password regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

// Validation schema
const schema = yup.object({
  firstName: yup
    .string()
    .required("الاسم الأول مطلوب")
    .min(3, "ادخل الاسم كامل"),
  phone: yup.string().required("رقم الهاتف مطلوب"),
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("ادخل البريد الالكتروني بشكل صحيح"),
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .matches(passwordRegex, "invalid-password"),
  rePassword: yup
    .string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([yup.ref("password")], "كلمتا المرور غير متطابقتين"),
  terms: yup.boolean().oneOf([true], "يجب الموافقة على الشروط والأحكام"),
});

export const RegisterForm = () => {
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
      const response = await axios.post("http://localhost:3000/register", data);
      console.log("Submitted:", response.data);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormGroup>
        <Label>الاسم كامل</Label>
        <Input type="text" {...register("firstName")} />
        {errors.firstName && <ErrorText>{errors.firstName.message}</ErrorText>}
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
        <Input type="password" {...register("rePassword")} />
        {errors.rePassword && (
          <ErrorText>{errors.rePassword.message}</ErrorText>
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
        <Button type="submit">تسجيل</Button>
      </FormActions>
    </Form>
  );
};
