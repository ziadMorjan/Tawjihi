import { useParams } from "react-router-dom";
import React, { useState } from "react";
import { API_URL } from "../../config";
import { useProfileApi } from "../../hooks/useProfileApi";
import { LogoAndButton } from "../../components/LogoAndButton";
import { NavBar } from "../../layout/navBar";
import { Containers } from "../../components/Container";
import { useApi } from "../../hooks/useApi";

import { H2, H3, Pargrahph } from "../../components/typography";
import { Card } from "../../components/card/courseCard";
import { TeacherProfileWraper } from "./style";
import { DownloadButton } from "../../components/Buttons/downloadCv";
import { WrapperCards } from "../Main/style";
import { CardSkeleton } from "../../components/Loading/LoadingCard";
import { Typography } from "@mui/material";
import Paginations from "../../components/paginations";
import FilterMenuItem from "../../components/MenuItem/FilterMenuItem";

//utils
import { paginate } from "../../utils/pagination";

function TeacherProfile() {
  const { id } = useParams();
  const { data, isLoading, error } = useProfileApi(`${API_URL}/users/${id}`);
  const profileData = data.doc;

  const { data: fetchedCourses = [] } = useApi(`${API_URL}/courses/`);

  const teacherCourses = fetchedCourses.filter(
    (course) => course?.teacher._id === id
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const { currentItems, totalPages } = paginate(
    teacherCourses,
    currentPage,
    itemsPerPage
  );

  return (
    <TeacherProfileWraper>
      <LogoAndButton />
      <NavBar />

      {/* القسم العلوي: معلومات المعلم */}
      <section className="img-sec">
        <Containers>
          <img
            src={
              "https://th.bing.com/th/id/OIP.x2wDWv8Y8uPFo00LXaOGxAHaHa?w=199&h=200&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"
            }
            alt="صورة المعلم"
          />
          <div>
            <H2>{profileData?.name}</H2>
            <Pargrahph>{profileData?.email}</Pargrahph>
            <Pargrahph>{profileData?.phone}</Pargrahph>
          </div>
        </Containers>
      </section>

      <hr />

      {/* قسم النبذة */}
      <section>
        <div className="about-sec">
          <Containers>
            <H3>نبذة عن المعلم</H3>
            <Pargrahph>{profileData?.description}</Pargrahph>

            <DownloadButton
              href={profileData?.cv}
              download={`${profileData?.name}_CV.pdf`}
            >
              تحميل السيرة الذاتية
            </DownloadButton>
          </Containers>
        </div>
      </section>

      <hr />

      {/* قسم الدورات */}
      <section>
        <Containers>
          <H3>{`الدورات (${teacherCourses.length})`}</H3>

          {teacherCourses.length ? (
            <FilterMenuItem
              currentPage={currentPage}
              totalPages={totalPages}
              order={false}
            />
          ) : null}

          {isLoading ? (
            <WrapperCards>
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </WrapperCards>
          ) : error ? (
            <Typography color="error">فشل تحميل الدورات</Typography>
          ) : teacherCourses.length === 0 ? (
            <Typography variant="body1">لا توجد دورات حتى الآن.</Typography>
          ) : (
            <WrapperCards>
              {currentItems.map((item) => (
                <Card
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
              ))}
            </WrapperCards>
          )}

          {totalPages > 1 && (
            <Paginations
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </Containers>
      </section>
    </TeacherProfileWraper>
  );
}

export default TeacherProfile;
