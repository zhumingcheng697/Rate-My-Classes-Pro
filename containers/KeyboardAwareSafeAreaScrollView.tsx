import { type ReactNode } from "react";
import {
  SafeAreaView,
  type NativeSafeAreaViewProps,
} from "react-native-safe-area-context";
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
} from "react-native-keyboard-aware-scroll-view";
import { type IBoxProps, Box } from "native-base";

type KeyboardAwareSafeAreaScrollViewProps = {
  contentContainerProps?: IBoxProps;
  safeAreaViewProps?: NativeSafeAreaViewProps;
  keyboardAwareScrollViewProps?: KeyboardAwareScrollViewProps;
  children: ReactNode;
};

export default function KeyboardAwareSafeAreaScrollView({
  contentContainerProps,
  safeAreaViewProps,
  keyboardAwareScrollViewProps,
  children,
}: KeyboardAwareSafeAreaScrollViewProps) {
  contentContainerProps = Object.assign(
    { marginY: "10px" },
    contentContainerProps
  );

  safeAreaViewProps = Object.assign(
    { edges: ["left", "right"] },
    safeAreaViewProps
  );

  keyboardAwareScrollViewProps = Object.assign(
    { keyboardShouldPersistTaps: "handled" },
    keyboardAwareScrollViewProps
  );

  return (
    <KeyboardAwareScrollView {...keyboardAwareScrollViewProps}>
      <SafeAreaView {...safeAreaViewProps}>
        <Box {...contentContainerProps}>{children}</Box>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
}
