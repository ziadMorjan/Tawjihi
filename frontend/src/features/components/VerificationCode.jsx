import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useRef } from "react";

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

// Config
import { API_URL } from "../../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Validation schema for 6-digit verification resetCode
const schema = yup.object({
  resetCode: yup
    .string()
    .length(6, "يجب أن يتكون رمز التحقق من 6 أرقام")
    .required("رمز التحقق مطلوب"),
});

export const VerificationCode = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const inputsRef = useRef([]);

  const onSubmit = async (data) => {
    try {
      const resetCode = inputsRef.current.map((input) => input.value).join("");
      const response = await axios.post(`${API_URL}/auth/verifyResetCode`, {
        resetCode,
      });
      console.log("Submitted:", response.data);
      navigate(`/${PATH.ResetPassword}`);
      reset();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "حدث خطأ أثناء التسجيل. حاول مرة أخرى.";
      setServerError(message);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // Only allow single digit

    inputsRef.current[index].value = value;

    // Set combined value to hidden field
    const combinedCode = inputsRef.current.map((input) => input.value).join("");
    setValue("resetCode", combinedCode);

    // Move to next input
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const arr = [0, 1, 2, 3, 4, 5];

  return (
    <>
      <LogoAndButton />
      <FormForgetPassword onSubmit={handleSubmit(onSubmit)}>
        {serverError && <ErrorText>{serverError}</ErrorText>}

        <FormGroup>
          <H3>التحقق من الرمز</H3>
          <Pargrahph size="16px">
            سوف نرسل لك كود التحقق عبر الايميل الخاص بك
          </Pargrahph>
          <Label>رمز التحقق</Label>
          <div style={{ display: "flex", gap: "10px", direction: "ltr" }}>
            {arr.map((_, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                onChange={(e) => handleChange(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
              />
            ))}
          </div>
          <input type="hidden" {...register("resetCode")} />
          {errors.resetCode && (
            <ErrorText>{errors.resetCode.message}</ErrorText>
          )}
        </FormGroup>

        <FormActions>
          <Button type="submit">ارسل كود التحقق</Button>
        </FormActions>
      </FormForgetPassword>
    </>
  );
};
