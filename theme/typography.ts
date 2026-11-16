import type { TextStyle } from 'react-native';

import { colors } from './colors';
import { fonts } from './fonts';

/** Text styles. Sizes are in points and scale with the system font size. */
export const textStyles = {
  display: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36, color: colors.ink },
  title: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28, color: colors.ink },
  label: { fontFamily: fonts.display, fontSize: 18, lineHeight: 24, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 23, color: colors.ink },
  strong: { fontFamily: fonts.strong, fontSize: 16, lineHeight: 23, color: colors.ink },
  small: { fontFamily: fonts.body, fontSize: 14, lineHeight: 20, color: colors.ink },
} as const satisfies Record<string, TextStyle>;
