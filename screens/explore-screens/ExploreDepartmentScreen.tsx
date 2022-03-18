import { Text, Button } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import {
  type RootState,
  type ExploreNavigationParamList,
} from "../../shared/types";
import SafeAreaScrollView from "../../container/SafeAreaScrollView";
import Grid from "../../container/Grid";
import { getSchoolName, getDepartmentName } from "../../shared/utils";

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
  const { schoolCode, departmentCode } = route.params;
  const schoolNames = useSelector((state: RootState) => state.schoolNameRecord);
  const departmentNames = useSelector(
    (state: RootState) => state.departmentNameRecord
  );

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>
        {getDepartmentName(schoolCode, departmentCode, departmentNames)}
      </Text>
      <Text variant={"h2"}>{getSchoolName(schoolCode, schoolNames)}</Text>
      <Grid minChildrenWidth={140} childrenHeight={"90px"}>
        {["2193", "3193", "4193"].map((classNumber, index) => (
          <Button
            key={index}
            borderRadius={12}
            onPress={() => {
              navigation.navigate("Explore-Detail", {
                schoolCode: schoolCode,
                departmentCode: departmentCode,
                classNumber,
                name: classNumber,
                description:
                  "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptas modi explicabo fuga, eum libero ipsum magnam. Dolores, vel vero nobis doloribus voluptatibus soluta ratione adipisci repellat voluptatem libero ipsam rerum.",
              });
            }}
          >
            {classNumber}
          </Button>
        ))}
      </Grid>
    </SafeAreaScrollView>
  );
}
