import { type ReactNode } from "react";
import {
  NativeSafeAreaViewProps,
  SafeAreaView,
} from "react-native-safe-area-context";
import { type IStackProps, ScrollView, VStack } from "native-base";

type SafeAreaScrollViewProps = {
  vstackProps?: IStackProps;
  safeAreaProps?: NativeSafeAreaViewProps;
  marginY?: number | string;
  children: ReactNode | ReactNode[];
};

export default function SafeAreaScrollView({
  vstackProps = { marginY: "10px" },
  safeAreaProps = { edges: ["left", "right"] },
  children,
}: SafeAreaScrollViewProps) {
  return (
    <ScrollView>
      <SafeAreaView {...safeAreaProps}>
        <VStack {...vstackProps}>{children}</VStack>
      </SafeAreaView>
    </ScrollView>
  );
}
