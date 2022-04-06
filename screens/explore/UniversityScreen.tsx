import React, { useMemo, useCallback } from "react";
import { Text, Box } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type {
  ExploreNavigationParamList,
  SchoolInfo,
} from "../../shared/types";
import { isSchoolGrad, isObjectEmpty, getSchoolName } from "../../shared/utils";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid, { type GridRenderItemInfo } from "../../containers/Grid";
import TieredTextButton from "../../components/TieredTextButton";

type UniversityScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "University"
>;

export default function UniversityScreen() {
  const navigation = useNavigation<UniversityScreenNavigationProp>();
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const settings = useSelector((state) => state.settings);
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

  const schoolCodeToNavigationButton = useCallback(
    (info: GridRenderItemInfo) => (schoolCode: string, index: number) => {
      const schoolInfo: SchoolInfo = { schoolCode };

      return (
        <TieredTextButton
          key={index}
          {...info}
          primaryText={getSchoolName(schoolInfo, schoolNames)}
          secondaryText={schoolCode.toUpperCase()}
          onPress={() => {
            navigation.navigate("School", schoolInfo);
          }}
        />
      );
    },
    [navigation, schoolNames]
  );

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Box marginY={"10px"}>
        <Text variant={"h1"}>{settings.selectedSemester.toString()}</Text>
        <Text variant={"h2"}>Undergraduate</Text>
        <Grid isLoaded={isSchoolNameLoaded && isDepartmentNameLoaded}>
          {(info) => undergradCodes.map(schoolCodeToNavigationButton(info))}
        </Grid>

        <Text variant={"h2"} marginTop={"16px"}>
          Graduate
        </Text>
        <Grid isLoaded={isSchoolNameLoaded && isDepartmentNameLoaded}>
          {(info) => gradCodes.map(schoolCodeToNavigationButton(info))}
        </Grid>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
