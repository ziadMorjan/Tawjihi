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

// Dark mode جاهز للمستقبل — نفس الـ structure، ألوان مختلفة
export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    bgPrimary:   colors.gray[900],
    bgSecondary: colors.gray[800],
    bgTertiary:  colors.gray[700],
    textPrimary:   colors.white,
    textSecondary: colors.gray[300],
    textMuted:     colors.gray[500],
    border:       colors.gray[700],
    borderStrong: colors.gray[600],
  },
};