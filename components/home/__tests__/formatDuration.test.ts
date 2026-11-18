import { createInstance } from 'i18next';

import { resources } from '@/i18n/locale';

import { formatDuration } from '../RumourList';

describe('formatDuration', () => {
  const i18n = createInstance();
  beforeAll(() => i18n.init({ resources, lng: 'es', interpolation: { escapeValue: false } }));

  it.each([
    [{ days: 1, hours: 3, minutes: 10 }, '1 día y 3 h'],
    [{ days: 2, hours: 0, minutes: 30 }, '2 días'],
    [{ days: 0, hours: 3, minutes: 20 }, '3 h 20 min'],
    [{ days: 0, hours: 3, minutes: 0 }, '3 h'],
    [{ days: 0, hours: 0, minutes: 40 }, '40 min'],
  ])('%o reads %p', (duration, expected) => {
    expect(formatDuration(i18n.t, duration).replace(/ /g, ' ')).toBe(expected);
  });
});
