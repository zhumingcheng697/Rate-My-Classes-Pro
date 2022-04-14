import React from "react";
import { Platform } from "react-native";
import { type RouteProp } from "@react-navigation/native";
import {
  type StackNavigationProp,
  type StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";

import PlainTextButton from "../../components/PlainTextButton";
import { type SharedNavigationParamList } from "../../libs/types";

type ReviewScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Review"
>;

type ReviewScreenRouteProp = RouteProp<SharedNavigationParamList, "Review">;

export type ReviewScreenOptionsProp = {
  navigation: ReviewScreenNavigationProp;
  route: ReviewScreenRouteProp;
};

export default ({
  navigation,
  route,
}: ReviewScreenOptionsProp): StackNavigationOptions => ({
  title: route.params.previousReview ? "Edit Review" : "New Review",
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
    const { classInfo, previousReview, newReview } = route.params;
    return (
      <PlainTextButton
        isDisabled={newReview ? false : true}
        marginRight={"10px"}
        title={previousReview ? "Update" : "Submit"}
        _text={{ fontSize: "md", fontWeight: "semibold" }}
        onPress={() => {
          navigation.navigate("Detail", { classInfo, newReview });
        }}
        {...props}
      />
    );
  },
  ...(Platform.OS === "ios" || Platform.OS === "macos"
    ? TransitionPresets.ModalSlideFromBottomIOS
    : TransitionPresets.DefaultTransition),
});
