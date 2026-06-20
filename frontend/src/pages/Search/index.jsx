import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Search, Frown } from 'lucide-react';
import { MainLayout } from '../../shared/components/layout/MainLayout';
import { CourseCard } from '../../features/courses/components/CourseCard';
import { useDebounce } from '../../shared/hooks/useDebounce';
import { useSearch } from '../../features/search/useSearch';
import { PATH } from '../../constants';
import {
  PageWrapper, SearchHeader, SearchTitle, SearchMeta,
  Tabs, Tab, TabCount,
  SectionTitle, CoursesGrid, TeachersGrid,
  TeacherCard, TeacherAvatar, TeacherName, TeacherRole,
  EmptyState, EmptyTitle, EmptyText,
  SkeletonCard,
} from './Search.styles';

const TABS = [
  { key: 'all',      label: 'الكل' },
  { key: 'courses',  label: 'الكورسات', icon: <BookOpen size={14} /> },
  { key: 'teachers', label: 'المعلمون', icon: <Users    size={14} /> },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  const rawQuery = searchParams.get('q') ?? '';
  const [tab, setTab] = useState('all');

  // debounce the URL param itself so the page doesn't re-fetch on every keystroke
  // (the navbar already debounces navigation, but the user can also type in the URL)
  const debouncedQuery = useDebounce(rawQuery, 300);

  const { courses, teachers, isLoading, hasResults } = useSearch(debouncedQuery, { limit: 50 });

  // reset tab when query changes
  useEffect(() => { setTab('all'); }, [debouncedQuery]);

  const showCourses  = (tab === 'all' || tab === 'courses')  && courses.length  > 0;
  const showTeachers = (tab === 'all' || tab === 'teachers') && teachers.length > 0;
  const noResults    = !isLoading && debouncedQuery && !hasResults;

  const totalCount = courses.length + teachers.length;

  return (
    <MainLayout>
      <PageWrapper>
        {/* ── Header ── */}
        <SearchHeader>
          <SearchTitle>
            {rawQuery
              ? <>نتائج البحث عن: <span>"{rawQuery}"</span></>
              : 'البحث'}
          </SearchTitle>
          {!isLoading && debouncedQuery && (
            <SearchMeta>
              {hasResults
                ? `${totalCount} نتيجة`
                : 'لا توجد نتائج'}
            </SearchMeta>
          )}
        </SearchHeader>

        {/* ── Tabs ── */}
        {debouncedQuery && (
          <Tabs>
            {TABS.map(t => {
              const count = t.key === 'courses'
                ? courses.length
                : t.key === 'teachers'
                  ? teachers.length
                  : totalCount;
              return (
                <Tab
                  key={t.key}
                  $active={tab === t.key}
                  onClick={() => setTab(t.key)}
                >
                  {t.icon}
                  {t.label}
                  {!isLoading && count > 0 && (
                    <TabCount $active={tab === t.key}>{count}</TabCount>
                  )}
                </Tab>
              );
            })}
          </Tabs>
        )}

        {/* ── Loading skeleton ── */}
        {isLoading && (
          <>
            <CoursesGrid>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} $h="220px" />
              ))}
            </CoursesGrid>
          </>
        )}

        {/* ── No query yet ── */}
        {!debouncedQuery && !isLoading && (
          <EmptyState>
            <Search size={64} strokeWidth={1.2} />
            <EmptyTitle>ابحث عن كورس أو معلم</EmptyTitle>
            <EmptyText>
              اكتب في شريط البحث الكلمة التي تبحث عنها وستظهر النتائج هنا
            </EmptyText>
          </EmptyState>
        )}

        {/* ── No results ── */}
        {noResults && (
          <EmptyState>
            <Frown size={64} strokeWidth={1.2} />
            <EmptyTitle>لا توجد نتائج</EmptyTitle>
            <EmptyText>
              لم نجد أي كورسات أو معلمين تطابق "{rawQuery}"،
              حاول بكلمة أخرى
            </EmptyText>
          </EmptyState>
        )}

        {/* ── Courses section ── */}
        {!isLoading && showCourses && (
          <div>
            <SectionTitle>
              <BookOpen size={20} />
              الكورسات ({courses.length})
            </SectionTitle>
            <CoursesGrid>
              {courses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </CoursesGrid>
          </div>
        )}

        {/* ── Teachers section ── */}
        {!isLoading && showTeachers && (
          <div>
            <SectionTitle>
              <Users size={20} />
              المعلمون ({teachers.length})
            </SectionTitle>
            <TeachersGrid>
              {teachers.map(teacher => (
                <TeacherCard
                  key={teacher._id}
                  onClick={() => navigate(PATH.teacherProfile(teacher._id))}
                >
                  <TeacherAvatar>
                    {teacher.coverImage
                      ? <img src={teacher.coverImage} alt={teacher.name} />
                      : <span>{teacher.name?.charAt(0)?.toUpperCase()}</span>
                    }
                  </TeacherAvatar>
                  <TeacherName>{teacher.name}</TeacherName>
                  <TeacherRole>معلم معتمد</TeacherRole>
                </TeacherCard>
              ))}
            </TeachersGrid>
          </div>
        )}
      </PageWrapper>
    </MainLayout>
  );
}
