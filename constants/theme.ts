/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#84CC16';
const tintColorDark  = '#A3E635';

export const Colors = {
  light: {
    text:            '#111827',  // Midnight
    background:     '#F9FFF0',  // Lime-tinted white
    tint:            tintColorLight,
    icon:            '#253260',  // Indigo dusk
    tabIconDefault: '#4B5E8A',  // Muted blue
    tabIconSelected: tintColorLight,
    surface:         '#FFFFFF',
    surfaceAlt:      '#F0FBD8',  // Lime mist card
    border:          '#D9F99D',  // Lime light
    primary:         '#1A2540',  // Navy deep
    accent:          '#84CC16',
  },
  dark: {
    text:            '#E2F5B8',  // Lime-tinted white
    background:     '#0B0F1A',  // Abyss
    tint:            tintColorDark,
    icon:            '#84CC16',  // Lime
    tabIconDefault: '#4B5563',  // Muted gray-blue
    tabIconSelected: tintColorDark,
    surface:         '#111827',  // Midnight
    surfaceAlt:      '#1A2540',  // Navy deep card
    border:          '#253260',  // Indigo dusk
    primary:         '#A3E635',  // Lime bright
    accent:          '#A3E635',
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
