import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export function useNotificationDeepLink() {
  const router = useRouter();

  useEffect(() => {
    // Handle tap on notification when app is already open
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const movieId = response.notification.request.content.data?.movieId as
          | number
          | undefined;
        const movieName = response.notification.request.content.data?.movieName as
          | string
          | undefined;

        if (movieId) {
          router.push({
            pathname: '/movie/[id]',
            params: { id: movieId, title: movieName ?? '' },
          });
        }
      },
    );

    // Handle tap on notification when app was closed/background
    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) {
      const movieId = lastResponse.notification.request.content.data?.movieId as
        | number
        | undefined;
      const movieName = lastResponse.notification.request.content.data?.movieName as
        | string
        | undefined;

      if (movieId) {
        router.push({
          pathname: '/movie/[id]',
          params: { id: movieId, title: movieName ?? '' },
        });
      }
    }

    return () => subscription.remove();
  }, [router]);
}
