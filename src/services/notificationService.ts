import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { WATCHLIST } from '../constants/api';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// In-memory maps to track timers and scheduled notification ids per movie
const pendingTimers = new Map<number, ReturnType<typeof setTimeout>>();
const scheduledNotifications = new Map<number, string>();

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('watchlist', {
        name: 'Watchlist reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Schedules a LOCAL notification after WATCHLIST.notificationDelayMs (3 min).
 * Uses a JS timer for the delay, then scheduleNotificationAsync with null trigger
 * (fires immediately when the timer resolves).
 * Debounced: calling again for the same movieId cancels the previous timer.
 */
export async function scheduleWatchlistNotification(
  movieId: number,
  movieName: string,
): Promise<void> {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;

  // Cancel any existing pending timer for this movie (debounce)
  cancelPendingTimer(movieId);

  const timer = setTimeout(async () => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: WATCHLIST.notificationTitle,
          body: WATCHLIST.notificationBody(movieName),
          data: { movieId, movieName },
          sound: 'default',
        },
        trigger: null, // fire immediately after JS timer delay
      });
      scheduledNotifications.set(movieId, notificationId);
    } catch {
      // Notification failed silently
    } finally {
      pendingTimers.delete(movieId);
    }
  }, WATCHLIST.notificationDelayMs);

  pendingTimers.set(movieId, timer);
}

/**
 * Cancels both the pending JS timer and any already-scheduled notification.
 * Call when: user opens movie detail OR removes from watchlist.
 */
export async function cancelWatchlistNotification(movieId: number): Promise<void> {
  cancelPendingTimer(movieId);

  const notificationId = scheduledNotifications.get(movieId);
  if (notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch {
      // Ignore cancel errors
    } finally {
      scheduledNotifications.delete(movieId);
    }
  }
}

function cancelPendingTimer(movieId: number): void {
  const timer = pendingTimers.get(movieId);
  if (timer) {
    clearTimeout(timer);
    pendingTimers.delete(movieId);
  }
}

/**
 * Listens for notification taps and calls the callback with movieId.
 * Returns an unsubscribe function — call it on component unmount.
 */
export function useNotificationListener(
  onNotificationTap: (movieId: number) => void,
): () => void {
  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      const movieId = response.notification.request.content.data?.movieId as
        | number
        | undefined;
      if (movieId) onNotificationTap(movieId);
    },
  );

  return () => subscription.remove();
}
