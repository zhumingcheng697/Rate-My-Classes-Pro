import React from "react";
import { Platform } from "react-native";
import { type RouteProp } from "@react-navigation/native";
import {
  type StackNavigationProp,
  type StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";

import { PlainTextButton } from "../../components/LinkCompatibleButton";
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
  title: route.params.newOrEdit ? `${route.params.newOrEdit} Review` : "Review",
  presentation: "modal",
  gestureEnabled: false,
  headerLeft: (props) => (
    <PlainTextButton
      marginLeft={"5px"}
      padding={"5px"}
      title={"Cancel"}
      _text={{ fontSize: "md", fontWeight: "normal" }}
      onPress={navigation.goBack}
      {...props}
    />
  ),
  headerRight: (props) => {
    const { classCode, newReview, newOrEdit, semester } = route.params;
    return (
      <PlainTextButton
        isDisabled={!newReview || !newOrEdit}
        marginRight={"5px"}
        padding={"5px"}
        title={newOrEdit === "Edit" ? "Update" : "Submit"}
        _text={{ fontSize: "md", fontWeight: "semibold" }}
        onPress={() =>
          navigation.navigate("Detail", { classCode, newReview, semester })
        }
        {...props}
      />
    );
  },
  ...(Platform.OS === "ios" || Platform.OS === "macos"
    ? TransitionPresets.ModalSlideFromBottomIOS
    : TransitionPresets.DefaultTransition),
});
