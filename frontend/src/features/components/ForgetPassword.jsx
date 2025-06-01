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

// Paths
import { PATH } from "../../routes";

// Validation Schema
const schema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required("البريد الإلكتروني مطلوب")
      .email("ادخل البريد الالكتروني بشكل صحيح"),
  })
  .noUnknown(true);

export const ForgetPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/forget-password",
        data
      );
      console.log("Submitted:", response.data);
      navigate(`/${PATH.VerificationCode}`);
    } catch (error) {
      console.error(
        "Submission error:",
        error?.response?.data?.message || error.message
      );
    }
  };

  return (
    <>
      <LogoAndButton />
      <FormForgetPassword onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <H3>إعادة تعيين كلمة المرور</H3>
          <Pargrahph>
            من فضلك أدخل بريدك الإلكتروني لإرسال رمز التحقق لإعادة تعيين كلمة
            المرور
          </Pargrahph>

          <Label>البريد الإلكتروني</Label>
          <Input type="email" {...register("email")} />
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </FormGroup>

        <FormActions>
          <Button type="submit">ارسل كود التحقق</Button>
        </FormActions>
      </FormForgetPassword>
    </>
  );
};
