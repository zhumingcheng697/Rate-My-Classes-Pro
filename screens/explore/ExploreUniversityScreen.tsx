import { useMemo } from "react";
import { Text } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type {
  ExploreNavigationParamList,
  SchoolInfo,
} from "../../shared/types";
import { isSchoolGrad, isObjectEmpty, getSchoolName } from "../../shared/utils";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import TieredTextButton from "../../components/TieredTextButton";

type ExploreUniversityScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Explore-University"
>;

export default function ExploreUniversityScreen() {
  const navigation = useNavigation<ExploreUniversityScreenNavigationProp>();
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
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

    return [undergradCodes, gradCodes];
  }, [schoolNames, departmentNames]);

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Text variant={"h1"}>Undergraduate</Text>
      <Grid
        isLoaded={isSchoolNameLoaded && isDepartmentNameLoaded}
        minChildrenWidth={140}
        childrenHeight={"90px"}
      >
        {(info) =>
          undergradCodes.map((schoolCode, index) => {
            const schoolInfo: SchoolInfo = { schoolCode };

            return (
              <TieredTextButton
                key={index}
                {...info}
                primaryText={getSchoolName(schoolInfo, schoolNames)}
                secondaryText={schoolCode.toUpperCase()}
                onPress={() => {
                  navigation.navigate("Explore-School", schoolInfo);
                }}
              />
            );
          })
        }
      </Grid>

      <Text variant={"h1"} marginTop={"16px"}>
        Graduate
      </Text>
      <Grid
        isLoaded={isSchoolNameLoaded && isDepartmentNameLoaded}
        minChildrenWidth={140}
        childrenHeight={"90px"}
      >
        {(info) =>
          gradCodes.map((schoolCode, index) => {
            const schoolInfo: SchoolInfo = { schoolCode };

            return (
              <TieredTextButton
                key={index}
                {...info}
                primaryText={getSchoolName(schoolInfo, schoolNames)}
                secondaryText={schoolCode.toUpperCase()}
                onPress={() => {
                  navigation.navigate("Explore-School", schoolInfo);
                }}
              />
            );
          })
        }
      </Grid>
    </KeyboardAwareSafeAreaScrollView>
  );
}
