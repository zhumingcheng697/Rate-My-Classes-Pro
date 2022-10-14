import React, { useEffect, useMemo, useState } from "react";
import { Text, Box } from "native-base";
import {
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
} from "../../libs/utils";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import AlertPopup from "../../components/AlertPopup";
import TieredTextButton from "../../components/TieredTextButton";

type SchoolScreenNavigationProp = StackNavigationProp<
  ExploreNavigationParamList,
  "School"
>;

type SchoolScreenRouteProp = RouteProp<ExploreNavigationParamList, "School">;

export default function SchoolScreen() {
  const navigation = useNavigation<SchoolScreenNavigationProp>();
  const route = useRoute<SchoolScreenRouteProp>();
  const { schoolCode } = route.params;
  const schoolNames = useSelector((state) => state.schoolNameRecord);
  const departmentNames = useSelector((state) => state.departmentNameRecord);
  const isLoaded = !!departmentNames && !isObjectEmpty(departmentNames);
  const [showAlert, setShowAlert] = useState(false);

  const departments = useMemo(() => {
    if (!isLoaded) return [];

    return Object.keys(departmentNames[schoolCode] ?? {});
  }, [departmentNames]);

  useEffect(() => {
    if (departmentNames && !(schoolCode in departmentNames)) {
      setShowAlert(true);
    }
  }, [departmentNames]);

  return (
    <>
      <AlertPopup
        header={"No Departments Available"}
        body={`${getSchoolName(
          route.params,
          schoolNames
        )} does not have any course offering departments.`}
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false);
          navigation.goBack();
        }}
      />
      <KeyboardAwareSafeAreaScrollView>
        <Box marginY={"10px"}>
          <Text variant={"h1"} opacity={schoolNames ? 1 : 0.5}>
            {getSchoolName(route.params, schoolNames)}
          </Text>
          <Grid
            isLoaded={isLoaded && !!departments.length}
            childrenCount={departments.length}
          >
            {(info) =>
              departments.map((departmentCode, index) => {
                const departmentInfo: DepartmentInfo = {
                  ...route.params,
                  departmentCode,
                };

                return (
                  <TieredTextButton
                    key={index}
                    {...info}
                    primaryText={getDepartmentName(
                      departmentInfo,
                      departmentNames
                    )}
                    secondaryText={`${departmentCode.toUpperCase()}-${schoolCode.toUpperCase()}`}
                    linkTo={Route("ExploreTab", "Department", departmentInfo)}
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
