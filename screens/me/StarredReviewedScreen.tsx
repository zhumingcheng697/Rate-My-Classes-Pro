import React from "react";
import { Box } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type { MeNavigationParamList, ClassInfo } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import { getFullClassCode, placeholderClassNumbers } from "../../shared/utils";
import TieredTextButton from "../../components/TieredTextButton";

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

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Box marginY={"10px"}>
        <Grid>
          {(info) =>
            (route.name === "Starred"
              ? Object.values(starredClasses)
              : (placeholderClassNumbers.map((classNumber) => ({
                  schoolCode: "UY",
                  departmentCode: "DM",
                  classNumber,
                  name: "Lorem ipsum dolor sit amet.",
                })) as ClassInfo[])
            ).map((classInfo, index) => (
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
