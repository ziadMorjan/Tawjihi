// src/design-system/theme.js

import { colors, typography, spacing, borderRadius, shadows, transitions, media } from './tokens';

export const lightTheme = {
  colors: {
    // Backgrounds
    bgPrimary:   colors.white,
    bgSecondary: colors.gray[50],
    bgTertiary:  colors.gray[100],

    // Text
    textPrimary:   colors.gray[900],
    textSecondary: colors.gray[600],
    textMuted:     colors.gray[400],
    textInverse:   colors.white,

    // Brand
    primary:      colors.primary[600],
    primaryHover: colors.primary[700],
    primaryLight: colors.primary[50],

    accent:      colors.accent[500],
    accentLight: colors.accent[50],

    // Semantic
    success:      colors.success[500],
    successLight: colors.success[50],
    warning:      colors.warning[500],
    warningLight: colors.warning[50],
    danger:       colors.danger[500],
    dangerLight:  colors.danger[50],

    // Borders
    border:       colors.gray[200],
    borderStrong: colors.gray[300],

    heroBg: colors.gray[900],
  },

  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  media,
};

// Dark mode — لوحة ألوان احترافية داكنة
export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,

    // ── Backgrounds: navy-slate hierarchy ──
    bgPrimary:   '#0D1117',   // الخلفية الرئيسية — أعمق وأنيق
    bgSecondary: '#161B22',   // خلفية ثانوية — sections, alt areas
    bgTertiary:  '#21262D',   // كاردات، إدخالات، hover

    // ── Text: contrast مثالي ──
    textPrimary:   '#E6EDF3',   // أبيض دافئ مريح للعين
    textSecondary: '#8B949E',   // رمادي-أزرق للنصوص الثانوية
    textMuted:     '#484F58',   // للتلميحات والـ placeholders
    textInverse:   '#0D1117',

    // ── Brand: تيل مضيء في الدارك ──
    primary:      '#1FA8D4',   // تيل أفتح ليكون مرئياً على الدارك
    primaryHover: '#0B6B8A',
    primaryLight: 'rgba(13,127,163,0.15)',

    // ── Accent: ذهبي دافئ ──
    accent:      '#E0A855',
    accentLight: 'rgba(200,137,58,0.15)',

    // ── Semantic ──
    success:      '#3FB950',
    successLight: 'rgba(63,185,80,0.12)',
    warning:      '#D29922',
    warningLight: 'rgba(210,153,34,0.12)',
    danger:       '#F85149',
    dangerLight:  'rgba(248,81,73,0.12)',

    // ── Borders: خطوط رقيقة مميزة ──
    border:       '#30363D',   // حدود افتراضية
    borderStrong: '#3D444D',   // حدود قوية للتركيز

    heroBg: '#090D13',
  },
};