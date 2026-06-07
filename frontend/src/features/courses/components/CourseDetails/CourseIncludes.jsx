import styled from 'styled-components';
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

const items = [
  { icon: PlayCircle, text: (n) => `${n} درس فيديو` },
  { icon: Infinity, text: () => 'وصول مدى الحياة' },
  { icon: Monitor, text: () => 'متاح على جميع الأجهزة' },
  { icon: Award, text: () => 'شهادة إتمام' },
  { icon: BookOpen, text: () => 'موارد قابلة للتحميل' },
];

export function CourseIncludes({ lessonsCount = 0 }) {
  return (
    <Grid>
      {items.map(({ icon: Icon, text }, i) => (
        <Item key={i}>
          <Icon size={15} />
          {text(lessonsCount)}
        </Item>
      ))}
    </Grid>
  );
}
