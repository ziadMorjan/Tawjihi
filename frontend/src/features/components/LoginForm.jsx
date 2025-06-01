//react
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
//yup
import * as yup from "yup";
//axios
import axios from "axios";

//Path
import { PATH } from "../../routes";

//styled
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorText,
  FormActions,
} from "./style";

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("ادخل البريد الالكتروني بشكل صحيح"),
  password: yup.string().required("كلمة المرور مطلوبة"),
});

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

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
        <Label>البريد الإلكتروني</Label>
        <Input type="email" {...register("email")} />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>كلمة المرور </Label>
        <Input type="password" {...register("password")} />
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>
          <Link to={`/${PATH.ForgetPassword}`}>هل نسيت كلمة السر</Link>{" "}
        </Label>
      </FormGroup>

      <FormActions>
        <Button type="submit"> تسجيل الدخول </Button>
      </FormActions>
    </Form>
  );
};
