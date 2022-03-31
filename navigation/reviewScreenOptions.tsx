import React from "react";
import { Platform } from "react-native";
import { type RouteProp } from "@react-navigation/native";
import {
  type StackNavigationProp,
  type StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";

import PlainTextButton from "../components/PlainTextButton";
import type {
  ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
} from "../shared/types";

type ReviewScreenNavigationProp = StackNavigationProp<
  | ExploreNavigationParamList
  | SearchNavigationParamList
  | MeNavigationParamList,
  "Review"
>;

type ReviewScreenRouteProp = RouteProp<
  | ExploreNavigationParamList
  | SearchNavigationParamList
  | MeNavigationParamList,
  "Review"
>;

export type ReviewScreenOptionsProp = {
  navigation: ReviewScreenNavigationProp;
  route: ReviewScreenRouteProp;
};

export default ({
  navigation,
}: ReviewScreenOptionsProp): StackNavigationOptions => ({
  presentation: "modal",
  gestureEnabled: false,
  headerLeft: (props) => {
    return (
      <PlainTextButton
        marginLeft={"10px"}
        title={"Cancel"}
        _text={{ fontSize: "md", fontWeight: "normal" }}
        onPress={navigation.goBack}
        {...props}
      />
    );
  },
  headerRight: (props) => {
    return (
      <PlainTextButton
        marginRight={"10px"}
        title={"Save"}
        _text={{ fontSize: "md", fontWeight: "semibold" }}
        onPress={navigation.goBack}
        {...props}
      />
    );
  },
  ...(Platform.OS === "ios" || Platform.OS === "macos"
    ? TransitionPresets.ModalSlideFromBottomIOS
    : TransitionPresets.DefaultTransition),
});
