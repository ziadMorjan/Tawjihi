//react
import { useState, useMemo, useContext, useEffect } from "react";

//style
import { CoursesPageWraper } from "./style";

//layout components
import SideBar from "../../layout/sideBar";
import { NavBar } from "../../layout/navBar";

//components
import { LogoAndButton } from "../../components/LogoAndButton";
import { Containers } from "../../components/Container";
import FilterMenuItem from "../../components/MenuItem/FilterMenuItem";
import { CardSkeleton } from "../../components/Loading/LoadingCard";
import { Card } from "../../components/card/courseCard";
import Paginations from "../../components/paginations";
import { ModalTeacher } from "../../components/modalTeacher";

//hooks
import { useApi } from "../../hooks/useApi";

//URL
import { API_URL } from "../../config";

//MUI Library
import { Typography } from "@mui/material";
import { WrapperCards } from "../Main/style";

//context
import { DataCourses } from "../../context/DataCourses";
import { NewOldContext } from "../../context/NewOldContext";
import { SearchContext } from "../../context/SearchContext";

//utils function
import { normalizeArabic } from "../../utils/normlizeArabic";


//toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Courses = () => {
  const {
    data: fetchedCourses = [],
    isLoading,
    error,
  } = useApi(`${API_URL}/courses/`);

  const { dataCourses, setDataCourses } = useContext(DataCourses);
  const { isNew } = useContext(NewOldContext);
  const { search, setSearch } = useContext(SearchContext);

  useEffect(() => {
    if (fetchedCourses.length > 0) {
      setDataCourses(fetchedCourses);
    }
  }, [fetchedCourses, setDataCourses]);

  const [filters, setFilters] = useState({
    names: [],
    branches: [],
    subjects: [],
    prices: [],
  });

  const courseNames = useMemo(() => {
    const names = dataCourses.map((course) => course.name);
    return [...new Set(names)];
  }, [dataCourses]);

  const handleFilterChange = (id, isChecked) => {
    const [type, value] = id.split("-");
    setFilters((prev) => {
      const updated = { ...prev };
      if (type === "branch") {
        updated.branches = isChecked
          ? [...prev.branches, value]
          : prev.branches.filter((v) => v !== value);
      } else if (type === "subject") {
        updated.subjects = isChecked
          ? [...prev.subjects, value]
          : prev.subjects.filter((v) => v !== value);
      } else if (type === "price") {
        updated.prices = isChecked
          ? [...prev.prices, value]
          : prev.prices.filter((v) => v !== value);
      }
      return updated;
    });
    setSearch("");
  };

  const filteredCourses = useMemo(() => {
    return dataCourses.filter((course) => {
      const name = course.name || "";
      const normalizedName = normalizeArabic(name.toLowerCase());

      const normalizedBranches = (course.branches || []).map((b) =>
        normalizeArabic(b.name.toLowerCase())
      );

      const normalizedSubject = normalizeArabic(
        course.subject?.name?.toLowerCase() || ""
      );

      const matchName =
        filters.names.length === 0 ||
        filters.names.some((filterName) =>
          normalizedName.includes(normalizeArabic(filterName.toLowerCase()))
        );

      const matchBranch =
        filters.branches.length === 0 ||
        filters.branches.some((filterBranch) =>
          normalizedBranches.includes(
            normalizeArabic(filterBranch.toLowerCase())
          )
        );

      const matchSubject =
        filters.subjects.length === 0 ||
        filters.subjects.some((subjectFilter) =>
          normalizedSubject.includes(
            normalizeArabic(subjectFilter.toLowerCase())
          )
        );

      const matchPrice =
        filters.prices.length === 0 ||
        filters.prices.some((priceFilter) => {
          if (priceFilter === "free") return course.price === 0;
          return course.price <= parseInt(priceFilter, 10);
        });

      const matchSearch =
        !search ||
        normalizedName.includes(normalizeArabic(search.toLowerCase()));

      return (
        matchName && matchBranch && matchSubject && matchPrice && matchSearch
      );
    });
  }, [dataCourses, filters, search]);

  const finalCourses = useMemo(() => {
    return isNew === "new"
      ? [...filteredCourses]
      : [...filteredCourses].reverse();
  }, [filteredCourses, isNew]);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = finalCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(finalCourses.length / itemsPerPage);

  return (
    <>
          <ToastContainer  />
    
      <ModalTeacher isopen="true" />
      <CoursesPageWraper>
        <div>
          <LogoAndButton />
          <NavBar />

          <Containers>
            <FilterMenuItem currentPage={currentPage} totalPages={totalPages} order={true}/>

            <div style={{ display: "flex" }}>
              <SideBar
                courseNames={courseNames}
                onFilterChange={handleFilterChange}
              />

              <div style={{ width: "80%" }}>
                {isLoading ? (
                  <WrapperCards>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <CardSkeleton key={i} />
                    ))}
                  </WrapperCards>
                ) : error ? (
                  <Typography color="error">فشل تحميل الدورات</Typography>
                ) : finalCourses.length === 0 ? (
                  <Typography variant="body1">لا توجد دورات مطابقة.</Typography>
                ) : (
                  <WrapperCards>
                    {currentItems.map((item, index) => (
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
              </div>
            </div>

            {totalPages > 1 && (
              <Paginations
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </Containers>
        </div>
      </CoursesPageWraper>
    </>
  );
};

export default Courses;
