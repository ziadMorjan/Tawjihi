// src/features/courses/components/CourseDetails/CourseCurriculum.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, PlayCircle, Lock, Clock } from 'lucide-react';
import { axiosInstance } from '../../../../shared/lib/axiosInstance';
import { useAuth } from '../../../auth';

const fetchLessons = async (courseId) => {
  const { data } = await axiosInstance.get('/lessons', {
    params: { course: courseId },
  });
  return data;
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const LessonItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.bgPrimary};
  transition: ${({ theme }) => theme.transitions.fast};
  cursor: ${({ $clickable }) => $clickable ? 'pointer' : 'default'};

  &:hover {
    background: ${({ $clickable, theme }) =>
      $clickable ? theme.colors.bgSecondary : theme.colors.bgPrimary
    };
    border-color: ${({ $clickable, theme }) =>
      $clickable ? theme.colors.borderStrong : theme.colors.border
    };
  }
`;

const LessonNumber = styled.span`
  min-width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.bgTertiary};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const LessonInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const LessonTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LessonMeta = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ShowMoreBtn = styled.button`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export function CourseCurriculum({ courseId, isEnrolled }) {
  const { user } = useAuth();
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['lessons', courseId],
    queryFn:  () => fetchLessons(courseId),
    enabled:  !!courseId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data ?? data?.lessons ?? data,
  });

  const lessons = Array.isArray(data) ? data : [];
  const visibleLessons = showAll ? lessons : lessons.slice(0, 5);

  if (isLoading) {
    return (
      <Wrapper>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{
            height: 60,
            borderRadius: 12,
            background: 'var(--skeleton-bg, #F1F5F9)',
            animation: 'pulse 1.5s infinite',
          }} />
        ))}
      </Wrapper>
    );
  }

  if (!lessons.length) return null;

  return (
    <div>
      <SectionTitle>محتوى الكورس ({lessons.length} درس)</SectionTitle>
      <Wrapper>
        {visibleLessons.map((lesson, index) => {
          const canAccess = isEnrolled || !!user?.role === 'admin';

          return (
            <LessonItem
              key={lesson._id}
              $clickable={canAccess}
            >
              <LessonNumber>{index + 1}</LessonNumber>

              <LessonInfo>
                <LessonTitle>{lesson.title ?? lesson.name}</LessonTitle>
                {lesson.duration && (
                  <LessonMeta>
                    <Clock size={12} />
                    {Math.round(lesson.duration / 60)} دقيقة
                  </LessonMeta>
                )}
              </LessonInfo>

              {canAccess
                ? <PlayCircle size={20} color="#2563EB" />
                : <Lock size={16} color="#94A3B8" />
              }
            </LessonItem>
          );
        })}

        {lessons.length > 5 && (
          <ShowMoreBtn onClick={() => setShowAll(p => !p)}>
            {showAll ? (
              <><ChevronUp size={16} /> عرض أقل</>
            ) : (
              <><ChevronDown size={16} /> عرض {lessons.length - 5} دروس إضافية</>
            )}
          </ShowMoreBtn>
        )}
      </Wrapper>
    </div>
  );
}