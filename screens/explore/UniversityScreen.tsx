import React, { useMemo, useCallback, useEffect } from "react";
import { Text, Box } from "native-base";
import { useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import Semester from "../../libs/semester";
import type { SchoolInfo } from "../../libs/types";
import {
  isSchoolGrad,
  isObjectEmpty,
  getSchoolName,
  Route,
  compareSchools,
} from "../../libs/utils";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid, { type GridRenderItemInfo } from "../../containers/Grid";
import { TieredTextButton } from "../../components/LinkCompatibleButton";
import { useAuth } from "../../mongodb/auth";
import { useHandoff } from "../../libs/hooks";

export default function UniversityScreen() {
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const { selectedSemester } = useSelector((state) => state.settings);
  const auth = useAuth();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      auth.setIsSemesterSettled(true);
    }
  }, [isFocused]);

  useHandoff({
    isFocused,
    route: Route("ExploreTab", "University"),
    title: "Explore Classes",
  });

  const isSchoolNameLoaded = !!schoolNames && !isObjectEmpty(schoolNames);
  const isDepartmentNameLoaded =
    !!departmentNames && !isObjectEmpty(departmentNames);

  const semesterName = useMemo(
    () => new Semester(selectedSemester).toString(),
    [selectedSemester.semesterCode, selectedSemester.year]
  );

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

    undergradCodes.sort(compareSchools);
    gradCodes.sort(compareSchools);

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
          linkTo={Route("ExploreTab", "School", {
            schoolInfo,
            semester: selectedSemester,
          })}
        />
      );
    },
    [schoolNames]
  );

  return (
    <KeyboardAwareSafeAreaScrollView>
      <Box marginY={"10px"}>
        <Text variant={"h1"} opacity={auth.isSettingsSettled ? 1 : 0.5}>
          {auth.isSettingsSettled ? semesterName : "Explore"}
        </Text>
        <Text variant={"h2"}>Undergraduate</Text>
        <Grid
          isLoaded={isSchoolNameLoaded && isDepartmentNameLoaded}
          childrenCount={undergradCodes.length}
        >
          {(info) => undergradCodes.map(schoolCodeToNavigationButton(info))}
        </Grid>

        <Text variant={"h2"} marginTop={"16px"}>
          Graduate
        </Text>
        <Grid
          isLoaded={isSchoolNameLoaded && isDepartmentNameLoaded}
          childrenCount={gradCodes.length}
        >
          {(info) => gradCodes.map(schoolCodeToNavigationButton(info))}
        </Grid>
      </Box>
    </KeyboardAwareSafeAreaScrollView>
  );
}
