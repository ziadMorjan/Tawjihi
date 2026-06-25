import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../../shared/lib/axiosInstance';
import { StarRating } from '../CourseCard/StarRating';
import { Spinner } from '../../../../shared/components';
import { MessageSquare, User } from 'lucide-react';
import { SectionHeader, SectionIcon, SectionTitle } from './CourseDetails.styles';

const fetchReviews = async (courseId) => {
  const { data } = await axiosInstance.get('/reviews', {
    params: { course: courseId },
  });
  return data;
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ReviewCard = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Avatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, #EFF6FF, #F5F3FF);
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReviewerName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ReviewText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.7;
  margin: 0;
`;

const EmptyMsg = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.bgSecondary};

  svg {
    color: ${({ theme }) => theme.colors.borderStrong};
  }
`;

const Count = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function CourseReviews({ courseId }) {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ['reviews', courseId],
    queryFn: () => fetchReviews(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data ?? data?.reviews ?? data,
  });

  const reviews = Array.isArray(data) ? data : [];

  return (
    <div>
      <SectionHeader>
        <SectionIcon><MessageSquare size={16} /></SectionIcon>
        <SectionTitle>{t('courseDetails.studentReviews')}</SectionTitle>
        <Count>({reviews.length})</Count>
      </SectionHeader>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
          <Spinner size="md" />
        </div>
      ) : reviews.length === 0 ? (
        <EmptyMsg>
          <MessageSquare size={28} />
          {t('courseDetails.noReviewsCourse')}
        </EmptyMsg>
      ) : (
        <Content>
          {reviews.map((review) => (
            <ReviewCard key={review._id}>
              <ReviewHeader>
                <Avatar>
                  {review.user?.name?.charAt(0) ?? <User size={16} />}
                </Avatar>
                <div>
                  <ReviewerName>{review.user?.name ?? t('teachers.anonymous')}</ReviewerName>
                  <StarRating rating={review.rating} showText={false} />
                </div>
              </ReviewHeader>
              {review.review && <ReviewText>{review.review}</ReviewText>}
            </ReviewCard>
          ))}
        </Content>
      )}
    </div>
  );
}
