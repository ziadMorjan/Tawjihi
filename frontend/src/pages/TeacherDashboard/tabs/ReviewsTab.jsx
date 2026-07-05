import { useState } from 'react';
import { Trash2, Loader2, Check, X } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useTeacherActions, useTeacherCourses, useTeacherReviews } from '../../../features/teacher';
import {
  FilterRow, FilterLabel, CourseSelect,
  EmptyState, TableWrap, StyledTable, Th, Td, RowHover,
  ConfirmGroup, ConfirmBtn, IconBtn,
  StatsRow, StatBox, StatNumber, ReviewStatLabel,
  DistBar, DistFill, DistInner,
  SkeletonCard,
} from '../styles';
import { formatDate } from '../helpers';

export default function ReviewsTab() {
  const { t } = useLanguage();
  const { courses, isLoading: coursesLoading } = useTeacherCourses();
  const { deleteReview, isDeletingReview } = useTeacherActions();
  const { reviews, isLoading: reviewsLoading } = useTeacherReviews();

  const [courseFilter, setCourseFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});

  const filtered = courseFilter
    ? reviews.filter((r) => {
        const cid = r.course?._id?.toString() || r.course?.toString();
        return cid === courseFilter;
      })
    : reviews;

  const avg = filtered.length
    ? (filtered.reduce((s, r) => s + r.rating, 0) / filtered.length).toFixed(1)
    : '0.0';

  const dist = [5, 4, 3, 2, 1].map((star) => {
    const count = filtered.filter((r) => r.rating === star).length;
    const pct = filtered.length ? Math.round((count / filtered.length) * 100) : 0;
    return { star, count, pct };
  });

  const toggleComment = (id) => {
    setExpandedComments((p) => ({ ...p, [id]: !p[id] }));
  };

  const isLoading = coursesLoading || reviewsLoading;

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      {/* Stats Summary */}
      {filtered.length > 0 && (
        <StatsRow>
          <StatBox>
            <StatNumber style={{ color: '#C8893A' }}>{avg}</StatNumber>
            <ReviewStatLabel>{t('teacherDashboard.reviews.averageRating')}</ReviewStatLabel>
            <div style={{ color: '#C8893A', fontSize: 13, marginTop: 2 }}>
              {'★'.repeat(Math.round(+avg))}{'☆'.repeat(5 - Math.round(+avg))}
            </div>
          </StatBox>
          <StatBox>
            <StatNumber>{filtered.length}</StatNumber>
            <ReviewStatLabel>{t('teacherDashboard.reviews.totalReviews')}</ReviewStatLabel>
          </StatBox>
          <StatBox style={{ textAlign: 'start', minWidth: 180 }}>
            {dist.map((d) => (
              <DistBar key={d.star}>
                <span style={{ flexShrink: 0, width: 30 }}>{d.star}★</span>
                <DistFill><DistInner $pct={d.pct} /></DistFill>
                <span style={{ flexShrink: 0, width: 24, textAlign: 'left' }}>{d.count}</span>
              </DistBar>
            ))}
          </StatBox>
        </StatsRow>
      )}

      {/* Course filter */}
      {courses.length > 1 && (
        <FilterRow>
          <FilterLabel>{t('teacherDashboard.reviews.filterByCourse')}:</FilterLabel>
          <CourseSelect value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">{t('teacherDashboard.reviews.allCourses')}</option>
            {courses.map((co) => (
              <option key={co._id} value={co._id}>{co.name}</option>
            ))}
          </CourseSelect>
        </FilterRow>
      )}

      {!filtered.length ? (
        <EmptyState>
          {courseFilter ? t('teacherDashboard.empty.noReviewsCourse') : t('teacherDashboard.empty.noReviews')}
        </EmptyState>
      ) : (
        <TableWrap>
          <StyledTable>
            <thead>
              <tr>
                <Th>{t('teacherDashboard.reviews.student')}</Th>
                <Th>{t('teacherDashboard.reviews.rating')}</Th>
                <Th>{t('teacherDashboard.reviews.comment')}</Th>
                <Th>{t('teacherDashboard.reviews.course')}</Th>
                <Th>{t('teacherDashboard.reviews.date')}</Th>
                <Th>{t('teacherDashboard.reviews.actions')}</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const isDeleting = confirmDelete === r._id;
                const isExpanded = expandedComments[r._id];
                const commentText = r.comment || '';
                const shouldTruncate = commentText.length > 120;
                const displayText = shouldTruncate && !isExpanded
                  ? commentText.slice(0, 120) + '...'
                  : commentText;

                return (
                  <RowHover key={r._id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: '#E2E8F0', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 10, fontWeight: 700,
                          color: '#64748B', flexShrink: 0, overflow: 'hidden',
                        }}>
                          {r.user?.coverImage
                            ? <img src={r.user.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : (r.user?.name?.charAt(0) || '؟')}
                        </div>
                        <span>{r.user?.name || '—'}</span>
                      </div>
                    </Td>
                    <Td>
                      <span style={{ color: '#C8893A', fontSize: 13 }}>
                        {Array.from({ length: r.rating }, () => '★').join('')}
                        {Array.from({ length: 5 - r.rating }, () => '☆').join('')}
                      </span>
                    </Td>
                    <Td style={{ maxWidth: 280, wordBreak: 'break-word' }}>
                      {displayText || '—'}
                      {shouldTruncate && (
                        <button onClick={() => toggleComment(r._id)}
                          style={{ background: 'none', border: 'none', color: '#0D7FA3', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', padding: 0, marginInlineStart: 4 }}>
                          {isExpanded ? t('teacherDashboard.reviews.showLess') : t('teacherDashboard.reviews.showMore')}
                        </button>
                      )}
                    </Td>
                    <Td>{r.course?.name || '—'}</Td>
                    <Td>{formatDate(r.createdAt)}</Td>
                    <Td>
                      {isDeleting ? (
                        <ConfirmGroup>
                          <ConfirmBtn $variant="confirm" onClick={() => { deleteReview(r._id); setConfirmDelete(null); }} disabled={isDeletingReview}>
                            {isDeletingReview ? <Loader2 size={13} /> : <Check size={13} />}
                          </ConfirmBtn>
                          <ConfirmBtn $variant="cancel" onClick={() => setConfirmDelete(null)}><X size={13} /></ConfirmBtn>
                        </ConfirmGroup>
                      ) : (
                        <IconBtn onClick={() => setConfirmDelete(r._id)} title={t('teacherDashboard.reviews.deleteReview')}>
                          <Trash2 size={14} />
                        </IconBtn>
                      )}
                    </Td>
                  </RowHover>
                );
              })}
            </tbody>
          </StyledTable>
        </TableWrap>
      )}
    </div>
  );
}
