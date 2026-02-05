/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1f1a17',
    background: '#f5efe4',
    tint: '#4f4a3d',
    icon: '#7f725d',
    tabIconDefault: '#7f725d',
    tabIconSelected: '#4f4a3d',
    surface: '#fbf7ef',
    paper: '#f8f2e8',
    border: '#d9ccb8',
    accent: '#5f6f5d',
    mutedText: '#7d6e58',
  },
  dark: {
    text: '#efe6d7',
    background: '#241d18',
    tint: '#efe6d7',
    icon: '#b9aa93',
    tabIconDefault: '#b9aa93',
    tabIconSelected: '#efe6d7',
    surface: '#2c241d',
    paper: '#3b3025',
    border: '#5a4b3b',
    accent: '#8ca287',
    mutedText: '#b8a58d',
  },
};

export const Literary = {
  spacing: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 18,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
