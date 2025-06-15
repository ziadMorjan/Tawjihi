//svg icon

export const CartIcon = ({ active, onClick }) => (
  <svg
    onClick={onClick}
    style={{
      cursor: "pointer",
      fill: active ? "#1e40af" : "none",
      stroke: "#2563eb",
      transition: "fill 0.3s ease, transform 0.2s ease",
      transform: active ? "scale(1.2)" : "scale(1)",
    }}
    width="24"
    height="24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <circle cx="9" cy="21" r="1" fill={active ? "#1e40af" : "#2563eb"} />
    <circle cx="20" cy="21" r="1" fill={active ? "#1e40af" : "#2563eb"} />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export const HeartIcon = ({ active, onClick }) => (
  <svg
    onClick={onClick}
    style={{
      cursor: "pointer",
      fill: active ? "#dc2626" : "none",
      stroke: "#ef4444",
      transition: "fill 0.3s ease, transform 0.2s ease",
      transform: active ? "scale(1.2)" : "scale(1)",
    }}
    width="24"
    height="24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.78 0L12 5.62l-1.02-1.02a5.5 5.5 0 0 0-7.78 7.78l1.02 1.02L12 21.23l7.78-7.78 1.02-1.02a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
