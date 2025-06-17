import { useParams } from "react-router-dom";
import { H2, H3, Pargrahph } from "../../components/typography";
import { Progress } from "../../components/progress";
import { CourseIcon } from "../../components/Icon/courseIcon";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";

import { StarRating } from "../../components/Star/starRating";
import {
  AboutCourseDiv,
  AvatarCircle,
  Container,
  CourseImage,
  DetailsWrapper,
  FieldRow,
  Label,
  LeaveCommentWrapper,
  LeftWrapper,
  MetaInfo,
  PageWrapper,
  ProgressRow,
  ReviewCard,
  ReviewContent,
  ReviewerName,
  ReviewHeader,
  ReviewList,
  ReviewSection,
  ReviewText,
  RightWrapper,
  StartButtonWrapper,
  StyledCourseWrapper,
  SubmitButton,
  TextArea,
  WatchText,
} from "./style";
import { Containers } from "../../components/Container";
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
import AnimatedList from "../../components/Animations/AnimatedList";
import { TeacherCard } from "../../components/card/teacherCard";
import { ModalTeacher } from "../../components/modalTeacher";

const CourseOne = () => {
  const { name } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data) => {
    console.log("تم إرسال التعليق:", data);
    // send to backend here
    reset(); // reset form after submission
  };

  const items = [
    { title: "مقدمة عن React", time: "05:30" },
    { title: "المكونات (Components)", time: "12:45" },
    { title: "مقدمة عن React", time: "05:30" },
    { title: "المكونات (Components)", time: "12:45" },
    { title: "مقدمة عن React", time: "05:30" },
    { title: "المكونات (Components)", time: "12:45" },
    { title: "مقدمة عن React", time: "05:30" },
    { title: "المكونات (Components)", time: "12:45" },
    { title: "مقدمة عن React", time: "05:30" },
    { title: "المكونات (Components)", time: "12:45" },
  ];

  return (
    <>
      <LogoAndButton />
      <NavBar />
      <PageWrapper />
      <ModalTeacher isOpen={false} />

      <Containers>
        <H2>تفاصيل الدورة</H2>
        <StyledCourseWrapper>
          <CourseImage src="/assets/img/learn.png" alt="صورة الدورة" />

          <DetailsWrapper>
            <ProgressRow>
              <Progress />
              <WatchText>نسبة المشاهدة 60%</WatchText>
            </ProgressRow>

            <div>
              <Label>البداية مع</Label>
              <H2>دورة {name}</H2>
              <Pargrahph>
                هذه الدورة مصممة لتزويدك بالمعرفة والمهارات الأساسية في مجال{" "}
                {name}. ستتعلم من خلال مجموعة من الدروس التفاعلية والتمارين
                العملية التي ستساعدك على فهم المفاهيم الرئيسية وتطبيقها في
                سياقات حقيقية.
              </Pargrahph>

              <MetaInfo>
                <CourseIcon icon="clock" text="13H" />
                <CourseIcon icon="star" text="4.5" />
              </MetaInfo>
            </div>

            <StartButtonWrapper>
              <Button variant="contained" color="primary">
                ابدأ الدورة الآن
              </Button>
            </StartButtonWrapper>
          </DetailsWrapper>
        </StyledCourseWrapper>

        <H2>الدروس </H2>

        <Container>
          <LeftWrapper>
            <AnimatedList
              items={items}
              onItemSelect={(item, index) => console.log(item, index)}
              showGradients={true}
              enableArrowNavigation={true}
              displayScrollbar={true}
            />
          </LeftWrapper>

          <RightWrapper>
            <TeacherCard
              id="123"
              name="أ. محمد النجار"
              desc="مدرس محترف لمواد الفيزياء والرياضيات"
              imgSrc="/images/mohammed.jpg"
              starIcon={4.5}
              badge="معلم"
            />
          </RightWrapper>
        </Container>

        <H3>حول الدورة</H3>
        <AboutCourseDiv>
          <H3>اسم الدورة</H3>
          <Pargrahph>
            هذه الدورة مصممة لتزويدك بالمعرفة والمهارات الأساسية في مجال
            الجغرافيا. ستتعلم من خلال مجموعة من الدروس التفاعلية والتمارين
            العملية التي ستساعدك على فهم المفاهيم الرئيسية وتطبيقها في سياقات
            حقيقية.هذه الدورة مصممة لتزويدك بالمعرفة والمهارات الأساسية في مجال
            الجغرافيا. ستتعلم من خلال مجموعة من الدروس التفاعلية والتمارين
            العملية التي ستساعدك على فهم المفاهيم الرئيسية وتطبيقها في سياقات
            حقيقية.هذه الدورة مصممة لتزويدك بالمعرفة والمهارات الأساسية في مجال
            الجغرافيا. ستتعلم من خلال مجموعة من الدروس التفاعلية والتمارين
            العملية التي ستساعدك على فهم المفاهيم الرئيسية وتطبيقها في سياقات
            حقيقية.
          </Pargrahph>
        </AboutCourseDiv>

        <H3>مراجعات الطلاب</H3>
        <ReviewSection>
          <ReviewList>
            <ReviewCard>
              <AvatarCircle>أ</AvatarCircle>
              <ReviewContent>
                <ReviewHeader>
                  <ReviewerName>أحمد خالد</ReviewerName>
                  <StarRating />
                </ReviewHeader>
                <ReviewText>
                  دورة ممتازة جدًا، استفدت منها كثيرًا والمحتوى كان واضح ومنظم.
                </ReviewText>
              </ReviewContent>
            </ReviewCard>

            <ReviewCard>
              <AvatarCircle>ل</AvatarCircle>
              <ReviewContent>
                <ReviewHeader>
                  <ReviewerName>ليلى محمد</ReviewerName>
                  <StarRating />
                </ReviewHeader>
                <ReviewText>
                  شرح رائع وأسلوب سهل، أنصح بها للمبتدئين.
                </ReviewText>
              </ReviewContent>
            </ReviewCard>
          </ReviewList>

          <LeaveCommentWrapper>
            <H3>أضف تعليقك</H3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldRow>
                <Label>تقييمك:</Label>
                <StarRating />
              </FieldRow>
              <FieldRow>
                <Label>تعليقك:</Label>
                <TextArea
                  placeholder="اكتب تعليقك هنا..."
                  {...register("comment", { required: "يرجى كتابة تعليقك" })}
                />
              </FieldRow>
              <SubmitButton type="submit">إرسال التعليق</SubmitButton>
              {errors.comment && (
                <span style={{ color: "red", fontSize: "13px" ,margin:"0px 10px" }}>
                  {errors.comment.message}
                </span>
              )}
            </form>
          </LeaveCommentWrapper>
        </ReviewSection>
      </Containers>
    </>
  );
};

export default CourseOne;
