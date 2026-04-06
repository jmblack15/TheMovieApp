import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { WATCHLIST } from '../../src/constants/api';
import {
  cancelWatchlistNotification,
  requestNotificationPermissions,
  scheduleWatchlistNotification,
} from '../../src/services/notificationService';

jest.useFakeTimers();

const mockGetPermissions = Notifications.getPermissionsAsync as jest.Mock;
const mockRequestPermissions = Notifications.requestPermissionsAsync as jest.Mock;
const mockSchedule = Notifications.scheduleNotificationAsync as jest.Mock;
const mockCancel = Notifications.cancelScheduledNotificationAsync as jest.Mock;
const mockSetChannel = Notifications.setNotificationChannelAsync as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  mockGetPermissions.mockResolvedValue({ status: 'granted' });
  mockSchedule.mockResolvedValue('mock-notification-id');
});

// ── requestNotificationPermissions ───────────────────────────────────────────

describe('requestNotificationPermissions', () => {
  it('returns true when already granted', async () => {
    mockGetPermissions.mockResolvedValue({ status: 'granted' });
    const result = await requestNotificationPermissions();
    expect(result).toBe(true);
    expect(mockRequestPermissions).not.toHaveBeenCalled();
  });

  it('calls requestPermissionsAsync when status is undetermined', async () => {
    mockGetPermissions.mockResolvedValue({ status: 'undetermined' });
    mockRequestPermissions.mockResolvedValue({ status: 'granted' });
    const result = await requestNotificationPermissions();
    expect(mockRequestPermissions).toHaveBeenCalledTimes(1);
    expect(result).toBe(true);
  });

  it('returns false when denied', async () => {
    mockGetPermissions.mockResolvedValue({ status: 'undetermined' });
    mockRequestPermissions.mockResolvedValue({ status: 'denied' });
    const result = await requestNotificationPermissions();
    expect(result).toBe(false);
  });

  it('calls setNotificationChannelAsync on Android', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');
    await requestNotificationPermissions();
    expect(mockSetChannel).toHaveBeenCalledWith('watchlist', expect.objectContaining({
      name: 'Watchlist reminders',
    }));
    jest.restoreAllMocks();
  });
});

// ── scheduleWatchlistNotification ────────────────────────────────────────────

describe('scheduleWatchlistNotification', () => {
  it('does NOT call scheduleNotificationAsync before 3 minutes', async () => {
    await scheduleWatchlistNotification(1, 'Inception');
    jest.advanceTimersByTime(WATCHLIST.notificationDelayMs - 1);
    expect(mockSchedule).not.toHaveBeenCalled();
  });

  it('calls scheduleNotificationAsync exactly once after 3 minutes', async () => {
    await scheduleWatchlistNotification(1, 'Inception');
    jest.advanceTimersByTime(WATCHLIST.notificationDelayMs);
    await Promise.resolve(); // flush microtasks
    expect(mockSchedule).toHaveBeenCalledTimes(1);
  });

  it('notification content has correct title from WATCHLIST.notificationTitle', async () => {
    await scheduleWatchlistNotification(1, 'Inception');
    jest.advanceTimersByTime(WATCHLIST.notificationDelayMs);
    await Promise.resolve();
    expect(mockSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          title: WATCHLIST.notificationTitle(),
        }),
      }),
    );
  });

  it('notification body contains movie name', async () => {
    await scheduleWatchlistNotification(1, 'Inception');
    jest.advanceTimersByTime(WATCHLIST.notificationDelayMs);
    await Promise.resolve();
    expect(mockSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          body: expect.stringContaining('Inception'),
        }),
      }),
    );
  });

  it('notification data contains movieId', async () => {
    await scheduleWatchlistNotification(42, 'Inception');
    jest.advanceTimersByTime(WATCHLIST.notificationDelayMs);
    await Promise.resolve();
    expect(mockSchedule).toHaveBeenCalledWith(
      expect.objectContaining({
        content: expect.objectContaining({
          data: expect.objectContaining({ movieId: 42 }),
        }),
      }),
    );
  });

  it('trigger is null (local, fires immediately)', async () => {
    await scheduleWatchlistNotification(1, 'Inception');
    jest.advanceTimersByTime(WATCHLIST.notificationDelayMs);
    await Promise.resolve();
    expect(mockSchedule).toHaveBeenCalledWith(
      expect.objectContaining({ trigger: null }),
    );
  });

  it('debounce: calling twice quickly schedules only 1 notification', async () => {
    await scheduleWatchlistNotification(1, 'Inception');
    await scheduleWatchlistNotification(1, 'Inception');
    jest.advanceTimersByTime(WATCHLIST.notificationDelayMs);
    await Promise.resolve();
    expect(mockSchedule).toHaveBeenCalledTimes(1);
  });

  it('debounce: add → cancel → add → only 1 notification scheduled', async () => {
    await scheduleWatchlistNotification(1, 'Inception');
    await cancelWatchlistNotification(1);
    await scheduleWatchlistNotification(1, 'Inception');
    jest.advanceTimersByTime(WATCHLIST.notificationDelayMs);
    await Promise.resolve();
    expect(mockSchedule).toHaveBeenCalledTimes(1);
  });
});

// ── cancelWatchlistNotification ──────────────────────────────────────────────

describe('cancelWatchlistNotification', () => {
  it('cancels pending timer so scheduleNotificationAsync never fires', async () => {
    await scheduleWatchlistNotification(1, 'Inception');
    await cancelWatchlistNotification(1);
    jest.advanceTimersByTime(WATCHLIST.notificationDelayMs);
    await Promise.resolve();
    expect(mockSchedule).not.toHaveBeenCalled();
  });

  it('calls cancelScheduledNotificationAsync with correct id after notification was scheduled', async () => {
    await scheduleWatchlistNotification(1, 'Inception');
    jest.advanceTimersByTime(WATCHLIST.notificationDelayMs);
    await Promise.resolve(); // let the timer callback run and set the notification id
    await cancelWatchlistNotification(1);
    expect(mockCancel).toHaveBeenCalledWith('mock-notification-id');
  });

  it('does nothing when movieId has no pending notification', async () => {
    await cancelWatchlistNotification(999);
    expect(mockCancel).not.toHaveBeenCalled();
  });
});
