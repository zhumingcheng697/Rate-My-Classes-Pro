import { useMemo } from "react";
import { Text, Button } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import { type ExploreNavigationParamList } from "../../shared/types";
import SafeAreaScrollView from "../../containers/SafeAreaScrollView";
import Grid from "../../containers/Grid";
import {
  getSchoolNameByInfo,
  getDepartmentNameByCode,
  isObjectEmpty,
} from "../../shared/utils";

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
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const isLoaded = !!departmentNames && !isObjectEmpty(departmentNames);

  const departments = useMemo(() => {
    if (!isLoaded) return [];

    return Object.keys(departmentNames[schoolCode] ?? {}).sort();
  }, [departmentNames]);

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>
        {getSchoolNameByInfo(route.params, schoolNames)}
      </Text>
      <Grid isLoaded={isLoaded} minChildrenWidth={140} childrenHeight={"90px"}>
        {departments.map((department, index) => (
          <Button
            key={index}
            borderRadius={12}
            onPress={() => {
              navigation.navigate("Explore-Department", {
                ...route.params,
                departmentCode: department,
              });
            }}
          >
            {getDepartmentNameByCode(schoolCode, department, departmentNames)}
          </Button>
        ))}
      </Grid>
    </SafeAreaScrollView>
  );
}
