/**
 * Palette from SPEC §14. Three base colors (tomato, mustard, teal) plus one
 * accent (bubblegum, reserved for voting). Do not add colors here without
 * updating the spec.
 */
export const colors = {
  paper: '#F3E7CF',
  paper2: '#E9D9B8',
  ink: '#1E1A16',
  tomato: '#E4572E',
  mustard: '#F2B33D',
  teal: '#17695D',
  bubblegum: '#F28FAD',
} as const;

export type ColorToken = keyof typeof colors;

/**
 * Text color to use on top of each surface. Every pair passes WCAG AA for
 * normal text (checked with antislop-human's contrast-check.py):
 * ink on paper 14.1, on paper2 12.4, on tomato 4.7, on mustard 9.3,
 * on bubblegum 7.7; paper on teal 5.3, on ink 14.1.
 * Paper on tomato is 3.0 and must never be used.
 */
export const onSurface = {
  paper: colors.ink,
  paper2: colors.ink,
  ink: colors.paper,
  tomato: colors.ink,
  mustard: colors.ink,
  teal: colors.paper,
  bubblegum: colors.ink,
} as const satisfies Record<ColorToken, string>;
