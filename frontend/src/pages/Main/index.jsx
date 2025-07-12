//react
import { useEffect, useState, useContext, useMemo } from "react";
import { Link } from "react-router-dom";

// style
import { Wrapper, WrapperCards, Wrappers, WrapperUl } from "./style";

// layouts Components
import { NavBar } from "../../layout/navBar";
import Footer from "../../layout/footer";

// components
import { H1, H2, Parg, Pargrahph } from "../../components/typography";
import { Containers } from "../../components/Container";
import SearchBar from "../../components/search";
import { LineColor } from "../../components/lineColor";
import { DiscoverSection } from "../../components/discoverSection";
import { Card, CourseCard } from "../../components/card/courseCard";
import { ModalTeacher } from "../../components/modalTeacher";
import { LogoAndButton } from "../../components/LogoAndButton";
import { CardSkeleton } from "../../components/Loading/LoadingCard";
import {SkeletonTeacherCard} from "../../components/Loading/SkeletonTeacherCard"
import { TeacherCard } from "../../components/card/teacherCard";

// hooks
import { useApi } from "../../hooks/useApi";

// URL
import { API_URL } from "../../config";

// context
import { LogOutContext } from "../../context/LogoutContext";

// MUI Library
import { Button } from "@mui/material";

//Path
import { PATH } from "../../routes";

//toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCRUD } from "../../hooks/useCRUD";

const MainPage = () => {
  const { isLogout, setIsLogout } = useContext(LogOutContext);
  const [active, setActive] = useState(1); // 0: Free, 1: Newest, 2: Discounted

  const menuItems = ["الدورات المجانية", "احدث الدورات", "دورات الخصم"];

  const { data: dataCourses, isLoading } = useApi(`${API_URL}/courses/`);
  const { data: dataTeachers } = useApi(
    `    ${API_URL}/users/?role=teacher&isActive=true&limit=3`
  );

  console.log("data is ", dataCourses);

  //filteredCourses
  const filteredCourses = useMemo(() => {
    return dataCourses.filter((course) => {
      if (active === 0) return course.price === 0;
      if (active === 1) return true;
      if (active === 2) return course.priceAfterDiscount !== undefined;
      return true;
    });
  }, [dataCourses, active]);

  useEffect(() => {
    if (isLogout) {
      setIsLogout(false); // إعادة الحالة الافتراضية بعد التحديث
    }
  }, [isLogout, setIsLogout]);
  return (
    <>
      <ToastContainer />

      <ModalTeacher isOpen="true" />
      <LogoAndButton />
      <NavBar />

      <Wrappers>
        <Containers>
          <H1 size="2rem" color="#fff">
            تعلم الدورات عبر الانترنت
          </H1>
          <Parg size="2rem">تعلّم كل موضوع في الوقت المحدد في كل مرة</Parg>
          <SearchBar />
        </Containers>
      </Wrappers>

      <WrapperUl>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={active === index ? "active" : ""}
            onClick={() => setActive(index)}
          >
            {item}
          </li>
        ))}
      </WrapperUl>

      <LineColor />

      <Containers>
        <WrapperCards>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          ) : filteredCourses.length === 0 ? (
            <p>لا توجد دورات مطابقة.</p>
          ) : (
            filteredCourses
              .slice(0, 3)
              .map((item, index) => (
                <CourseCard
                  key={item._id}
                  item={item}
                  id={item._id}
                  imgSrc={item.img || "/assets/img/logo.png"}
                  name={item.name}
                  starIcon={item.averageRating}
                  price={item.price}
                  priceAfterDiscount={item.priceAfterDiscount}
                  teacherName={item.teacher?.name}
                  teacherImg={item.teacher?.img || "/assets/img/logo.png"}
                  branch={item.branches.map((b) => b.name).join(" | ")}
                  subject={item.subject?.name}
                />
              ))
          )}
          {dataTeachers.length === 0 ? (
            <p style={{ color: "red", display: "block" }}>
              اتصال انترنت ضعيف يتم التحميل ...
            </p>
          ) : (
            <>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button style={{ width: "fit-content", display: "block" }}>
                  <Link to={`/${PATH.Courses}`}> عرض المزيد</Link>
                </Button>
              </div>
            </>
          )}
        </WrapperCards>
      </Containers>

      <DiscoverSection />

      <Wrapper>
        <H2>عن معليمينا</H2>
        <Pargrahph>لدينا أكثر من 3250 مدربًا محترفًا وماهراً</Pargrahph>
        <LineColor />
      </Wrapper>

      <Containers>
        <WrapperCards>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <SkeletonTeacherCard key={i} />
            ))
          ) : dataTeachers.length === 0 ? (
            <p>.لا يوجد معلمين</p>
          ) : (
            dataTeachers
              .slice(0, 3)
              .map((item, index) => (
                <TeacherCard
                  id={item._id}
                  name={item.name}
                  desc="مدرس محترف لمواد الفيزياء والرياضيات"
                  imgSrc={item.img || "/assets/img/logo.png"}
                  key={index}
                  starIcon={4.5}
                  badge="معلم"
                />
              ))
          )}

          {dataTeachers.length === 0 ? (
            <p style={{ color: "red", display: "block" }}>
              اتصال انترنت ضعيف يتم التحميل ...
            </p>
          ) : (
            <>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button style={{ width: "fit-content", display: "block" }}>
                  <Link to={`/${PATH.Teachers}`}> عرض المزيد</Link>
                </Button>
              </div>
            </>
          )}
        </WrapperCards>
      </Containers>
      <Footer />
    </>
  );
};

export default MainPage;
