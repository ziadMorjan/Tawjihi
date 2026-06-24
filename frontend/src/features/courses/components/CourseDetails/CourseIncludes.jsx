import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { PlayCircle, BookOpen, Award, Infinity, Monitor } from 'lucide-react';

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

export function CourseIncludes({ lessonsCount = 0 }) {
  const { t } = useTranslation();

  const items = [
    { icon: PlayCircle, text: t('courseDetails.videoLessonsCount', { count: lessonsCount }) },
    { icon: Infinity, text: t('courseDetails.lifetimeAccess') },
    { icon: Monitor, text: t('courseDetails.availableOnDevices') },
    { icon: Award, text: t('courseDetails.certificate') },
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
