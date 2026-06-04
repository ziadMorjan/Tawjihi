// src/features/courses/components/CourseDetails/CourseReviews.jsx
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../../shared/lib/axiosInstance';
import { StarRating } from '../CourseCard/StarRating';
import { Spinner } from '../../../../shared/components';

const fetchReviews = async (courseId) => {
  const { data } = await axiosInstance.get('/reviews', {
    params: { course: courseId },
  });
  return data;
};

const Wrapper    = styled.div`display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing[4]};`;
const SectionTitle = styled.h2`font-size: ${({ theme }) => theme.typography.fontSize.xl}; font-weight: ${({ theme }) => theme.typography.fontWeight.bold}; color: ${({ theme }) => theme.colors.textPrimary}; margin-bottom: ${({ theme }) => theme.spacing[4]};`;

const ReviewCard = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.bgPrimary};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  flex-shrink: 0;
`;

const ReviewerName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ReviewText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const EmptyMsg = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
`;

export function CourseReviews({ courseId }) {
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', courseId],
    queryFn:  () => fetchReviews(courseId),
    enabled:  !!courseId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data ?? data?.reviews ?? data,
  });

  const reviews = Array.isArray(data) ? data : [];

  return (
    <div>
      <SectionTitle>تقييمات الطلاب ({reviews.length})</SectionTitle>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
          <Spinner size="md" />
        </div>
      ) : reviews.length === 0 ? (
        <EmptyMsg>لا توجد تقييمات بعد — كن أول من يقيّم هذا الكورس!</EmptyMsg>
      ) : (
        <Wrapper>
          {reviews.map(review => (
            <ReviewCard key={review._id}>
              <ReviewHeader>
                <Avatar>
                  {review.user?.name?.charAt(0) ?? '؟'}
                </Avatar>
                <div>
                  <ReviewerName>{review.user?.name ?? 'مجهول'}</ReviewerName>
                  <StarRating rating={review.rating} showText={false} />
                </div>
              </ReviewHeader>
              {review.review && (
                <ReviewText>{review.review}</ReviewText>
              )}
            </ReviewCard>
          ))}
        </Wrapper>
      )}
    </div>
  );
}