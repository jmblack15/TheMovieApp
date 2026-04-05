import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import { useNetworkStatus } from "../src/hooks/useNetworkStatus";
import { useNotificationDeepLink } from "../src/hooks/useNotificationDeepLink";
import { requestNotificationPermissions } from "../src/services/notificationService";
import { useThemeStore } from "../src/store/themeStore";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

function AppProviders({ children }: { children: React.ReactNode }) {
  const loadTheme = useThemeStore((s) => s.loadTheme);
  useNetworkStatus();
  useNotificationDeepLink();

  useEffect(() => {
    loadTheme();
    requestNotificationPermissions();
  }, [loadTheme]);

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
