import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_LOCALE, resolveLocale, resources } from './locale';

const i18n = createInstance();

// Resources are bundled, so init resolves synchronously and the first render
// already has its strings. Saving the choice and the Settings picker are M2.
void i18n.use(initReactI18next).init({
  resources,
  lng: resolveLocale(getLocales()[0]?.languageCode),
  fallbackLng: DEFAULT_LOCALE,
  interpolation: { escapeValue: false },
});

export default i18n;
