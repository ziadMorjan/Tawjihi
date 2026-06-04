// src/features/courses/components/CoursesGrid/index.jsx
import styled from 'styled-components';
import {CourseCardSkeleton} from "../../features/courses/components/CourseCard/CourseCardSkeleton"
import {CourseCard} from "../../features/courses/components/CourseCard"

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const ErrorMsg = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

export function CoursesGrid({ courses = [], isLoading, isError }) {
  if (isError) {
    return <ErrorMsg>حدث خطأ أثناء تحميل الكورسات. حاول مجدداً.</ErrorMsg>;
  }

  if (isLoading) {
    return (
      <Grid>
        {Array.from({ length: 8 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </Grid>
    );
  }

  if (!courses.length) {
    return <ErrorMsg>لا توجد كورسات متاحة حالياً.</ErrorMsg>;
  }

  return (
    <Grid>
      {courses.map(course => (
        <CourseCard key={course._id} course={course} />
      ))}
    </Grid>
  );
}