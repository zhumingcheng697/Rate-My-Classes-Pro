import { type ReactNode } from "react";
import {
  NativeSafeAreaViewProps,
  SafeAreaView,
} from "react-native-safe-area-context";
import { type IBoxProps, ScrollView, Box } from "native-base";

type SafeAreaScrollViewProps = {
  contentContainerProps?: IBoxProps;
  safeAreaProps?: NativeSafeAreaViewProps;
  marginY?: number | string;
  children: ReactNode | ReactNode[];
};

export default function SafeAreaScrollView({
  contentContainerProps = { marginY: "10px" },
  safeAreaProps = { edges: ["left", "right"] },
  children,
}: SafeAreaScrollViewProps) {
  Object.assign({ marginY: "10px" }, contentContainerProps);
  Object.assign({ edges: ["left", "right"] }, safeAreaProps);

  return (
    <ScrollView>
      <SafeAreaView {...safeAreaProps}>
        <Box {...contentContainerProps}>{children}</Box>
      </SafeAreaView>
    </ScrollView>
  );
}
