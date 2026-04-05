import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";
import { useNotificationDeepLink } from "../src/hooks/useNotificationDeepLink";
import { requestNotificationPermissions } from "../src/services/notificationService";

export const unstable_settings = {
  anchor: "(tabs)",
};

const queryClient = new QueryClient();

function AppProviders({ children }: { children: React.ReactNode }) {
  useNotificationDeepLink();
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </AppProviders>
    </QueryClientProvider>
  );
}
