"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import {
  ButtonGroup,
  CancelButton,
  Container,
  ErrorText,
  FormCard,
  FormGrid,
  FormGroup,
  Header,
  HiddenInput,
  ImageUploadOverlay,
  ImageUploadText,
  Input,
  InputContainer,
  Label,
  MaxWidthContainer,
  PasswordToggle,
  ProfileImage,
  ProfileImageContainer,
  ProfileImageSection,
  SaveButton,
  Select,
  Subtitle,
  TextArea,
  UploadIcon,
} from "./style";
import { Title } from "@mui/icons-material";

function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        roleUser: user.roleUser || "طالب",
        bio: user.bio || "",
      });
      setImagePreview(user.profileImage || "");
    }
  }, [reset]);

  const handleImageChange = (e) => {
    clearErrors("profileImage");
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("profileImage", {
          type: "manual",
          message: "الملف يجب أن يكون صورة فقط",
        });
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("bio", data.bio);

      if (data.password) {
        formData.append("password", data.password);
      }

      if (imageFile) formData.append("coverImage", imageFile);

      // Remove roleUser from data if it exists
      if ("roleUser" in data) {
        delete data.roleUser;
      }

      const API_URL =
        process.env.REACT_APP_API_URL || "http://localhost:3001/api";
      const res = await axios.patch(`${API_URL}/users/updateMe`, formData, {
        withCredentials: true,
      });

      const updatedUser = {
        ...res.data.data.updatedDoc,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("تم تحديث الملف الشخصي بنجاح!");
      navigate("/user/profile");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ ما. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/user/profile");
  };

  return (
    <Container>
      <MaxWidthContainer>
        <Header>
          <Title>تعديل الملف الشخصي</Title>
          <Subtitle>قم بتحديث بيانات حسابك أدناه</Subtitle>
        </Header>

        <FormCard>
          <Form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            noValidate
          >
            {/* Profile Image Section */}
            <ProfileImageSection>
              <ProfileImageContainer>
                <ProfileImage
                  src={imagePreview || "https://via.placeholder.com/150"}
                  alt="الصورة الشخصية"
                  onClick={() => fileInputRef.current?.click()}
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && fileInputRef.current?.click()
                  }
                  role="button"
                  aria-label="رفع صورة الملف الشخصي"
                  title="اضغط لتغيير الصورة"
                />
                <ImageUploadOverlay
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadIcon>📷</UploadIcon>
                </ImageUploadOverlay>
              </ProfileImageContainer>

              <HiddenInput
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                aria-describedby="profileImageError"
              />

              <ImageUploadText>اضغط على الصورة لتغييرها</ImageUploadText>

              {errors.profileImage && (
                <ErrorText id="profileImageError">
                  {errors.profileImage.message}
                </ErrorText>
              )}
            </ProfileImageSection>

            {/* Form Fields */}
            <FormGrid>
              <FormGroup>
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name", { required: "الاسم مطلوب" })}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby="nameError"
                />
                {errors.name && (
                  <ErrorText id="nameError">{errors.name.message}</ErrorText>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "البريد الإلكتروني مطلوب",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "تنسيق البريد غير صالح",
                    },
                  })}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby="emailError"
                />
                {errors.email && (
                  <ErrorText id="emailError">{errors.email.message}</ErrorText>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="phone">رقم الهاتف</Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone", {
                    pattern: {
                      value: /^[+]?[\d\s\-()]+$/,
                      message: "رقم الهاتف غير صالح",
                    },
                  })}
                  aria-invalid={errors.phone ? "true" : "false"}
                  aria-describedby="phoneError"
                  placeholder="مثال: +966501234567"
                />
                {errors.phone && (
                  <ErrorText id="phoneError">{errors.phone.message}</ErrorText>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="roleUser">الدور</Label>
                <Select id="roleUser" {...register("roleUser")}>
                  <option value="طالب">طالب</option>
                  <option value="معلم">معلم</option>
                  <option value="مدير">مدير</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">كلمة المرور الجديدة (اختياري)</Label>
                <InputContainer>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      minLength: {
                        value: 6,
                        message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                      },
                    })}
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby="passwordError"
                    placeholder="اتركه فارغاً إذا لم ترد تغييره"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </PasswordToggle>
                </InputContainer>
                {errors.password && (
                  <ErrorText id="passwordError">
                    {errors.password.message}
                  </ErrorText>
                )}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
                <InputContainer>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword", {
                      validate: (value) => {
                        if (password && !value) {
                          return "تأكيد كلمة المرور مطلوب";
                        }
                        if (password && value !== password) {
                          return "كلمات المرور غير متطابقة";
                        }
                        return true;
                      },
                    })}
                    aria-invalid={errors.confirmPassword ? "true" : "false"}
                    aria-describedby="confirmPasswordError"
                    placeholder="أعد كتابة كلمة المرور"
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "إخفاء تأكيد كلمة المرور"
                        : "إظهار تأكيد كلمة المرور"
                    }
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </PasswordToggle>
                </InputContainer>
                {errors.confirmPassword && (
                  <ErrorText id="confirmPasswordError">
                    {errors.confirmPassword.message}
                  </ErrorText>
                )}
              </FormGroup>

              <FormGroup className="full-width">
                <Label htmlFor="bio">النبذة الشخصية</Label>
                <TextArea
                  id="bio"
                  {...register("bio")}
                  rows={4}
                  placeholder="اكتب نبذة مختصرة عن نفسك..."
                />
              </FormGroup>
            </FormGrid>

            {/* Action Buttons */}
            <ButtonGroup>
              <CancelButton type="button" onClick={handleCancel}>
                إلغاء
              </CancelButton>
              <SaveButton
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span>⏳</span>
                    جارٍ الحفظ...
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    حفظ التغييرات
                  </>
                )}
              </SaveButton>
            </ButtonGroup>
          </Form>
        </FormCard>
      </MaxWidthContainer>
    </Container>
  );
}

export default EditProfile;
