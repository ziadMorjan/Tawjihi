import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  PlayCircle,
  Lock,
  Clock,
  BookOpen,
} from "lucide-react";
import { axiosInstance } from "../../../../shared/lib/axiosInstance";
import {
  SectionHeader,
  SectionIcon,
  SectionTitle,
} from "./CourseDetails.styles";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PATH } from "../../../../constants";

const formatDuration = (seconds) => {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}:${String(secs).padStart(2, '0')}`;
};

const shimmer = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const fetchLessons = async (courseId) => {
  const { data } = await axiosInstance.get("/lessons", {
    params: { course: courseId },
  });
  return data;
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const LessonItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid transparent;
  transition: all 0.2s ease;
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};

  &:hover {
    background: ${({ $clickable, theme }) =>
      $clickable ? theme.colors.bgTertiary : theme.colors.bgSecondary};
    border-color: ${({ $clickable, theme }) =>
      $clickable ? theme.colors.primary + "30" : "transparent"};
    ${({ $clickable }) => $clickable && "padding-right: 20px;"};
  }
`;

const LessonNumber = styled.span`
  min-width: 30px;
  height: 30px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const LessonInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const LessonTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LessonMeta = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ShowMoreBtn = styled.button`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-radius: 12px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.typography.fontFamily.base};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary} + "60";
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const Skeleton = styled.div`
  height: 58px;
  border-radius: 12px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const Count = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function CourseCurriculum({ courseId, isEnrolled }) {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["lessons", courseId],
    queryFn: () => fetchLessons(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data ?? data?.lessons ?? data,
  });

  const lessons = Array.isArray(data) ? data : [];
  const visibleLessons = showAll ? lessons : lessons.slice(0, 5);

  if (isLoading) {
    return (
      <div>
        <SectionHeader>
          <SectionIcon>
            <BookOpen size={16} />
          </SectionIcon>
          <SectionTitle>محتوى الكورس</SectionTitle>
        </SectionHeader>
        <Content>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} />
          ))}
        </Content>
      </div>
    );
  }

  if (!lessons.length) return null;

  return (
    <div>
      <SectionHeader>
        <SectionIcon>
          <BookOpen size={16} />
        </SectionIcon>
        <SectionTitle>محتوى الكورس</SectionTitle>
        <Count>({lessons.length} درس)</Count>
      </SectionHeader>

      <Content>
        {visibleLessons.map((lesson, index) => {
          const canAccess = isEnrolled;

          return (
            <LessonItem
              key={lesson._id}
              $clickable={canAccess}
              onClick={() => {
                if (!canAccess) return;
                navigate(PATH.learn(courseId), {
                  state: { startIndex: index },
                });
              }}
            >
              <LessonNumber>{String(index + 1).padStart(2, "0")}</LessonNumber>

              <LessonInfo>
                <LessonTitle>{lesson.title ?? lesson.name}</LessonTitle>
                {lesson.duration > 0 && (
                  <LessonMeta>
                    <Clock size={11} />
                    {formatDuration(lesson.duration)}
                  </LessonMeta>
                )}
              </LessonInfo>

              {canAccess ? (
                <PlayCircle size={18} color="#2563EB" />
              ) : (
                <Lock size={15} color="#94A3B8" />
              )}
            </LessonItem>
          );
        })}

        {lessons.length > 5 && (
          <ShowMoreBtn onClick={() => setShowAll((p) => !p)}>
            {showAll ? (
              <>
                <ChevronUp size={16} /> عرض أقل
              </>
            ) : (
              <>
                <ChevronDown size={16} /> عرض {lessons.length - 5} دروس إضافية
              </>
            )}
          </ShowMoreBtn>
        )}
      </Content>
    </div>
  );
}
