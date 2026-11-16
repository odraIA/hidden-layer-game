import { createInstance } from 'i18next';

import { resolveLocale, resources, SUPPORTED_LOCALES } from '../locale';

describe('resolveLocale (SPEC §13)', () => {
  it.each([
    ['es', 'es'],
    ['ca', 'ca-valencia'],
    ['CA', 'ca-valencia'],
    ['en', 'en'],
    ['fr', 'es'],
    [null, 'es'],
    [undefined, 'es'],
  ])('system language %p starts the app in %p', (system, expected) => {
    expect(resolveLocale(system)).toBe(expected);
  });
});

describe('i18next with our resources', () => {
  it.each(SUPPORTED_LOCALES)('%s loads and picks plural forms', async (locale) => {
    const i18n = createInstance();
    await i18n.init({ resources, lng: locale, fallbackLng: 'es', interpolation: { escapeValue: false } });

    expect(i18n.language).toBe(locale);
    const one = i18n.t('duration.daysHours', { count: 1, hours: 3 });
    const two = i18n.t('duration.daysHours', { count: 2, hours: 3 });
    expect(one).toContain('1');
    expect(two).toContain('2');
    expect(one.replace('1', '2')).not.toBe(two);
  });
});
