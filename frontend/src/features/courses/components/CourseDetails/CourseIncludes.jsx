import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { PlayCircle, BookOpen, Award, Infinity, Monitor } from 'lucide-react';
import { axiosInstance } from '../../../../shared/lib/axiosInstance';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[2]};

  ${({ theme }) => theme.media.maxSm} {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 4px 0;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
`;

const fetchLessonsCount = async (courseId) => {
  const { data } = await axiosInstance.get('/lessons', {
    params: { course: courseId },
  });
  const docs = data?.data?.docs ?? data?.data ?? data?.lessons ?? [];
  return Array.isArray(docs) ? docs.length : 0;
};

export function CourseIncludes({ courseId, lessonsCount: propCount = 0 }) {
  const { t } = useTranslation();

  // إذا تم تمرير courseId، نجلب العدد الحقيقي من API
  const { data: fetchedCount } = useQuery({
    queryKey: ['lessons-count', courseId],
    queryFn: () => fetchLessonsCount(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const count = courseId ? (fetchedCount ?? propCount) : propCount;

  const items = [
    { icon: PlayCircle, text: t('courseDetails.videoLessonsCount', { count }) },
    { icon: Infinity, text: t('courseDetails.lifetimeAccess') },
    { icon: Monitor, text: t('courseDetails.availableOnDevices') },
    // { icon: Award, text: t('courseDetails.certificate') },
    { icon: BookOpen, text: t('courseDetails.downloadableResources') },
  ];

  return (
    <Grid>
      {items.map(({ icon: Icon, text }, i) => (
        <Item key={i}>
          <Icon size={15} />
          {text}
        </Item>
      ))}
    </Grid>
  );
}
