import { useState } from 'react';
import {
  LayoutDashboard, Layers, MessageSquare, Star, Bell,
  Trash2, Send, Reply, Plus, Loader2, Edit3, Users, Check, X,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from 'recharts';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { useLanguage } from '../../shared/hooks/useLanguage';
import {
  useTeacherStats, useTeacherActions, useTeacherCourses, useTeacherReviews,
} from '../../features/teacher';
import { teacherApi } from '../../features/teacher';
import { useQuery } from '@tanstack/react-query';
import { useBranches, useSubjects } from '../../features/admin';
import { Button } from '../../shared/components/Button';
import {
  PageInner, Header, Title,
  StatsGrid, StatCard, StatIconWrap, StatInfo, StatValue, StatLabel,
  TableWrap, StyledTable, Th, Td, ActionsCell, ActionBtn,
  EmptyState, RowHover, Badge,
  Form, FieldGroup, Label, StyledInput, StyledTextarea, Select,
  FilterRow, FilterLabel, CourseSelect,
  CommentCard, CommentUser, UserAvatar, CommentName, CommentLesson,
  CommentActions, IconBtn, ConfirmGroup, ConfirmBtn, CommentText,
  ReplyBtn, ReplyInputWrap, ReplyInput,
  RepliesSection, ReplyItem, ReplyThreadLine, ReplyAvatar,
  ReplyContent, ReplyHeader, ReplyName, ReplyTime, ReplyActions, ReplyText,
  EditReplyWrap, EditReplyInput, EditReplyBtns,
  SkeletonCard, OldPrice, Note,
  ChartCard, LtrChartWrap, ChartTitle, ChartGrid, SectionTitle, EmptyMiniData,
  ModalOverlay, ModalContent, ModalTitle,
  StatsRow, StatBox, StatNumber, ReviewStatLabel,
  DistBar, DistFill, DistInner,
} from './styles';

function calcYAxisWidth(data, key = 'name') {
  if (!data?.length) return 80;
  const longest = Math.max(...data.map((d) => (d[key] || '').length));
  return Math.min(Math.max(longest * 5.5, 80), 140);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatPrice(p) { return (p?.toLocaleString('ar-SA') || '0') + ' ₪'; }

const NAV_ITEMS = (t) => [
  { key: 0, label: t('teacherDashboard.nav.overview'), icon: LayoutDashboard },
  { key: 1, label: t('teacherDashboard.nav.courses'), icon: Layers },
  { key: 2, label: t('teacherDashboard.nav.comments'), icon: MessageSquare },
  { key: 3, label: t('teacherDashboard.nav.reviews'), icon: Star },
  { key: 4, label: t('teacherDashboard.nav.sendNotification'), icon: Bell },
];

// ── Tab Components ───────────────────────────────────────────────────────────

function OverviewTab() {
  const { stats } = useTeacherStats();
  const { t, isAr } = useLanguage();
  if (!stats) return <SkeletonCard />;

  const { charts } = stats;

  const cards = [
    { label: t('teacherDashboard.stats.courses'), value: stats.totalCourses, icon: Layers },
    { label: t('teacherDashboard.stats.students'), value: stats.totalStudents, icon: Users },
    {
      label: t('teacherDashboard.stats.averageRating'),
      value: typeof stats.averageRating === 'number' ? stats.averageRating.toFixed(1) + ' / 5' : '—',
      icon: Star,
    },
  ];

  return (
    <>
      <StatsGrid>
        {cards.map((c) => (
          <StatCard key={c.label}>
            <StatIconWrap><c.icon /></StatIconWrap>
            <StatInfo>
              <StatValue>{c.value}</StatValue>
              <StatLabel>{c.label}</StatLabel>
            </StatInfo>
          </StatCard>
        ))}
      </StatsGrid>

      <SectionTitle>{t('teacherDashboard.sections.charts')}</SectionTitle>

      <ChartGrid>
        {!charts.enrollmentTrend?.length || charts.enrollmentTrend.length < 2 ? (
          <ChartCard><ChartTitle>{t('teacherDashboard.sections.monthlyEnrollments')}</ChartTitle><EmptyMiniData>{t('teacherDashboard.empty.noData')}</EmptyMiniData></ChartCard>
        ) : (
          <ChartCard>
            <ChartTitle>{t('teacherDashboard.sections.monthlyEnrollments')}</ChartTitle>
            <ResponsiveContainer width="100%" height={230}>
              <AreaChart data={charts.enrollmentTrend} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                {/* <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis width={40} tick={{ fontSize: 10 }} /> */}
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#0D7FA3" fill="#0D7FA340" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        <ChartCard>
          <ChartTitle>{t('teacherDashboard.sections.courseRatings')}</ChartTitle>
          <LtrChartWrap>
            <ResponsiveContainer
              width="100%"
              height={Math.max((charts.courseRatings?.length || 1) * 42, 180)}
            >
              {(() => {
                const w = calcYAxisWidth(charts.courseRatings) ;
                const data = isAr
                  ? [...(charts.courseRatings || [])].reverse()
                  : (charts.courseRatings || []);
                return (
                  <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
                  >
                    <XAxis type="number" domain={[0, 5]} tick={{ fontSize: 11 }} tickCount={4} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={w}
                      orientation="left"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val) => val.length > 14 ? val.slice(0, 13) + '…' : val}
                    />
                    <Tooltip />
                    <Bar dataKey="rating" fill="#C8893A" radius={[0, 4, 4, 0]} />
                  </BarChart>
                );
              })()}
            </ResponsiveContainer>
          </LtrChartWrap>
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('teacherDashboard.sections.commentsByCourse')}</ChartTitle>
          <LtrChartWrap>
            <ResponsiveContainer
              width="100%"
              height={Math.max((charts.commentCounts?.length || 1) * 42, 180)}
            >
              {(() => {
                const w = calcYAxisWidth(charts.commentCounts);
                const data = isAr
                  ? [...(charts.commentCounts || [])].reverse()
                  : (charts.commentCounts || []);
                return (
                  <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
                  >
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      tickCount={4}
                      allowDecimals={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={w}
                      orientation="left"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#A855F7" radius={[0, 4, 4, 0]} />
                  </BarChart>
                );
              })()}
            </ResponsiveContainer>
          </LtrChartWrap>
        </ChartCard>

        {!charts.reviewsTrend?.length || charts.reviewsTrend.length < 2 ? (
          <ChartCard><ChartTitle>{t('teacherDashboard.sections.monthlyRatings')}</ChartTitle><EmptyMiniData>{t('teacherDashboard.empty.noData')}</EmptyMiniData></ChartCard>
        ) : (
          <ChartCard>
            <ChartTitle>{t('teacherDashboard.sections.monthlyRatings')}</ChartTitle>
            <ResponsiveContainer width="100%" height={230}>
              <LineChart data={charts.reviewsTrend} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis width={36} tick={{ fontSize: 8, textAnchor: isAr ? 'start' : 'end' }} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </ChartGrid>
    </>
  );
}

function CoursesTab() {
  const { t } = useLanguage();
  const { courses, isLoading } = useTeacherCourses();
  const { deleteCourse, updateCourse, createCourse, isDeleting, isCreating, isUpdating } = useTeacherActions();
  const { subjects } = useSubjects();
  const { branches } = useBranches();
  const [editingCourse, setEditingCourse] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  // Add/Edit form state
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formPriceAfter, setFormPriceAfter] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formBranches, setFormBranches] = useState([]);
  const [formFile, setFormFile] = useState(null);

  const resetForm = () => {
    setFormName(''); setFormDesc(''); setFormPrice(''); setFormPriceAfter('');
    setFormSubject(''); setFormBranches([]); setFormFile(null);
  };

  const openEdit = (course) => {
    setEditingCourse(course);
    setFormName(course.name);
    setFormDesc(course.description || '');
    setFormPrice(String(course.price || ''));
    setFormPriceAfter(String(course.priceAfterDiscount || ''));
    setFormSubject(course.subject?._id || '');
    setFormBranches(course.branches?.map((b) => b._id || b) || []);
    setFormFile(null);
    setShowAdd(false);
  };

  const openAdd = () => {
    resetForm();
    setShowAdd(true);
    setEditingCourse(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formName.trim());
    if (formDesc.trim()) fd.append('description', formDesc.trim());
    if (formPrice) fd.append('price', formPrice);
    if (formPriceAfter) fd.append('priceAfterDiscount', formPriceAfter);
    if (formSubject) fd.append('subject', formSubject);
    if (formBranches.length) fd.append('branches', JSON.stringify(formBranches));
    if (formFile) fd.append('coverImage', formFile);

    if (editingCourse) {
      updateCourse({ id: editingCourse._id, formData: fd }, { onSuccess: () => { setEditingCourse(null); resetForm(); } });
    } else {
      createCourse(fd, { onSuccess: () => { setShowAdd(false); resetForm(); } });
    }
  };

  const handleDelete = (c) => {
    const msg = t('teacherDashboard.confirmDelete', { name: c.name });
    if (window.confirm(msg)) deleteCourse(c._id);
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={openAdd}>{t('teacherDashboard.actions.add')}</Button>
      </div>

      {courses.length === 0 && <EmptyState>{t('teacherDashboard.empty.noCourses')}</EmptyState>}

      {(showAdd || editingCourse) && (
        <ModalOverlay onClick={() => { setShowAdd(false); setEditingCourse(null); }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editingCourse ? t('teacherDashboard.form.editCourse') : t('teacherDashboard.form.addCourse')}</ModalTitle>
            <Form onSubmit={handleSave}>
              <FieldGroup><Label>{t('teacherDashboard.form.name')}</Label><StyledInput value={formName} onChange={(e) => setFormName(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>{t('teacherDashboard.form.description')}</Label><StyledTextarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} /></FieldGroup>
              <FieldGroup><Label>{t('teacherDashboard.form.price')}</Label><StyledInput type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} /></FieldGroup>
              <FieldGroup><Label>{t('teacherDashboard.form.priceAfterDiscount')}</Label><StyledInput type="number" value={formPriceAfter} onChange={(e) => setFormPriceAfter(e.target.value)} /></FieldGroup>
              <FieldGroup>
                <Label>{t('teacherDashboard.form.subject')}</Label>
                <Select value={formSubject} onChange={(e) => setFormSubject(e.target.value)}>
                  <option value="">{t('teacherDashboard.form.selectSubject')}</option>
                  {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </Select>
              </FieldGroup>
              <FieldGroup>
                <Label>{t('teacherDashboard.form.branches')}</Label>
                <Select multiple value={formBranches} onChange={(e) => setFormBranches(Array.from(e.target.selectedOptions, (o) => o.value))}>
                  {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </Select>
              </FieldGroup>
              <FieldGroup><Label>{t('teacherDashboard.form.courseImage')}</Label><StyledInput type="file" accept="image/*" onChange={(e) => setFormFile(e.target.files[0] || null)} /></FieldGroup>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" variant="primary" size="sm" isLoading={isCreating || isUpdating} disabled={!formName.trim()}>
                  {editingCourse ? t('teacherDashboard.actions.update') : t('teacherDashboard.actions.create')}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowAdd(false); setEditingCourse(null); }}>{t('teacherDashboard.actions.cancel')}</Button>
              </div>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      {courses.length > 0 && (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>{t('teacherDashboard.table.image')}</Th><Th>{t('teacherDashboard.table.title')}</Th><Th>{t('teacherDashboard.table.subject')}</Th><Th>{t('teacherDashboard.table.branch')}</Th><Th>{t('teacherDashboard.table.price')}</Th><Th>{t('teacherDashboard.table.rating')}</Th><Th>{t('teacherDashboard.table.actions')}</Th></tr></thead>
            <tbody>
              {courses.map((c) => (
                <RowHover key={c._id}>
                  <Td>{c.coverImage ? <img src={c.coverImage} alt="" style={{ width: 48, height: 32, borderRadius: 6, objectFit: 'cover' }} /> : '—'}</Td>
                  <Td>{c.name}</Td>
                  <Td>{c.subject?.name || '—'}</Td>
                  <Td>{c.branches?.[0]?.name || '—'}</Td>
                  <Td>{c.priceAfterDiscount ? <><span>{formatPrice(c.priceAfterDiscount)}</span> <OldPrice>{formatPrice(c.price)}</OldPrice></> : formatPrice(c.price)}</Td>
                  <Td>{c.averageRating > 0 ? <Badge>{c.averageRating.toFixed(1)}</Badge> : '—'}</Td>
                  <ActionsCell>
                    <ActionBtn $color="primary" title={t('teacherDashboard.actions.edit')} onClick={() => openEdit(c)}><Edit3 size={16} /></ActionBtn>
                    <ActionBtn $color="danger" title={t('teacherDashboard.actions.delete')} onClick={() => handleDelete(c)} disabled={isDeleting}><Trash2 size={16} /></ActionBtn>
                  </ActionsCell>
                </RowHover>
              ))}
            </tbody>
          </StyledTable>
        </TableWrap>
      )}
    </div>
  );
}

function CommentsTab() {
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

function ReviewsTab() {
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

function SendNotificationTab() {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const { sendNotification, isSending } = useTeacherActions();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    sendNotification({ title: title.trim(), message: message.trim() }, {
      onSuccess: () => { setTitle(''); setMessage(''); },
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FieldGroup>
        <Label>{t('teacherDashboard.form.title')}</Label>
        <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('teacherDashboard.sendNotification.titlePlaceholder')} required />
      </FieldGroup>
      <FieldGroup>
        <Label>{t('teacherDashboard.form.message')}</Label>
        <StyledTextarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('teacherDashboard.sendNotification.bodyPlaceholder')} required />
      </FieldGroup>
      <Button type="submit" variant="primary" size="md" leftIcon={isSending ? <Loader2 size={16} /> : <Send size={16} />} isLoading={isSending} disabled={!title.trim() || !message.trim()}>
        {t('teacherDashboard.sendNotification.sendToStudents')}
      </Button>
      <Note>{t('teacherDashboard.sendNotification.hint')}</Note>
    </Form>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const [activeNav, setActiveNav] = useState(0);
  const { t } = useLanguage();

  const tabs = {
    0: <OverviewTab />,
    1: <CoursesTab />,
    2: <CommentsTab />,
    3: <ReviewsTab />,
    4: <SendNotificationTab />,
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS(t)} activeNav={activeNav} onNavChange={setActiveNav}>
      <PageInner>
        <Header><Title>{t('teacherDashboard.title')}</Title></Header>
        {tabs[activeNav]}
      </PageInner>
    </DashboardLayout>
  );
}
