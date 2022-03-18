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
import SafeAreaScrollView from "../../components/SafeAreaScrollView";
import Grid from "../../components/Grid";

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
  const schoolNames = useSelector((state: RootState) => state.schoolNameRecord);
  const departmentNames = useSelector(
    (state: RootState) => state.departmentNameRecord
  );

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>
        {((departmentNames || {})[route.params.schoolCode] ?? {})[
          route.params.departmentCode
        ] || route.params.departmentCode}
      </Text>
      <Text variant={"h2"}>
        {(schoolNames || {})[route.params.schoolCode] ??
          route.params.schoolCode}
      </Text>
      <Grid minChildrenWidth={140} childrenHeight={"90px"}>
        {["2193", "3193", "4193"].map((classNumber, index) => (
          <Button
            key={index}
            borderRadius={12}
            onPress={() => {
              navigation.navigate("Explore-Detail", {
                schoolCode: route.params.schoolCode,
                departmentCode: "DM",
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
