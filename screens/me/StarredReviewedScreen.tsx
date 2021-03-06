import React, { useEffect, useMemo, useState } from "react";
import { Box } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type {
  SharedNavigationParamList,
  MeNavigationParamList,
} from "../../libs/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import AlertPopup from "../../components/AlertPopup";
import ClassesGrid from "../../components/ClassesGrid";
import { useAuth } from "../../mongodb/auth";

type StarredReviewedScreenNavigationProp =
  StackNavigationProp<SharedNavigationParamList>;

type StarredReviewedScreenRouteProp = RouteProp<
  MeNavigationParamList,
  "Starred" | "Reviewed"
>;

export default function StarredReviewedScreen() {
  const starredClasses = useSelector((state) => state.starredClassRecord);
  const reviewedClasses = useSelector((state) => state.reviewedClassRecord);
  const navigation = useNavigation<StarredReviewedScreenNavigationProp>();
  const route = useRoute<StarredReviewedScreenRouteProp>();
  const [alertDismissed, setAlertDismissed] = useState(false);
  const auth = useAuth();

  const classes = useMemo(
    () =>
      route.name === "Starred"
        ? Object.values(starredClasses ?? {}).sort(
            (a, b) => b.starredDate - a.starredDate
          )
        : Object.values(reviewedClasses ?? {}).sort(
            (a, b) => b.reviewedDate - a.reviewedDate
          ),
    [route.name, starredClasses, reviewedClasses]
  );

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigation.goBack();
      return;
    }
  }, [auth.isAuthenticated]);

  return (
    <KeyboardAwareSafeAreaScrollView>
      <AlertPopup
        header={`No ${route.name} Classes`}
        body={`You have not ${route.name.toLowerCase()} any classes yet. Come back later when you have ${route.name.toLowerCase()} some classes.`}
        isOpen={!classes.length && !alertDismissed && auth.isAuthenticated}
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
