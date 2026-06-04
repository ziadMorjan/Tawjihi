// src/features/courses/components/CourseCard/CourseCardSkeleton.jsx
//
// 🟡 [تحسين] بدل spinner في وسط الصفحة،
// skeleton يعطي المستخدم إحساس إن الصفحة تحمّل بسرعة

import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.bgTertiary} 25%,
    ${({ theme }) => theme.colors.bgSecondary} 50%,
    ${({ theme }) => theme.colors.bgTertiary} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const Wrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
`;

const ImageSkeleton = styled(SkeletonBase)`
  aspect-ratio: 16 / 9;
  border-radius: 0;
`;

const Body = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Line = styled(SkeletonBase)`
  height: ${({ $height }) => $height || '16px'};
  width: ${({ $width }) => $width || '100%'};
`;

export function CourseCardSkeleton() {
  return (
    <Wrapper>
      <ImageSkeleton />
      <Body>
        <Line $height="12px" $width="40%" />
        <Line $height="18px" />
        <Line $height="18px" $width="80%" />
        <Line $height="14px" $width="50%" />
        <Line $height="14px" $width="30%" />
      </Body>
    </Wrapper>
  );
}