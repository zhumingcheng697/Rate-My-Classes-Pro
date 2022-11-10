import React from "react";
import { Platform } from "react-native";
import { CommonActions } from "@react-navigation/native";
import { type HeaderBackButtonProps } from "@react-navigation/elements";
import { Icon, type IIconProps } from "native-base";
import {
  TransitionPresets,
  type StackNavigationOptions,
} from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Pressable } from "../../components/LinkCompatibleButton";
import colors, { subtleBorder } from "../../styling/colors";
import { colorModeResponsiveStyle } from "../../styling/color-mode-utils";
import { useInitialPreviousRoute, useInitialTabName } from "../../libs/hooks";
import { Route } from "../../libs/utils";

function ChevronIcon(props: IIconProps) {
  return (
    <Icon
      {...props}
      size={"md"}
      {...colorModeResponsiveStyle((selector) => ({
        color: selector(colors.nyu),
      }))}
      as={<Ionicons name={"chevron-back"} />}
    />
  );
}

function WebBackButton(props: HeaderBackButtonProps) {
  const { onPress: _, canGoBack, ...rest } = props;
  const tabName = useInitialTabName();
  const previousRoute = useInitialPreviousRoute();
  return !canGoBack ? null : (
    <Pressable
      {...rest}
      marginLeft={"11px"}
      marginRight={"8px"}
      linkTo={{
        ...Route(tabName, previousRoute?.name, previousRoute?.params),
        action: CommonActions.goBack(),
      }}
    >
      <ChevronIcon />
    </Pressable>
  );
}

export default (): StackNavigationOptions => ({
  ...TransitionPresets.DefaultTransition,
  headerStyle: {
    shadowColor: "transparent",
    borderBottomWidth: 1,
    borderBottomColor: subtleBorder,
  },
  headerLeft:
    Platform.OS === "web" ? (props) => <WebBackButton {...props} /> : undefined,
  headerBackImage:
    Platform.OS === "web"
      ? undefined
      : () => <ChevronIcon marginRight={"-3px"} />,
});
