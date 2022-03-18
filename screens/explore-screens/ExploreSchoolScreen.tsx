import { Text, Button } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import { RootState } from "../../redux/types";
import { type ExploreNavigationParamList } from "../../shared/types";
import SafeAreaScrollView from "../../components/SafeAreaScrollView";
import Grid from "../../components/Grid";

type ExploreSchoolScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Explore-School"
>;

type ExploreSchoolScreenRouteProp = RouteProp<
  ExploreNavigationParamList,
  "Explore-School"
>;

export default function ExploreSchoolScreen() {
  const navigation = useNavigation<ExploreSchoolScreenNavigationProp>();
  const route = useRoute<ExploreSchoolScreenRouteProp>();
  const schoolNames = useSelector((state: RootState) => state.schoolNameRecord);
  const departmentNames = useSelector(
    (state: RootState) => state.departmentNameRecord
  );

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>
        {(schoolNames || {})[route.params.schoolCode] ||
          route.params.schoolCode}
      </Text>
      <Grid minChildrenWidth={140} childrenHeight={"90px"}>
        {Object.keys(
          (departmentNames || {})[route.params.schoolCode] ?? {}
        ).map((department, index) => (
          <Button
            key={index}
            borderRadius={12}
            onPress={() => {
              navigation.navigate("Explore-Department", {
                schoolCode: route.params.schoolCode,
                departmentCode: department,
              });
            }}
          >
            {department}
          </Button>
        ))}
      </Grid>
    </SafeAreaScrollView>
  );
}
