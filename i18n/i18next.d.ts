import 'i18next';

import type es from './es.json';

// Makes t('some.key') a compile error when the key is not in es.json.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: typeof es };
  }
}
