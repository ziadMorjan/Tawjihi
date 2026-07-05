import { useState } from 'react';
import {
  LayoutDashboard, UserCheck, Users, Layers, GitBranch,
  BookMarked, Ticket, Newspaper, Bell,
  DollarSign, GraduationCap, BookOpen,
  Check, X, Trash2, Send, Plus, Loader2, Edit3, Save, XCircle,
  Clock,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { useLanguage } from '../../shared/hooks/useLanguage';
import {
  useAdminStats, useAdminActions, usePendingTeachers,
  useAllUsers, useAllCourses, useBranches, useSubjects,
  useCoupons, useNews,
} from '../../features/admin';
import { adminApi } from '../../features/admin';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../shared/components/Button';
import { getNotificationTypeConfig } from '../../features/notifications/utils/notificationTypes';
import {
  PageInner, Header, Title,
  StatsGrid, StatCard, StatIconWrap, StatInfo, StatValue, StatLabel,
  ChartCard, LtrChartWrap, ChartTitle, ChartGrid, ChartGrid3, SectionTitle,
  TableWrap, StyledTable, Th, Td, ActionsCell, ActionBtn,
  ConfirmGroup, ConfirmBtn,
  ModalOverlay, ModalContent, ModalTitle,
  EmptyState, RowHover, Badge,
  Form, FieldGroup, Label, StyledInput, StyledTextarea, Select, InlineForm,
  ListCard, NewsCard, NewsImg, NewsContent, NewsTitle, NewsBody,
  SkeletonCard, OldPrice, EmptyMiniData,
  PreviewCard, PreviewIcon, PreviewContent, PreviewTitle, PreviewBody,
  HistoryCard, HistoryIcon, HistoryContent, HistoryTitle, HistoryBody, HistoryTime,
} from './styles';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatPrice(p) { return (p?.toLocaleString('ar-SA') || '0') + ' ₪'; }

const NAV_ITEMS = (t) => [
  { key: 0, label: t('adminDashboard.nav.overview'), icon: LayoutDashboard },
  { key: 1, label: t('adminDashboard.nav.pendingTeachers'), icon: UserCheck },
  { key: 2, label: t('adminDashboard.nav.users'), icon: Users },
  { key: 3, label: t('adminDashboard.nav.courses'), icon: Layers },
  { key: 4, label: t('adminDashboard.nav.branches'), icon: GitBranch },
  { key: 5, label: t('adminDashboard.nav.subjects'), icon: BookMarked },
  { key: 6, label: t('adminDashboard.nav.coupons'), icon: Ticket },
  { key: 7, label: t('adminDashboard.nav.news'), icon: Newspaper },
  { key: 8, label: t('adminDashboard.nav.broadcast'), icon: Bell },
];

// ── Tab Components ───────────────────────────────────────────────────────────

const PIE_COLORS = ['#0D7FA3', '#C8893A', '#22C55E', '#EF4444', '#A855F7', '#F97316'];
const RADIAN = Math.PI / 180;

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }, isAr) => {
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="#666"
      textAnchor={x > cx ? (isAr ? 'end' : 'start') : (isAr ? 'start' : 'end')}
      dominantBaseline="central"
      fontSize={11}
    >
      {`${name}: ${value}`}
    </text>
  );
};

function calcYAxisWidth(data, key = 'name') {
  if (!data?.length) return 120;
  const longest = Math.max(...data.map((d) => (d[key] || '').length));
  return Math.min(Math.max(longest * 6.5, 120), 200);
}

function OverviewTab() {
  const { stats } = useAdminStats();
  const { isAr, t } = useLanguage();
  if (!stats) return <SkeletonCard />;

  const { charts } = stats;

  const cards = [
    { label: t('adminDashboard.stats.totalUsers'), value: stats.totalUsers, icon: Users },
    { label: t('adminDashboard.stats.students'), value: stats.totalStudents, icon: GraduationCap },
    { label: t('adminDashboard.stats.teachers'), value: stats.totalTeachers, icon: BookOpen },
    { label: t('adminDashboard.stats.courses'), value: stats.totalCourses, icon: Layers },
    { label: t('adminDashboard.stats.revenue'), value: formatPrice(stats.totalRevenue), icon: DollarSign },
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

      <SectionTitle>{t('adminDashboard.sections.platformTrends')}</SectionTitle>

      <ChartGrid3>
        {!charts.revenueTrend?.length || charts.revenueTrend.length < 2 ? (
          <ChartCard><ChartTitle>{t('adminDashboard.sections.monthlyRevenue')}</ChartTitle><EmptyMiniData>{t('adminDashboard.empty.noData')}</EmptyMiniData></ChartCard>
        ) : (
          <ChartCard>
            <ChartTitle>{t('adminDashboard.sections.monthlyRevenue')}</ChartTitle>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={charts.revenueTrend} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
                {/* <XAxis dataKey="month" tick={{ fontSize: 8 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis width={36} tick={{ fontSize: 8 }} /> */}
                <Tooltip />
                <Area type="monotone" dataKey="total" stroke="#0D7FA3" fill="#0D7FA340" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {!charts.enrollmentTrend?.length || charts.enrollmentTrend.length < 2 ? (
          <ChartCard><ChartTitle>{t('adminDashboard.sections.monthlyEnrollments')}</ChartTitle><EmptyMiniData>{t('adminDashboard.empty.noData')}</EmptyMiniData></ChartCard>
        ) : (
          <ChartCard>
            <ChartTitle>{t('adminDashboard.sections.monthlyEnrollments')}</ChartTitle>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={charts.enrollmentTrend} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
                {/* <XAxis dataKey="month" tick={{ fontSize: 8 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis width={36} tick={{ fontSize: 8 }} /> */}
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#C8893A" fill="#C8893A40" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}

        {!charts.userGrowth?.length || charts.userGrowth.length < 2 ? (
          <ChartCard><ChartTitle>{t('adminDashboard.sections.userGrowth')}</ChartTitle><EmptyMiniData>{t('adminDashboard.empty.noData')}</EmptyMiniData></ChartCard>
        ) : (
          <ChartCard>
            <ChartTitle>{t('adminDashboard.sections.userGrowth')}</ChartTitle>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={charts.userGrowth} margin={{ top: 8, right: 4, bottom: 0, left: 4 }}>
                {/* <XAxis dataKey="month" tick={{ fontSize: 8 }} tickFormatter={(v) => v.slice(5)} />
                <YAxis width={5} tick={{ fontSize: 8 }} /> */}
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#22C55E" fill="#22C55E40" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        )}
      </ChartGrid3>

      <SectionTitle>{t('adminDashboard.sections.content')}</SectionTitle>

      <ChartGrid>
        <ChartCard>
          <ChartTitle>{t('adminDashboard.sections.topCourses')}</ChartTitle>
          <LtrChartWrap> 
            <ResponsiveContainer
              width="100%"
              height={Math.max((charts.topCourses?.length || 1) * 42, 220)}
            >
              {(() => {
                const w = calcYAxisWidth(charts.topCourses) * 0.6;
                const data = isAr
                  ? [...(charts.topCourses || [])].reverse()
                  : (charts.topCourses || []);
                return (
                  <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ left: 0, right: 0, top: 8, bottom: 8 }}
                  >
                    <XAxis type="number" tick={{ fontSize: 10 }} tickCount={4} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={w}
                      orientation="left"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Bar dataKey="enrollmentCount" fill="#0D7FA3" radius={[0, 4, 4, 0]} />
                  </BarChart>
                );
              })()}
            </ResponsiveContainer>
          </LtrChartWrap>
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('adminDashboard.sections.subjectDistribution')}</ChartTitle>
          <LtrChartWrap>
            <ResponsiveContainer
              width="100%"
              height={Math.max((charts.subjectDistribution?.length || 1) * 42, 220)}
            >
              {(() => {
                const w = calcYAxisWidth(charts.subjectDistribution) * 0.6;
                const data = isAr
                  ? [...(charts.subjectDistribution || [])].reverse()
                  : (charts.subjectDistribution || []);
                return (
                  <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ left: 0, right: 0, top: 8, bottom: 24 }}
                  >
                    <XAxis type="number" tick={{ fontSize: 10 }} tickCount={4} allowDecimals={false} />
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
      </ChartGrid>

      <SectionTitle>{t('adminDashboard.sections.users')}</SectionTitle>

      <ChartGrid3>
        <ChartCard>
          <ChartTitle>{t('adminDashboard.sections.ratingDistribution')}</ChartTitle>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart
              data={charts.ratingDistribution}
              margin={{ left: 8, right: 8, top: 8, bottom: 16 }}
            >
              <XAxis dataKey="range" tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="count" fill="#C8893A" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('adminDashboard.sections.roleDistribution')}</ChartTitle>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie
                data={charts.userRoleDistribution}
                dataKey="count"
                nameKey="role"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={(p) => renderPieLabel(p, isAr)}
                labelLine={{ stroke: '#999', strokeWidth: 1 }}
              >
                {charts.userRoleDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                iconSize={10}
                formatter={(value) => <span style={{ fontSize: 11, color: '#666' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard>
          <ChartTitle>{t('adminDashboard.sections.userStatus')}</ChartTitle>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie
                data={charts.activeInactive}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={55}
                innerRadius={30}
                label={(p) => renderPieLabel(p, isAr)}
                labelLine={{ stroke: '#999', strokeWidth: 1 }}
              >
                {charts.activeInactive.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#22C55E' : '#EF4444'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                verticalAlign="bottom"
                iconSize={10}
                formatter={(value) => <span style={{ fontSize: 11, color: '#666' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartGrid3>
    </>
  );
}

function PendingTeachersTab() {
  const { approveTeacher, rejectTeacher, isApproving, isRejecting } = useAdminActions();
  const { pendingTeachers, isLoading } = usePendingTeachers();
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  if (isLoading) return <SkeletonCard />;
  if (!pendingTeachers.length) return <EmptyState>{t('adminDashboard.empty.noPendingTeachers')}</EmptyState>;

  return (
    <TableWrap>
      <StyledTable>
        <thead><tr><Th>{t('adminDashboard.table.name')}</Th><Th>{t('adminDashboard.table.email')}</Th><Th>{t('adminDashboard.table.phone')}</Th><Th>{t('adminDashboard.table.cv')}</Th><Th>{t('adminDashboard.table.actions')}</Th></tr></thead>
        <tbody>
          {pendingTeachers.map((pt) => (
            <RowHover key={pt._id}>
              <Td>{pt.name}</Td>
              <Td>{pt.email}</Td>
              <Td>{pt.phone || '—'}</Td>
              <Td>{pt.cv ? <a href={pt.cv} target="_blank" rel="noreferrer">{t('adminDashboard.actions.view')}</a> : '—'}</Td>
              <ActionsCell>
                {confirm?.id === pt._id && confirm.type === 'approve' ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { approveTeacher(pt._id); setConfirm(null); }} disabled={isApproving}>
                      {isApproving ? <Loader2 size={13} /> : <Check size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="success" title={t('adminDashboard.actions.approve')} onClick={() => setConfirm({ type: 'approve', id: pt._id })}><Check size={16} /></ActionBtn>
                )}
                {confirm?.id === pt._id && confirm.type === 'reject' ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { rejectTeacher(pt._id); setConfirm(null); }} disabled={isRejecting}>
                      {isRejecting ? <Loader2 size={13} /> : <X size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="danger" title={t('adminDashboard.actions.reject')} onClick={() => setConfirm({ type: 'reject', id: pt._id })}><X size={16} /></ActionBtn>
                )}
              </ActionsCell>
            </RowHover>
          ))}
        </tbody>
      </StyledTable>
    </TableWrap>
  );
}

function UsersTab() {
  const { deleteUser, isDeletingUser } = useAdminActions();
  const { users, isLoading } = useAllUsers();
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const filtered = search
    ? users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users;

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <StyledInput
          placeholder={t('adminDashboard.search.users')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {!filtered.length ? (
        <EmptyState>{search ? t('adminDashboard.empty.noSearchResults') : t('adminDashboard.empty.noUsers')}</EmptyState>
      ) : (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>{t('adminDashboard.table.image')}</Th><Th>{t('adminDashboard.table.name')}</Th><Th>{t('adminDashboard.table.email')}</Th><Th>{t('adminDashboard.table.phone')}</Th><Th>{t('adminDashboard.table.joinDate')}</Th><Th>{t('adminDashboard.table.actions')}</Th></tr></thead>
            <tbody>
              {filtered.map((u) => (
                <RowHover key={u._id}>
                  <Td>
                    {u.coverImage ? <img src={u.coverImage} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} /> : '—'}
                  </Td>
                  <Td>{u.name}</Td>
                  <Td>{u.email}</Td>
                  <Td>{u.phone || '—'}</Td>
                  <Td>{formatDate(u.createdAt)}</Td>
                  <ActionsCell>
                    {confirm === u._id ? (
                      <ConfirmGroup>
                        <ConfirmBtn $variant="confirm" onClick={() => { deleteUser(u._id); setConfirm(null); }} disabled={isDeletingUser}>
                          {isDeletingUser ? <Loader2 size={13} /> : <Check size={13} />}
                        </ConfirmBtn>
                        <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                      </ConfirmGroup>
                    ) : (
                      <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(u._id)}><Trash2 size={16} /></ActionBtn>
                    )}
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

function CoursesTab() {
  const { deleteCourse, isDeletingCourse } = useAdminActions();
  const { courses, isLoading } = useAllCourses();
  const [search, setSearch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const filtered = search
    ? courses.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()) || c.teacher?.name?.toLowerCase().includes(search.toLowerCase()))
    : courses;

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <StyledInput
          placeholder={t('adminDashboard.search.courses')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {!filtered.length ? (
        <EmptyState>{search ? t('adminDashboard.empty.noSearchResults') : t('adminDashboard.empty.noCourses')}</EmptyState>
      ) : (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>{t('adminDashboard.table.image')}</Th><Th>{t('adminDashboard.table.title')}</Th><Th>{t('adminDashboard.table.teacher')}</Th><Th>{t('adminDashboard.table.subject')}</Th><Th>{t('adminDashboard.table.price')}</Th><Th>{t('adminDashboard.table.rating')}</Th><Th>{t('adminDashboard.table.actions')}</Th></tr></thead>
            <tbody>
              {filtered.map((c) => (
                <RowHover key={c._id}>
                  <Td>
                    {c.coverImage ? <img src={c.coverImage} alt="" style={{ width: 48, height: 32, borderRadius: 6, objectFit: 'cover' }} /> : '—'}
                  </Td>
                  <Td>{c.name}</Td>
                  <Td>{c.teacher?.name || '—'}</Td>
                  <Td>{c.subject?.name || '—'}</Td>
                  <Td>
                    {c.priceAfterDiscount ? <><span>{formatPrice(c.priceAfterDiscount)}</span> <OldPrice>{formatPrice(c.price)}</OldPrice></> : formatPrice(c.price)}
                  </Td>
                  <Td>{c.averageRating > 0 ? <Badge $type={c.averageRating >= 4 ? 'success' : c.averageRating >= 2.5 ? 'warning' : 'danger'}>{c.averageRating.toFixed(1)}</Badge> : '—'}</Td>
                  <ActionsCell>
                    {confirm === c._id ? (
                      <ConfirmGroup>
                        <ConfirmBtn $variant="confirm" onClick={() => { deleteCourse(c._id); setConfirm(null); }} disabled={isDeletingCourse}>
                          {isDeletingCourse ? <Loader2 size={13} /> : <Check size={13} />}
                        </ConfirmBtn>
                        <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                      </ConfirmGroup>
                    ) : (
                      <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(c._id)}><Trash2 size={16} /></ActionBtn>
                    )}
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

function BranchesTab() {
  const { createBranch, updateBranch, deleteBranch, isCreatingBranch, isUpdatingBranch, isDeletingBranch } = useAdminActions();
  const { branches, isLoading } = useBranches();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createBranch(name.trim(), { onSuccess: () => setName('') });
  };

  const startEdit = (b) => {
    setEditingId(b._id);
    setEditName(b.name);
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    updateBranch({ id: editingId, name: editName.trim() }, { onSuccess: () => setEditingId(null) });
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <InlineForm as="form" onSubmit={handleAdd}>
        <StyledInput value={name} onChange={(e) => setName(e.target.value)} placeholder={t('adminDashboard.form.branchName')} required style={{ flex: 1 }} />
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingBranch ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingBranch} disabled={!name.trim()}>{t('adminDashboard.actions.add')}</Button>
      </InlineForm>
      {branches.length === 0 && <EmptyState>{t('adminDashboard.empty.noBranches')}</EmptyState>}
      {branches.map((b) => (
        <ListCard key={b._id}>
          {editingId === b._id ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <StyledInput value={editName} onChange={(e) => setEditName(e.target.value)} style={{ flex: 1 }} autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null); }} />
              <ConfirmBtn $variant="confirm" onClick={saveEdit} disabled={isUpdatingBranch || !editName.trim()}>
                {isUpdatingBranch ? <Loader2 size={13} /> : <Save size={13} />}
              </ConfirmBtn>
              <ConfirmBtn $variant="cancel" onClick={() => setEditingId(null)}><XCircle size={13} /></ConfirmBtn>
            </div>
          ) : (
            <>
              <span style={{ cursor: 'pointer' }} onClick={() => startEdit(b)}>{b.name}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <ActionBtn $color="primary" title={t('adminDashboard.actions.edit')} onClick={() => startEdit(b)}><Edit3 size={16} /></ActionBtn>
                {confirm === b._id ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { deleteBranch(b._id); setConfirm(null); }} disabled={isDeletingBranch}>
                      {isDeletingBranch ? <Loader2 size={13} /> : <Check size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(b._id)}><Trash2 size={16} /></ActionBtn>
                )}
              </div>
            </>
          )}
        </ListCard>
      ))}
    </div>
  );
}

function SubjectsTab() {
  const { createSubject, updateSubject, deleteSubject, isCreatingSubject, isUpdatingSubject, isDeletingSubject } = useAdminActions();
  const { subjects, isLoading } = useSubjects();
  const { branches } = useBranches();
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editBranch, setEditBranch] = useState('');
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createSubject({ name: name.trim(), branch: branch || undefined }, { onSuccess: () => { setName(''); setBranch(''); } });
  };

  const startEdit = (s) => {
    setEditingId(s._id);
    setEditName(s.name);
    setEditBranch(s.branch?._id || '');
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    updateSubject({ id: editingId, name: editName.trim(), branch: editBranch || undefined }, { onSuccess: () => setEditingId(null) });
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <InlineForm as="form" onSubmit={handleAdd}>
        <StyledInput value={name} onChange={(e) => setName(e.target.value)} placeholder={t('adminDashboard.form.subjectName')} required />
        <Select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">{t('adminDashboard.form.noBranch')}</option>
          {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </Select>
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingSubject ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingSubject} disabled={!name.trim()}>{t('adminDashboard.actions.add')}</Button>
      </InlineForm>
      {subjects.length === 0 && <EmptyState>{t('adminDashboard.empty.noSubjects')}</EmptyState>}
      {subjects.map((s) => (
        <ListCard key={s._id}>
          {editingId === s._id ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <StyledInput value={editName} onChange={(e) => setEditName(e.target.value)} style={{ flex: 1 }} autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null); }} />
              <Select value={editBranch} onChange={(e) => setEditBranch(e.target.value)} style={{ width: 140 }}>
                <option value="">{t('adminDashboard.form.noBranch')}</option>
                {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
              </Select>
              <ConfirmBtn $variant="confirm" onClick={saveEdit} disabled={isUpdatingSubject || !editName.trim()}>
                {isUpdatingSubject ? <Loader2 size={13} /> : <Save size={13} />}
              </ConfirmBtn>
              <ConfirmBtn $variant="cancel" onClick={() => setEditingId(null)}><XCircle size={13} /></ConfirmBtn>
            </div>
          ) : (
            <>
              <span style={{ cursor: 'pointer' }} onClick={() => startEdit(s)}>
                {s.name} {s.branch?.name ? <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>({s.branch?.name})</span> : ''}
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                <ActionBtn $color="primary" title={t('adminDashboard.actions.edit')} onClick={() => startEdit(s)}><Edit3 size={16} /></ActionBtn>
                {confirm === s._id ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { deleteSubject(s._id); setConfirm(null); }} disabled={isDeletingSubject}>
                      {isDeletingSubject ? <Loader2 size={13} /> : <Check size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(s._id)}><Trash2 size={16} /></ActionBtn>
                )}
              </div>
            </>
          )}
        </ListCard>
      ))}
    </div>
  );
}

function CouponsTab() {
  const { createCoupon, updateCoupon, deleteCoupon, isCreatingCoupon, isUpdatingCoupon, isDeletingCoupon } = useAdminActions();
  const { coupons, isLoading } = useCoupons();
  const [name, setName] = useState('');
  const [discount, setDiscount] = useState('');
  const [expire, setExpire] = useState('');
  const [editCoupon, setEditCoupon] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDiscount, setEditDiscount] = useState('');
  const [editExpire, setEditExpire] = useState('');
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !discount || !expire) return;
    createCoupon({ name: name.trim().toUpperCase(), discount: Number(discount), expire: new Date(expire).toISOString() }, { onSuccess: () => { setName(''); setDiscount(''); setExpire(''); } });
  };

  const openEdit = (c) => {
    setEditCoupon(c);
    setEditName(c.name);
    setEditDiscount(String(c.discount));
    setEditExpire(new Date(c.expire).toISOString().split('T')[0]);
  };

  const handleSave = () => {
    updateCoupon({ id: editCoupon._id, name: editName.trim().toUpperCase(), discount: Number(editDiscount), expire: editExpire }, { onSuccess: () => setEditCoupon(null) });
  };

  const handleDelete = (id) => {
    deleteCoupon(id, { onSuccess: () => setConfirm(null) });
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      {editCoupon && (
        <ModalOverlay onClick={() => setEditCoupon(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{t('adminDashboard.coupons.editTitle')}</ModalTitle>
            <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <FieldGroup><Label>{t('adminDashboard.form.name')}</Label><StyledInput value={editName} onChange={(e) => setEditName(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>{t('adminDashboard.form.discountPercent')}</Label><StyledInput type="number" value={editDiscount} onChange={(e) => setEditDiscount(e.target.value)} min="1" max="100" required /></FieldGroup>
              <FieldGroup><Label>{t('adminDashboard.form.expireDate')}</Label><StyledInput type="date" value={editExpire} onChange={(e) => setEditExpire(e.target.value)} required /></FieldGroup>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" variant="primary" size="sm" isLoading={isUpdatingCoupon} disabled={!editName.trim() || !editDiscount || !editExpire}>{t('adminDashboard.actions.save')}</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditCoupon(null)}>{t('adminDashboard.actions.cancel')}</Button>
              </div>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      <Form onSubmit={handleAdd} style={{ marginBottom: 24 }}>
        <FieldGroup>
          <Label>{t('adminDashboard.form.name')}</Label>
          <StyledInput value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: SAVE20" required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.form.discountPercent')}</Label>
          <StyledInput type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="20" min="1" max="100" required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.form.expireDate')}</Label>
          <StyledInput type="date" value={expire} onChange={(e) => setExpire(e.target.value)} required />
        </FieldGroup>
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingCoupon ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingCoupon} disabled={!name.trim() || !discount || !expire}>{t('adminDashboard.coupons.addButton')}</Button>
      </Form>
      {coupons.length === 0 && <EmptyState>{t('adminDashboard.empty.noCoupons')}</EmptyState>}
      {coupons.length > 0 && (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>{t('adminDashboard.table.name')}</Th><Th>{t('adminDashboard.table.discount')}</Th><Th>{t('adminDashboard.table.expireDate')}</Th><Th>{t('adminDashboard.table.status')}</Th><Th>{t('adminDashboard.table.actions')}</Th></tr></thead>
            <tbody>
              {coupons.map((c) => {
                const expired = new Date(c.expire) < new Date();
                return (
                  <RowHover key={c._id} style={{ opacity: expired ? 0.5 : 1 }}>
                    <Td><strong>{c.name}</strong></Td>
                    <Td>{c.discount}%</Td>
                    <Td>{formatDate(c.expire)}</Td>
                    <Td>{expired ? <Badge $type="danger">{t('adminDashboard.coupons.expired')}</Badge> : <Badge $type="success">{t('adminDashboard.coupons.active')}</Badge>}</Td>
                    <ActionsCell>
                      <ActionBtn $color="primary" title={t('adminDashboard.actions.edit')} onClick={() => openEdit(c)}><Edit3 size={16} /></ActionBtn>
                      {confirm === c._id ? (
                        <ConfirmGroup>
                          <ConfirmBtn $variant="confirm" onClick={() => handleDelete(c._id)} disabled={isDeletingCoupon}>
                            {isDeletingCoupon ? <Loader2 size={13} /> : <Check size={13} />}
                          </ConfirmBtn>
                          <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                        </ConfirmGroup>
                      ) : (
                        <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(c._id)}><Trash2 size={16} /></ActionBtn>
                      )}
                    </ActionsCell>
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

function NewsTab() {
  const { createNews, updateNews, deleteNews, isCreatingNews, isUpdatingNews, isDeletingNews } = useAdminActions();
  const { news, isLoading } = useNews();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [editNews, setEditNews] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editFile, setEditFile] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const { t } = useLanguage();

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const fd = new FormData();
    fd.append('title', title.trim());
    fd.append('body', content.trim());
    if (file) fd.append('coverImage', file);
    createNews(fd, { onSuccess: () => { setTitle(''); setContent(''); setFile(null); } });
  };

  const openEdit = (n) => {
    setEditNews(n);
    setEditTitle(n.title);
    setEditContent(n.body);
    setEditFile(null);
  };

  const handleSave = () => {
    const fd = new FormData();
    fd.append('title', editTitle.trim());
    fd.append('body', editContent.trim());
    if (editFile) fd.append('coverImage', editFile);
    updateNews({ id: editNews._id, formData: fd }, { onSuccess: () => setEditNews(null) });
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      {editNews && (
        <ModalOverlay onClick={() => setEditNews(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{t('adminDashboard.news.editTitle')}</ModalTitle>
            <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <FieldGroup><Label>{t('adminDashboard.form.title')}</Label><StyledInput value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>{t('adminDashboard.form.content')}</Label><StyledTextarea value={editContent} onChange={(e) => setEditContent(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>{t('adminDashboard.form.imageOptional')}</Label><StyledInput type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files[0] || null)} /></FieldGroup>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" variant="primary" size="sm" isLoading={isUpdatingNews} disabled={!editTitle.trim() || !editContent.trim()}>{t('adminDashboard.actions.save')}</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditNews(null)}>{t('adminDashboard.actions.cancel')}</Button>
              </div>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      <Form onSubmit={handleAdd} style={{ marginBottom: 24 }}>
        <FieldGroup>
          <Label>{t('adminDashboard.form.title')}</Label>
          <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الخبر" required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.form.content')}</Label>
          <StyledTextarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="نص الخبر" required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.form.imageOptional')}</Label>
          <StyledInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
        </FieldGroup>
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingNews ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingNews} disabled={!title.trim() || !content.trim()}>{t('adminDashboard.news.addButton')}</Button>
      </Form>
      {news.length === 0 && <EmptyState>{t('adminDashboard.empty.noNews')}</EmptyState>}
      {news.map((n) => (
        <NewsCard key={n._id}>
          {n.coverImage && <NewsImg src={n.coverImage} alt="" />}
          <NewsContent>
            <NewsTitle>{n.title}</NewsTitle>
            <NewsBody>{n.body}</NewsBody>
          </NewsContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ActionBtn $color="primary" title={t('adminDashboard.actions.edit')} onClick={() => openEdit(n)}><Edit3 size={16} /></ActionBtn>
            {confirm === n._id ? (
              <ConfirmGroup>
                <ConfirmBtn $variant="confirm" onClick={() => { deleteNews(n._id); setConfirm(null); }} disabled={isDeletingNews}>
                  {isDeletingNews ? <Loader2 size={13} /> : <Check size={13} />}
                </ConfirmBtn>
                <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
              </ConfirmGroup>
            ) : (
              <ActionBtn $color="danger" title={t('adminDashboard.actions.delete')} onClick={() => setConfirm(n._id)}><Trash2 size={16} /></ActionBtn>
            )}
          </div>
        </NewsCard>
      ))}
    </div>
  );
}

function BroadcastTab() {
  const { broadcastNotification, broadcastToSpecific, isBroadcasting } = useAdminActions();
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [recipientType, setRecipientType] = useState('all_students');
  const [notifType, setNotifType] = useState('message');
  const [sentHistory, setSentHistory] = useState([]);

  const { data: allTeachers } = useQuery({
    queryKey: ['all-teacher-ids'],
    queryFn: adminApi.getAllTeacherIds,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: recipientType === 'all_teachers' || recipientType === 'everyone',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    const payload = { title: title.trim(), body: body.trim(), type: notifType };

    const addToHistory = () => {
      setSentHistory((prev) => [{ ...payload, sentAt: new Date().toISOString() }, ...prev].slice(0, 5));
      setTitle('');
      setBody('');
    };

    if (recipientType === 'all_students') {
      broadcastNotification(payload, { onSuccess: addToHistory });
    } else if (recipientType === 'all_teachers') {
      if (!allTeachers?.length) return;
      broadcastToSpecific({ ...payload, recipients: allTeachers }, { onSuccess: addToHistory });
    } else if (recipientType === 'everyone') {
      const uData = await adminApi.getAllUsers();
      const tData = allTeachers || [];
      const allIds = [...(uData?.map((u) => u._id) || []), ...tData];
      if (!allIds.length) return;
      broadcastToSpecific({ ...payload, recipients: allIds }, { onSuccess: addToHistory });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <Label>{t('adminDashboard.form.title')}</Label>
          <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('adminDashboard.broadcast.titlePlaceholder')} required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.form.message')}</Label>
          <StyledTextarea value={body} onChange={(e) => setBody(e.target.value)} placeholder={t('adminDashboard.broadcast.bodyPlaceholder')} required />
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.broadcast.recipients')}</Label>
          <Select value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
            <option value="all_students">{t('adminDashboard.broadcast.allStudents')}</option>
            <option value="all_teachers">{t('adminDashboard.broadcast.allTeachers')}</option>
            <option value="everyone">{t('adminDashboard.broadcast.everyone')}</option>
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Label>{t('adminDashboard.broadcast.notifType')}</Label>
          <Select value={notifType} onChange={(e) => setNotifType(e.target.value)}>
            <option value="message">{t('notifications.types.message')}</option>
            <option value="course">{t('notifications.types.course')}</option>
            <option value="news">{t('notifications.types.news')}</option>
          </Select>
        </FieldGroup>
        <Button type="submit" variant="primary" size="md" leftIcon={isBroadcasting ? <Loader2 size={16} /> : <Send size={16} />} isLoading={isBroadcasting} disabled={!title.trim() || !body.trim()}>
          {t('adminDashboard.broadcast.sendButton')}
        </Button>
      </Form>

      <SectionTitle style={{ marginTop: 32 }}>{t('adminDashboard.broadcast.previewTitle')}</SectionTitle>
      {(() => {
        const config = getNotificationTypeConfig(notifType);
        const Icon = config.icon;
        return (
          <PreviewCard>
            <PreviewIcon $color={config.color}><Icon /></PreviewIcon>
            <PreviewContent>
              <PreviewTitle>{title || t('adminDashboard.broadcast.previewPlaceholder')}</PreviewTitle>
              {body && <PreviewBody>{body}</PreviewBody>}
            </PreviewContent>
          </PreviewCard>
        );
      })()}

      {sentHistory.length > 0 && (
        <>
          <SectionTitle style={{ marginTop: 32 }}>{t('adminDashboard.broadcast.sentHistory')}</SectionTitle>
          {sentHistory.map((h, i) => {
            const cfg = getNotificationTypeConfig(h.type);
            const HIcon = cfg.icon;
            return (
              <HistoryCard key={i}>
                <HistoryIcon $color={cfg.color}><HIcon /></HistoryIcon>
                <HistoryContent>
                  <HistoryTitle>{h.title}</HistoryTitle>
                  {h.body && <HistoryBody>{h.body}</HistoryBody>}
                  <HistoryTime><Clock size={12} /> {new Date(h.sentAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</HistoryTime>
                </HistoryContent>
              </HistoryCard>
            );
          })}
        </>
      )}
    </>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState(0);
  const { t } = useLanguage();

  const tabs = {
    0: <OverviewTab />,
    1: <PendingTeachersTab />,
    2: <UsersTab />,
    3: <CoursesTab />,
    4: <BranchesTab />,
    5: <SubjectsTab />,
    6: <CouponsTab />,
    7: <NewsTab />,
    8: <BroadcastTab />,
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS(t)} activeNav={activeNav} onNavChange={setActiveNav}>
      <PageInner>
        <Header><Title>{t('adminDashboard.title')}</Title></Header>
        {tabs[activeNav]}
      </PageInner>
    </DashboardLayout>
  );
}
