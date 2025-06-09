import { useState, useMemo } from "react";
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

const Courses = () => {
    const {
        data: allCourses = [],
        isLoading,
        error,
    } = useApi(`${API_URL}/courses/`);

    const [selectedFilters, setSelectedFilters] = useState([]);

    const toggleFilter = (id) => {
        setSelectedFilters((prev) =>
            prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
        );
    };

    const resetFilters = () => {
        setSelectedFilters([]);
        localStorage.removeItem("search");
    };

    const search = (localStorage.getItem("search") || "").toLowerCase();

    const courseNameToFilterId = {
        العربية: "course-arabic",
        العربي: "course-arabic",
        arabic: "course-arabic",

        الإنجليزية: "course-english",
        الانجليزية: "course-english",
        انجليزية: "course-english",
        english: "course-english",

        الرياضيات: "course-math",
        رياضيات: "course-math",
        math: "course-math",

        الفيزياء: "course-physics",
        فيزياء: "course-physics",
        physics: "course-physics",

        الكيمياء: "course-chemistry",
        كيمياء: "course-chemistry",
        chemistry: "course-chemistry",

        الأحياء: "course-biology",
        الاحياء: "course-biology",
        biology: "course-biology",

        التاريخ: "course-history",
        تاريخ: "course-history",
        history: "course-history",

        الجغرافيا: "course-geography",
        جغرافيا: "course-geography",
        geography: "course-geography",

        الإسلامية: "course-islamic",
        "التربية الاسلامية": "course-islamic",
        islamic: "course-islamic",
    };

    const filteredCourses = useMemo(() => {
        return allCourses.filter((course) => {
            const courseNameLower = (course.name || "").toLowerCase();
            const courseBranchId = `branch-${(course.branch || "").toLowerCase()}`;

            // Determine price tag
            let priceTag = "price-under-500";
            if (course.price === 0) priceTag = "price-free";
            else if (course.price <= 50) priceTag = "price-under-50";
            else if (course.price <= 100) priceTag = "price-under-100";
            else if (course.price <= 200) priceTag = "price-under-200";

            const courseTags = [courseBranchId, priceTag];

            const matchedCourseFilter = Object.entries(courseNameToFilterId).find(
                ([keyword]) => courseNameLower.includes(keyword.toLowerCase())
            );

            if (matchedCourseFilter) {
                courseTags.push(matchedCourseFilter[1]);
            }

            const matchesFilters =
                selectedFilters.length === 0 ||
                selectedFilters.every((filterId) => courseTags.includes(filterId));

            const matchesSearch = !search || courseNameLower.includes(search);

            return matchesFilters && matchesSearch;
        });
    }, [allCourses, courseNameToFilterId, selectedFilters, search]);

    return (
        <div>
            <LogoAndButton />
            <NavBar />
            <Containers>
                <FilterMenuItem />
                <div style={{ display: "flex" }}>
                    <SideBar
                        branches={[
                            { id: "branch-science", text: "العلمي" },
                            { id: "branch-arts", text: "الأدبي" },
                        ]}
                        courses={[
                            { id: "course-arabic", text: "اللغة العربية" },
                            { id: "course-english", text: "اللغة الإنجليزية" },
                            { id: "course-math", text: "الرياضيات" },
                            { id: "course-physics", text: "الفيزياء" },
                            { id: "course-chemistry", text: "الكيمياء" },
                            { id: "course-biology", text: "الأحياء" },
                            { id: "course-history", text: "التاريخ" },
                            { id: "course-geography", text: "الجغرافيا" },
                            { id: "course-islamic", text: "التربية الإسلامية" },
                        ]}
                        prices={[
                            { id: "price-free", text: "مجاني" },
                            { id: "price-under-50", text: "أقل من 50" },
                            { id: "price-under-100", text: "أقل من 100" },
                            { id: "price-under-200", text: "أقل من 200" },
                            { id: "price-under-500", text: "أقل من 500" },
                        ]}
                        selectedFilters={selectedFilters}
                        onFilterChange={toggleFilter}
                        onReset={resetFilters}
                    />

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
                            <Typography color="error">فشل في تحميل الدورات.</Typography>
                        ) : filteredCourses.length === 0 ? (
                            <Typography variant="body1">لا توجد دورات مطابقة.</Typography>
                        ) : (
                            <WrapperCards>
                                {filteredCourses.map((item, index) => (
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
