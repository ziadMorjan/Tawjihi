// react
import { useState } from "react";

// style
import { Wrapper, WrapperCard, Wrappers, WrapperUl } from "./style";

// layouts
import { NavBar } from "../../layout/navBar";
import Footer from "../../layout/footer";

// components
import { H1, H2, Parg, Pargrahph } from "../../components/typography";
import { Containers } from "../../components/Container";
import SearchBar from "../../components/search";
import { LineColor } from "../../components/lineColor";
import { DiscoverSection } from "../../components/discoverSection";
import { Card } from "../../components/card/courseCard";
import { ModalTeacher } from "../../components/modalTeacher";
import { LogoAndButton } from "../../components/LogoAndButton";
import { CardSkeleton } from "../../components/Loading/LoadingCard";

// Hooks
import { useApi } from "../../hooks/useApi";

//Api
import { API_URL } from "../../config";

const MainPage = () => {
  const [active, setActive] = useState(1); // 0: Free, 1: Newest, 2: Discounted
  const menuItems = ["الدورات المجانية", "احدث الدورات", "دورات الخصم"];

  const { data, isLoading } = useApi(`${API_URL}/courses`);

  const filteredCourses = data.filter((course) => {
    if (active === 0) return course.price === 0;
    if (active === 1) return true;
    if (active === 2) return course.priceAfterDiscount !== undefined;
    return true;
  });

  return (
    <>
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
        <WrapperCard>
          {isLoading ? (
            // Show 3 loading skeleton cards
            Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
          ) : filteredCourses.length === 0 ? (
            <p>لا توجد دورات مطابقة.</p>
          ) : (
            filteredCourses
              .slice(0, 3)
              .map((item, index) => (
                <Card
                  key={index}
                  imgSrc="/assets/img/logo.png"
                  name={item.name}
                  starIcon={item.averageRating}
                  price={item.price}
                  priceAfterDiscount={item.priceAfterDiscount}
                  teacherName={item.teacher?.name}
                  teacherImg={item.teacher?.img || "/assets/img/logo.png"}
                />
              ))
          )}
        </WrapperCard>
      </Containers>

      <DiscoverSection />

      <Wrapper>
        <H2>عن معليمينا</H2>
        <Pargrahph>لدينا أكثر من 3250 مدربًا محترفًا وماهراً </Pargrahph>
        <LineColor />
      </Wrapper>

      <Containers>
        <WrapperCard>
          {data.map((teacher, index) => (
            <Card
              key={index}
              imgSrc={teacher.img || "/assets/img/logo.png"}
              name={teacher.name}
              desc={teacher.subject}
              starIcon={teacher.rating}
            />
          ))}
        </WrapperCard>
      </Containers>

      <Footer />
    </>
  );
};

export default MainPage;
