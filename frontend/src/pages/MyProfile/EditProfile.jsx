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
        role: user.role || "Student",
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
          message: "Only image files are allowed",
        });
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError("profileImage", {
          type: "manual",
          message: "Image size must be less than 2MB",
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

      // Simulated API call - replace URL with your API endpoint
      const response = await fetch("https://api.example.com/user/update", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update profile");

      // const result = await response.json(); // Uncomment for real API response

      const updatedUser = {
        ...data,
        profileImage: imagePreview,
        joinedAt: "2024",
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully!");
      navigate("/user-profile");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EditProfileWrapper>
      <Containers>
        <H2>Edit Profile</H2>
        <Pargrahph>Update your account details below</Pargrahph>

        <EditForm
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          noValidate
        >
          <UploadImg
            src={imagePreview || "https://via.placeholder.com/150"}
            alt="Profile"
            onClick={() => fileInputRef.current.click()}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current.click()}
            role="button"
            aria-label="Upload profile image"
            title="Click or press Enter to change profile image"
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
            Name:
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby="nameError"
            />
            {errors.name && (
              <ErrorText id="nameError">{errors.name.message}</ErrorText>
            )}
          </label>

          <label htmlFor="email">
            Email:
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
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
            Role:
            <input id="role" type="text" {...register("role")} />
          </label>

          <label htmlFor="bio">
            Bio:
            <textarea id="bio" {...register("bio")} rows={4} />
          </label>

          <SaveButton
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </SaveButton>
        </EditForm>
      </Containers>
    </EditProfileWrapper>
  );
}

export default EditProfile;
