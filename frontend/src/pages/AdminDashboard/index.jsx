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
import styled from 'styled-components';
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

const PageInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[6]}`};

  @media (max-width: 600px) {
    padding: 16px 12px;
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

const StatIconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
  svg { width: 24px; height: 24px; }
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.2;
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ChartCard = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  display: flex;
  flex-direction: column;
  min-height: 280px;
`;

const LtrChartWrap = styled.div`
  direction: ltr;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    max-width: 100%;
    overflow-x: auto;
  }
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing[3]};
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const ChartGrid3 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: ${({ theme }) => theme.spacing[8]} 0 ${({ theme }) => theme.spacing[4]};
`;

const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.bgPrimary};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Th = styled.th`
  text-align: right;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.bgSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  white-space: nowrap;
`;

const Td = styled.td`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: middle;
`;

const ActionsCell = styled.td`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const ActionBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  color: ${({ theme, $color }) => theme.colors[$color] || theme.colors.textSecondary};
  &:hover {
    background: ${({ theme, $color }) =>
      $color ? theme.colors[$color] + '18' : theme.colors.bgSecondary};
  }
`;

const ConfirmGroup = styled.div`
  display: flex; align-items: center; gap: 2px;
`;

const ConfirmBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  padding: 3px; border-radius: 4px; border: none; cursor: pointer;
  font-family: inherit; line-height: 1;
  background: ${({ $variant, theme }) => $variant === 'confirm' ? theme.colors.success + '20' : theme.colors.danger + '15'};
  color: ${({ $variant, theme }) => $variant === 'confirm' ? theme.colors.success : theme.colors.danger};
  &:hover { opacity: 0.8; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 200;
  display: flex; align-items: center; justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.bgPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;

  @media (max-width: 600px) {
    width: 90vw;
    padding: 16px;
  }
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing[6]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

const RowHover = styled.tr`
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.bgSecondary}; }
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.success + '20' :
    $type === 'warning' ? theme.colors.warning + '20' :
    $type === 'danger' ? theme.colors.danger + '20' :
    theme.colors.primaryLight};
  color: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.success :
    $type === 'warning' ? theme.colors.warning :
    $type === 'danger' ? theme.colors.danger :
    theme.colors.primary};
`;

const Form = styled.form`
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StyledInput = styled.input`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}18;
  }
`;

const StyledTextarea = styled.textarea`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  resize: vertical;
  min-height: 120px;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}18;
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}18;
  }
`;

const InlineForm = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  align-items: flex-end;

  @media (max-width: 600px) {
    flex-direction: column;
    input, select { width: 100%; }
  }
`;

const ListCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const NewsCard = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const NewsImg = styled.img`
  width: 120px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  object-fit: cover;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 100%;
    max-width: 100%;
    height: auto;
    aspect-ratio: 3 / 2;
  }
`;

const NewsContent = styled.div`
  flex: 1;
`;

const NewsTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing[1]};
`;

const NewsBody = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SkeletonCard = styled.div`
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.bgTertiary};
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
`;

const OldPrice = styled.span`
  text-decoration: line-through;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatPrice(p) { return (p?.toLocaleString('ar-SA') || '0') + ' ₪'; }

const NAV_ITEMS = [
  { key: 0, label: 'نظرة عامة', icon: LayoutDashboard },
  { key: 1, label: 'المعلمون المعلقون', icon: UserCheck },
  { key: 2, label: 'المستخدمون', icon: Users },
  { key: 3, label: 'الكورسات', icon: Layers },
  { key: 4, label: 'الفروع', icon: GitBranch },
  { key: 5, label: 'المواد', icon: BookMarked },
  { key: 6, label: 'الكوبونات', icon: Ticket },
  { key: 7, label: 'الأخبار', icon: Newspaper },
  { key: 8, label: 'إرسال إشعار', icon: Bell },
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

const EmptyMiniData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 170px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

function calcYAxisWidth(data, key = 'name') {
  if (!data?.length) return 120;
  const longest = Math.max(...data.map((d) => (d[key] || '').length));
  return Math.min(Math.max(longest * 6.5, 120), 200);
}

function OverviewTab() {
  const { stats } = useAdminStats();
  const { isAr } = useLanguage();
  if (!stats) return <SkeletonCard />;

  const { charts } = stats;

  const cards = [
    { label: 'إجمالي المستخدمين', value: stats.totalUsers, icon: Users },
    { label: 'الطلاب', value: stats.totalStudents, icon: GraduationCap },
    { label: 'المعلمون', value: stats.totalTeachers, icon: BookOpen },
    { label: 'الكورسات', value: stats.totalCourses, icon: Layers },
    { label: 'الإيرادات', value: formatPrice(stats.totalRevenue), icon: DollarSign },
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

      <SectionTitle>اتجاهات المنصة</SectionTitle>

      <ChartGrid3>
        {!charts.revenueTrend?.length || charts.revenueTrend.length < 2 ? (
          <ChartCard><ChartTitle>الإيرادات الشهرية</ChartTitle><EmptyMiniData>لا توجد بيانات</EmptyMiniData></ChartCard>
        ) : (
          <ChartCard>
            <ChartTitle>الإيرادات الشهرية</ChartTitle>
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
          <ChartCard><ChartTitle>الاشتراكات الشهرية</ChartTitle><EmptyMiniData>لا توجد بيانات</EmptyMiniData></ChartCard>
        ) : (
          <ChartCard>
            <ChartTitle>الاشتراكات الشهرية</ChartTitle>
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
          <ChartCard><ChartTitle>نمو المستخدمين</ChartTitle><EmptyMiniData>لا توجد بيانات</EmptyMiniData></ChartCard>
        ) : (
          <ChartCard>
            <ChartTitle>نمو المستخدمين</ChartTitle>
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

      <SectionTitle>المحتوى</SectionTitle>

      <ChartGrid>
        <ChartCard>
          <ChartTitle>الكورسات الأعلى اشتراكاً</ChartTitle>
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
          <ChartTitle>توزيع المواد</ChartTitle>
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

      <SectionTitle>المستخدمون</SectionTitle>

      <ChartGrid3>
        <ChartCard>
          <ChartTitle>توزيع التقييمات</ChartTitle>
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
          <ChartTitle>توزيع الأدوار</ChartTitle>
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
          <ChartTitle>حالة المستخدمين</ChartTitle>
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

  if (isLoading) return <SkeletonCard />;
  if (!pendingTeachers.length) return <EmptyState>لا يوجد معلمون معلقون</EmptyState>;

  return (
    <TableWrap>
      <StyledTable>
        <thead><tr><Th>الاسم</Th><Th>الإيميل</Th><Th>الهاتف</Th><Th>السيرة</Th><Th>الإجراءات</Th></tr></thead>
        <tbody>
          {pendingTeachers.map((t) => (
            <RowHover key={t._id}>
              <Td>{t.name}</Td>
              <Td>{t.email}</Td>
              <Td>{t.phone || '—'}</Td>
              <Td>{t.cv ? <a href={t.cv} target="_blank" rel="noreferrer">عرض</a> : '—'}</Td>
              <ActionsCell>
                {confirm?.id === t._id && confirm.type === 'approve' ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { approveTeacher(t._id); setConfirm(null); }} disabled={isApproving}>
                      {isApproving ? <Loader2 size={13} /> : <Check size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="success" title="قبول" onClick={() => setConfirm({ type: 'approve', id: t._id })}><Check size={16} /></ActionBtn>
                )}
                {confirm?.id === t._id && confirm.type === 'reject' ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { rejectTeacher(t._id); setConfirm(null); }} disabled={isRejecting}>
                      {isRejecting ? <Loader2 size={13} /> : <X size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="danger" title="رفض" onClick={() => setConfirm({ type: 'reject', id: t._id })}><X size={16} /></ActionBtn>
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

  const filtered = search
    ? users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users;

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <StyledInput
          placeholder="بحث بالاسم أو الإيميل..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {!filtered.length ? (
        <EmptyState>{search ? 'لا توجد نتائج بحث' : 'لا يوجد مستخدمون'}</EmptyState>
      ) : (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>الصورة</Th><Th>الاسم</Th><Th>الإيميل</Th><Th>الهاتف</Th><Th>تاريخ الانضمام</Th><Th>الإجراءات</Th></tr></thead>
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
                      <ActionBtn $color="danger" title="حذف" onClick={() => setConfirm(u._id)}><Trash2 size={16} /></ActionBtn>
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

  const filtered = search
    ? courses.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()) || c.teacher?.name?.toLowerCase().includes(search.toLowerCase()))
    : courses;

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <StyledInput
          placeholder="بحث بالاسم أو المعلم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
        />
      </div>

      {!filtered.length ? (
        <EmptyState>{search ? 'لا توجد نتائج بحث' : 'لا توجد كورسات'}</EmptyState>
      ) : (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>الصورة</Th><Th>العنوان</Th><Th>المعلم</Th><Th>المادة</Th><Th>السعر</Th><Th>التقييم</Th><Th>الإجراءات</Th></tr></thead>
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
                      <ActionBtn $color="danger" title="حذف" onClick={() => setConfirm(c._id)}><Trash2 size={16} /></ActionBtn>
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
        <StyledInput value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم الفرع" required style={{ flex: 1 }} />
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingBranch ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingBranch} disabled={!name.trim()}>إضافة</Button>
      </InlineForm>
      {branches.length === 0 && <EmptyState>لا توجد فروع</EmptyState>}
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
                <ActionBtn $color="primary" title="تعديل" onClick={() => startEdit(b)}><Edit3 size={16} /></ActionBtn>
                {confirm === b._id ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { deleteBranch(b._id); setConfirm(null); }} disabled={isDeletingBranch}>
                      {isDeletingBranch ? <Loader2 size={13} /> : <Check size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="danger" title="حذف" onClick={() => setConfirm(b._id)}><Trash2 size={16} /></ActionBtn>
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
        <StyledInput value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم المادة" required />
        <Select value={branch} onChange={(e) => setBranch(e.target.value)}>
          <option value="">بدون فرع</option>
          {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
        </Select>
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingSubject ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingSubject} disabled={!name.trim()}>إضافة</Button>
      </InlineForm>
      {subjects.length === 0 && <EmptyState>لا توجد مواد</EmptyState>}
      {subjects.map((s) => (
        <ListCard key={s._id}>
          {editingId === s._id ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <StyledInput value={editName} onChange={(e) => setEditName(e.target.value)} style={{ flex: 1 }} autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null); }} />
              <Select value={editBranch} onChange={(e) => setEditBranch(e.target.value)} style={{ width: 140 }}>
                <option value="">بدون فرع</option>
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
                <ActionBtn $color="primary" title="تعديل" onClick={() => startEdit(s)}><Edit3 size={16} /></ActionBtn>
                {confirm === s._id ? (
                  <ConfirmGroup>
                    <ConfirmBtn $variant="confirm" onClick={() => { deleteSubject(s._id); setConfirm(null); }} disabled={isDeletingSubject}>
                      {isDeletingSubject ? <Loader2 size={13} /> : <Check size={13} />}
                    </ConfirmBtn>
                    <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                  </ConfirmGroup>
                ) : (
                  <ActionBtn $color="danger" title="حذف" onClick={() => setConfirm(s._id)}><Trash2 size={16} /></ActionBtn>
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
            <ModalTitle>تعديل الكوبون</ModalTitle>
            <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <FieldGroup><Label>الاسم</Label><StyledInput value={editName} onChange={(e) => setEditName(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>نسبة الخصم (%)</Label><StyledInput type="number" value={editDiscount} onChange={(e) => setEditDiscount(e.target.value)} min="1" max="100" required /></FieldGroup>
              <FieldGroup><Label>تاريخ الانتهاء</Label><StyledInput type="date" value={editExpire} onChange={(e) => setEditExpire(e.target.value)} required /></FieldGroup>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" variant="primary" size="sm" isLoading={isUpdatingCoupon} disabled={!editName.trim() || !editDiscount || !editExpire}>حفظ</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditCoupon(null)}>إلغاء</Button>
              </div>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      <Form onSubmit={handleAdd} style={{ marginBottom: 24 }}>
        <FieldGroup>
          <Label>الاسم</Label>
          <StyledInput value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: SAVE20" required />
        </FieldGroup>
        <FieldGroup>
          <Label>نسبة الخصم (%)</Label>
          <StyledInput type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="20" min="1" max="100" required />
        </FieldGroup>
        <FieldGroup>
          <Label>تاريخ الانتهاء</Label>
          <StyledInput type="date" value={expire} onChange={(e) => setExpire(e.target.value)} required />
        </FieldGroup>
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingCoupon ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingCoupon} disabled={!name.trim() || !discount || !expire}>إضافة كوبون</Button>
      </Form>
      {coupons.length === 0 && <EmptyState>لا توجد كوبونات</EmptyState>}
      {coupons.length > 0 && (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>الاسم</Th><Th>الخصم</Th><Th>تاريخ الانتهاء</Th><Th>الحالة</Th><Th>الإجراءات</Th></tr></thead>
            <tbody>
              {coupons.map((c) => {
                const expired = new Date(c.expire) < new Date();
                return (
                  <RowHover key={c._id} style={{ opacity: expired ? 0.5 : 1 }}>
                    <Td><strong>{c.name}</strong></Td>
                    <Td>{c.discount}%</Td>
                    <Td>{formatDate(c.expire)}</Td>
                    <Td>{expired ? <Badge $type="danger">منتهي الصلاحية</Badge> : <Badge $type="success">فعّال</Badge>}</Td>
                    <ActionsCell>
                      <ActionBtn $color="primary" title="تعديل" onClick={() => openEdit(c)}><Edit3 size={16} /></ActionBtn>
                      {confirm === c._id ? (
                        <ConfirmGroup>
                          <ConfirmBtn $variant="confirm" onClick={() => handleDelete(c._id)} disabled={isDeletingCoupon}>
                            {isDeletingCoupon ? <Loader2 size={13} /> : <Check size={13} />}
                          </ConfirmBtn>
                          <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
                        </ConfirmGroup>
                      ) : (
                        <ActionBtn $color="danger" title="حذف" onClick={() => setConfirm(c._id)}><Trash2 size={16} /></ActionBtn>
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
            <ModalTitle>تعديل الخبر</ModalTitle>
            <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <FieldGroup><Label>العنوان</Label><StyledInput value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>المحتوى</Label><StyledTextarea value={editContent} onChange={(e) => setEditContent(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>صورة (اختياري)</Label><StyledInput type="file" accept="image/*" onChange={(e) => setEditFile(e.target.files[0] || null)} /></FieldGroup>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" variant="primary" size="sm" isLoading={isUpdatingNews} disabled={!editTitle.trim() || !editContent.trim()}>حفظ</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditNews(null)}>إلغاء</Button>
              </div>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      <Form onSubmit={handleAdd} style={{ marginBottom: 24 }}>
        <FieldGroup>
          <Label>العنوان</Label>
          <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الخبر" required />
        </FieldGroup>
        <FieldGroup>
          <Label>المحتوى</Label>
          <StyledTextarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="نص الخبر" required />
        </FieldGroup>
        <FieldGroup>
          <Label>صورة (اختياري)</Label>
          <StyledInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
        </FieldGroup>
        <Button type="submit" variant="primary" size="sm" leftIcon={isCreatingNews ? <Loader2 size={14} /> : <Plus size={14} />} isLoading={isCreatingNews} disabled={!title.trim() || !content.trim()}>إضافة خبر</Button>
      </Form>
      {news.length === 0 && <EmptyState>لا توجد أخبار</EmptyState>}
      {news.map((n) => (
        <NewsCard key={n._id}>
          {n.coverImage && <NewsImg src={n.coverImage} alt="" />}
          <NewsContent>
            <NewsTitle>{n.title}</NewsTitle>
            <NewsBody>{n.body}</NewsBody>
          </NewsContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ActionBtn $color="primary" title="تعديل" onClick={() => openEdit(n)}><Edit3 size={16} /></ActionBtn>
            {confirm === n._id ? (
              <ConfirmGroup>
                <ConfirmBtn $variant="confirm" onClick={() => { deleteNews(n._id); setConfirm(null); }} disabled={isDeletingNews}>
                  {isDeletingNews ? <Loader2 size={13} /> : <Check size={13} />}
                </ConfirmBtn>
                <ConfirmBtn $variant="cancel" onClick={() => setConfirm(null)}><X size={13} /></ConfirmBtn>
              </ConfirmGroup>
            ) : (
              <ActionBtn $color="danger" title="حذف" onClick={() => setConfirm(n._id)}><Trash2 size={16} /></ActionBtn>
            )}
          </div>
        </NewsCard>
      ))}
    </div>
  );
}

const PreviewCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  max-width: 560px;
`;

const PreviewIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme, $color }) => theme.colors[$color] + '15'};
  color: ${({ theme, $color }) => theme.colors[$color]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg { width: 18px; height: 18px; }
`;

const PreviewContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const PreviewTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PreviewBody = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HistoryCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  max-width: 560px;
`;

const HistoryIcon = styled(PreviewIcon)`
  width: 28px;
  height: 28px;
  svg { width: 14px; height: 14px; }
`;

const HistoryContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const HistoryTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const HistoryBody = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 2px;
`;

const HistoryTime = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
`;

function BroadcastTab() {
  const { broadcastNotification, broadcastToSpecific, isBroadcasting } = useAdminActions();
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
          <Label>العنوان</Label>
          <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الإشعار" required />
        </FieldGroup>
        <FieldGroup>
          <Label>الرسالة</Label>
          <StyledTextarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="نص الإشعار" required />
        </FieldGroup>
        <FieldGroup>
          <Label>المستهدفون</Label>
          <Select value={recipientType} onChange={(e) => setRecipientType(e.target.value)}>
            <option value="all_students">جميع الطلاب</option>
            <option value="all_teachers">جميع المعلمين</option>
            <option value="everyone">الجميع (طلاب + معلمين)</option>
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Label>نوع الإشعار</Label>
          <Select value={notifType} onChange={(e) => setNotifType(e.target.value)}>
            <option value="message">رسالة</option>
            <option value="course">كورس</option>
            <option value="news">خبر</option>
          </Select>
        </FieldGroup>
        <Button type="submit" variant="primary" size="md" leftIcon={isBroadcasting ? <Loader2 size={16} /> : <Send size={16} />} isLoading={isBroadcasting} disabled={!title.trim() || !body.trim()}>
          إرسال الإشعار
        </Button>
      </Form>

      <SectionTitle style={{ marginTop: 32 }}>معاينة الإشعار</SectionTitle>
      {(() => {
        const config = getNotificationTypeConfig(notifType);
        const Icon = config.icon;
        return (
          <PreviewCard>
            <PreviewIcon $color={config.color}><Icon /></PreviewIcon>
            <PreviewContent>
              <PreviewTitle>{title || 'عنوان الإشعار'}</PreviewTitle>
              {body && <PreviewBody>{body}</PreviewBody>}
            </PreviewContent>
          </PreviewCard>
        );
      })()}

      {sentHistory.length > 0 && (
        <>
          <SectionTitle style={{ marginTop: 32 }}>آخر الإشعارات المرسلة</SectionTitle>
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
    <DashboardLayout navItems={NAV_ITEMS} activeNav={activeNav} onNavChange={setActiveNav}>
      <PageInner>
        <Header><Title>لوحة التحكم</Title></Header>
        {tabs[activeNav]}
      </PageInner>
    </DashboardLayout>
  );
}
