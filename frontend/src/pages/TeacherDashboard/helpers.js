export function calcYAxisWidth(data, key = 'name') {
  if (!data?.length) return 80;
  const longest = Math.max(...data.map((d) => (d[key] || '').length));
  return Math.min(Math.max(longest * 5.5, 80), 140);
}

export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatPrice(p) { return (p?.toLocaleString('ar-SA') || '0') + ' ₪'; }
