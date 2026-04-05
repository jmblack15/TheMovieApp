// ── Env vars ────────────────────────────────────────────────────────────────
process.env.EXPO_PUBLIC_TMDB_API_KEY = 'test';

// ── Silence act() warnings from Zustand async store updates ──────────────────
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('not wrapped in act')) return;
  originalConsoleError(...args);
};

// ── AsyncStorage ─────────────────────────────────────────────────────────────
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// ── Expo Notifications ────────────────────────────────────────────────────────
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('mock-notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  AndroidImportance: { DEFAULT: 3, HIGH: 4, MAX: 5 },
}));

// ── expo-image ────────────────────────────────────────────────────────────────
jest.mock('expo-image', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    Image: ({ testID, ...props }: Record<string, unknown>) =>
      React.createElement(View, { testID }),
  };
});

// ── expo-status-bar ───────────────────────────────────────────────────────────
jest.mock('expo-status-bar', () => ({ StatusBar: () => null }));

// ── react-native-safe-area-context ────────────────────────────────────────────
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

// ── expo-router ───────────────────────────────────────────────────────────────
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({ id: '1', title: 'Test Movie' }),
  useNavigation: () => ({ setOptions: jest.fn() }),
  Stack: { Screen: 'Screen' },
  Tabs: { Screen: 'Screen' },
}));

// ── @react-native-community/netinfo ──────────────────────────────────────────
jest.mock('@react-native-community/netinfo', () => ({
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() =>
    Promise.resolve({ isConnected: true, isInternetReachable: true }),
  ),
}));

// ── themeStore ────────────────────────────────────────────────────────────────
jest.mock('./src/store/themeStore', () => ({
  useThemeStore: jest.fn((selector: (s: unknown) => unknown) =>
    selector({
      mode: 'dark',
      colors: require('./src/constants/theme').DARK_COLORS,
      isDark: true,
      setMode: jest.fn(),
      loadTheme: jest.fn(),
    }),
  ),
}));

// ── expo-constants ────────────────────────────────────────────────────────────
jest.mock('expo-constants', () => ({
  expoConfig: { extra: { tmdbApiKey: 'test-api-key' } },
}));

// ── Global beforeEach cleanup ─────────────────────────────────────────────────
beforeEach(async () => {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  await AsyncStorage.clear();
  jest.clearAllMocks();
});
