// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

/** Props that carry text a person reads or hears. */
const TEXT_PROPS = '/^(label|title|placeholder|footnote|accessibilityLabel|accessibilityHint)$/';

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/*'],
  },
  {
    // CLAUDE.md rule 5: UI text always goes through t('key').
    files: ['app/**/*.tsx', 'components/**/*.tsx'],
    rules: {
      'react/jsx-no-literals': ['error', { noStrings: true, ignoreProps: true }],
    },
  },
  {
    // CLAUDE.md rule 10: colors only from theme/.
    files: ['app/**', 'components/**', 'lib/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
          message: 'Use a color token from theme/ instead of a raw hex value.',
        },
        // CLAUDE.md rule 5 for props: jsx-no-literals above ignores all of them.
        ...[':matches(Literal, TemplateLiteral)', 'JSXExpressionContainer > :matches(Literal, TemplateLiteral)'].map(
          (value) => ({
            selector: `JSXAttribute[name.name=${TEXT_PROPS}] > ${value}`,
            message: "UI text goes through t('key'), also in props.",
          }),
        ),
      ],
    },
  },
]);
