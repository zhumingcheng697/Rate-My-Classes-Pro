import { useMemo } from "react";
import { Text, Button, Skeleton } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import {
  type RootState,
  type ExploreNavigationParamList,
} from "../../shared/types";
import { isSchoolGrad, isObjectEmpty } from "../../shared/util";
import SafeAreaScrollView from "../../components/SafeAreaScrollView";
import Grid from "../../components/Grid";

type ExploreUniversityScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Explore-University"
>;

export default function ExploreUniversityScreen() {
  const navigation = useNavigation<ExploreUniversityScreenNavigationProp>();
  const schoolNames = useSelector((state: RootState) => state.schoolNameRecord);
  const departmentNames = useSelector(
    (state: RootState) => state.departmentNameRecord
  );
  const isSchoolNameLoaded = !!schoolNames && !isObjectEmpty(schoolNames);
  const isDepartmentNameLoaded =
    !!departmentNames && !isObjectEmpty(departmentNames);

  const [undergradCodes, gradCodes] = useMemo(() => {
    if (!isSchoolNameLoaded || !isDepartmentNameLoaded) return [[], []];

    const undergradCodes: string[] = [];
    const gradCodes: string[] = [];

    for (let code in schoolNames) {
      const departments = departmentNames[code];
      if (departments && !isObjectEmpty(departments)) {
        if (isSchoolGrad(code)) {
          gradCodes.push(code);
        } else {
          undergradCodes.push(code);
        }
      }
    }

    return [undergradCodes.sort(), gradCodes.sort()];
  }, [schoolNames, departmentNames]);

  return (
    <SafeAreaScrollView>
      <Text variant={"h1"}>Undergraduate</Text>
      <Grid
        isLoaded={isSchoolNameLoaded && isDepartmentNameLoaded}
        minChildrenWidth={140}
        childrenHeight={"90px"}
      >
        {undergradCodes.map((code, index) => (
          <Button
            key={index}
            borderRadius={12}
            onPress={() => {
              navigation.navigate("Explore-School", {
                schoolCode: code,
              });
            }}
          >
            {(schoolNames || {})[code] || code.toUpperCase()}
          </Button>
        ))}
      </Grid>

      <Text variant={"h1"} marginTop={"16px"}>
        Graduate
      </Text>
      <Grid
        isLoaded={!!schoolNames && !!Object.keys(schoolNames).length}
        minChildrenWidth={140}
        childrenHeight={"90px"}
      >
        {gradCodes.map((code, index) => (
          <Button
            key={index}
            borderRadius={12}
            onPress={() => {
              navigation.navigate("Explore-School", {
                schoolCode: code,
              });
            }}
          >
            {(schoolNames || {})[code]}
          </Button>
        ))}
      </Grid>
    </SafeAreaScrollView>
  );
}
