import { useState, useMemo, useContext, useEffect } from "react";
import SideBar from "../../layout/sideBar";
import { LogoAndButton } from "../../components/LogoAndButton";
import { Containers } from "../../components/Container";
import FilterMenuItem from "../../components/MenuItem/FilterMenuItem";
import { CardSkeleton } from "../../components/Loading/LoadingCard";
import { Card } from "../../components/card/courseCard";
import { useApi } from "../../hooks/useApi";
import { API_URL } from "../../config";
import { Typography } from "@mui/material";
import { WrapperCards } from "../Main/style";
import { NavBar } from "../../layout/navBar";
import { DataCourses } from "../../context/DataCourses";
import { NewOldContext } from "../../context/NewOldContext";
import Paginations from "../../components/paginations";
import { CoursesPageWraper } from "./style";

const Courses = () => {
  // Fetch course data from API using custom useApi hook
  const {
    data: fetchedCourses = [],
    isLoading,
    error,
  } = useApi(`${API_URL}/courses/`);



  // Global course data context and state setter
  const { dataCourses, setDataCourses } = useContext(DataCourses);

  // Context to determine whether to sort courses as newest or oldest
  const { isNew } = useContext(NewOldContext);

  // When fetchedCourses updates, store them in the global course context
  useEffect(() => {
    if (fetchedCourses.length > 0) {
      setDataCourses(fetchedCourses);
    }
  }, [fetchedCourses, setDataCourses]);

  // Local state to keep track of selected filter options
  const [filters, setFilters] = useState({
    names: [],
    branches: [],
    types: [],
    prices: [],
  });

  // Extract unique course names for course name filters
  const courseNames = useMemo(() => {
    const names = dataCourses.map((course) => course.name);
    return [...new Set(names)];
  }, [dataCourses]);

  // Helper function to normalize Arabic strings by removing "ال" prefix
  const normalizeArabic = (str) => {
    if (!str) return "";
    return str.startsWith("ال") ? str.slice(2) : str;
  };

  // Update filters based on checkbox changes
  const handleFilterChange = (id, isChecked) => {
    const [type, value] = id.split("-");
    setFilters((prev) => {
      const updated = { ...prev };
      if (type === "course") {
        const courseName = courseNames[parseInt(value, 10)];
        updated.names = isChecked
          ? [...prev.names, courseName]
          : prev.names.filter((name) => name !== courseName);
      } else if (type === "branch") {
        updated.branches = isChecked
          ? [...prev.branches, value]
          : prev.branches.filter((v) => v !== value);
      } else if (type === "type") {
        updated.types = isChecked
          ? [...prev.types, value]
          : prev.types.filter((v) => v !== value);
      } else if (type === "price") {
        updated.prices = isChecked
          ? [...prev.prices, value]
          : prev.prices.filter((v) => v !== value);
      }
      return updated;
    });
  };

  // Filter courses based on active filters
  const filteredCourses = useMemo(() => {
    return dataCourses.filter((course) => {
      const name = course.name || "";
      const branchName = course.branches?.[0]?.name || "";
      const normalizedBranch = normalizeArabic(branchName);

      // Course name filter
      const matchName =
        filters.names.length === 0 ||
        filters.names.some((filterName) =>
          normalizeArabic(name.toLowerCase()).includes(
            normalizeArabic(filterName.toLowerCase())
          )
        );

      // Course branch filter
      const matchBranch =
        filters.branches.length === 0 ||
        filters.branches.some(
          (filterBranch) => filterBranch === normalizedBranch
        );

      // Course type filter (matches course name to type keywords)
      const matchType =
        filters.types.length === 0 ||
        filters.types.some((type) =>
          normalizeArabic(name.toLowerCase()).includes(
            normalizeArabic(type.toLowerCase())
          )
        );

      // Course price filter (free or under price limit)
      const matchPrice =
        filters.prices.length === 0 ||
        filters.prices.some((priceFilter) => {
          if (priceFilter === "free") return course.price === 0;
          return course.price <= parseInt(priceFilter, 10);
        });

      // Only return course if it matches all filter criteria
      return matchName && matchBranch && matchType && matchPrice;
    });
  }, [dataCourses, filters]);

  // Final sorting: show newest or oldest based on context
  const finalCourses = useMemo(() => {
    return isNew === "new"
      ? [...filteredCourses]
      : [...filteredCourses].reverse();
  }, [filteredCourses, isNew]);



  //variables for Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = finalCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(finalCourses.length / itemsPerPage);





  return (
    <CoursesPageWraper>
      <div>
        {/* Top branding section (logo + button) */}
        <LogoAndButton />
        {/* Navigation bar */}
        <NavBar />

        <Containers>
          {/* Filter menu items (buttons or tags, not checkboxes) */}
          <FilterMenuItem currentPage={currentPage} totalPages={totalPages} />

          <div style={{ display: "flex" }}>
            {/* Sidebar with filter checkboxes */}
            <SideBar
              courseNames={courseNames}
              onFilterChange={handleFilterChange}
            />

            {/* Main content: Course list or loading/error messages */}
            <div style={{ width: '80%' }}>
              {/* Loading state: show skeleton cards */}
              {isLoading ? (
                <WrapperCards>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <CardSkeleton key={i} />
                  ))}
                </WrapperCards>
              ) : error ? (
                // API error state
                <Typography color="error">فشل تحميل الدورات</Typography>
              ) : finalCourses.length === 0 ? (
                // No matching courses after filtering
                <Typography variant="body1">لا توجد دورات مطابقة.</Typography>
              ) : (
                // Render final filtered and sorted courses
                <WrapperCards>
                  {currentItems.map((item, index) => (
                 
                      < Card

                      
                      key = { index }
                      imgSrc = { item.img || "/assets/img/logo.png" }
                      name = { item.name }
                      starIcon = { item.averageRating }
                      price = { item.price }
                      priceAfterDiscount = { item.priceAfterDiscount }
                      teacherName = { item.teacher?.name }
                      teacherImg = { item.teacher?.img || "/assets/img/logo.png" }
                      branch = {
                        item.branches.map((branch) => {
                    return branch.name
                  }).join(' | ')
                      }
                      />
                  ))}

                </WrapperCards>
              )}

            </div>

          </div>
          {/* Pagination buttons */}
          {totalPages > 1 && <Paginations currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />}

        </Containers>
      </div>
    </CoursesPageWraper>
  );
};

export default Courses;
