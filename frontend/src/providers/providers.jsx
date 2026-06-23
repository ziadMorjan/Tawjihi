import { useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useTranslation } from "react-i18next";
import { GlobalStyle, lightTheme, darkTheme } from "../design-system";
import { AuthProvider } from "../features/auth";
import { ThemeModeProvider, useThemeMode } from "../features/theme/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// ── Syncs <html dir="" lang=""> with the active i18n language ──────────────
function DirectionSync() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.setAttribute('lang', i18n.language);
    document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  }, [i18n.language, isAr]);

  return null; // renders nothing — side-effect only
}

function ThemedApp({ children }) {
  const { isDark } = useThemeMode();
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AuthProvider>
        {/* rtl prop follows the active language automatically */}
        <ToastContainer position="bottom-left" rtl={isAr} autoClose={3000} />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        {/* DirectionSync must be inside QueryClientProvider so useTranslation works */}
        <DirectionSync />
        <ThemedApp>{children}</ThemedApp>
      </ThemeModeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
