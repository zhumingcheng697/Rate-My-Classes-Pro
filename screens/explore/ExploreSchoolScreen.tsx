import { useMemo } from "react";
import { Text } from "native-base";
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
import TieredTextButton from "../../components/TieredTextButton";
import {
  getSchoolName,
  getDepartmentName,
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
      <Text variant={"h1"}>{getSchoolName(route.params, schoolNames)}</Text>
      <Grid isLoaded={isLoaded} minChildrenWidth={140} childrenHeight={"90px"}>
        {departments.map((departmentCode, index) => {
          const departmentInfo = { ...route.params, departmentCode };

          return (
            <TieredTextButton
              key={index}
              primaryText={getDepartmentName(departmentInfo, departmentNames)}
              secondaryText={`${departmentCode.toUpperCase()}-${schoolCode.toUpperCase()}`}
              onPress={() => {
                navigation.navigate("Explore-Department", departmentInfo);
              }}
            />
          );
        })}
      </Grid>
    </SafeAreaScrollView>
  );
}
