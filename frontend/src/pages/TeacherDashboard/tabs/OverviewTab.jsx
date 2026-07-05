import {
  Layers, Users, Star,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area,
  LineChart, Line,
} from 'recharts';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useTeacherStats } from '../../../features/teacher';
import {
  StatsGrid, StatCard, StatIconWrap, StatInfo, StatValue, StatLabel,
  ChartCard, LtrChartWrap, ChartTitle, ChartGrid, SectionTitle,
  EmptyMiniData, SkeletonCard,
} from '../styles';
import { calcYAxisWidth } from '../helpers';

export default function OverviewTab() {
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
