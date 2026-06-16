import { ThemeProvider } from "styled-components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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

function ThemedApp({ children }) {
  const { isDark } = useThemeMode();
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <AuthProvider>
        <ToastContainer position="bottom-left" rtl={true} autoClose={3000} />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeModeProvider>
        <ThemedApp>{children}</ThemedApp>
      </ThemeModeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
