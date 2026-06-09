// src/pages/Courses/index.jsx
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import styled from "styled-components";
import { FiltersPanel } from "../../features/courses/components/FiltersPanel";
import { Pagination } from "../../features/courses/components/Pagination";
import { useCoursesFilters } from "../../features/courses/hooks/useCoursesFilters";
import { Input, Badge } from "../../shared/components";
import { MainLayout } from "../../shared/components/layout/MainLayout";
import { CoursesGrid } from "../../components/CoursesGrid";
import  useCourses from '../../features/courses/hooks/useCourses'
/* ─── Layout ─── */
const PageWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[6]}`};

  ${({ theme }) => theme.media.maxMd} {
    padding: ${({ theme }) => `${theme.spacing[6]} ${theme.spacing[4]}`};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize["3xl"]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  ${({ theme }) => theme.media.maxSm} {
    flex-wrap: wrap;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
  min-width: 200px;
`;

const MobileFilterBtn = styled.button`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  white-space: nowrap;
  transition: ${({ theme }) => theme.transitions.fast};

  ${({ theme }) => theme.media.maxMd} {
    display: flex;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: ${({ theme }) => theme.spacing[8]};
  align-items: start;

  ${({ theme }) => theme.media.maxMd} {
    grid-template-columns: 1fr;
  }
`;

const ResultsMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ResultsCount = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};

  strong {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`;

const ActiveFilters = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
`;

/* ─── Component ─── */
export default function Courses() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const { filters, setFilter, setPage, clearFilters, hasActiveFilters } =
    useCoursesFilters();

  // 🟡 نبني الـ params اللي بنرسلها للـ backend
  const queryParams = {
    ...(filters.keyword && { keyword: filters.keyword }),
    ...(filters.subject && { subject: filters.subject }),
    ...(filters.branch && { branch: filters.branch }),
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit,
  };

const { data: rawData, isLoading, isError } = useCourses(queryParams);

const courses    = rawData?.data?.docs ?? rawData?.data ?? [];
const totalPages = rawData?.pagination?.totalPages ?? rawData?.data?.pagination?.totalPages ?? 1;
const totalItems = rawData?.pagination?.totalResults ?? courses.length;

  // Search مع debounce بسيط
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    // نطبق الـ search بعد 500ms من آخر كتابة
    clearTimeout(window._searchTimeout);
    window._searchTimeout = setTimeout(() => {
      setFilter("keyword", value);
    }, 500);
  };

  return (
    <MainLayout>
      <PageWrapper>
        <PageHeader>
          <PageTitle>جميع الكورسات</PageTitle>
          <PageSubtitle>
            اكتشف كورساتنا الشاملة لجميع مواد التوجيهي
          </PageSubtitle>
        </PageHeader>

        {/* Search + Mobile Filter Toggle */}
        <TopBar>
          <SearchWrapper>
            <Input
              placeholder="ابحث عن كورس..."
              value={searchInput}
              onChange={handleSearchChange}
              leftIcon={<Search size={18} />}
            />
          </SearchWrapper>

          <MobileFilterBtn onClick={() => setMobileFiltersOpen(true)}>
            <SlidersHorizontal size={16} />
            فلترة
            {hasActiveFilters && (
              <Badge
                variant="primary"
                style={{ padding: "0 6px", minWidth: 18 }}
              >
                !
              </Badge>
            )}
          </MobileFilterBtn>
        </TopBar>

        <ContentGrid>
          {/* Filters Sidebar */}
          <FiltersPanel
            filters={filters}
            setFilter={setFilter}
            clearFilters={clearFilters}
            hasActiveFilters={hasActiveFilters}
            mobileOpen={mobileFiltersOpen}
          />

          {/* Mobile Overlay Close */}
          {mobileFiltersOpen && (
            <div
              onClick={() => setMobileFiltersOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                zIndex: 199,
                display: "none",
              }}
            />
          )}

          {/* Results */}
          <div>
            <ResultsMeta>
              <ResultsCount>
                {isLoading ? (
                  "جارٍ التحميل..."
                ) : (
                  <>
                    عُثر على <strong>{totalItems}</strong> كورس
                  </>
                )}
              </ResultsCount>

              {/* Active Filter Badges */}
              {hasActiveFilters && (
                <ActiveFilters>
                  {filters.keyword && (
                    <Badge
                      variant="primary"
                      icon={
                        <X
                          size={12}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSearchInput("");
                            setFilter("keyword", "");
                          }}
                        />
                      }
                    >
                      {filters.keyword}
                    </Badge>
                  )}
                </ActiveFilters>
              )}
            </ResultsMeta>

            <CoursesGrid
              courses={courses}
              isLoading={isLoading}
              isError={isError}
            />

            <Pagination
              currentPage={filters.page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </ContentGrid>
      </PageWrapper>
    </MainLayout>
  );
}
