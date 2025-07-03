"use client";

import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import axios from "axios";

// Styled Components
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 1rem;

  @media (min-width: 640px) {
    padding: 3rem 1.5rem;
  }
`;

const MaxWidthContainer = styled.div`
  max-width: 48rem;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #0f172a;
  margin: 0 0 0.5rem 0;

  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.125rem;
  margin: 0;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Form = styled.form`
  padding: 2rem;

  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

const ProfileImageContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const ProfileImage = styled.img`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ImageUploadOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;

  ${ProfileImage}:hover + & {
    opacity: 1;
  }
`;

const UploadIcon = styled.div`
  color: white;
  font-size: 1.5rem;
`;

const ImageUploadText = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  text-align: center;
  margin: 0;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  &.full-width {
    @media (min-width: 768px) {
      grid-column: span 2;
    }
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:invalid {
    border-color: #ef4444;
  }

  &[aria-invalid="true"] {
    border-color: #ef4444;
  }

  &:disabled {
    background-color: #f9fafb;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &[aria-invalid="true"] {
    border-color: #ef4444;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  resize: vertical;
  min-height: 6rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &[aria-invalid="true"] {
    border-color: #ef4444;
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: "⚠️";
    font-size: 0.75rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const SaveButton = styled.button`
  flex: 1;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 0.875rem 2rem;
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
    color: #374151;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 1.25rem;
  padding: 0.25rem;

  &:hover {
    color: #374151;
  }
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

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
