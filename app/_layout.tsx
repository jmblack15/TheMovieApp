import '../src/i18n';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../src/i18n";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import { loadSavedLanguage } from "../src/i18n";
import { useNetworkStatus } from "../src/hooks/useNetworkStatus";
import { useNotificationDeepLink } from "../src/hooks/useNotificationDeepLink";
import { requestNotificationPermissions } from "../src/services/notificationService";
import { useThemeStore } from "../src/store/themeStore";
import { useWatchlistStore } from "../src/store/watchlistStore";

export const unstable_settings = {
  anchor: "(tabs)",
};


function AppProviders({ children }: { children: React.ReactNode }) {
  const loadTheme = useThemeStore((s) => s.loadTheme);
  const loadWatchlist = useWatchlistStore((s) => s.loadWatchlist);
  useNetworkStatus();
  useNotificationDeepLink();

  useEffect(() => {
    loadSavedLanguage();
    loadTheme();
    loadWatchlist();
    requestNotificationPermissions();
  }, [loadTheme, loadWatchlist]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="movie/[id]"
            options={{
              title: "",
              headerTransparent: true,
              headerTintColor: "#FFFFFF",
            }}
          />
        </Stack>
      </AppProviders>
    </QueryClientProvider>
  );
}
