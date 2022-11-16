import React, {
  Component,
  type ReactNode,
  useCallback,
  useState,
  useEffect,
} from "react";
import { type Dispatch } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import ExploreNavigation from "./ExploreNavigation";
import SearchNavigation from "./SearchNavigation";
import MeNavigation from "./MeNavigation";
import AlertPopup from "../components/AlertPopup";
import {
  type RootNavigationParamList,
  type SchoolNameRecord,
  type DepartmentNameRecord,
  ErrorType,
} from "../libs/types";
import { getDepartmentNames, getSchoolNames } from "../libs/schedge";
import { useRefresh } from "../libs/hooks";
import { composeErrorMessage, isObjectEmpty } from "../libs/utils";
import { useAuth } from "../mongodb/auth";
import { setDepartmentNameRecord, setSchoolNameRecord } from "../redux/actions";
import { subtleBorder } from "../styling/colors";
import { useDynamicColor } from "../styling/color-mode-utils";
import { Platform } from "react-native";

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
  const [schoolError, setSchoolError] = useState<ErrorType | null>(null);
  const [departmentError, setDepartmentError] = useState<ErrorType | null>(
    null
  );
  const [accountError, setAccountError] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const schoolNameRecord = useSelector((state) => state.schoolNameRecord);
  const departmentNameRecord = useSelector(
    (state) => state.departmentNameRecord
  );
  const dispatch = useDispatch();
  const auth = useAuth();
  const userDocError = auth.userDocError;
  const hasError =
    schoolError || departmentError || accountError || userDocError;

  const getSchoolAndDepartmentNames = useCallback(
    (
      schoolNameRecord: SchoolNameRecord | null,
      departmentNameRecord: DepartmentNameRecord | null,
      dispatch: Dispatch,
      failSilently: boolean = false
    ) => {
      if (schoolNameRecord && departmentNameRecord) return;

      if (!schoolNameRecord) {
        getSchoolNames()
          .then((record) => {
            if (record && !isObjectEmpty(record)) {
              setSchoolNameRecord(dispatch)(record);
              setSchoolError(null);
            } else {
              setSchoolError(ErrorType.noData);
              if (!failSilently) setShowAlert(true);
            }
          })
          .catch((e) => {
            console.error(e);
            setSchoolError(ErrorType.network);
            if (!failSilently) setShowAlert(true);
          });
      }

      if (!departmentNameRecord) {
        getDepartmentNames()
          .then((record) => {
            if (record && !isObjectEmpty(record)) {
              setDepartmentNameRecord(dispatch)(record);
              setDepartmentError(null);
            } else {
              setDepartmentError(ErrorType.noData);
              if (!failSilently) setShowAlert(true);
            }
          })
          .catch((e) => {
            console.error(e);
            setDepartmentError(ErrorType.network);
            if (!failSilently) setShowAlert(true);
          });
      }
    },
    []
  );

  const fetchInfo = useCallback(
    (failSilently: boolean = false) => {
      if (!auth.isUserDocLoaded) {
        auth
          .fetchUserDoc()
          .then(() => setAccountError(null))
          .catch((e) => {
            console.error(e);
            setAccountError(e);
            if (!failSilently) setShowAlert(true);
          });
      }

      getSchoolAndDepartmentNames(
        schoolNameRecord,
        departmentNameRecord,
        dispatch,
        failSilently
      );
    },
    [schoolNameRecord, departmentNameRecord, dispatch, auth]
  );

  useRefresh(
    !hasError ? undefined : (reason) => fetchInfo(reason === "NetInfo")
  );

  useEffect(() => {
    if (userDocError && !showAlert) setShowAlert(true);
  }, [userDocError]);

  useEffect(() => {
    if (
      !schoolError &&
      !departmentError &&
      !accountError &&
      !userDocError &&
      showAlert
    ) {
      setShowAlert(false);
    }
  }, [schoolError, departmentError, accountError, userDocError, showAlert]);

  return (
    <RootNavigationComponent fetchInfo={fetchInfo}>
      <AlertPopup
        global
        header={"Unable to Load Class or Account Information"}
        isOpen={
          showAlert &&
          (accountError || userDocError) &&
          (schoolError || departmentError)
        }
        onClose={() => {
          setShowAlert(false);
          fetchInfo(true);
        }}
      />
      <AlertPopup
        global
        isOpen={
          showAlert &&
          !accountError &&
          !userDocError &&
          !!(schoolError || departmentError)
        }
        onClose={() => {
          setShowAlert(false);
          fetchInfo(true);
        }}
      />
      <AlertPopup
        global
        header={"Unable to Load Account Information"}
        isOpen={
          showAlert &&
          (accountError || userDocError) &&
          !schoolError &&
          !departmentError
        }
        body={composeErrorMessage(accountError || userDocError)}
        onClose={() => {
          setShowAlert(false);
          fetchInfo(true);
        }}
      />
      <Tab.Navigator
        backBehavior={Platform.OS === "web" ? "history" : undefined}
        screenOptions={({ route }) => ({
          title: route.name.replace(/Tab/gi, ""),
          headerShown: false,
          tabBarStyle: {
            shadowColor: "transparent",
            borderTopWidth: 1,
            borderTopColor: subtleBorder,
          },
          tabBarInactiveTintColor: useDynamicColor({
            light: "#8E8E8F",
            dark: "#7C7C7D",
          }),
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;

            if (route.name === "ExploreTab") {
              iconName = "compass";
            } else if (route.name === "SearchTab") {
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
        <Tab.Screen name={"ExploreTab"} component={ExploreNavigation} />
        <Tab.Screen name={"SearchTab"} component={SearchNavigation} />
        <Tab.Screen name={"MeTab"} component={MeNavigation} />
      </Tab.Navigator>
    </RootNavigationComponent>
  );
}
