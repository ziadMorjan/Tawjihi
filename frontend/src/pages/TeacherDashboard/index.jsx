import { useState } from 'react';
import {
  LayoutDashboard, Layers, MessageSquare, Star, Bell,
  Trash2, Send, Reply, Plus, Loader2, Edit3, Users, Check, X,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
} from 'recharts';
import styled from 'styled-components';
import DashboardLayout from '../../shared/components/layout/DashboardLayout';
import { useLanguage } from '../../shared/hooks/useLanguage';
import {
  useTeacherStats, useTeacherActions, useTeacherCourses, useTeacherReviews,
} from '../../features/teacher';
import { teacherApi } from '../../features/teacher';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../features/auth';
import { useBranches, useSubjects } from '../../features/admin';
import { Button } from '../../shared/components/Button';

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
    background: ${({ theme, $color }) => $color ? theme.colors[$color] + '18' : theme.colors.bgSecondary};
  }
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
        $type === 'danger' ? theme.colors.danger + '20' : theme.colors.primaryLight};
  color: ${({ $type, theme }) =>
    $type === 'success' ? theme.colors.success :
      $type === 'warning' ? theme.colors.warning :
        $type === 'danger' ? theme.colors.danger : theme.colors.primary};
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
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}18; }
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
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}18; }
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
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}18; }
`;

/* ── Filter ── */
const FilterRow = styled.div`
  display: flex; align-items: center; gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[5]};

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const FilterLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
`;

const CourseSelect = styled.select`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none; cursor: pointer;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

/* ── Comment Card ── */
const CommentCard = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-inline-start: 4px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.card};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  transition: box-shadow 0.2s;
  &:hover { box-shadow: ${({ theme }) => theme.shadows.lg}; }
`;

const CommentUser = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const UserAvatar = styled.div`
  width: 36px; height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primaryLight};
  display: flex; align-items: center; justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary};
  overflow: hidden;
  flex-shrink: 0;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const CommentName = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-left: 5px;
`;

const CommentLesson = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const CommentActions = styled.div`
  margin-inline-start: auto;
  display: flex; align-items: center; gap: ${({ theme }) => theme.spacing[1]};
`;

const IconBtn = styled.button`
  background: none; border: none; cursor: pointer; padding: 4px;
  border-radius: 6px; color: ${({ theme }) => theme.colors.textMuted};
  display: flex; align-items: center; font-family: inherit;
  &:hover { background: ${({ theme }) => theme.colors.bgTertiary}; color: ${({ theme }) => theme.colors.textPrimary}; }
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

const CommentText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 ${({ theme }) => theme.spacing[3]};
  line-height: 1.6;
`;

const ReplyBtn = styled.button`
  display: inline-flex; align-items: center; gap: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
  background: none; border: none; padding: 0; cursor: pointer; font-family: inherit;
  &:hover { opacity: 0.8; }
`;

const ReplyInputWrap = styled.div`
  margin-top: ${({ theme }) => theme.spacing[3]};
  display: flex; gap: ${({ theme }) => theme.spacing[2]};
`;

const ReplyInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}18; }
`;

/* ── Replies ── */
const RepliesSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing[3]};
  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing[3]};
`;

const ReplyItem = styled.div`
  display: flex; align-items: flex-start; gap: ${({ theme }) => theme.spacing[2]};
  position: relative;
`;

const ReplyThreadLine = styled.div`
  position: absolute;
  top: 28px; bottom: -12px;
  inset-inline-start: 13px;
  width: 2px;
  background: ${({ theme }) => theme.colors.border};
  &:last-child { display: none; }
`;

const ReplyAvatar = styled.div`
  width: 28px; height: 28px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.bgTertiary};
  display: flex; align-items: center; justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: 10px; color: ${({ theme }) => theme.colors.textMuted};
  flex-shrink: 0; overflow: hidden; z-index: 1;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

const ReplyContent = styled.div`
  flex: 1; min-width: 0;
`;

const ReplyHeader = styled.div`
  display: flex; align-items: center; gap: ${({ theme }) => theme.spacing[2]};
`;

const ReplyName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ReplyTime = styled.span`
  font-size: 10px; color: ${({ theme }) => theme.colors.textMuted};
`;

const ReplyActions = styled.div`
  margin-inline-start: auto;
  display: flex; align-items: center; gap: 1px;
`;

const ReplyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 2px 0 0; line-height: 1.5;
`;

const EditReplyWrap = styled.div`
  display: flex; align-items: center; gap: 4px; margin-top: 4px;
`;

const EditReplyInput = styled.input`
  flex: 1; min-width: 0;
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;
  &:focus { border-color: ${({ theme }) => theme.colors.primary}; }
`;

const EditReplyBtns = styled.div`
  display: flex; align-items: center; gap: 2px;
`;

const SkeletonCard = styled.div`
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ theme }) => theme.colors.bgTertiary};
  animation: pulse 1.5s ease-in-out infinite;
  @keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
`;

const OldPrice = styled.span`
  text-decoration: line-through; color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

const Note = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: ${({ theme }) => theme.spacing[2]} 0 0;
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

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: ${({ theme }) => theme.spacing[8]} 0 ${({ theme }) => theme.spacing[4]};
`;

const EmptyMiniData = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 230px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

function calcYAxisWidth(data, key = 'name') {
  if (!data?.length) return 80;
  const longest = Math.max(...data.map((d) => (d[key] || '').length));
  return Math.min(Math.max(longest * 5.5, 80), 140);
}

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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatPrice(p) { return (p?.toLocaleString('ar-SA') || '0') + ' ₪'; }

const NAV_ITEMS = [
  { key: 0, label: 'نظرة عامة', icon: LayoutDashboard },
  { key: 1, label: 'كورساتي', icon: Layers },
  { key: 2, label: 'تعليقات الطلاب', icon: MessageSquare },
  { key: 3, label: 'تقييمات طلابي', icon: Star },
  { key: 4, label: 'إرسال إشعار', icon: Bell },
];

// ── Tab Components ───────────────────────────────────────────────────────────

function OverviewTab() {
  const { stats } = useTeacherStats();
  const { isAr } = useLanguage();
  if (!stats) return <SkeletonCard />;

  const { charts } = stats;

  const cards = [
    { label: 'كورساتي', value: stats.totalCourses, icon: Layers },
    { label: 'طلابي', value: stats.totalStudents, icon: Users },
    {
      label: 'متوسط التقييم',
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

      <SectionTitle>الرسوم البيانية</SectionTitle>

      <ChartGrid>
        {!charts.enrollmentTrend?.length || charts.enrollmentTrend.length < 2 ? (
          <ChartCard><ChartTitle>الاشتراكات الشهرية</ChartTitle><EmptyMiniData>لا توجد بيانات</EmptyMiniData></ChartCard>
        ) : (
          <ChartCard>
            <ChartTitle>الاشتراكات الشهرية</ChartTitle>
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
          <ChartTitle>تقييمات الكورسات</ChartTitle>
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
          <ChartTitle>التعليقات حسب الكورس</ChartTitle>
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
          <ChartCard><ChartTitle>التقييمات الشهرية</ChartTitle><EmptyMiniData>لا توجد بيانات</EmptyMiniData></ChartCard>
        ) : (
          <ChartCard>
            <ChartTitle>التقييمات الشهرية</ChartTitle>
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
  const { user } = useAuth();
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
    const msg = `سيتم حذف الكورس "${c.name}" وجميع دروسه وبيانات الطلاب المسجلين معه. هل أنت متأكد؟`;
    if (window.confirm(msg)) deleteCourse(c._id);
  };

  if (isLoading) return <SkeletonCard />;

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={openAdd}>إضافة كورس</Button>
      </div>

      {courses.length === 0 && <EmptyState>لا توجد كورسات بعد</EmptyState>}

      {(showAdd || editingCourse) && (
        <ModalOverlay onClick={() => { setShowAdd(false); setEditingCourse(null); }}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>{editingCourse ? 'تعديل الكورس' : 'إضافة كورس جديد'}</ModalTitle>
            <Form onSubmit={handleSave}>
              <FieldGroup><Label>الاسم</Label><StyledInput value={formName} onChange={(e) => setFormName(e.target.value)} required /></FieldGroup>
              <FieldGroup><Label>الوصف</Label><StyledTextarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} /></FieldGroup>
              <FieldGroup><Label>السعر</Label><StyledInput type="number" value={formPrice} onChange={(e) => setFormPrice(e.target.value)} /></FieldGroup>
              <FieldGroup><Label>السعر بعد الخصم (اختياري)</Label><StyledInput type="number" value={formPriceAfter} onChange={(e) => setFormPriceAfter(e.target.value)} /></FieldGroup>
              <FieldGroup>
                <Label>المادة</Label>
                <Select value={formSubject} onChange={(e) => setFormSubject(e.target.value)}>
                  <option value="">اختر المادة</option>
                  {subjects.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </Select>
              </FieldGroup>
              <FieldGroup>
                <Label>الفروع</Label>
                <Select multiple value={formBranches} onChange={(e) => setFormBranches(Array.from(e.target.selectedOptions, (o) => o.value))}>
                  {branches.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
                </Select>
              </FieldGroup>
              <FieldGroup><Label>صورة الكورس (اختياري)</Label><StyledInput type="file" accept="image/*" onChange={(e) => setFormFile(e.target.files[0] || null)} /></FieldGroup>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" variant="primary" size="sm" isLoading={isCreating || isUpdating} disabled={!formName.trim()}>
                  {editingCourse ? 'تحديث' : 'إنشاء'}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => { setShowAdd(false); setEditingCourse(null); }}>إلغاء</Button>
              </div>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      {courses.length > 0 && (
        <TableWrap>
          <StyledTable>
            <thead><tr><Th>الصورة</Th><Th>العنوان</Th><Th>المادة</Th><Th>الفرع</Th><Th>السعر</Th><Th>التقييم</Th><Th>الإجراءات</Th></tr></thead>
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
                    <ActionBtn $color="primary" title="تعديل" onClick={() => openEdit(c)}><Edit3 size={16} /></ActionBtn>
                    <ActionBtn $color="danger" title="حذف" onClick={() => handleDelete(c)} disabled={isDeleting}><Trash2 size={16} /></ActionBtn>
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
  const { user } = useAuth();
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
          <FilterLabel>فلترة حسب الكورس:</FilterLabel>
          <CourseSelect value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">كل الكورسات</option>
            {courses.map((co) => (
              <option key={co._id} value={co._id}>{co.name}</option>
            ))}
          </CourseSelect>
        </FilterRow>
      )}

      {!filteredComments.length ? (
        <EmptyState>
          {courseFilter ? 'لا توجد تعليقات على هذا الكورس' : 'لا توجد تعليقات على كورساتك بعد'}
        </EmptyState>
      ) : (
        filteredComments.map((c) => (
          <CommentCard key={c._id}>
            <CommentUser>
              <UserAvatar>{c.user?.coverImage ? <img src={c.user.coverImage} alt="" /> : c.user?.name?.charAt(0) || '؟'}</UserAvatar>
              <div>
                <CommentName>{c.user?.name || 'طالب'}</CommentName>
                <CommentLesson>{c.lesson?.name || 'درس'} &middot; {formatDate(c.createdAt)}</CommentLesson>
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
                  <IconBtn onClick={() => setConfirmDelete({ type: 'comment', id: c._id })} title="حذف التعليق">
                    <Trash2 size={14} />
                  </IconBtn>
                )}
              </CommentActions>
            </CommentUser>
            <CommentText>{c.content}</CommentText>

            <ReplyBtn onClick={() => setReplyOpen(replyOpen === c._id ? null : c._id)}>
              <MessageSquare size={14} /> {replyOpen === c._id ? 'إلغاء' : 'رد'}
            </ReplyBtn>

            {replyOpen === c._id && (
              <ReplyInputWrap>
                <ReplyInput type="text" placeholder="اكتب ردك..." value={replyText[c._id] || ''}
                  onChange={(e) => setReplyText((p) => ({ ...p, [c._id]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(c._id); } }} />
                <Button variant="primary" size="sm" leftIcon={isReplying ? <Loader2 size={14} /> : <Reply size={14} />} isLoading={isReplying} onClick={() => handleReply(c._id)} disabled={!replyText[c._id]?.trim()}>إرسال</Button>
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
                          <ReplyName>{r.user?.name || 'معلم'}</ReplyName>
                          <ReplyTime>{r.createdAt ? new Date(r.createdAt).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }) : ''}</ReplyTime>
                          {!isEditing && (
                            <ReplyActions>
                              <IconBtn onClick={() => { setEditingReply({ commentId: c._id, replyId: r._id }); setEditReplyText(r.text); }} title="تعديل الرد">
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
                                <IconBtn onClick={() => setConfirmDelete({ type: 'reply', id: r._id, commentId: c._id })} title="حذف الرد">
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

const StatsRow = styled.div`
  display: flex; gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
`;

const StatBox = styled.div`
  flex: 1; min-width: 140px;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.bgPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.2;
`;

const ReviewStatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 2px;
`;

const DistBar = styled.div`
  display: flex; align-items: center; gap: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  &:not(:last-child) { margin-bottom: 3px; }
`;

const DistFill = styled.div`
  flex: 1; height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.bgTertiary};
  overflow: hidden;
`;

const DistInner = styled.div`
  height: 100%;
  border-radius: 3px;
  width: ${({ $pct }) => $pct}%;
  background: ${({ theme }) => theme.colors.accent};
  transition: width 0.3s;
`;

function ReviewsTab() {
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
            <ReviewStatLabel>متوسط التقييم</ReviewStatLabel>
            <div style={{ color: '#C8893A', fontSize: 13, marginTop: 2 }}>
              {'★'.repeat(Math.round(+avg))}{'☆'.repeat(5 - Math.round(+avg))}
            </div>
          </StatBox>
          <StatBox>
            <StatNumber>{filtered.length}</StatNumber>
            <ReviewStatLabel>إجمالي التقييمات</ReviewStatLabel>
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
          <FilterLabel>فلترة حسب الكورس:</FilterLabel>
          <CourseSelect value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
            <option value="">كل الكورسات</option>
            {courses.map((co) => (
              <option key={co._id} value={co._id}>{co.name}</option>
            ))}
          </CourseSelect>
        </FilterRow>
      )}

      {!filtered.length ? (
        <EmptyState>
          {courseFilter ? 'لا توجد تقييمات على هذا الكورس' : 'لا توجد تقييمات بعد'}
        </EmptyState>
      ) : (
        <TableWrap>
          <StyledTable>
            <thead>
              <tr>
                <Th>الطالب</Th>
                <Th>التقييم</Th>
                <Th>التعليق</Th>
                <Th>الكورس</Th>
                <Th>التاريخ</Th>
                <Th>الإجراءات</Th>
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
                          {isExpanded ? 'عرض أقل' : 'عرض المزيد'}
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
                        <IconBtn onClick={() => setConfirmDelete(r._id)} title="حذف التقييم">
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
        <Label>العنوان</Label>
        <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الإشعار" required />
      </FieldGroup>
      <FieldGroup>
        <Label>الرسالة</Label>
        <StyledTextarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="نص الإشعار" required />
      </FieldGroup>
      <Button type="submit" variant="primary" size="md" leftIcon={isSending ? <Loader2 size={16} /> : <Send size={16} />} isLoading={isSending} disabled={!title.trim() || !message.trim()}>
        إرسال لطلابي
      </Button>
      <Note>سيتم إرسال الإشعار لجميع الطلاب المسجلين في كورساتك</Note>
    </Form>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const [activeNav, setActiveNav] = useState(0);

  const tabs = {
    0: <OverviewTab />,
    1: <CoursesTab />,
    2: <CommentsTab />,
    3: <ReviewsTab />,
    4: <SendNotificationTab />,
  };

  return (
    <DashboardLayout navItems={NAV_ITEMS} activeNav={activeNav} onNavChange={setActiveNav}>
      <PageInner>
        <Header><Title>لوحة المعلم</Title></Header>
        {tabs[activeNav]}
      </PageInner>
    </DashboardLayout>
  );
}
