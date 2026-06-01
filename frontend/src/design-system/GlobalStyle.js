// src/design-system/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  /* Font Loading — Vazirmatn موجود في public/assets/fonts */
  @font-face {
    font-family: 'Vazirmatn';
    src: url('/assets/fonts/Vazirmatn-Regular.ttf') format('truetype');
    font-weight: 400;
    font-display: swap;
  }
  @font-face {
    font-family: 'Vazirmatn';
    src: url('/assets/fonts/Vazirmatn-Medium.ttf') format('truetype');
    font-weight: 500;
    font-display: swap;
  }
  @font-face {
    font-family: 'Vazirmatn';
    src: url('/assets/fonts/Vazirmatn-SemiBold.ttf') format('truetype');
    font-weight: 600;
    font-display: swap;
  }
  @font-face {
    font-family: 'Vazirmatn';
    src: url('/assets/fonts/Vazirmatn-Bold.ttf') format('truetype');
    font-weight: 700;
    font-display: swap;
  }

  /* Reset */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    /* 🟡 [تحسين] text-size-adjust يمنع iOS من تكبير الخط تلقائياً */
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.base};
    font-weight: ${({ theme }) => theme.typography.fontWeight.regular};
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.bgPrimary};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    direction: rtl;
    /* 🟡 [تحسين] يحسن وضوح النص على الشاشات */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Typography defaults */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primaryHover};
    }
  }

  img {
    max-width: 100%;
    display: block;
  }

  button {
    cursor: pointer;
    font-family: inherit;
    border: none;
    background: none;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  ul, ol {
    list-style: none;
  }

  /* Scrollbar — subtle */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 999px;
    &:hover { background: ${({ theme }) => theme.colors.borderStrong}; }
  }
`;