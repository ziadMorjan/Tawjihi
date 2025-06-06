// style
import {
  ModalDiv,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  CancelButton,
  ErrorText,
} from "./style";

// react
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// yup
import * as yup from "yup";
// hooks
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../../context/ModalContext";
// axios
import axios from "axios";

// API URL
import { API_URL } from "../../config";

// Password regex
const fullPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Validation schema
const schema = yup.object({
  name: yup.string().required("الاسم الأول مطلوب").min(3, "ادخل الاسم كامل"),
  phone: yup.string().required("رقم الهاتف مطلوب"),
  email: yup
    .string()
    .required("البريد الإلكتروني مطلوب")
    .email("ادخل البريد الالكتروني بشكل صحيح"),
  password: yup
    .string()
    .required("كلمة المرور مطلوبة")
    .matches(fullPasswordRegex, "invalid-password"),
  confirmPassword: yup
    .string()
    .required("تأكيد كلمة المرور مطلوب")
    .oneOf([yup.ref("password")], "كلمتا المرور غير متطابقتين"),
  cv: yup
    .mixed()
    .required("السيرة الذاتية مطلوبة")
    .test("fileType", "صيغة الملف غير مدعومة", (value) => {
      return (
        value &&
        value.length > 0 &&
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(value[0].type)
      );
    }),
});

export const ModalTeacher = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ resolver: yupResolver(schema) });

  const { isOpen, setIsOpen } = useContext(ModalContext);
  const [res, setRes] = useState(false);
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
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("cv", data.cv[0]);
    formData.append("role", "teacher");

    try {
      const response = await axios.post(`${API_URL}/auth/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Form submitted:", response.data);
      setRes(true);
      reset();
      setIsOpen(false);
      setTimeout(() => setRes(false), 2000);
    } catch (error) {
      console.error("Form error:", error);
    }
  };

  const onCancel = () => {
    reset();
    setRes(false);
    setIsOpen(false);
  };

  useEffect(() => {
    document.body.style.overflowX = "hidden";
    document.body.style.overflowY = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflowY = "auto";
      document.body.style.overflowX = "hidden";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && <div className="modal-overlay" onClick={onCancel} />}
      <ModalDiv className={isOpen ? "show bodyModal" : "hide"}>
        <Form onSubmit={handleSubmit(onSubmit)}>
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
                  <ul
                    style={{
                      paddingRight: "1rem",
                      margin: "0.5rem 0",
                    }}
                  >
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
            <Input type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword.message}</ErrorText>
            )}
          </FormGroup>

          <FormGroup>
            <Label>السيرة الذاتية (PDF أو Word)</Label>
            <Input type="file" accept=".pdf,.doc,.docx" {...register("cv")} />
            {errors.cv && <ErrorText>{errors.cv.message}</ErrorText>}
          </FormGroup>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Button type="submit">إرسال</Button>
            <CancelButton
              style={{ background: "red", color: "white" }}
              type="button"
              onClick={onCancel}
            >
              إلغاء
            </CancelButton>
          </div>

          {res && (
            <p style={{ color: "green", marginTop: "1rem" }}>
              ✅ تم إرسال الطلب بنجاح
            </p>
          )}
        </Form>
      </ModalDiv>
    </>
  );
};
