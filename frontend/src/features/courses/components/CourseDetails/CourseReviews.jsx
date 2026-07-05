import { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../../../../shared/lib/axiosInstance';
import { StarRating } from '../CourseCard/StarRating';
import { Spinner } from '../../../../shared/components';
import { MessageSquare, User, Pencil, Check, X, Star, Trash2, Loader2 } from 'lucide-react';
import { SectionHeader, SectionIcon, SectionTitle } from './CourseDetails.styles';
import { useAuth } from '../../../../features/auth';
import { useUpdateReview, useDeleteReview } from '../../../../features/reviews';

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

const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-inline-start: auto;
`;

const IconBtn = styled.button`
  background: none; border: none; cursor: pointer; padding: 4px;
  border-radius: 6px; color: ${({ theme }) => theme.colors.textMuted};
  display: flex; align-items: center; font-family: inherit;
  &:hover { background: ${({ theme }) => theme.colors.border}; color: ${({ theme }) => theme.colors.textPrimary}; }
`;

const EditWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StarPicker = styled.div`
  display: flex; align-items: center; gap: 4px;
  direction: ltr;
`;

const StarBtn = styled.button`
  background: none; border: none; cursor: pointer; padding: 2px;
  color: ${({ $filled, theme }) => $filled ? theme.colors.accent : theme.colors.border};
  transition: color 0.15s;
  &:hover { color: ${({ theme }) => theme.colors.accent}; }
`;

const EditTextarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  outline: none;
  background: ${({ theme }) => theme.colors.bgPrimary};
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const EditActions = styled.div`
  display: flex; gap: 6px;
`;

const SaveBtn = styled.button`
  display: flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.success};
  background: ${({ theme }) => theme.colors.success}15;
  color: ${({ theme }) => theme.colors.success};
  cursor: pointer; font-size: 12px; font-family: inherit;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CancelBtn = styled.button`
  display: flex; align-items: center; gap: 4px;
  padding: 4px 10px; border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer; font-size: 12px; font-family: inherit;
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
  const { user } = useAuth();
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const updateReview = useUpdateReview(courseId);
  const deleteReview = useDeleteReview(courseId);

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', courseId],
    queryFn: () => fetchReviews(courseId),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    select: (data) => data?.data ?? data?.reviews ?? data,
  });

  const reviews = Array.isArray(data) ? data : [];

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment || '');
  };

  const saveEdit = async (reviewId) => {
    await updateReview.mutateAsync({
      reviewId,
      data: { rating: editRating, review: editComment },
    });
    setEditingId(null);
  };

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
          {reviews.map((review) => {
            const isOwner = user?._id === review.user?._id;
            const isEditing = editingId === review._id;

            return (
              <ReviewCard key={review._id}>
                <ReviewHeader>
                  <Avatar>
                    {review.user?.name?.charAt(0) ?? <User size={16} />}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <ReviewerName>{review.user?.name ?? t('teachers.anonymous')}</ReviewerName>
                    <StarRating rating={review.rating} showText={false} />
                  </div>
                  {isOwner && !isEditing && (
                    <ActionsRow>
                      <IconBtn onClick={() => startEdit(review)} title={t('video.edit')}>
                        <Pencil size={14} />
                      </IconBtn>
                      <IconBtn onClick={() => deleteReview.mutate(review._id)} title={t('video.delete')}>
                        {deleteReview.isPending ? <Loader2 size={14} /> : <Trash2 size={14} />}
                      </IconBtn>
                    </ActionsRow>
                  )}
                </ReviewHeader>
                {isEditing ? (
                  <EditWrap>
                    <StarPicker>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarBtn key={s} $filled={s <= editRating} onClick={() => setEditRating(s)}>
                          <Star size={18} fill={s <= editRating ? '#C8893A' : 'none'} />
                        </StarBtn>
                      ))}
                    </StarPicker>
                    <EditTextarea
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows={2}
                    />
                    <EditActions>
                      <SaveBtn
                        onClick={() => saveEdit(review._id)}
                        disabled={updateReview.isPending || !editRating}
                      >
                        {updateReview.isPending ? <Loader2 size={13} /> : <Check size={13} />}
                        {t('video.save')}
                      </SaveBtn>
                      <CancelBtn onClick={() => setEditingId(null)}>
                        <X size={13} /> {t('video.cancel')}
                      </CancelBtn>
                    </EditActions>
                  </EditWrap>
                ) : (
                  review.comment && <ReviewText>{review.comment}</ReviewText>
                )}
              </ReviewCard>
            );
          })}
        </Content>
      )}
    </div>
  );
}
