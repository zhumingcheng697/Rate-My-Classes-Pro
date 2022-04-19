import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function useInnerHeight() {
  const { height } = useWindowDimensions();
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
