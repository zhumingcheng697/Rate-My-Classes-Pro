import { useMemo } from "react";
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
import { isObjectEmpty } from "../../shared/util";

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
  const { schoolCode } = route.params;
  const schoolNames = useSelector((state: RootState) => state.schoolNameRecord);
  const departmentNames = useSelector(
    (state: RootState) => state.departmentNameRecord
  );
  const isLoaded = !!departmentNames && !isObjectEmpty(departmentNames);

  const departments = useMemo(() => {
    if (!isLoaded) return [];

    return Object.keys(departmentNames[schoolCode] ?? {}).sort();
  }, [departmentNames]);

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>
        {(schoolNames || {})[schoolCode] || schoolCode}
      </Text>
      <Grid isLoaded={isLoaded} minChildrenWidth={140} childrenHeight={"90px"}>
        {departments.map((department, index) => (
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
            {((departmentNames || {})[schoolCode] ?? {})[department] ||
              department.toUpperCase()}
          </Button>
        ))}
      </Grid>
    </SafeAreaScrollView>
  );
}
