// SVG components icon star
export const FullStar = () => (
  <svg
    width="24"
    height="24"
    fill="#facc15"
    stroke="#fbbf24"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export const HalfStar = () => (
  <svg width="24" height="24" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="halfGrad" x1="100%" y1="0%" x2="0%" y2="0%">
        <stop offset="50%" stopColor="#facc15" />
        <stop offset="50%" stopColor="#e5e7eb" />
      </linearGradient>
    </defs>
    <path
      fill="url(#halfGrad)"
      stroke="#fbbf24"
      strokeWidth="1.5"
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
    />
  </svg>
);

export const EmptyStar = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    stroke="#d1d5db"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);
