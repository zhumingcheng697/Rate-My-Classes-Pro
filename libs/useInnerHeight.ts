import { useEffect, useState } from "react";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import useDimensions from "./useDimensions";

export default function useInnerHeight() {
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
