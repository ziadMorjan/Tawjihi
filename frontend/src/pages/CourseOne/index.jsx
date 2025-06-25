// CourseOne.jsx (refactored with subcomponents)

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { API_URL } from "../../config";
import axios from "axios";
import { LoginAndRegisterButton } from "../../components/loginButtonAndRegister";

const CourseOne = () => {
  const [thisCourse, setThisCourse] = useState({})
  const [enrollmentCourses, setEnrollmentCourses] = useState([])
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);


  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?._id;

  const { name, id: courseId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(-1);


  // check if this course is enrolled or not 
  const isEnrolled = enrollmentCourses.some(
    (enrolled) => enrolled?.course._id === courseId
  );




  useEffect(() => {
    const getCourse = async () => {
      try {
        setDataLoading(true)
        // get this course data 
        const res = await axios.get(`${API_URL}/courses/${courseId}`, {
          withCredentials: true,
        })

        if (res) {
          setThisCourse(res.data.data.doc)
        }

        // get the enrollment courses 
        const enrollmentsRes = await axios.get(`${API_URL}/enrollments?user=${userId}`, {
          withCredentials: true,
        });

        if (enrollmentsRes) {
          setEnrollmentCourses(enrollmentsRes.data.data.docs)
        }

      } catch (e) {
        console.log(e)
      } finally {
        setDataLoading(false)
      }
    }
    getCourse()
  }, [])



  // console.log(fetchedCourses, 'current course')

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



  const handlePayment = async () => {
      try {
        setPaymentLoading(true)

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

              {isEnrolled ? (
                <Button variant="contained" color="primary">
                  ابدأ الدورة الآن
                </Button>) : (
                <LoginAndRegisterButton
                  fontSize={18}
                  onClick={handlePayment}
                  isDisabled={paymentLoading}>

                  {paymentLoading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
