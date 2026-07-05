import {
  Users, Layers, DollarSign, GraduationCap, BookOpen,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useLanguage } from '../../../shared/hooks/useLanguage';
import { useAdminStats } from '../../../features/admin';
import {
  StatsGrid, StatCard, StatIconWrap, StatInfo, StatValue, StatLabel,
  ChartCard, LtrChartWrap, ChartTitle, ChartGrid, ChartGrid3, SectionTitle,
  EmptyMiniData, SkeletonCard,
} from '../styles';
import { formatPrice, calcYAxisWidth, renderPieLabel, PIE_COLORS } from '../helpers';

export default function OverviewTab() {
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
