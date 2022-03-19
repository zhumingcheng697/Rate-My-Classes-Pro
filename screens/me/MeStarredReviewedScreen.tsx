import { Text } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import type { MeNavigationParamList, ClassCode } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import { getClassCode, placeholderClassNumbers } from "../../shared/utils";
import TieredTextButton from "../../components/TieredTextButton";

type MeStarredReviewedScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Me-Starred" | "Me-Reviewed"
>;

type MeStarredReviewedScreenRouteProp = RouteProp<
  MeNavigationParamList,
  "Me-Starred" | "Me-Reviewed"
>;

export default function MeStarredReviewedScreen() {
  const navigation = useNavigation<MeStarredReviewedScreenNavigationProp>();
  const route = useRoute<MeStarredReviewedScreenRouteProp>();

  return (
    <KeyboardAwareSafeAreaScrollView>
      {/* <Text variant={"h1"}>{route.name.replace(/Me-/gi, "")}</Text> */}
      <Grid minChildrenWidth={140} childrenHeight={"90px"}>
        {placeholderClassNumbers.map((classNumber, index) => {
          const classCode: ClassCode = {
            schoolCode: "UY",
            departmentCode: "DM",
            classNumber,
          };

          return (
            <TieredTextButton
              key={index}
              primaryText={"Lorem ipsum dolor sit amet"}
              secondaryText={getClassCode(classCode)}
              onPress={() => {
                navigation.navigate("Me-Detail", {
                  ...classCode,
                  name: classNumber,
                  description:
                    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas modi explicabo fuga, eum libero ipsum magnam. Dolores, vel vero nobis doloribus voluptatibus soluta ratione adipisci repellat voluptatem libero ipsam rerum.",
                });
              }}
            />
          );
        })}
      </Grid>
    </KeyboardAwareSafeAreaScrollView>
  );
}
