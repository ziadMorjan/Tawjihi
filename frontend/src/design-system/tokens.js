// src/design-system/tokens.js

export const colors = {
  // --- Primary: تيل داكن راقٍ بدل الأزرق الـ AI-classic ---
  primary: {
    50:  '#EDF6F9',
    100: '#C8E8F2',
    500: '#0D7FA3',
    600: '#0B6B8A',
    700: '#09566E',
  },

  // --- Accent: ذهبي دافئ بدل البنفسجي الـ AI ---
  accent: {
    50:  '#FDF6EC',
    500: '#C8893A',
    600: '#A86E25',
  },

  // --- Neutrals ---
  gray: {
    50:  '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // --- Semantic ---
  success: {
    50:  '#F0FDF4',
    500: '#16A34A',
    600: '#15803D',
  },
  warning: {
    50:  '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  },
  danger: {
    50:  '#FEF2F2',
    500: '#DC2626',
    600: '#B91C1C',
  },

  // --- Base ---
  white: '#FFFFFF',
  black: '#000000',
};

export const typography = {
  // المشروع عنده Vazirmatn جاهز في public/assets/fonts
  fontFamily: {
    base: "'Vazirmatn', 'Segoe UI', sans-serif",
    mono: "'Fira Code', monospace",
  },
  fontSize: {
    xs:   '0.75rem',   // 12px — captions
    sm:   '0.875rem',  // 14px — body small
    base: '1rem',      // 16px — body
    lg:   '1.125rem',  // 18px — subheading
    xl:   '1.25rem',   // 20px
    '2xl':'1.5rem',    // 24px
    '3xl':'1.875rem',  // 30px
    '4xl':'2.25rem',   // 36px — headings كبيرة
  },
  fontWeight: {
    regular:   400,
    medium:    500,
    semibold:  600,
    bold:      700,
  },
  lineHeight: {
    tight:  1.25,
    normal: 1.6,
    relaxed:1.75,
  },
};

export const spacing = {
  1:  '0.25rem',  // 4px
  2:  '0.5rem',   // 8px
  3:  '0.75rem',  // 12px
  4:  '1rem',     // 16px
  5:  '1.25rem',  // 20px
  6:  '1.5rem',   // 24px
  8:  '2rem',     // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
};

export const borderRadius = {
  sm:   '0.375rem',  // 6px
  md:   '0.5rem',    // 8px
  lg:   '0.75rem',   // 12px
  xl:   '1rem',      // 16px
  '2xl':'1.5rem',    // 24px
  full: '9999px',    // pill
};

export const shadows = {
  sm:  '0 1px 2px 0 rgba(0,0,0,0.05)',
  md:  '0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -1px rgba(0,0,0,0.04)',
  lg:  '0 10px 15px -3px rgba(0,0,0,0.07), 0 4px 6px -2px rgba(0,0,0,0.04)',
  xl:  '0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.03)',
  card:'0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
};

export const transitions = {
  fast:   'all 0.15s ease',
  normal: 'all 0.25s ease',
  slow:   'all 0.4s ease',
};

export const breakpoints = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl':'1536px',
};

// Helper للـ media queries داخل Styled Components
export const media = {
  sm:  `@media (min-width: ${breakpoints.sm})`,
  md:  `@media (min-width: ${breakpoints.md})`,
  lg:  `@media (min-width: ${breakpoints.lg})`,
  xl:  `@media (min-width: ${breakpoints.xl})`,
  // Mobile first - max-width للـ overrides
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  maxMd: `@media (max-width: ${breakpoints.md})`,
};