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
import { useComments } from "../../context/CommentContext";

const CommentForm = ({ courseId, lessonId, from }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();


  const {
    course_comments,
    lesson_comments,
    isReviewsLoading,
    isReviewPosting,
    isReviewDeleting,
    isUpdating,

    getCourseComments,
    postCourseComment,
    deleteCourseComment,
    updateCourseComment,

    getLessonComments,
    postLessonComment,
    deleteLessonComment,
    updateLessonComment,

    error
  } = useComments()






  const onSubmit = async (data) => {

    if (from === "videoPage") {
      postLessonComment(lessonId, data.comment);

    } else if (from === "coursePage") {
      postCourseComment(courseId, data.comment);

      console.log(error)
    }

    reset();

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
            disabled={isReviewPosting}
          />
        </FieldRow>
        <SubmitButton type="submit" disabled={isReviewPosting}>
          {isReviewPosting ? (
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
