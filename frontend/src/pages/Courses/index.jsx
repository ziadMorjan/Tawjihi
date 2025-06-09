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
import { useState } from "react";
import { useEffect } from "react";


const Courses = () => {
  const { data: dataCourses, isLoading, error } = useApi(`${API_URL}/courses/`);

  useEffect(()=>{
    console.log(dataCourses)
  }, [dataCourses])

  // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
  
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataCourses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dataCourses.length / itemsPerPage);

  return (
    <div>
      <LogoAndButton />
      <Containers>
        <FilterMenuItem currentPage={currentPage} totalPages={totalPages} />
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
                
                {currentItems.map((item, index) => (
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

             {/* Pagination buttons */}
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      disabled={index + 1 === currentPage}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>

          </div>
        </div>
      </Containers>
    </div>
  );
};

export default Courses;
