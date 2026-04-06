import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useOfflineStore } from '../store/offlineStore';

export function useNetworkStatus() {
  const setOnlineStatus = useOfflineStore((s) => s.setOnlineStatus);
  const loadCachedMovies = useOfflineStore((s) => s.loadCachedMovies);

  useEffect(() => {
    loadCachedMovies();

    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline =
        state.isConnected === true && state.isInternetReachable !== false;
      setOnlineStatus(isOnline);
    });

    return () => unsubscribe();
  }, [setOnlineStatus, loadCachedMovies]);
}

export function useIsOnline(): boolean {
  return useOfflineStore((s) => s.isOnline);
}
