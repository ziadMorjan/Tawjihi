// CourseOne.jsx (refactored with subcomponents)

import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";

// Layout & Components
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
import { ModalTeacher } from "../../components/modalTeacher";
import { Containers } from "../../components/Container";
import { H2, H3, Pargrahph } from "../../components/typography";
import { Progress } from "../../components/progress";
import { CourseIcon } from "../../components/Icon/courseIcon";
import { StarRating } from "../../components/Star/starRating";
import AnimatedList from "../../components/Animations/AnimatedList";
import { TeacherCard } from "../../components/card/teacherCard";
import Button from "@mui/material/Button";

// Subcomponents
import ReviewListSection from "../../components/ReviewListSection";
import CommentForm from "../../components/CommentForm";

// Style
import {
  AboutCourseDiv,
  Container,
  CourseImage,
  DetailsWrapper,
  Label,
  LeftWrapper,
  MetaInfo,
  PageWrapper,
  ProgressRow,
  RightWrapper,
  StartButtonWrapper,
  StyledCourseWrapper,
  WatchText,
  ReviewSection,
} from "./style";

const CourseOne = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(-1);

  const items = [
    {
      title: "الكيمياء",
      time: "05:30",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      resources: [
        {
          name: "ملف الكيمياء - PDF",
          url: "https://example.com/chemistry.pdf",
        },
        {
          name: "أمثلة كيمياء",
          url: "https://example.com/chemistry-examples.zip",
        },
      ],
    },
    {
      title: "الفيزياء",
      time: "12:45",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      resources: [
        {
          name: "ملف الفيزياء - PDF",
          url: "https://example.com/physics.pdf",
        },
      ],
    },
  ];
  

  const handleVideoClick = (item, index) => {
    navigate(`/courses/${name}/123/video/${index}`, { state: { items } });
  };

  const handleVideoSelect = (item, index) => {
    setCurrentIndex(index);
    handleVideoClick(item, index);
  };

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
                {name}.
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

        <H2>الدروس</H2>
        <Container>
          <LeftWrapper>
            <AnimatedList
              items={items}
              onItemSelect={handleVideoSelect}
              selectedIndex={currentIndex}
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
            الجغرافيا.
          </Pargrahph>
        </AboutCourseDiv>

        <H3>مراجعات الطلاب</H3>
        <ReviewSection>
          <ReviewListSection />

          <H3>اضف تقيمك </H3>
          <StarRating />

          <CommentForm
            register={register}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            errors={errors}
          />
        </ReviewSection>
      </Containers>
    </>
  );
};

export default CourseOne;
