// src/features/courses/components/CourseDetails/CourseIncludes.jsx
import styled from 'styled-components';
import { PlayCircle, BookOpen, Award, Infinity, Monitor } from 'lucide-react';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};

  ${({ theme }) => theme.media.maxSm} {
    grid-template-columns: 1fr;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
`;

export function CourseIncludes({ lessonsCount = 0 }) {
  const items = [
    { icon: <PlayCircle size={18} />, text: `${lessonsCount} درس فيديو`     },
    { icon: <Infinity    size={18} />, text: 'وصول مدى الحياة'             },
    { icon: <Monitor     size={18} />, text: 'متاح على جميع الأجهزة'       },
    { icon: <Award       size={18} />, text: 'شهادة إتمام'                 },
    { icon: <BookOpen    size={18} />, text: 'موارد قابلة للتحميل'         },
  ];

  return (
    <Grid>
      {items.map((item, i) => (
        <Item key={i}>
          {item.icon}
          {item.text}
        </Item>
      ))}
    </Grid>
  );
}