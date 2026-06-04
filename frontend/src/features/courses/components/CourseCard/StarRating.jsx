// src/features/courses/components/CourseCard/StarRating.jsx
//
// 🟡 [تحسين] الكود القديم كان يحسب النجوم داخل CourseCard مباشرة
// مكون مستقل أوضح وقابل لإعادة الاستخدام في صفحة تفاصيل الكورس

import styled from 'styled-components';
import { Star } from 'lucide-react';

const StarsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const RatingText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-right: ${({ theme }) => theme.spacing[1]};
`;

// 🟡 منطق النجوم في util منفصل — قابل للاختبار
export const calculateStars = (rating) => {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
};

export function StarRating({ rating = 0, showText = true }) {
  const { full, half, empty } = calculateStars(rating);

  return (
    <StarsWrapper>
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={`full-${i}`}
          size={14}
          fill="#F59E0B"
          color="#F59E0B"
        />
      ))}

      {half && (
        <Star
          key="half"
          size={14}
          fill="url(#half)"
          color="#F59E0B"
          style={{ opacity: 0.6 }}
        />
      )}

      {Array.from({ length: empty }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={14}
          fill="none"
          color="#CBD5E1"
        />
      ))}

      {showText && (
        <RatingText>({rating.toFixed(1)})</RatingText>
      )}
    </StarsWrapper>
  );
}