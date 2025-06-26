import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
  ProgressRow,
  WatchText,
  MetaInfo,
  StartButtonWrapper,
} from "./style";
import { API_URL } from "../../config";
import axios from "axios";
import { LoginAndRegisterButton } from "../../components/loginButtonAndRegister";
import { Label } from "@mui/icons-material";

const CourseOne = () => {
  const [thisCourse, setThisCourse] = useState({});
  const [enrollmentCourses, setEnrollmentCourses] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  const { name, id: courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // check if this course is enrolled or not
  const isEnrolled = enrollmentCourses.some(
    (enrolled) => enrolled?.course._id === courseId
  );

  useEffect(() => {
    const getCourse = async () => {
      try {
        setDataLoading(true);
        // get this course data
        const res = await axios.get(`${API_URL}/courses/${courseId}`, {
          withCredentials: true,
        });

        if (res) {
          setThisCourse(res.data.data.doc);
          console.log(res.data.data.doc, "current course data");
        }

        // get the enrollment courses
        const enrollmentsRes = await axios.get(
          `${API_URL}/enrollments?user=${userId}`,
          {
            withCredentials: true,
          }
        );

        if (enrollmentsRes) {
          setEnrollmentCourses(enrollmentsRes.data.data.docs);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setDataLoading(false);
      }
    };
    getCourse();
  }, []);

  const handleSelect = (item, index) => {
    setSelectedIndex(index);
    navigate(`/courses/${name}/video/${index}`, {
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

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);

      const course_ids = [courseId];
      const res = await axios.post(
        `${API_URL}/payment/create-checkout-session`,
        { ids: course_ids },
        {
          withCredentials: true,
        }
      );
      window.location.href = res.data.sessionUrl;
    } catch (e) {
      console.log(e);
    } finally {
      setPaymentLoading(false);
    }
  };

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
            <ProgressRow>
              {/* <Progress /> */}
              <WatchText>نسبة المشاهدة 60%</WatchText>
            </ProgressRow>

            <div>
              <Label>البداية مع</Label>
              <H2>دورة {thisCourse.name}</H2>
              <Pargrahph>
                {thisCourse.description || "وصف الدورة غير متوفر."}
              </Pargrahph>

              <MetaInfo>
                {/* <CourseIcon icon="clock" text="13H" />
                <CourseIcon icon="star" text="4.5" /> */}
              </MetaInfo>
            </div>

            <StartButtonWrapper>
              {isEnrolled ? (
                <Button variant="contained" color="primary">
                  ابدأ الدورة الآن
                </Button>
              ) : (
                <LoginAndRegisterButton
                  fontSize={18}
                  onClick={handlePayment}
                  isDisabled={paymentLoading}
                >
                  {paymentLoading ? (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span className="spinner" /> جاري المعالجة...
                    </span>
                  ) : (
                    "شراء "
                  )}
                </LoginAndRegisterButton>
              )}
            </StartButtonWrapper>
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
              id={thisCourse.teacher?._id}
              name={thisCourse.teacher?.name || "معلم غير معروف"}
              desc="مدرس محترف لمواد الفيزياء والرياضيات"
              imgSrc="/images/mohammed.jpg" // Replace with teacher image if available
              starIcon={thisCourse.averageRating || 0}
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
