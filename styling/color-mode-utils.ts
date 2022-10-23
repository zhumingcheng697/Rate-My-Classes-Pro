import { useCallback, useMemo, useState } from "react";
import type { ColorSchemeName } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

import colors, { type ColorPair } from "./colors";
import { useColorScheme } from "../libs/hooks";

export function useDynamicColor({ light, dark }: ColorPair) {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? dark : light;
}

export const colorModeResponsiveStyle = (
  style: (selector: (colorPair: ColorPair) => string) => Record<string, any>
) => ({
  ...style(({ light }) => light),
  _dark: style(({ dark }) => dark),
});

export function useColorModeSynchronizer() {
  const colorScheme = useColorScheme();

  const getNavigationTheme = useCallback(
    (colorScheme: ColorSchemeName) => ({
      dark: colorScheme === "dark",
      colors: {
        ...(colorScheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
        primary: colors.nyu[colorScheme || "light"],
        background: colors.background.primary[colorScheme || "light"],
      },
    }),
    []
  );

  const [navigationTheme, setNavigationScheme] = useState(() =>
    getNavigationTheme(colorScheme)
  );

  const colorModeManager = useMemo(
    () => ({
      get: async () => {
        setNavigationScheme(getNavigationTheme(colorScheme));
        return colorScheme;
      },
      set: async () => {},
    }),
    [colorScheme, getNavigationTheme, setNavigationScheme]
  );

  return { navigationTheme, colorModeManager };
}
