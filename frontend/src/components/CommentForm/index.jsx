//MUI Library
import { Label } from "@mui/icons-material";

//styles
import { FieldRow, LeaveCommentWrapper, SubmitButton, TextArea } from "./style";

//components
import { H3 } from "../typography";

//hooks
import { useForm } from "react-hook-form";

const CommentForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log("تم إرسال التعليق:", data);
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
