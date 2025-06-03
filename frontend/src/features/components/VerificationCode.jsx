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

// Validation schema for 6-digit verification code
const schema = yup.object({
  code: yup
    .string()
    .length(6, "يجب أن يتكون رمز التحقق من 6 أرقام")
    .required("رمز التحقق مطلوب"),
});

export const VerificationCode = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const inputsRef = useRef([]);

  const onSubmit = async (data) => {
    try {
      const code = inputsRef.current.map((input) => input.value).join("");
      const response = await axios.post("http://localhost:3000/verify-code", {
        code,
      });
      console.log("Submitted:", response.data);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; // Only allow single digit

    inputsRef.current[index].value = value;

    // Set combined value to hidden field
    const combinedCode = inputsRef.current.map((input) => input.value).join("");
    setValue("code", combinedCode);

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
        <FormGroup>
          <H3>التحقق من الرمز</H3>
          <Pargrahph size='16px'>سوف نرسل لك كود التحقق عبر الايميل الخاص بك</Pargrahph>
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
          <input type="hidden" {...register("code")} />
          {errors.code && <ErrorText>{errors.code.message}</ErrorText>}
        </FormGroup>

        <FormActions>
          <Button type="submit">ارسل كود التحقق</Button>
        </FormActions>
      </FormForgetPassword>
    </>
  );
};
