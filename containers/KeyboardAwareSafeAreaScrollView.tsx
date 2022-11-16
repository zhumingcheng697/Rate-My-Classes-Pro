import React, { Children, type ReactNode } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  SafeAreaView,
  type NativeSafeAreaViewProps,
} from "react-native-safe-area-context";
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
} from "react-native-keyboard-aware-scroll-view";

export type KeyboardAwareSafeAreaScrollViewProps = {
  safeAreaViewProps?: NativeSafeAreaViewProps;
  keyboardAwareScrollViewProps?: KeyboardAwareScrollViewProps;
  wrapChildrenInIndividualSafeAreaViews?: boolean;
  children: ReactNode;
};

export default function KeyboardAwareSafeAreaScrollView({
  safeAreaViewProps,
  keyboardAwareScrollViewProps,
  wrapChildrenInIndividualSafeAreaViews = false,
  children,
}: KeyboardAwareSafeAreaScrollViewProps) {
  const tabBarHeight = useBottomTabBarHeight();

  safeAreaViewProps = Object.assign(
    { edges: ["left", "right"] },
    safeAreaViewProps
  );

  keyboardAwareScrollViewProps = Object.assign(
    {
      keyboardShouldPersistTaps: "handled",
      extraHeight: 90,
      extraScrollHeight: -tabBarHeight,
    },
    keyboardAwareScrollViewProps
  );

  return (
    <KeyboardAwareScrollView {...keyboardAwareScrollViewProps}>
      {wrapChildrenInIndividualSafeAreaViews ? (
        Children.map(children, (child) => (
          <SafeAreaView {...safeAreaViewProps}>{child}</SafeAreaView>
        ))
      ) : (
        <SafeAreaView {...safeAreaViewProps}>{children}</SafeAreaView>
      )}
    </KeyboardAwareScrollView>
  );
}
