// MUI
import { Label } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

// styles
import { FieldRow, LeaveCommentWrapper, SubmitButton, TextArea } from "./style";

// components
import { H3 } from "../typography";

// hooks
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../../config";
import { useState } from "react";

const CommentForm = ({ courseId, lessonId, from }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let response = {};
      if (from === "videoPage") {
        response = await axios.post(
          `${API_URL}/lessons/${lessonId}/comments`,
          {
            content: data.comment,
          },
          { withCredentials: true }
        );
      } else if (from === "coursePage") {
        response = await axios.post(
          `${API_URL}/courses/${courseId}/reviews`,
          {
            comment: data.comment,
            rating: 3, // default rating
          },
          { withCredentials: true }
        );
      }

      console.log("Review posted successfully:", response);
    } catch (error) {
      console.error("Error posting review:", error);
    } finally {
      setIsSubmitting(false);
      reset();
    }
  };

  return (
    <LeaveCommentWrapper>
      <H3>أضف تعليقك</H3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldRow>
          <Label>تعليقك:</Label>
          <TextArea
            placeholder="اكتب تعليقك هنا..."
            {...register("comment", { required: "يرجى كتابة تعليقك" })}
            disabled={isSubmitting}
          />
        </FieldRow>
        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <CircularProgress size={22} color="inherit" />
          ) : (
            "إرسال التعليق"
          )}
        </SubmitButton>
        {errors.comment && (
          <span style={{ color: "red", fontSize: "13px", margin: "0px 10px" }}>
            {errors.comment.message}
          </span>
        )}
      </form>
    </LeaveCommentWrapper>
  );
};

export default CommentForm;
