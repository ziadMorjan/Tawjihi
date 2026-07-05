export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatPrice(p) { return (p?.toLocaleString('ar-SA') || '0') + ' ₪'; }

export const PIE_COLORS = ['#0D7FA3', '#C8893A', '#22C55E', '#EF4444', '#A855F7', '#F97316'];
const RADIAN = Math.PI / 180;

export const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }, isAr) => {
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

export function calcYAxisWidth(data, key = 'name') {
  if (!data?.length) return 120;
  const longest = Math.max(...data.map((d) => (d[key] || '').length));
  return Math.min(Math.max(longest * 6.5, 120), 200);
}
