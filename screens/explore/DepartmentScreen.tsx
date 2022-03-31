import React, { Component } from "react";
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
  ClassInfo,
  SchoolNameRecord,
  DepartmentNameRecord,
} from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import Grid from "../../containers/Grid";
import {
  getSchoolName,
  getDepartmentName,
  getClassCode,
  placeholderClassNumbers,
} from "../../shared/utils";
import { getCurrentClasses } from "../../shared/schedge";
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

  return (
    <DepartmentScreenComponent
      navigation={navigation}
      route={route}
      schoolNames={schoolNames}
      departmentNames={departmentNames}
    />
  );
}

type DepartmentScreenComponentProps = {
  navigation: DepartmentScreenNavigationProp;
  route: DepartmentScreenRouteProp;
  schoolNames: SchoolNameRecord;
  departmentNames: DepartmentNameRecord;
};

type DepartmentScreenComponentState = {
  classes: ClassInfo[];
  loadError: boolean;
};

class DepartmentScreenComponent extends Component<
  DepartmentScreenComponentProps,
  DepartmentScreenComponentState
> {
  state: DepartmentScreenComponentState = {
    classes: [],
    loadError: false,
  };

  componentDidMount() {
    if (DEBUGGING) {
      this.setState({
        classes: placeholderClassNumbers.map((classNumber) => ({
          ...this.props.route.params,
          classNumber,
          name: "Lorem ipsum dolor sit amet",
        })),
      });
      return;
    }

    getCurrentClasses(this.props.route.params)
      .then((classes) => {
        this.setState({ classes });
      })
      .catch((e) => {
        console.error(e);
        this.setState({ loadError: true });
      });
  }

  clearLoadError() {
    this.setState({ loadError: false });
  }

  render() {
    const { navigation, route, schoolNames, departmentNames } = this.props;
    const { classes, loadError } = this.state;

    return (
      <>
        <AlertPopup
          isOpen={this.state.loadError}
          onClose={this.clearLoadError.bind(this)}
        />
        <KeyboardAwareSafeAreaScrollView>
          <Box marginY={"10px"}>
            <Text variant={"h1"}>
              {getDepartmentName(route.params, departmentNames)}
            </Text>
            <Text variant={"h2"}>
              {getSchoolName(route.params, schoolNames)}
            </Text>
            <Grid isLoaded={!!classes.length && !loadError}>
              {(info) =>
                classes.map((classInfo, index) => {
                  return (
                    <TieredTextButton
                      key={index}
                      {...info}
                      primaryText={classInfo.name}
                      secondaryText={getClassCode(classInfo)}
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
