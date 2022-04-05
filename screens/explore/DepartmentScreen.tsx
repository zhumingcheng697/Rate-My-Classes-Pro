import React, { Component } from "react";
import { Text, Box } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";
import { useSelector } from "react-redux";

import {
  type ExploreNavigationParamList,
  type SchoolNameRecord,
  type DepartmentNameRecord,
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
  placeholderClassNumbers,
} from "../../shared/utils";
import Semester from "../../shared/semester";
import { getClasses } from "../../shared/schedge";
import TieredTextButton from "../../components/TieredTextButton";
import AlertPopup from "../../components/AlertPopup";

const DEBUGGING = false;

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
  const selectedSemester = useSelector((state) => state.selectedSemester);

  return (
    <DepartmentScreenComponent
      navigation={navigation}
      route={route}
      schoolNames={schoolNames}
      departmentNames={departmentNames}
      selectedSemester={selectedSemester}
    />
  );
}

type DepartmentScreenComponentProps = {
  navigation: DepartmentScreenNavigationProp;
  route: DepartmentScreenRouteProp;
  schoolNames: SchoolNameRecord;
  departmentNames: DepartmentNameRecord;
  selectedSemester: Semester;
};

type DepartmentScreenComponentState = {
  classes: ClassInfo[];
  error: ErrorType | null;
  showAlert: boolean;
};

class DepartmentScreenComponent extends Component<
  DepartmentScreenComponentProps,
  DepartmentScreenComponentState
> {
  state: DepartmentScreenComponentState = {
    classes: [],
    error: null,
    showAlert: false,
  };

  componentDidMount() {
    const { route, selectedSemester } = this.props;

    if (DEBUGGING) {
      this.setState({
        classes: placeholderClassNumbers.map((classNumber) => ({
          ...route.params,
          classNumber,
          name: "Lorem ipsum dolor sit amet",
        })),
      });
      return;
    }

    getClasses(route.params, selectedSemester)
      .then((classes) => {
        if (classes && classes.length) {
          this.setState({ classes });
        } else {
          this.setState({ showAlert: true, error: ErrorType.noData });
        }
      })
      .catch((e) => {
        console.error(e);
        this.setState({ showAlert: true, error: ErrorType.loadFailed });
      });
  }

  goBackOnError() {
    this.setState({ showAlert: false });
    this.props.navigation.goBack();
  }

  render() {
    const { navigation, route, schoolNames, departmentNames } = this.props;
    const { classes, showAlert, error } = this.state;

    return (
      <>
        <AlertPopup
          header={error === ErrorType.noData ? "No Classes Offered" : undefined}
          body={
            error === ErrorType.noData
              ? `The ${getFullDepartmentCode(
                  route.params
                )} department is not offering any classes for the semester.`
              : undefined
          }
          isOpen={showAlert}
          onClose={this.goBackOnError.bind(this)}
        />
        <KeyboardAwareSafeAreaScrollView>
          <Box marginY={"10px"}>
            <Text variant={"h1"}>
              {getDepartmentName(route.params, departmentNames)}
            </Text>
            <Text variant={"h2"}>
              {getSchoolName(route.params, schoolNames)}
            </Text>
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
}
