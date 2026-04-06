import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import en from './locales/en.json';
import es from './locales/es.json';

export type SupportedLanguage = 'en' | 'es';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'es'];
const LANGUAGE_KEY = 'app_language';

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';
const defaultLanguage: SupportedLanguage =
  SUPPORTED_LANGUAGES.includes(deviceLanguage as SupportedLanguage)
    ? (deviceLanguage as SupportedLanguage)
    : 'en';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: defaultLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export async function loadSavedLanguage(): Promise<void> {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.includes(saved as SupportedLanguage)) {
      await i18n.changeLanguage(saved);
    }
  } catch {
    // keep default
  }
}

export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  await queryClient.invalidateQueries();
}

export function getCurrentLanguage(): SupportedLanguage {
  return (i18n.language as SupportedLanguage) ?? 'en';
}

export default i18n;
