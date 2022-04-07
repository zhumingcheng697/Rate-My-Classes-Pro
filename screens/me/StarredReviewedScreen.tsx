import React, { useState } from "react";
import { Box } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
  useIsFocused,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type {
  ClassInfo,
  StackNavigationSharedParamList,
  MeNavigationParamList,
} from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { placeholderClassNumbers } from "../../shared/utils";
import AlertPopup from "../../components/AlertPopup";
import ClassesGrid from "../../components/ClassesGrid";

type StarredReviewedScreenNavigationProp =
  StackNavigationProp<StackNavigationSharedParamList>;

type StarredReviewedScreenRouteProp = RouteProp<
  MeNavigationParamList,
  "Starred" | "Reviewed"
>;

export default function StarredReviewedScreen() {
  const starredClasses = useSelector((state) => state.starredClassRecord);
  const navigation = useNavigation<StarredReviewedScreenNavigationProp>();
  const route = useRoute<StarredReviewedScreenRouteProp>();
  const [alertDismissed, setAlertDismissed] = useState(false);
  const isFocused = useIsFocused();

  const classes =
    route.name === "Starred"
      ? Object.values(starredClasses)
      : (placeholderClassNumbers.map((classNumber) => ({
          schoolCode: "UY",
          departmentCode: "DM",
          classNumber,
          name: "Lorem ipsum dolor sit amet.",
          description:
            "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas officiis quis voluptatum enim officia eos aliquid, quae cum aliquam vero aperiam beatae similique cupiditate, at ea laboriosam itaque? Quas, expedita.",
        })) as ClassInfo[]);

  return (
    <KeyboardAwareSafeAreaScrollView>
      <AlertPopup
        header={`No ${route.name} Classes`}
        body={`You have not ${route.name.toLowerCase()} any classes yet. Come back later when you have ${route.name.toLowerCase()} some classes.`}
        isOpen={!classes.length && !alertDismissed && isFocused}
        onClose={() => {
          setAlertDismissed(true);
          navigation.goBack();
        }}
      />
      <Box marginY={"10px"}>
        <ClassesGrid
          isLoaded={!!classes.length}
          classes={classes}
          navigation={navigation}
        />
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
