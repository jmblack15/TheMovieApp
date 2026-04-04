import * as Notifications from 'expo-notifications';

const REMINDER_DELAY_MS = 3 * 60 * 1000;

export function scheduleWatchlistReminder(
  movieTitle: string,
): ReturnType<typeof setTimeout> {
  return setTimeout(() => {
    void Notifications.scheduleNotificationAsync({
      content: {
        title: 'Recordatorio',
        body: `No olvides ver "${movieTitle}"`,
      },
      trigger: null,
    });
  }, REMINDER_DELAY_MS);
}

export function cancelWatchlistReminder(
  timerId: ReturnType<typeof setTimeout>,
): void {
  clearTimeout(timerId);
}
