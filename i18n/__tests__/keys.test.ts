import { resources, SUPPORTED_LOCALES } from '../locale';

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out.set(path, value);
    else for (const [k, v] of flatten(value, path)) out.set(k, v);
  }
  return out;
}

const placeholders = (text: string) => [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort();

const source = flatten(resources.es.translation);

describe('i18n files (SPEC §13)', () => {
  it('es.json has strings to compare against', () => {
    expect(source.size).toBeGreaterThan(0);
  });

  describe.each(SUPPORTED_LOCALES.filter((locale) => locale !== 'es'))('%s', (locale) => {
    const target = flatten(resources[locale].translation);

    it('has every key that es.json has', () => {
      const missing = [...source.keys()].filter((key) => !target.get(key)?.trim());
      expect(missing).toEqual([]);
    });

    it('has no keys that es.json lacks', () => {
      const extra = [...target.keys()].filter((key) => !source.has(key));
      expect(extra).toEqual([]);
    });

    it('uses the same {{placeholders}} as es.json', () => {
      const mismatched = [...source.entries()]
        .filter(([key]) => target.has(key))
        .filter(([key, text]) => placeholders(text).join() !== placeholders(target.get(key)!).join())
        .map(([key]) => key);
      expect(mismatched).toEqual([]);
    });
  });
});
