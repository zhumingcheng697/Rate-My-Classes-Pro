import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  useWindowDimensions,
  Platform,
  AppState,
  Appearance,
  useColorScheme as _useColorScheme,
  Keyboard,
  NativeModules,
  type KeyboardEvent,
} from "react-native";
import { useDispatch } from "react-redux";
import { useSafeAreaFrame } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { StackNavigationProp } from "@react-navigation/stack";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNetInfo } from "@react-native-community/netinfo";
import {
  type NavigationAction,
  type NavigationState,
  useIsFocused,
  useLinkProps as _useLinkProps,
  CommonActions,
  useNavigation,
  useNavigationState,
} from "@react-navigation/native";
import { HANDOFF_ACTIVITY_TYPE, WEB_DEPLOYMENT_URL } from "react-native-dotenv";

import {
  ErrorType,
  type ClassCode,
  type RootNavigationParamList,
  type SharedNavigationParamList,
  type ExploreNavigationParamList,
  type SearchNavigationParamList,
  type MeNavigationParamList,
  type RouteNameFor,
  type RouteParamsFor,
  type Settings,
  type StarredClassRecord,
  type ReviewedClassRecord,
  type ClassInfoWithSections,
} from "./types";
import Semester, { type SemesterInfo } from "./semester";
import {
  asyncTryCatch,
  getFullClassCode,
  Route,
  validateSettings,
} from "./utils";
import { getClassWithSections } from "./schedge";
import Database from "../mongodb/db";
import { stringifyRoute } from "../navigation/linking/stringify";
import { selectSemester } from "../redux/actions";

type NavigationProp =
  | StackNavigationProp<ExploreNavigationParamList>
  | StackNavigationProp<SearchNavigationParamList>
  | StackNavigationProp<MeNavigationParamList>
  | StackNavigationProp<SharedNavigationParamList>;

export function useInitialTabName() {
  const tabNavigation = useNavigation<NavigationProp>().getParent();

  const isFocused = useIsFocused();

  const tabState =
    tabNavigation?.getState() as NavigationState<RootNavigationParamList>;

  const [tabName, setTabName] = useState<
    keyof RootNavigationParamList | undefined
  >(undefined);

  useEffect(() => {
    const newTabName = tabState?.routes[tabState.index]?.name;
    if (isFocused && tabState && !tabName && newTabName) {
      setTabName(newTabName);
    }
  }, [tabState]);

  return tabName;
}

export function useThrottle<T extends any[]>(
  f: (...arg: T) => void,
  timeout: number,
  lazy: boolean = false,
  alwaysDelay: boolean = false
) {
  const timeoutId = useRef<ReturnType<typeof setTimeout>>();
  const lastUpdated = useRef<number>(0);

  return useCallback(
    (...arg: T) => {
      if (timeoutId.current) clearTimeout(timeoutId.current);

      const diff = Date.now() - lastUpdated.current;

      timeoutId.current = setTimeout(
        () => {
          lastUpdated.current = Date.now();
          f(...arg);
        },
        diff > timeout && !alwaysDelay
          ? 0
          : lazy || alwaysDelay
          ? timeout
          : timeout - diff
      );
    },
    [timeoutId, lastUpdated, f, timeout, lazy]
  );
}

export function useDelayedTruth(truth: boolean, delay: number = 1000) {
  const [isTrue, setIsTrue] = useState(false);
  const delayedSetIsTrue = useThrottle(setIsTrue, delay, true, truth);

  useEffect(() => {
    if (!truth) {
      setIsTrue(false);
    }
    delayedSetIsTrue(truth);
  }, [truth]);

  return isTrue;
}

export function useHandoff({
  isFocused,
  route,
  title,
  timeout = 300,
  isReady = true,
  isTemporary = false,
}: {
  isFocused: boolean;
  route: ReturnType<typeof Route>;
  title: string;
  timeout?: number;
  isReady?: boolean;
  isTemporary?: boolean;
}) {
  const addUserActivity = useCallback(
    (title: string, url: string, isTemporary: boolean) => {
      asyncTryCatch(async () => {
        if (Platform.OS === "ios" && url)
          await NativeModules.RNHandoffModule?.becomeCurrent({
            activityType: HANDOFF_ACTIVITY_TYPE,
            title,
            webpageURL: url,
            eligibleForSearch: !isTemporary,
            eligibleForHandoff: true,
            eligibleForPrediction: !isTemporary,
            isTemporary,
          });
      });
    },
    []
  );

  const update = useThrottle(addUserActivity, timeout);

  const path = useMemo(() => {
    const { tabName, screenName, screenParams } = route;
    if (tabName && screenName) {
      return stringifyRoute(tabName, screenName, screenParams);
    }
  }, [route.tabName, route.screenName, route.screenParams]);

  useEffect(() => {
    if (isFocused && isReady && path) {
      update(title, WEB_DEPLOYMENT_URL + path, isTemporary);
    }
  }, [isFocused, path, title, isReady, isTemporary]);
}

export function useInitialPreviousRoute() {
  const current = useNavigationState(
    (state) => state.routes[state.index - 1]
  ) as (
    | NavigationState<ExploreNavigationParamList>
    | NavigationState<SearchNavigationParamList>
    | NavigationState<MeNavigationParamList>
  )["routes"][number];

  const isFocused = useIsFocused();

  const [route, setRoute] = useState<typeof current | undefined>(undefined);

  useEffect(() => {
    if (isFocused && !route && current) {
      setRoute(current);
    }
  }, [current]);

  return route;
}

export function useSemester({
  db,
  navigation,
  params,
  settings,
  isSettingsSettled,
  setIsSemesterSettled,
}: {
  db?: Database | null;
  navigation?: NavigationProp;
  params: { semester?: SemesterInfo };
  settings: Settings;
  isSettingsSettled: boolean;
  setIsSemesterSettled: (isSemesterSettled: boolean) => void;
}) {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      navigation &&
      isSettingsSettled &&
      (!params.semester ||
        !Semester.equals(params.semester, settings.selectedSemester))
    ) {
      navigation.setParams({ semester: settings.selectedSemester });
    }
  }, [settings.selectedSemester.semesterCode, settings.selectedSemester.year]);

  useEffect(() => {
    if (isSettingsSettled && isFocused) {
      if (
        params.semester &&
        !Semester.equals(params.semester, settings.selectedSemester)
      ) {
        selectSemester(dispatch)(params.semester);

        asyncTryCatch(async () => {
          if (db && params.semester) {
            await db.updateSettings(
              validateSettings({
                ...settings,
                selectedSemester: params.semester,
              })
            );
          }
        });
      }

      setIsSemesterSettled(true);
    }
  }, [isSettingsSettled, isFocused]);

  useEffect(() => {
    if (isSettingsSettled && navigation && !params.semester) {
      navigation.setParams({
        semester: settings.selectedSemester,
      });
    }
  }, [isSettingsSettled]);

  return params?.semester || settings.selectedSemester;
}

export function useLinkProps<
  Tab extends keyof RootNavigationParamList,
  Screen extends RouteNameFor<Tab>,
  Params extends RouteParamsFor<Tab, Screen>
>(
  {
    tabName,
    screenName,
    screenParams,
    action: _action,
  }: {
    tabName?: Tab;
    screenName?: Screen;
    screenParams?: Params;
    action?: NavigationAction;
  },
  simultaneousAction?: ((...arg: any[]) => void) | null
) {
  const to = useMemo(
    () =>
      (tabName &&
        screenName &&
        stringifyRoute(
          tabName,
          screenName,
          screenParams as RouteParamsFor<Tab, Screen>
        )) ??
      "",
    [tabName, screenName, screenParams]
  );

  const action = useMemo(
    () =>
      screenName &&
      (_action ??
        CommonActions.navigate({
          name: screenName,
          params: screenParams,
        })),
    [screenName, screenParams]
  );

  const { onPress, ...rest } = _useLinkProps({ to, action });

  const handler = useCallback(
    simultaneousAction
      ? (...args: Parameters<typeof onPress>) => {
          onPress(...args);
          simultaneousAction();
        }
      : onPress,
    [onPress, simultaneousAction]
  );

  if (tabName && screenName && to && action) {
    return { onPress: handler, ...rest };
  } else {
    return { onPress: simultaneousAction ?? undefined };
  }
}

export function useIsCurrentRoute(routeKey: string) {
  return useNavigationState(
    ({ index, routes }) =>
      index === routes.length - 1 && routes[index]?.key === routeKey
  );
}

export function useClassInfoLoader(
  {
    classCode,
    semester,
    isSemesterSettled,
    isSettingsSettled,
    starredClassRecord,
    reviewedClassRecord,
  }: {
    classCode: ClassCode;
    semester: SemesterInfo;
    isSemesterSettled: boolean;
    isSettingsSettled: boolean;
    starredClassRecord?: StarredClassRecord | null;
    reviewedClassRecord?: ReviewedClassRecord | null;
  },
  loadSchedule: boolean = false
) {
  const isLoading = useRef(false);
  const [classInfo, setClassInfo] = useState<ClassInfoWithSections | null>(
    () => {
      const name = classCode.name;
      if (typeof name === "string" && !loadSchedule) {
        return {
          ...classCode,
          name,
          description: classCode.description ?? "",
          sections: [],
        };
      }
      return null;
    }
  );
  const [loadedSemester, setLoadedSemester] = useState(semester);
  const [scheduleLoaded, setScheduleLoaded] = useState(false);
  const [classInfoError, setClassInfoError] = useState<ErrorType | null>(null);
  const loadFromStarredReviewed = useCallback(() => {
    if (starredClassRecord) {
      const starredClass = starredClassRecord[getFullClassCode(classCode)];
      if (starredClass) {
        setClassInfo({
          ...classCode,
          name: starredClass.name,
          description: starredClass.description,
          sections: [],
        });
        return true;
      }
    }
    if (reviewedClassRecord) {
      const reviewedClass = reviewedClassRecord[getFullClassCode(classCode)];
      if (reviewedClass) {
        setClassInfo({
          ...classCode,
          name: reviewedClass.name,
          description: reviewedClass.description,
          sections: [],
        });
        return true;
      }
    }

    return false;
  }, [starredClassRecord, reviewedClassRecord, classCode]);

  const loadClass = useCallback(
    (failSilently: boolean = false) => {
      isLoading.current = true;

      getClassWithSections(classCode, semester)
        .then((classInfo) => {
          if (classInfo) {
            if (!loadSchedule) {
              classInfo.sections = [];
            }
            setClassInfo(classInfo);
            setScheduleLoaded(true);
            setClassInfoError(null);
          } else if (loadFromStarredReviewed()) {
            setClassInfoError(null);
          } else if (isSettingsSettled) {
            setClassInfo(null);
            setClassInfoError(ErrorType.noData);
          } else {
            setClassInfo(null);
          }
        })
        .catch((e) => {
          console.error(e);
          setClassInfo(null);
          if (!failSilently) setClassInfoError(ErrorType.network);
        })
        .finally(() => (isLoading.current = false));
    },
    [
      classCode,
      semester,
      loadFromStarredReviewed,
      isSettingsSettled,
      loadSchedule,
    ]
  );

  const needsReload = useMemo(() => {
    if (!classInfo) return false;
    return (
      classInfo.schoolCode !== classCode.schoolCode ||
      classInfo.departmentCode !== classCode.departmentCode ||
      classInfo.classNumber !== classCode.classNumber
    );
  }, [classInfo, classCode]);

  const hasSemesterChanged = useMemo(
    () => !Semester.equals(semester, loadedSemester),
    [semester, loadedSemester]
  );

  useEffect(() => {
    const name = classInfo?.name ?? classCode.name;
    if (
      typeof name === "string" &&
      !needsReload &&
      (!loadSchedule || (scheduleLoaded && !hasSemesterChanged))
    ) {
      if (name !== classInfo?.name) {
        setClassInfo({
          ...classCode,
          name,
          description: classInfo?.description ?? classCode.description ?? "",
          sections: classInfo?.sections ?? [],
        });
      }
    } else if (
      isSemesterSettled &&
      (!classInfo || needsReload || (loadSchedule && hasSemesterChanged))
    ) {
      setLoadedSemester(semester);
      setScheduleLoaded(false);
      loadClass();
    }
  }, [
    classCode,
    semester.semesterCode,
    semester.year,
    isSemesterSettled,
    isSettingsSettled,
    needsReload,
  ]);

  const reloadClassInfo =
    !classInfo && !isLoading.current && classInfoError === ErrorType.network
      ? loadClass
      : undefined;

  return { classInfo, classInfoError, scheduleLoaded, reloadClassInfo };
}

export function useAppState() {
  const [appState, setAppState] = useState(() => AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (appState) =>
      setAppState(appState)
    );

    return () => sub.remove();
  }, []);

  return appState;
}

export function useRefresh(
  callback: ((reason: "AppState" | "NetInfo") => void) | undefined
) {
  const appState = useAppState();
  const { isInternetReachable } = useNetInfo();

  useEffect(() => {
    if (callback && appState === "active") callback("AppState");
  }, [appState]);

  useEffect(() => {
    if (callback && isInternetReachable) callback("NetInfo");
  }, [isInternetReachable]);
}

export function useColorScheme() {
  const current = _useColorScheme();
  const appState = useAppState();
  const [colorScheme, setColorScheme] = useState(current);

  useEffect(() => setColorScheme(current), [current]);

  useEffect(() => {
    if (Platform.OS === "web") {
      const updateColorScheme = () =>
        setColorScheme(Appearance.getColorScheme());

      window.addEventListener("focus", updateColorScheme);

      return () => window.removeEventListener("focus", updateColorScheme);
    }
  });

  useEffect(() => {
    setColorScheme(Appearance.getColorScheme());
  }, [appState]);

  return colorScheme;
}

export function useIsCatalyst() {
  const isCatalyst = useMemo(
    () =>
      Platform.OS === "ios" &&
      (!/^(?:phone|pad)$/i.test(Platform.constants.interfaceIdiom) ||
        (!Platform.isPad && /pad/i.test(Platform.constants.systemName))),
    []
  );

  return isCatalyst;
}

export function useDimensions() {
  const isCatalyst = useIsCatalyst();

  const dimensionsHook = useCallback(
    isCatalyst ? useSafeAreaFrame : useWindowDimensions,
    []
  );

  return dimensionsHook();
}

export function useInnerHeight() {
  const { height } = useDimensions();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();

  const [cachedHeight, setCachedHeight] = useState(height);
  const [cachedHeaderHeight, setCachedHeaderHeight] = useState(headerHeight);
  const [cachedTabBarHeight, setCachedTabBarHeight] = useState(tabBarHeight);

  useEffect(() => {
    if (height) setCachedHeight(height);
  }, [height]);

  useEffect(() => {
    if (headerHeight) setCachedHeaderHeight(headerHeight);
  }, [headerHeight]);

  useEffect(() => {
    if (tabBarHeight) setCachedTabBarHeight(tabBarHeight);
  }, [tabBarHeight]);

  return cachedHeight - cachedHeaderHeight - cachedTabBarHeight;
}

export const useKeyboardHeight = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    function onKeyboardChange(e: KeyboardEvent) {
      setKeyboardHeight(e.endCoordinates.height);
    }

    function onKeyboardHide(e: KeyboardEvent) {
      setKeyboardHeight(0);
    }
    function onKeyboardShow(e: KeyboardEvent) {
      setKeyboardHeight(e.endCoordinates.height);
    }

    const subscriptions =
      Platform.OS === "ios"
        ? [
            Keyboard.addListener("keyboardWillChangeFrame", onKeyboardChange),
            Keyboard.addListener("keyboardWillHide", onKeyboardHide),
            Keyboard.addListener("keyboardWillShow", onKeyboardShow),
          ]
        : [
            Keyboard.addListener("keyboardDidHide", onKeyboardHide),
            Keyboard.addListener("keyboardDidShow", onKeyboardShow),
          ];

    return () =>
      subscriptions.forEach((subscription) => {
        subscription.remove();
      });
  }, [setKeyboardHeight]);

  return keyboardHeight;
};
