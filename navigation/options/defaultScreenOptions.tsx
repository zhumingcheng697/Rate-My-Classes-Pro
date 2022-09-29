import React from "react";
import { Icon } from "native-base";
import {
  TransitionPresets,
  type StackNavigationOptions,
} from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import colors from "../../libs/colors";
import { colorModeResponsiveStyle } from "../../libs/color-mode-utils";

export default (): StackNavigationOptions => ({
  ...TransitionPresets.DefaultTransition,
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
