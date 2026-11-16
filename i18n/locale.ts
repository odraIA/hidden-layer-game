import caValencia from './ca-valencia.json';
import en from './en.json';
import es from './es.json';

export const SUPPORTED_LOCALES = ['es', 'ca-valencia', 'en'] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = 'es';

/** `es` is the source of truth; the other files must carry the same keys. */
export const resources = {
  es: { translation: es },
  'ca-valencia': { translation: caValencia },
  en: { translation: en },
} as const satisfies Record<AppLocale, { translation: object }>;

/**
 * SPEC §13: start in the system language if it is one of ours (`ca` maps to
 * `ca-valencia`), otherwise Spanish.
 */
export function resolveLocale(systemLanguageCode: string | null | undefined): AppLocale {
  switch (systemLanguageCode?.toLowerCase()) {
    case 'ca':
      return 'ca-valencia';
    case 'en':
      return 'en';
    default:
      return DEFAULT_LOCALE;
  }
}
