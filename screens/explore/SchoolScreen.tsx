import React, { useEffect, useMemo, useState } from "react";
import { Text, Box } from "native-base";
import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import type {
  ExploreNavigationParamList,
  DepartmentInfo,
} from "../../libs/types";
import {
  getSchoolName,
  getDepartmentName,
  isObjectEmpty,
  Route,
  compareDepartments,
} from "../../libs/utils";
import Semester from "../../libs/semester";
import { useHandoff, useSemester } from "../../libs/hooks";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import AlertPopup from "../../components/AlertPopup";
import { TieredTextButton } from "../../components/LinkCompatibleButton";
import { useAuth } from "../../mongodb/auth";

type SchoolScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "School"
>;

type SchoolScreenRouteProp = RouteProp<ExploreNavigationParamList, "School">;

export default function SchoolScreen() {
  const navigation = useNavigation<SchoolScreenNavigationProp>();
  const route = useRoute<SchoolScreenRouteProp>();
  const settings = useSelector((state) => state.settings);
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const isLoaded =
    !!schoolNames &&
    !isObjectEmpty(schoolNames) &&
    !!departmentNames &&
    !isObjectEmpty(departmentNames);
  const { schoolInfo } = route.params;
  const { db, isSettingsSettled, setIsSemesterSettled } = useAuth();
  const isFocused = useIsFocused();
  const semesterInfo = useSemester({
    db,
    navigation,
    params: route.params,
    settings,
    isSettingsSettled,
    setIsSemesterSettled,
  });
  const [showAlert, setShowAlert] = useState(false);

  const departments = useMemo(() => {
    if (!isLoaded) return [];

    return Object.keys(departmentNames[schoolInfo.schoolCode] ?? {}).sort(
      (a, b) => compareDepartments(departmentNames, schoolInfo.schoolCode, a, b)
    );
  }, [departmentNames]);

  useHandoff({
    isFocused,
    route: Route("ExploreTab", "School", route.params),
    title: `Explore ${schoolInfo.schoolCode.toUpperCase()} Classes for ${new Semester(
      semesterInfo
    ).toString()}`,
    isReady: !!route.params.semester,
  });

  useEffect(() => {
    if (departmentNames && !(schoolInfo.schoolCode in departmentNames)) {
      setShowAlert(true);
    }
  }, [departmentNames]);

  const noDataErrorMessage = useMemo(() => {
    const diff = Semester.between(
      Semester.predictCurrentSemester(),
      semesterInfo
    );

    return `${getSchoolName(schoolInfo, schoolNames)} ${
      diff > 0 ? "did" : diff < 0 ? "will" : "does"
    } not have any course offering departments in ${new Semester(
      semesterInfo
    ).toString()}.`;
  }, [semesterInfo, schoolInfo, schoolNames]);

  return (
    <>
      <AlertPopup
        header={"No Departments Available"}
        body={noDataErrorMessage}
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
      <KeyboardAwareSafeAreaScrollView>
        <Box marginY={"10px"}>
          <Text variant={"h1"} opacity={schoolNames ? 1 : 0.5}>
            {getSchoolName(schoolInfo, schoolNames)}
          </Text>
          <Grid
            isLoaded={isLoaded && !!departments.length}
            childrenCount={departments.length}
          >
            {(info) =>
              departments.map((departmentCode, index) => {
                const departmentInfo: DepartmentInfo = {
                  ...schoolInfo,
                  departmentCode,
                };

                return (
                  <TieredTextButton
                    key={departmentCode + index}
                    {...info}
                    primaryText={getDepartmentName(
                      departmentInfo,
                      departmentNames
                    )}
                    secondaryText={`${departmentCode.toUpperCase()}-${schoolInfo.schoolCode.toUpperCase()}`}
                    linkTo={Route("ExploreTab", "Department", {
                      departmentInfo,
                      semester: semesterInfo,
                    })}
                  />
                );
              })
            }
          </Grid>
        </Box>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
