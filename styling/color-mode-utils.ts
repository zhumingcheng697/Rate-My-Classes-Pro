import { useCallback, useMemo, useState } from "react";
import type { ColorSchemeName } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";

import colors, { type ColorPair } from "./colors";
import { useColorScheme } from "../libs/hooks";

export function useDynamicColor({ light, dark }: ColorPair) {
  const { colorScheme } = useColorModeSynchronizer();
  return colorScheme === "dark" ? dark : light;
}

export const colorModeResponsiveStyle = (
  style: (selector: (colorPair: ColorPair) => string) => Record<string, any>
) => {
  const lightStyle = style(({ light }) => light);
  return {
    ...lightStyle,
    _light: lightStyle,
    _dark: style(({ dark }) => dark),
  };
};

export function useColorModeSynchronizer() {
  const current = useColorScheme();
  const [colorScheme, setColorScheme] = useState(current);

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
    getNavigationTheme(current)
  );

  const colorModeManager = useMemo(
    () => ({
      get: async () => {
        setNavigationScheme(getNavigationTheme(current));
        setColorScheme(current);
        return current;
      },
      set: async () => {},
    }),
    [current, getNavigationTheme, setNavigationScheme]
  );

  return { navigationTheme, colorModeManager, colorScheme };
}
