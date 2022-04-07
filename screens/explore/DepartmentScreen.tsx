import React, { useEffect, useState } from "react";
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
  type ExploreNavigationParamList,
  type ClassInfo,
  ErrorType,
} from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import {
  getSchoolName,
  getDepartmentName,
  getFullDepartmentCode,
  getFullClassCode,
} from "../../shared/utils";
import Semester from "../../shared/semester";
import { getClasses } from "../../shared/schedge";
import TieredTextButton from "../../components/TieredTextButton";
import AlertPopup from "../../components/AlertPopup";

type DepartmentScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "Department"
>;

type DepartmentScreenRouteProp = RouteProp<
  ExploreNavigationParamList,
  "Department"
>;

export default function DepartmentScreen() {
  const navigation = useNavigation<DepartmentScreenNavigationProp>();
  const route = useRoute<DepartmentScreenRouteProp>();
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const { selectedSemester } = useSelector((state) => state.settings);
  const isFocused = useIsFocused();

  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);

  const noDataErrorMessage = () => {
    const diff = Semester.between(
      Semester.predictCurrentSemester(),
      selectedSemester
    );

    return `The ${getFullDepartmentCode(route.params)} department ${
      diff > 0
        ? "did not offer"
        : diff < 0
        ? "will not be offering"
        : "is not offering"
    } any classes in ${selectedSemester.toString()}.`;
  };

  useEffect(() => {
    getClasses(route.params, selectedSemester)
      .then((classes) => {
        if (classes && classes.length) {
          setClasses(classes);
        } else {
          setShowAlert(true);
          setError(ErrorType.noData);
        }
      })
      .catch((e) => {
        console.error(e);
        setShowAlert(true);
        setError(ErrorType.network);
      });
  }, [route.params, selectedSemester]);

  return (
    <>
      <AlertPopup
        header={error === ErrorType.noData ? "No Classes Offered" : undefined}
        body={error === ErrorType.noData ? noDataErrorMessage() : undefined}
        isOpen={showAlert && isFocused}
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
      <KeyboardAwareSafeAreaScrollView>
        <Box marginY={"10px"}>
          <Text variant={"h1"}>
            {getDepartmentName(route.params, departmentNames)}
          </Text>
          <Text variant={"h2"}>{getSchoolName(route.params, schoolNames)}</Text>
          <Grid isLoaded={!!classes.length && !error}>
            {(info) =>
              classes.map((classInfo, index) => {
                return (
                  <TieredTextButton
                    key={index}
                    {...info}
                    primaryText={classInfo.name}
                    secondaryText={getFullClassCode(classInfo)}
                    onPress={() => {
                      navigation.navigate("Detail", classInfo);
                    }}
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
