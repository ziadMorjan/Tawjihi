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
import { useApi } from "../../hooks/useApi";



const MainPage = () => {
  const [active, setActive] = useState(false);
  const menuItems = ["الدورات المجانية", "احدث الدورات", "دورات الخصم"];

  const {data ,isLoading} = useApi('http://10.10.10.59:5000/api/v1/courses')
  return (
    <>
      <ModalTeacher isOpen="true" />
<LogoAndButton/>
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
  {isLoading ? (
    <p>Loading...</p>
  ) : (
    data.map((item, index) => (
      <Card
        key={index}
        imgSrc="/assets/img/logo.png"
        name={item.name}
        desc={item.desc}
        starIcon={item.averageRating}
        price={item.price}
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
          {data.map((item) => {
            return (
              <Card
                imgSrc="/assets/img/logo.png"
                name="علي حسن"
                desc="اللغة العربية"
                starIcon="5"
              />
            );
          })}
        </WrapperCard>
      </Containers>
      <Footer />
    </>
  );
};

export default MainPage;
