//react
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

//yup
import * as yup from "yup";

//axios
import axios from "axios";


// URL
import { API_URL } from "../../config";

//Path
import { PATH } from "../../routes";

//context
import { AuthContext } from "../../context/AuthContext";

// Styled components
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  ErrorText,
  FormActions,
} from "./style";
import { SocialMediaIcon } from "../../components/Icon/socialMediaIcon";
import { Pargrahph } from "../../components/typography";
import { MiddleLineLetter } from "../../components/MiddleLineLetter";
import { WrapperElementFlexCenter } from "../../styles/style";

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("ادخل البريد الالكتروني بشكل صحيح"),
  password: yup.string().required("كلمة المرور مطلوبة"),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const { setIsAuth } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const response = await axios.post(`${API_URL}/auth/login`, data, {
        withCredentials: true,
      });

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setIsAuth(true);
        reset();
        navigate(PATH.Main);
      } else {
        throw new Error("لم يتم العثور على بيانات المستخدم.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء محاولة تسجيل الدخول. حاول مرة أخرى.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      {serverError && <ErrorText>{serverError}</ErrorText>}

      <FormGroup>
        <Label>البريد الإلكتروني</Label>
        <Input type="email" {...register("email")} disabled={loading} />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>كلمة المرور </Label>
        <Input type="password" {...register("password")} disabled={loading} />
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
      </FormGroup>

      <FormGroup>
        <Label>
          <Link to={`/${PATH.ForgetPassword}`}>هل نسيت كلمة السر؟</Link>
        </Label>
      </FormGroup>

      <FormActions>
        <Button type="submit" disabled={loading}>
          {loading ? "جاري التسجيل..." : "تسجيل"}
        </Button>
      </FormActions>

      <MiddleLineLetter text="أو تسجيل الدخول باستخدام" />
      <WrapperElementFlexCenter>
        <SocialMediaIcon icon="google" />
        <SocialMediaIcon icon="facebook" />
      </WrapperElementFlexCenter>

      <Pargrahph size="16px">
        ليس لديك حساب؟ <Link to={`/${PATH.Register}`}>إنشاء حساب جديد</Link>
      </Pargrahph>
    </Form>
  );
};
