import { type ReactNode } from "react";
import {
  NativeSafeAreaViewProps,
  SafeAreaView,
} from "react-native-safe-area-context";
import { IStackProps, ScrollView, VStack } from "native-base";

type SafeAreaScrollViewProp = {
  vstackProps?: IStackProps;
  safeAreaProps?: NativeSafeAreaViewProps;
  marginY?: number | string;
  children: ReactNode | ReactNode[];
};

export default function SafeAreaScrollView({
  vstackProps = { marginY: "10px" },
  safeAreaProps = { edges: ["left", "right"] },
  children,
}: SafeAreaScrollViewProp) {
  return (
    <ScrollView>
      <SafeAreaView {...safeAreaProps}>
        <VStack {...vstackProps}>{children}</VStack>
      </SafeAreaView>
    </ScrollView>
  );
}
