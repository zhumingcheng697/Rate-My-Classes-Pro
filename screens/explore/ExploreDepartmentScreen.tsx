import { Text } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type { ExploreNavigationParamList, ClassCode } from "../../shared/types";
import SafeAreaScrollView from "../../containers/SafeAreaScrollView";
import Grid from "../../containers/Grid";
import {
  getSchoolName,
  getDepartmentName,
  getClassCode,
} from "../../shared/utils";
import TieredTextButton from "../../components/TieredTextButton";

type ExploreDepartmentScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Explore-Department"
>;

type ExploreDepartmentScreenRouteProp = RouteProp<
  ExploreNavigationParamList,
  "Explore-Department"
>;

export default function ExploreDepartmentScreen() {
  const navigation = useNavigation<ExploreDepartmentScreenNavigationProp>();
  const route = useRoute<ExploreDepartmentScreenRouteProp>();
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>
        {getDepartmentName(route.params, departmentNames)}
      </Text>
      <Text variant={"h2"}>{getSchoolName(route.params, schoolNames)}</Text>
      <Grid minChildrenWidth={140} childrenHeight={"90px"}>
        {["2193", "3193", "4193"].map((classNumber, index) => {
          const classCode: ClassCode = { ...route.params, classNumber };

          return (
            <TieredTextButton
              key={index}
              primaryText={"Lorem ipsum dolor sit amet"}
              secondaryText={getClassCode(classCode)}
              onPress={() => {
                navigation.navigate("Explore-Detail", {
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
    </SafeAreaScrollView>
  );
}
