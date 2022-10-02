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
import { useNetInfo } from "@react-native-community/netinfo";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  type RootNavigationParamList,
  type SchoolNameRecord,
  type DepartmentNameRecord,
  ErrorType,
} from "../libs/types";
import { getDepartmentNames, getSchoolNames } from "../libs/schedge";
import { useAppState } from "../libs/hooks";
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
  const [fetchingSchoolNames, setFetchingSchoolNames] = useState(false);
  const [fetchingDepartmentNames, setFetchingDepartmentNames] = useState(false);
  const [fetchingUserDoc, setFetchingUserDoc] = useState(false);
  const schoolNameRecord = useSelector((state) => state.schoolNameRecord);
  const departmentNameRecord = useSelector(
    (state) => state.departmentNameRecord
  );
  const dispatch = useDispatch();
  const auth = useAuth();
  const appState = useAppState();
  const netInfo = useNetInfo();

  const getSchoolAndDepartmentNames = useCallback(
    (
      schoolNameRecord: SchoolNameRecord | null,
      departmentNameRecord: DepartmentNameRecord | null,
      dispatch: Dispatch,
      failSilently: boolean = false
    ) => {
      if (schoolNameRecord && departmentNameRecord) return;

      if (!schoolNameRecord && !fetchingSchoolNames) {
        setFetchingSchoolNames(true);

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
            if (!failSilently) setShowAlert(true);
          })
          .finally(() => {
            setFetchingSchoolNames(false);
          });
      }

      if (!departmentNameRecord && !fetchingDepartmentNames) {
        setFetchingDepartmentNames(true);

        getDepartmentNames()
          .then((record) => {
            if (record && !isObjectEmpty(record)) {
              setDepartmentNameRecord(dispatch)(record);
              setError(null);
              if (!failSilently) setShowAlert(false);
            } else {
              setError(ErrorType.noData);
              if (!failSilently) setShowAlert(true);
            }
          })
          .catch((e) => {
            console.error(e);
            setError(ErrorType.network);
            if (!failSilently) setShowAlert(true);
          })
          .finally(() => {
            setFetchingDepartmentNames(false);
          });
      }
    },
    []
  );

  const fetchInfo = useCallback(
    (failSilently: boolean = false) => {
      if (!fetchingUserDoc) {
        setFetchingUserDoc(true);

        auth
          .fetchUserDoc()
          .catch((e) => {
            console.error(e);
            setAccountError(true);
            if (!failSilently) setShowAlert(true);
          })
          .finally(() => {
            setFetchingUserDoc(false);
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

  useEffect(() => {
    if ((error || accountError) && appState === "active") fetchInfo();
  }, [appState]);

  useEffect(() => {
    if ((error || accountError) && netInfo.isInternetReachable) fetchInfo();
  }, [netInfo]);

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
