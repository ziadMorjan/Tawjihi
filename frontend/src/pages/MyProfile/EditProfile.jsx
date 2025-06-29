import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Containers } from "../../components/Container";
import { H2, Pargrahph } from "../../components/typography";
import {
  EditProfileWrapper,
  EditForm,
  SaveButton,
  UploadImg,
  ErrorText,
} from "./style";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role || "طالب",
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
      if (file.size > MAX_FILE_SIZE) {
        setError("profileImage", {
          type: "manual",
          message: "يجب أن يكون حجم الصورة أقل من 2 ميجابايت",
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
      formData.append("role", data.role);
      formData.append("bio", data.bio);
      if (imageFile) formData.append("profileImage", imageFile);

      const response = await fetch("https://api.example.com/user/update", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("فشل في تحديث الملف الشخصي");

      const updatedUser = {
        ...data,
        profileImage: imagePreview,
        joinedAt: "2024",
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("تم تحديث الملف الشخصي بنجاح!");
      navigate("/user-profile");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ ما. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EditProfileWrapper>
      <Containers>
        <H2>تعديل الملف الشخصي</H2>
        <Pargrahph>قم بتحديث بيانات حسابك أدناه</Pargrahph>

        <EditForm
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          noValidate
        >
          <UploadImg
            src={imagePreview || "https://via.placeholder.com/150"}
            alt="الصورة الشخصية"
            onClick={() => fileInputRef.current.click()}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current.click()}
            role="button"
            aria-label="رفع صورة الملف الشخصي"
            title="اضغط أو اضغط Enter لتغيير الصورة"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
            aria-describedby="profileImageError"
          />
          {errors.profileImage && (
            <ErrorText id="profileImageError">
              {errors.profileImage.message}
            </ErrorText>
          )}

          <label htmlFor="name">
            الاسم:
            <input
              id="name"
              type="text"
              {...register("name", { required: "الاسم مطلوب" })}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby="nameError"
            />
            {errors.name && (
              <ErrorText id="nameError">{errors.name.message}</ErrorText>
            )}
          </label>

          <label htmlFor="email">
            البريد الإلكتروني:
            <input
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
          </label>

          <label htmlFor="role">
            الدور:
            <input id="role" type="text" {...register("role")} />
          </label>

          <label htmlFor="bio">
            النبذة:
            <textarea id="bio" {...register("bio")} rows={4} />
          </label>

          <SaveButton
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </SaveButton>
        </EditForm>
      </Containers>
    </EditProfileWrapper>
  );
}

export default EditProfile;
