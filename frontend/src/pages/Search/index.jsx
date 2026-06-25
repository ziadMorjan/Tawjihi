import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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

const TABS = (t) => [
  { key: 'all',      label: t('common.all') },
  { key: 'courses',  label: t('nav.courses'), icon: <BookOpen size={14} /> },
  { key: 'teachers', label: t('nav.teachers'), icon: <Users    size={14} /> },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { t }          = useTranslation();

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
              ? <>{t('search.title')}: <span>"{rawQuery}"</span></>
              : t('search.title')}
          </SearchTitle>
          {!isLoading && debouncedQuery && (
            <SearchMeta>
              {hasResults
                ? `${totalCount} ${t('search.results')}`
                : t('search.noResults')}
            </SearchMeta>
          )}
        </SearchHeader>

        {/* ── Tabs ── */}
        {debouncedQuery && (
          <Tabs>
            {TABS(t).map(tabItem => {
              const count = tabItem.key === 'courses'
                ? courses.length
                : tabItem.key === 'teachers'
                  ? teachers.length
                  : totalCount;
              return (
                <Tab
                  key={tabItem.key}
                  $active={tab === tabItem.key}
                  onClick={() => setTab(tabItem.key)}
                >
                  {tabItem.icon}
                  {tabItem.label}
                  {!isLoading && count > 0 && (
                    <TabCount $active={tab === tabItem.key}>{count}</TabCount>
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
            <EmptyTitle>{t('search.searchEmpty')}</EmptyTitle>
            <EmptyText>{t('search.searchEmptySub')}</EmptyText>
          </EmptyState>
        )}

        {/* ── No results ── */}
        {noResults && (
          <EmptyState>
            <Frown size={64} strokeWidth={1.2} />
            <EmptyTitle>{t('search.noResults')}</EmptyTitle>
            <EmptyText>
              {t('search.noResultsSub')}
            </EmptyText>
          </EmptyState>
        )}

        {/* ── Courses section ── */}
        {!isLoading && showCourses && (
          <div>
            <SectionTitle>
              <BookOpen size={20} />
              {t('nav.courses')} ({courses.length})
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
              {t('nav.teachers')} ({teachers.length})
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
                  <TeacherRole>{t('teachers.certified')}</TeacherRole>
                </TeacherCard>
              ))}
            </TeachersGrid>
          </div>
        )}
      </PageWrapper>
    </MainLayout>
  );
}
