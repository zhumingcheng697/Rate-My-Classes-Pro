import { useCallback, useMemo } from "react";
import { DynamicColorIOS, type ColorSchemeName } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

import { useColorScheme } from "./hooks";
import colors, { type ColorPair } from "./colors";

export const colorModeResponsiveStyle = (
  style: (
    selector: (colorPair: ColorPair) => ReturnType<typeof DynamicColorIOS>
  ) => Record<string, any>
) => ({ ...style(DynamicColorIOS) });

const dynamicThemeColor = (
  selector: (
    colors: typeof DefaultTheme.colors & typeof DarkTheme.colors
  ) => string
) =>
  DynamicColorIOS({
    light: selector(DefaultTheme.colors),
    dark: selector(DarkTheme.colors),
  });

export function useColorModeSynchronizer() {
  const colorScheme = useColorScheme();

  const getNavigationTheme = useCallback(
    (colorScheme: ColorSchemeName) => ({
      dark: colorScheme === "dark",
      colors: {
        primary: DynamicColorIOS(colors.nyu),
        background: DynamicColorIOS(colors.background.primary),
        card: dynamicThemeColor((colors) => colors.card),
        text: dynamicThemeColor((colors) => colors.text),
        border: dynamicThemeColor((colors) => colors.border),
        notification: dynamicThemeColor((colors) => colors.notification),
      },
    }),
    []
  );

  const navigationTheme = useMemo(
    () => getNavigationTheme(colorScheme),
    [colorScheme]
  );

  const colorModeManager = undefined;

  return { navigationTheme, colorModeManager };
}
