import React, { Component, type ReactNode, useCallback, useState } from "react";
import { type Dispatch } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  type RootNavigationParamList,
  type SchoolNameRecord,
  type DepartmentNameRecord,
  ErrorType,
} from "../libs/types";
import { getDepartmentNames, getSchoolNames } from "../libs/schedge";
import { isObjectEmpty } from "../libs/utils";
import AlertPopup from "../components/AlertPopup";
import { useAuth } from "../mongodb/auth";
import { setDepartmentNameRecord, setSchoolNameRecord } from "../redux/actions";
import ExploreNavigation from "./ExploreNavigation";
import SearchNavigation from "./SearchNavigation";
import MeNavigation from "./MeNavigation";

const Tab = createBottomTabNavigator<RootNavigationParamList>();

type RootNavigationComponentProps = {
  fetchInfo: () => void;
  children: ReactNode;
};

class RootNavigationComponent extends Component<RootNavigationComponentProps> {
  componentDidMount() {
    this.props.fetchInfo();
  }

  render() {
    return this.props.children;
  }
}

export default function RootNavigation() {
  const [error, setError] = useState<ErrorType | null>(null);
  const [accountError, setAccountError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const schoolNameRecord = useSelector((state) => state.schoolNameRecord);
  const departmentNameRecord = useSelector(
    (state) => state.departmentNameRecord
  );
  const dispatch = useDispatch();
  const auth = useAuth();

  const getSchoolAndDepartmentNames = useCallback(
    (
      schoolNameRecord: SchoolNameRecord | null,
      departmentNameRecord: DepartmentNameRecord | null,
      dispatch: Dispatch
    ) => {
      if (schoolNameRecord && departmentNameRecord) return;

      if (!schoolNameRecord)
        getSchoolNames()
          .then((record) => {
            if (record && !isObjectEmpty(record)) {
              setSchoolNameRecord(dispatch)(record);
              setError(null);
              setShowAlert(false);
            } else {
              setError(ErrorType.noData);
              setShowAlert(true);
            }
          })
          .catch((e) => {
            console.error(e);
            setError(ErrorType.network);
            setShowAlert(true);
          });

      if (!departmentNameRecord)
        getDepartmentNames()
          .then((record) => {
            if (record && !isObjectEmpty(record)) {
              setDepartmentNameRecord(dispatch)(record);
              setError(null);
              setShowAlert(false);
            } else {
              setError(ErrorType.noData);
              setShowAlert(true);
            }
          })
          .catch((e) => {
            console.error(e);
            setError(ErrorType.network);
            setShowAlert(true);
          });
    },
    []
  );

  const fetchInfo = useCallback(() => {
    auth.fetchUserDoc().catch((e) => {
      console.error(e);
      setAccountError(true);
      setShowAlert(true);
    });

    getSchoolAndDepartmentNames(
      schoolNameRecord,
      departmentNameRecord,
      dispatch
    );
  }, [schoolNameRecord, departmentNameRecord, dispatch, auth]);

  return (
    <RootNavigationComponent fetchInfo={fetchInfo}>
      <AlertPopup
        header={
          accountError
            ? error
              ? "Unable to Load Class or Account Information"
              : "Unable to Load Account Information"
            : undefined
        }
        body={
          error === ErrorType.noData && !accountError
            ? "This might be an issue with Schedge, our API provider for classes."
            : undefined
        }
        isOpen={showAlert}
        onClose={() => {
          setShowAlert(false);
        }}
        onlyShowWhenFocused={false}
      />
      <Tab.Navigator
        screenListeners={{ tabPress: fetchInfo }}
        screenOptions={({ route }) => ({
          title: route.name.replace(/-Tab/gi, ""),
          headerShown: false,
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;

            if (route.name === "Explore-Tab") {
              iconName = "compass";
            } else if (route.name === "Search-Tab") {
              iconName = "search";
            } else {
              iconName = "person";
            }

            return (
              <Ionicons
                name={focused ? iconName : `${iconName}-outline`}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen name={"Explore-Tab"} component={ExploreNavigation} />
        <Tab.Screen name={"Search-Tab"} component={SearchNavigation} />
        <Tab.Screen name={"Me-Tab"} component={MeNavigation} />
      </Tab.Navigator>
    </RootNavigationComponent>
  );
}
