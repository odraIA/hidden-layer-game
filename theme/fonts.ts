import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { TitanOne_400Regular } from '@expo-google-fonts/titan-one/400Regular';

/**
 * Font files handed to expo-font's useFonts. Subpath imports keep the other
 * Nunito weights out of the bundle. Both families are OFL and cover the
 * Valencian character set (à è é í ò ó ú ï ü ç and the l·l middle dot).
 */
export const fontAssets = {
  TitanOne_400Regular,
  Nunito_600SemiBold,
  Nunito_800ExtraBold,
};

export const fonts = {
  /** Titan One: round, heavy cartoon-poster titles. */
  display: 'TitanOne_400Regular',
  /** Nunito SemiBold: rounded body text that holds up next to 3px outlines. */
  body: 'Nunito_600SemiBold',
  /** Nunito ExtraBold: emphasis inside body text. */
  strong: 'Nunito_800ExtraBold',
} as const satisfies Record<string, keyof typeof fontAssets>;
