import React from "react";
import { Platform } from "react-native";
import { type RouteProp } from "@react-navigation/native";
import {
  type StackNavigationProp,
  type StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";

import { PlainTextButton } from "../../components/LinkCompatibleButton";
import type { Review, SharedNavigationParamList } from "../../libs/types";
import { hasEditedReview } from "../../libs/utils";

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
    const { classCode, pendingReview, previousReview, newOrEdit, semester } =
      route.params;

    let newReview: Omit<Review, "userId"> | undefined = undefined;
    let hasEdited = false;

    if (
      pendingReview &&
      pendingReview.enjoyment &&
      pendingReview.difficulty &&
      pendingReview.workload &&
      pendingReview.value &&
      pendingReview.semester &&
      pendingReview.instructor
    ) {
      newReview = {
        enjoyment: pendingReview.enjoyment,
        difficulty: pendingReview.difficulty,
        workload: pendingReview.workload,
        value: pendingReview.value,
        semester: pendingReview.semester,
        instructor: pendingReview.instructor,
        comment: pendingReview.comment ?? "",
        upvotes: previousReview?.upvotes ?? {},
        downvotes: previousReview?.downvotes ?? {},
        reviewedDate: previousReview?.reviewedDate ?? Date.now(),
      };

      hasEdited = hasEditedReview(
        previousReview,
        newReview.enjoyment,
        newReview.difficulty,
        newReview.workload,
        newReview.value,
        newReview.comment
      );
    }

    return (
      <PlainTextButton
        isDisabled={!newReview || !newOrEdit || !hasEdited}
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
