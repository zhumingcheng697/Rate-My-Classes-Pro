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

import type { MeNavigationParamList, ClassInfo } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import { getFullClassCode, placeholderClassNumbers } from "../../shared/utils";
import TieredTextButton from "../../components/TieredTextButton";
import AlertPopup from "../../components/AlertPopup";

type StarredReviewedScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Starred" | "Reviewed"
>;

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
        <Grid isLoaded={!!classes.length}>
          {(info) =>
            classes.map((classInfo, index) => (
              <TieredTextButton
                key={index}
                {...info}
                primaryText={classInfo.name}
                secondaryText={getFullClassCode(classInfo)}
                onPress={() => {
                  navigation.navigate("Detail", {
                    description:
                      "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas modi explicabo fuga, eum libero ipsum magnam. Dolores, vel vero nobis doloribus voluptatibus soluta ratione adipisci repellat voluptatem libero ipsam rerum.",
                    ...classInfo,
                  });
                }}
              />
            ))
          }
        </Grid>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
