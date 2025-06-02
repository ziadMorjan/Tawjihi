//react
import { useState } from "react";

//style
import { Wrapper, WrapperCard, Wrappers, WrapperUl } from "./style";

//layouts
import { NavBar } from "../../layout/navBar";
import Footer from "../../layout/footer";

// components
import { H1, H2, Parg, Pargrahph } from "../../components/typography";
import { Containers } from "../../components/Container";
import SearchBar from "../../components/search";
import { LineColor } from "../../components/lineColor";
import { DiscoverSection } from "../../components/discoverSection";
import { Card } from "../../components/card";
import { ModalTeacher } from "../../components/modalTeacher";
import { LogoAndButton } from "../../components/LogoAndButton";

//Hooks

const MainPage = () => {
  const [active, setActive] = useState(false);
  const menuItems = ["الدورات المجانية", "احدث الدورات", "دورات الخصم"];

  const data = [
    {
      name: "محمد عبد الله",
      desc: "دورة أساسيات React",
      averageRating: 5,
      price: 49.99,
      teacherImg: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "أحمد منصور",
      desc: "تعلم JavaScript من الصفر",
      averageRating: 4,
      price: 0,
      teacherImg: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      name: "ليلى الخطيب",
      desc: "تصميم واجهات المستخدم UI/UX",
      averageRating: 3,
      price: 29.99,
      teacherImg: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  ];

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
        {menuItems.map((item, index) => {
          if (active === false) {
            setActive(1);
          }
          return (
            <li
              key={index}
              className={active === index ? "active" : ""}
              onClick={() => {
                setActive(index);
              }}
            >
              {item}
            </li>
          );
        })}
      </WrapperUl>
      <LineColor />
      <Containers>
        <WrapperCard>
          {data.map((item, index) => (
            <Card
              key={index}
              imgSrc="/assets/img/logo.png"
              name={item.name}
              desc={item.desc}
              starIcon={item.averageRating}
              price={item.price}
              teacherImg={item.teacherImg}
            />
          ))}
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
