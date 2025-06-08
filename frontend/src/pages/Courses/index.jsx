//layouts component 
import SideBar from "../../layout/sideBar";
//components
import { LogoAndButton } from "../../components/LogoAndButton";
import { Containers } from "../../components/Container";
import FilterMenuItem from "../../components/MenuItem/FilterMenuItem";
import { CardSkeleton } from "../../components/Loading/LoadingCard";
import { Card } from "../../components/card/courseCard";
//hooks
import { useApi } from "../../hooks/useApi";

//URL
import { API_URL } from "../../config";

//MUI components
import { Typography } from "@mui/material";
import { WrapperCards } from "../Main/style";


const Courses = () => {
  const { data: dataCourses, isLoading, error } = useApi(`${API_URL}/courses/`);

  return (
    <div>
      <LogoAndButton />
      <Containers>
        <FilterMenuItem />
        <div style={{ display: "flex" }}>
          <SideBar />
          <div
            style={{
              flexGrow: 1,
              padding: "1rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {isLoading ? (
              <WrapperCards>
                {Array.from({ length: 3 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </WrapperCards>
            ) : error ? (
              <Typography color="error">Failed to load courses</Typography>
            ) : dataCourses.length === 0 ? (
              <Typography variant="body1">لا توجد دورات مطابقة.</Typography>
            ) : (
              <WrapperCards>
                {dataCourses.map((item, index) => (
                  <Card
                    key={index}
                    imgSrc={item.img || "/assets/img/logo.png"}
                    name={item.name}
                    starIcon={item.averageRating}
                    price={item.price}
                    priceAfterDiscount={item.priceAfterDiscount}
                    teacherName={item.teacher?.name}
                    teacherImg={item.teacher?.img || "/assets/img/logo.png"}
                  />
                ))}
              </WrapperCards>
            )}
          </div>
        </div>
      </Containers>
    </div>
  );
};

export default Courses;
