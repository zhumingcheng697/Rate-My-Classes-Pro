import { useEffect, useState, useMemo, useCallback } from "react";
import {
  useWindowDimensions,
  Appearance,
  Platform,
  useColorScheme as _useColorScheme,
} from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export function useIsCatalyst() {
  const isCatalyst = useMemo(
    () =>
      Platform.OS === "ios" &&
      (!/^(?:phone|pad)$/i.test(Platform.constants.interfaceIdiom) ||
        (!Platform.isPad && /pad/i.test(Platform.constants.systemName))),
    []
  );

  return isCatalyst;
}

export function useDimensions() {
  const isCatalyst = useIsCatalyst();

  const dimensionsHook = useCallback(
    isCatalyst ? useSafeAreaFrame : useWindowDimensions,
    []
  );

  return dimensionsHook();
}

export function useInnerHeight() {
  const { height } = useDimensions();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const [cachedHeight, setCachedHeight] = useState(height);
  const [cachedHeaderHeight, setCachedHeaderHeight] = useState(headerHeight);
  const [cachedTabBarHeight, setCachedTabBarHeight] = useState(tabBarHeight);

  useEffect(() => {
    if (height) setCachedHeight(height);
  }, [height]);

  useEffect(() => {
    if (headerHeight) setCachedHeaderHeight(headerHeight);
  }, [headerHeight]);

  useEffect(() => {
    if (tabBarHeight) setCachedTabBarHeight(tabBarHeight);
  }, [tabBarHeight]);

  return cachedHeight - cachedHeaderHeight - cachedTabBarHeight;
}

export function useColorScheme(delay = 250) {
  const isiOS = Platform.OS === "ios" && !useIsCatalyst();

  const colorSchemeHook = useCallback(
    isiOS
      ? () => {
          const [colorScheme, setColorScheme] = useState(() =>
            Appearance.getColorScheme()
          );

          useEffect(() => {
            let timeout: ReturnType<typeof setTimeout>;

            const { remove } = Appearance.addChangeListener(() => {
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                setColorScheme(Appearance.getColorScheme());
              }, delay);
            });

            return () => {
              clearTimeout(timeout);
              remove();
            };
          }, []);

          return colorScheme;
        }
      : _useColorScheme,
    []
  );

  return colorSchemeHook();
}
