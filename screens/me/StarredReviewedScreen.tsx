import React from "react";
import { Text, Box } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import type { MeNavigationParamList, ClassCode } from "../../shared/types";
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
  const navigation = useNavigation<StarredReviewedScreenNavigationProp>();
  const route = useRoute<StarredReviewedScreenRouteProp>();

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Box marginY={"10px"}>
        {/* <Text variant={"h1"}>{route.name.replace(/Me-/gi, "")}</Text> */}
        <Grid>
          {(info) =>
            placeholderClassNumbers.map((classNumber, index) => {
              const classCode: ClassCode = {
                schoolCode: "UY",
                departmentCode: "DM",
                classNumber,
              };

              return (
                <TieredTextButton
                  key={index}
                  {...info}
                  primaryText={"Lorem ipsum dolor sit amet"}
                  secondaryText={getFullClassCode(classCode)}
                  onPress={() => {
                    navigation.navigate("Detail", {
                      ...classCode,
                      name: classNumber,
                      description:
                        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas modi explicabo fuga, eum libero ipsum magnam. Dolores, vel vero nobis doloribus voluptatibus soluta ratione adipisci repellat voluptatem libero ipsam rerum.",
                    });
                  }}
                />
              );
            })
          }
        </Grid>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
