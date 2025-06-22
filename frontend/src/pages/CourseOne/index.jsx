import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

// Components
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
import { ModalTeacher } from "../../components/modalTeacher";
import { Containers } from "../../components/Container";
import { H2, H3, Pargrahph } from "../../components/typography";
import AnimatedList from "../../components/Animations/AnimatedList";
import ReviewListSection from "../../components/ReviewListSection";
import CommentForm from "../../components/CommentForm";
import { StarRating } from "../../components/Star/starRating";
import { TeacherCard } from "../../components/card/teacherCard";
import Button from "@mui/material/Button";

// Style
import {
  CourseImage,
  StyledCourseWrapper,
  DetailsWrapper,
  LeftWrapper,
  RightWrapper,
  Container,
  ReviewSection,
} from "./style";
import { API_URL } from "../../config";
import Loading from "../../components/Loading";

const CourseOne = () => {
  const { name, id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    axios.get(`${API_URL}/courses/${id}`).then((res) => {
      setCourse(res.data.data.doc); // set the raw API object directly
    });
    axios.get(`${API_URL}/courses/${id}/lessons`).then((res) => {
      setLessons(res.data.data.docs);
    });
  }, [id]);

  const handleSelect = (item, index) => {
    setSelectedIndex(index);
    navigate(`/courses/${name}/${id}/video/${index}`, {
      state: { items: lessons },
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("تم إرسال التعليق:", data);
    reset();
  };

  if (!course) {
    return <Loading />; // simple loading fallback
  }

  return (
    <>
      <LogoAndButton />
      <NavBar />
      <ModalTeacher />

      <Containers>
        <H2>تفاصيل الدورة</H2>

        <StyledCourseWrapper>
          <CourseImage src="/assets/img/learn.png" alt="صورة الدورة" />
          <DetailsWrapper>
            <H2>دورة {course.name || name}</H2>
            <Pargrahph>
              {course.description || "وصف الدورة غير متاح حالياً."}
            </Pargrahph>
            <Button
              variant="contained"
              onClick={() => handleSelect(lessons[0], 0)}
              disabled={lessons.length === 0}
            >
              ابدأ الدورة الآن
            </Button>
          </DetailsWrapper>
        </StyledCourseWrapper>

        <H2>الدروس</H2>
        <Container>
          <LeftWrapper>
            <AnimatedList
              items={lessons}
              selectedIndex={selectedIndex}
              onItemSelect={handleSelect}
            />
          </LeftWrapper>

          <RightWrapper>
            <TeacherCard
              id={course.teacher?._id}
              name={course.teacher?.name || "معلم غير معروف"}
              desc="مدرس محترف لمواد الفيزياء والرياضيات"
              imgSrc="/images/mohammed.jpg" // Replace with teacher image if available
              starIcon={course.averageRating || 0}
              badge="معلم"
            />
          </RightWrapper>
        </Container>

        <H3>مراجعات الطلاب</H3>
        <ReviewSection>
          <ReviewListSection />
          <H3>أضف تقييمك</H3>
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
