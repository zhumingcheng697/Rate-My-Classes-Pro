import React from "react";
import { Platform, useColorScheme } from "react-native";
import { Icon } from "native-base";
import {
  TransitionPresets,
  type StackNavigationOptions,
} from "@react-navigation/stack";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import colors from "../../libs/colors";
import { colorModeResponsiveStyle } from "../../libs/color-mode-utils";

export default (): StackNavigationOptions => ({
  ...TransitionPresets.DefaultTransition,
  headerStyle: {
    shadowColor: "transparent",
    borderBottomWidth: 1,
    ...(Platform.OS === "ios" || Platform.OS === "macos"
      ? colorModeResponsiveStyle((selector) => ({
          borderColor: selector({
            light: DefaultTheme.colors.border,
            dark: DarkTheme.colors.border,
          }),
        }))
      : {
          borderColor:
            useColorScheme() === "dark"
              ? DarkTheme.colors.border
              : DefaultTheme.colors.border,
        }),
  },
  headerBackImage: () => (
    <Icon
      size={"md"}
      marginRight={"-3px"}
      {...colorModeResponsiveStyle((selector) => ({
        color: selector(colors.nyu),
      }))}
      as={<Ionicons name={"chevron-back"} />}
    />
  ),
});
