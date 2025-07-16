//MUI Library
import { Label } from "@mui/icons-material";

//styles
import { FieldRow, LeaveCommentWrapper, SubmitButton, TextArea } from "./style";

//components
import { H3 } from "../typography";

//hooks
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_URL } from "../../config";

const CommentForm = ({ courseId, lessonId, from }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Submitted data:", data);
    try {
      // setReviewsLoading(true);

      let response = {};
      if (from === 'videoPage') {
        response = await axios.post(`${API_URL}/lessons/${lessonId}/comments`,
          {
            content: data.comment,
            // Assuming a default rating of 3
          },
          { withCredentials: true });

      } else if (from === 'coursePage') {
        response = await axios.post(`${API_URL}/courses/${courseId}/reviews`,
          {
            comment: data.comment,
            rating: 3, // Assuming a default rating of 3
          },
          { withCredentials: true });
      }


      console.log("Review posts successfully:", response);

      // Process reviews as needed
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {

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
          />
        </FieldRow>
        <SubmitButton type="submit">إرسال التعليق</SubmitButton>
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
