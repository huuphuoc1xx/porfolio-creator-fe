import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import vi from '../locales/vi.json';

export enum Locale {
  En = 'en',
  Vi = 'vi',
}

const LOCALE_STORAGE_KEY = 'portfolio-locale';

function getStoredLocale(): string {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === Locale.En || stored === Locale.Vi) return stored;
  } catch {
    /* ignore */
  }
  return Locale.En;
}

function saveLocale(lng: string) {
  try {
    const locale = lng.startsWith('vi') || lng === 'vn' ? Locale.Vi : Locale.En;
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}

i18n.use(initReactI18next).init({
  resources: {
    [Locale.En]: { translation: en as Record<string, unknown> },
    [Locale.Vi]: { translation: vi as Record<string, unknown> },
  },
  lng: getStoredLocale(),
  fallbackLng: Locale.En,
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => saveLocale(lng));
saveLocale(i18n.language);

export default i18n;
