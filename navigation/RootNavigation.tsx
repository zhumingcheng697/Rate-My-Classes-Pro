import React, {
  Component,
  type ReactNode,
  useCallback,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { Platform } from "react-native";
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
  type WatchAppContext,
  ErrorType,
} from "../libs/types";
import Schedge from "../libs/schedge";
import Semester, { type SemesterInfo } from "../libs/semester";
import { useRefresh } from "../libs/hooks";
import { composeErrorMessage, isObjectEmpty } from "../libs/utils";
import { useWatchConnectivity } from "../libs/watch";
import { useAuth } from "../mongodb/auth";
import Action from "../redux/actions";
import { subtleBorder } from "../styling/colors";
import { useDynamicColor } from "../styling/color-mode-utils";

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
  const [recordError, setRecordError] = useState<ErrorType | null>(null);
  const starred = useSelector((state) => state.starredClassRecord);
  const { selectedSemester } = useSelector((state) => state.settings);
  const loadedSemester = useRef<SemesterInfo | null>(null);
  const [accountError, setAccountError] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);
  const schoolNameRecord = useSelector((state) => state.schoolNameRecord);
  const departmentNameRecord = useSelector(
    (state) => state.departmentNameRecord
  );
  const dispatch = useDispatch();
  const auth = useAuth();
  const userDocError = auth.userDocError;
  const hasError = recordError || accountError || userDocError;

  const getSchoolAndDepartmentNames = useCallback(
    (
      schoolNameRecord: SchoolNameRecord | null,
      departmentNameRecord: DepartmentNameRecord | null,
      selectedSemester: SemesterInfo,
      isSemesterSettled: boolean,
      dispatch: Dispatch,
      failSilently: boolean = false
    ) => {
      if ((schoolNameRecord && departmentNameRecord) || !isSemesterSettled)
        return;

      Schedge.getNameRecordFor(selectedSemester)
        .then(({ school, department }) => {
          if (
            school &&
            department &&
            !isObjectEmpty(school) &&
            !isObjectEmpty(department)
          ) {
            Action.setSchoolNameRecord(dispatch)(school);
            Action.setDepartmentNameRecord(dispatch)(department);
            setRecordError(null);
            loadedSemester.current = selectedSemester;
          } else {
            setRecordError(ErrorType.noData);
            if (!failSilently) setShowAlert(true);
          }
        })
        .catch((e) => {
          console.error(e);
          setRecordError(ErrorType.network);
          if (!failSilently) setShowAlert(true);
        });
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
        selectedSemester,
        auth.isSemesterSettled && auth.isSettingsSettled,
        dispatch,
        failSilently
      );
    },
    [schoolNameRecord, departmentNameRecord, dispatch, auth, selectedSemester]
  );

  useEffect(() => {
    if (auth.isSemesterSettled && auth.isSettingsSettled) {
      if (
        schoolNameRecord &&
        departmentNameRecord &&
        loadedSemester.current &&
        Semester.equals(selectedSemester, loadedSemester.current)
      )
        return;

      Action.setDepartmentNameRecord(dispatch)(null);
      getSchoolAndDepartmentNames(
        schoolNameRecord,
        null,
        selectedSemester,
        auth.isSemesterSettled && auth.isSettingsSettled,
        dispatch
      );
    }
  }, [
    selectedSemester.semesterCode,
    selectedSemester.year,
    auth.isSemesterSettled && auth.isSettingsSettled,
  ]);

  useRefresh(
    !hasError ? undefined : (reason) => fetchInfo(reason === "NetInfo")
  );

  useEffect(() => {
    if (userDocError && !showAlert) setShowAlert(true);
  }, [userDocError]);

  useEffect(() => {
    if (!recordError && !accountError && !userDocError && showAlert) {
      setShowAlert(false);
    }
  }, [recordError, accountError, userDocError, showAlert]);

  const [sortedStarred, compactSchoolNameRecord, compactDepartmentNameRecord] =
    useMemo(() => {
      const sortedStarred = starred
        ? Object.values(starred).sort((a, b) => b.starredDate - a.starredDate)
        : [];

      if (!sortedStarred.length) {
        return [[], {}, {}];
      }

      if (!schoolNameRecord || !departmentNameRecord) {
        return [[], null, null];
      }

      const compactSchoolNameRecord: SchoolNameRecord = {};
      const compactDepartmentNameRecord: DepartmentNameRecord = {};

      for (let { schoolCode, departmentCode } of sortedStarred) {
        if (schoolCode in schoolNameRecord) {
          compactSchoolNameRecord[schoolCode] = schoolNameRecord[schoolCode];
        }

        if (
          schoolCode in departmentNameRecord &&
          departmentCode in departmentNameRecord[schoolCode]
        ) {
          if (!(schoolCode in compactDepartmentNameRecord)) {
            compactDepartmentNameRecord[schoolCode] = {};
          }
          compactDepartmentNameRecord[schoolCode][departmentCode] =
            departmentNameRecord[schoolCode][departmentCode];
        }
      }

      return [
        sortedStarred,
        compactSchoolNameRecord,
        compactDepartmentNameRecord,
      ];
    }, [starred, schoolNameRecord, departmentNameRecord]);

  const [isReady, context] = useMemo(() => {
    return [
      auth.isSemesterSettled &&
        auth.isSettingsSettled &&
        !!compactSchoolNameRecord &&
        !!compactDepartmentNameRecord,
      {
        hasSynced: true,
        starred: sortedStarred,
        selectedSemester,
        isAuthenticated: auth.isAuthenticated,
        schoolNameRecord: compactSchoolNameRecord || {},
        departmentNameRecord: compactDepartmentNameRecord || {},
      } as WatchAppContext,
    ];
  }, [
    auth.isSemesterSettled && auth.isSettingsSettled,
    compactSchoolNameRecord,
    compactDepartmentNameRecord,
    sortedStarred,
    selectedSemester,
    auth.isAuthenticated,
  ]);

  useWatchConnectivity(isReady, context);

  return (
    <RootNavigationComponent fetchInfo={fetchInfo}>
      <AlertPopup
        global
        header={"Unable to Load Class or Account Information"}
        isOpen={showAlert && (accountError || userDocError) && recordError}
        onClose={() => {
          setShowAlert(false);
          fetchInfo(true);
        }}
      />
      <AlertPopup
        global
        isOpen={showAlert && !accountError && !userDocError && !!recordError}
        onClose={() => {
          setShowAlert(false);
          fetchInfo(true);
        }}
      />
      <AlertPopup
        global
        header={"Unable to Load Account Information"}
        isOpen={showAlert && (accountError || userDocError) && !recordError}
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
