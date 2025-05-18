/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string } | undefined,
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // Get theme, with fallback to 'light'
  const theme = useColorScheme();
  
  // Handle the case where props is undefined
  if (!props) {
    return Colors[theme][colorName];
  }
  
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
