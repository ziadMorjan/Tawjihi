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

const CommentForm = ({ courseId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // setReviewsLoading(true);
      const response = await axios.post(`${API_URL}/lessons/${courseId}/comments`,
        { content: data.comment },
        { withCredentials: true });

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
