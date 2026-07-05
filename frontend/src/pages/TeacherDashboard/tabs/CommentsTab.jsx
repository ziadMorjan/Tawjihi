import { useState } from 'react';
import { MessageSquare, Reply, Trash2, Loader2, Edit3, Check, X } from 'lucide-react';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useTeacherActions, useTeacherCourses } from '../../../features/teacher';
import { teacherApi } from '../../../features/teacher';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../../shared/components/Button';
import {
  FilterRow, FilterLabel, CourseSelect,
  EmptyState, CommentCard, CommentUser, UserAvatar, CommentName,
  CommentLesson, CommentActions, IconBtn, ConfirmGroup, ConfirmBtn,
  CommentText, ReplyBtn, ReplyInputWrap, ReplyInput,
  RepliesSection, ReplyItem, ReplyThreadLine, ReplyAvatar,
  ReplyContent, ReplyHeader, ReplyName, ReplyTime, ReplyActions, ReplyText,
  EditReplyWrap, EditReplyInput, EditReplyBtns,
  SkeletonCard,
} from '../styles';
import { formatDate } from '../helpers';

export default function CommentsTab() {
  const { t } = useLanguage();
  const { courses, isLoading: coursesLoading } = useTeacherCourses();
  const {
    replyToComment, isReplying,
    editReply, isEditingReply,
    deleteReply, isDeletingReply,
    deleteComment, isDeletingComment,
  } = useTeacherActions();

  const courseIds = courses.map((c) => c._id);
  const { data: allComments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['my-comments', courseIds],
    queryFn: teacherApi.getMyComments,
    staleTime: 0,
    retry: false,
  });

  const [courseFilter, setCourseFilter] = useState('');
  const [replyOpen, setReplyOpen] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [editingReply, setEditingReply] = useState(null);
  const [editReplyText, setEditReplyText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredComments = courseFilter
    ? allComments.filter((c) => {
        const cid = c.lesson?.course?.toString();
        return cid === courseFilter;
      })
    : allComments;

  const handleReply = (commentId) => {
    const text = replyText[commentId]?.trim();
    if (!text) return;
    replyToComment({ id: commentId, text }, {
      onSuccess: () => { setReplyOpen(null); setReplyText((p) => ({ ...p, [commentId]: '' })); },
    });
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId, {
      onSuccess: () => setConfirmDelete(null),
    });
  };

  const handleEditReply = (commentId, replyId) => {
    const text = editReplyText?.trim();
    if (!text) return;
    editReply({ commentId, replyId, text }, {
      onSuccess: () => { setEditingReply(null); setEditReplyText(''); },
    });
  };

  const handleDeleteReply = (commentId, replyId) => {
    deleteReply({ commentId, replyId }, {
      onSuccess: () => setConfirmDelete(null),
    });
  };

  if (coursesLoading || commentsLoading) return <SkeletonCard />;

  return (
    <div>
      {/* Course filter */}
      {courses.length > 1 && (
        <FilterRow>
          <FilterLabel>{t('teacherDashboard.comments.filterByCourse')}:</FilterLabel>
          <CourseSelect value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">{t('teacherDashboard.comments.allCourses')}</option>
            {courses.map((co) => (
              <option key={co._id} value={co._id}>{co.name}</option>
            ))}
          </CourseSelect>
        </FilterRow>
      )}

      {!filteredComments.length ? (
        <EmptyState>
          {courseFilter ? t('teacherDashboard.empty.noCommentsCourse') : t('teacherDashboard.empty.noComments')}
        </EmptyState>
      ) : (
        filteredComments.map((c) => (
          <CommentCard key={c._id}>
            <CommentUser>
              <UserAvatar>{c.user?.coverImage ? <img src={c.user.coverImage} alt="" /> : c.user?.name?.charAt(0) || '؟'}</UserAvatar>
              <div>
                <CommentName>{c.user?.name || t('teacherDashboard.comments.student')}</CommentName>
                <CommentLesson>{c.lesson?.name || t('teacherDashboard.comments.lesson')} &middot; {formatDate(c.createdAt)}</CommentLesson>
              </div>
              <CommentActions>
                {/* Delete comment */}
                {confirmDelete?.type === 'comment' && confirmDelete.id === c._id ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => handleDeleteComment(c._id)} disabled={isDeletingComment}>
                      {isDeletingComment ? <Loader2 size={13} /> : <Check size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirmDelete(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <IconBtn onClick={() => setConfirmDelete({ type: 'comment', id: c._id })} title={t('teacherDashboard.comments.deleteComment')}>
                    <Trash2 size={14} />
                  </IconBtn>
                )}
              </CommentActions>
            </CommentUser>
            <CommentText>{c.content}</CommentText>

            <ReplyBtn onClick={() => setReplyOpen(replyOpen === c._id ? null : c._id)}>
              <MessageSquare size={14} /> {replyOpen === c._id ? t('teacherDashboard.actions.cancel') : t('teacherDashboard.actions.reply')}
            </ReplyBtn>

            {replyOpen === c._id && (
              <ReplyInputWrap>
                <ReplyInput type="text" placeholder={t('teacherDashboard.comments.replyPlaceholder')} value={replyText[c._id] || ''}
                  onChange={(e) => setReplyText((p) => ({ ...p, [c._id]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(c._id); } }} />
                <Button variant="primary" size="sm" leftIcon={isReplying ? <Loader2 size={14} /> : <Reply size={14} />} isLoading={isReplying} onClick={() => handleReply(c._id)} disabled={!replyText[c._id]?.trim()}>{t('teacherDashboard.actions.send')}</Button>
              </ReplyInputWrap>
            )}

            {c.replies?.length > 0 && (
              <RepliesSection>
                {c.replies.map((r, idx) => {
                  const isEditing = editingReply?.commentId === c._id && editingReply?.replyId === r._id;
                  const isDeleting = confirmDelete?.type === 'reply' && confirmDelete.id === r._id && confirmDelete.commentId === c._id;
                  return (
                    <ReplyItem key={r._id || idx}>
                      <ReplyThreadLine />
                      <ReplyAvatar>{r.user?.coverImage ? <img src={r.user.coverImage} alt="" /> : r.user?.name?.charAt(0) || '؟'}</ReplyAvatar>
                      <ReplyContent>
                        <ReplyHeader>
                          <ReplyName>{r.user?.name || t('teacherDashboard.comments.teacher')}</ReplyName>
                          <ReplyTime>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }) : ''}</ReplyTime>
                          {!isEditing && (
                            <ReplyActions>
                              <IconBtn onClick={() => { setEditingReply({ commentId: c._id, replyId: r._id }); setEditReplyText(r.text); }} title={t('teacherDashboard.comments.editReply')}>
                                <Edit3 size={12} />
                              </IconBtn>
                              {isDeleting ? (
                                <ConfirmGroup>
                                  <ConfirmBtn $variant="confirm" onClick={() => handleDeleteReply(c._id, r._id)} disabled={isDeletingReply}>
                                    {isDeletingReply ? <Loader2 size={11} /> : <Check size={11} />}
                                  </ConfirmBtn>
                                  <ConfirmBtn $variant="cancel" onClick={() => setConfirmDelete(null)}><X size={11} /></ConfirmBtn>
                                </ConfirmGroup>
                              ) : (
                                <IconBtn onClick={() => setConfirmDelete({ type: 'reply', id: r._id, commentId: c._id })} title={t('teacherDashboard.comments.deleteReply')}>
                                  <Trash2 size={12} />
                                </IconBtn>
                              )}
                            </ReplyActions>
                          )}
                        </ReplyHeader>
                        {isEditing ? (
                          <EditReplyWrap>
                            <EditReplyInput value={editReplyText} onChange={(e) => setEditReplyText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleEditReply(c._id, r._id); } }} />
                            <EditReplyBtns>
                              <ConfirmBtn $variant="confirm" onClick={() => handleEditReply(c._id, r._id)} disabled={isEditingReply || !editReplyText?.trim()}>
                                {isEditingReply ? <Loader2 size={12} /> : <Check size={12} />}
                              </ConfirmBtn>
                              <ConfirmBtn $variant="cancel" onClick={() => setEditingReply(null)}><X size={12} /></ConfirmBtn>
                            </EditReplyBtns>
                          </EditReplyWrap>
                        ) : (
                          <ReplyText>{r.text}</ReplyText>
                        )}
                      </ReplyContent>
                    </ReplyItem>
                  );
                })}
              </RepliesSection>
            )}
          </CommentCard>
        ))
      )}
    </div>
  );
}
