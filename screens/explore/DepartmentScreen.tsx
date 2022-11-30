import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Text, Box } from "native-base";
import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import {
  type ClassInfo,
  type SharedNavigationParamList,
  type ExploreNavigationParamList,
  ErrorType,
} from "../../libs/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import {
  getSchoolName,
  getDepartmentName,
  getFullDepartmentCode,
  Route,
} from "../../libs/utils";
import Semester from "../../libs/semester";
import { useHandoff, useRefresh, useSemester } from "../../libs/hooks";
import Schedge from "../../libs/schedge";
import AlertPopup from "../../components/AlertPopup";
import ClassesGrid from "../../components/ClassesGrid";
import { useAuth } from "../../mongodb/auth";

type DepartmentScreenNavigationProp =
  StackNavigationProp<SharedNavigationParamList>;

type DepartmentScreenRouteProp = RouteProp<
  ExploreNavigationParamList,
  "Department"
>;

export default function DepartmentScreen() {
  const navigation = useNavigation<DepartmentScreenNavigationProp>();
  const route = useRoute<DepartmentScreenRouteProp>();
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const settings = useSelector((state) => state.settings);
  const { departmentInfo } = route.params;
  const { db, isSettingsSettled, setIsSemesterSettled } = useAuth();
  const semesterInfo = useSemester({
    db,
    navigation,
    params: route.params,
    settings,
    isSettingsSettled,
    setIsSemesterSettled,
  });

  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);
  const isFocused = useIsFocused();

  const semester = useMemo(
    () => new Semester(semesterInfo),
    [semesterInfo.semesterCode, semesterInfo.year]
  );

  useHandoff({
    isFocused,
    route: Route("ExploreTab", "Department", route.params),
    title: `Explore ${getFullDepartmentCode(
      departmentInfo
    )} Classes for ${new Semester(semesterInfo).toString()}`,
    isReady: !!route.params.semester,
  });

  const noDataErrorMessage = useMemo(() => {
    const diff = Semester.between(Semester.predictCurrentSemester(), semester);

    return `The ${getFullDepartmentCode(departmentInfo)} department ${
      diff > 0
        ? "did not offer"
        : diff < 0
        ? "will not be offering"
        : "is not offering"
    } any classes in ${semester.toString()}.`;
  }, [semester, departmentInfo]);

  const fetchClasses = useCallback(
    (failSilently: boolean = false) => {
      if (!isSettingsSettled) return;

      Schedge.getClasses(departmentInfo, semester)
        .then((classes) => {
          if (classes && classes.length) {
            setClasses(classes);
            setShowAlert(false);
            setError(null);
          } else {
            setError(ErrorType.noData);
            setShowAlert(true);
          }
        })
        .catch((e) => {
          console.error(e);
          setError(ErrorType.network);
          if (!failSilently) setShowAlert(true);
        });
    },
    [isSettingsSettled, semester, departmentInfo]
  );

  useEffect(fetchClasses, [semester, isSettingsSettled]);

  useEffect(() => {
    if (!error && showAlert) setShowAlert(false);
  }, [error, showAlert]);

  useRefresh(
    error !== ErrorType.network
      ? undefined
      : (reason) => fetchClasses(reason === "NetInfo")
  );

  return (
    <>
      <AlertPopup
        autoDismiss
        isOpen={showAlert && error === ErrorType.network}
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
      <AlertPopup
        header={"No Classes Offered"}
        body={noDataErrorMessage}
        isOpen={showAlert && error === ErrorType.noData}
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
      <KeyboardAwareSafeAreaScrollView>
        <Box marginY={"10px"}>
          <Text variant={"h1"} opacity={departmentNames ? 1 : 0.5}>
            {getDepartmentName(departmentInfo, departmentNames)}
          </Text>
          <Text variant={"h2"} opacity={schoolNames ? 1 : 0.5}>
            {getSchoolName(departmentInfo, schoolNames)}
          </Text>
          <ClassesGrid
            isLoaded={!!classes.length && !error}
            classes={classes}
            navigation={navigation}
            semesterInfo={semesterInfo}
          />
        </Box>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
