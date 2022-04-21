import React from "react";
import { Icon } from "native-base";
import {
  TransitionPresets,
  type StackNavigationOptions,
} from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

export default (): StackNavigationOptions => ({
  ...TransitionPresets.DefaultTransition,
  headerBackImage: () => (
    <Icon
      size={"md"}
      marginRight={"-3px"}
      color={"nyu.light"}
      _dark={{ color: "nyu.dark" }}
      as={<Ionicons name={"chevron-back"} />}
    />
  ),
});
