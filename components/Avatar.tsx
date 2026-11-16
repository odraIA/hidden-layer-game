import { StyleSheet, Text, View } from 'react-native';

import { borders, colors, radii, textStyles } from '@/theme';

type AvatarProps = {
  /** Shown next to the avatar by the caller, so the avatar itself is decorative. */
  name: string;
};

const SIZE = 56;

/** Initial-letter avatar. Photos arrive with profiles in M2. */
export function Avatar({ name }: AvatarProps) {
  return (
    <View style={styles.circle} accessible={false} importantForAccessibility="no-hide-descendants">
      <Text style={textStyles.title} allowFontScaling={false}>
        {name.trim().charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
    borderWidth: borders.outline,
    borderColor: colors.ink,
    borderRadius: radii.full,
  },
});
