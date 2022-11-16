import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  useWindowDimensions,
  Platform,
  AppState,
  Appearance,
  useColorScheme as _useColorScheme,
  Keyboard,
  type KeyboardEvent,
  type EmitterSubscription,
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
  type RouteProp,
} from "@react-navigation/native";

import {
  ErrorType,
  type ClassCode,
  type ClassInfo,
  type RootNavigationParamList,
  type ExploreNavigationParamList,
  type SharedNavigationParamList,
  type SearchNavigationParamList,
  type MeNavigationParamList,
  type RouteNameFor,
  type RouteParamsFor,
  type Settings,
  type StarredClassRecord,
  type ReviewedClassRecord,
} from "./types";
import Semester, { type SemesterInfo } from "./semester";
import { asyncTryCatch, getFullClassCode, validateSettings } from "./utils";
import { getClass } from "./schedge";
import Database from "../mongodb/db";
import { stringifyRoute } from "../navigation/linking/stringify";
import { selectSemester } from "../redux/actions";

export function useInitialTabName() {
  const tabNavigation = useNavigation<
    | StackNavigationProp<ExploreNavigationParamList>
    | StackNavigationProp<SearchNavigationParamList>
    | StackNavigationProp<MeNavigationParamList>
  >().getParent();

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
}: {
  db?: Database | null;
  navigation?: StackNavigationProp<SharedNavigationParamList>;
  params: RouteProp<SharedNavigationParamList>["params"];
  settings: Settings;
  isSettingsSettled: boolean;
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
    if (
      isSettingsSettled &&
      isFocused &&
      params.semester &&
      !Semester.equals(params.semester, settings.selectedSemester)
    ) {
      selectSemester(dispatch)(params.semester);

      asyncTryCatch(async () => {
        if (db && params.semester) {
          await db.updateSettings(
            validateSettings({ ...settings, selectedSemester: params.semester })
          );
        }
      });
    }
  }, [isSettingsSettled, isFocused]);

  useEffect(() => {
    if (isSettingsSettled && navigation && !params.semester) {
      navigation.setParams({
        semester: settings.selectedSemester,
      });
    }
  }, [isSettingsSettled]);

  return params.semester || settings.selectedSemester;
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
  const routeIndex = useNavigationState((state) => state.index);
  const routes = useNavigationState((state) => state.routes);

  return (
    routeIndex === routes.length - 1 && routes[routeIndex]?.key === routeKey
  );
}

export function useClassInfoLoader({
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
}) {
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(() => {
    const name = classCode.name;
    if (typeof name === "string") {
      return {
        ...classCode,
        name,
        description: classCode.description ?? "",
      };
    }
    return null;
  });
  const [classInfoError, setClassInfoError] = useState<ErrorType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadFromStarredReviewed = useCallback(() => {
    if (starredClassRecord) {
      const starredClass = starredClassRecord[getFullClassCode(classCode)];
      if (starredClass) {
        setClassInfo({
          ...classCode,
          name: starredClass.name,
          description: starredClass.description,
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
        });
        return true;
      }
    }

    return false;
  }, [starredClassRecord, reviewedClassRecord, classCode]);

  const loadClass = useCallback(
    (failSilently: boolean = false) => {
      setIsLoading(true);
      getClass(classCode, semester)
        .then((classInfo) => {
          if (classInfo) {
            setClassInfo(classInfo);
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
        .finally(() => setIsLoading(false));
    },
    [classCode, semester, loadFromStarredReviewed, isSettingsSettled]
  );

  const needsReload = useMemo(() => {
    if (!classInfo) return false;
    return (
      classInfo.schoolCode !== classCode.schoolCode ||
      classInfo.departmentCode !== classCode.departmentCode ||
      classInfo.classNumber !== classCode.classNumber
    );
  }, [classInfo, classCode]);

  useEffect(() => {
    const name = classInfo?.name ?? classCode.name;
    if (typeof name === "string" && !needsReload) {
      if (name !== classInfo?.name) {
        setClassInfo({
          ...classCode,
          name,
          description: classInfo?.description ?? classCode.description ?? "",
        });
      }
    } else if (isSemesterSettled && (!classInfo || needsReload)) {
      loadClass();
    }
  }, [classCode, semester, isSemesterSettled, isSettingsSettled, needsReload]);

  const reloadClassInfo =
    !classInfo && !isLoading && classInfoError === ErrorType.network
      ? loadClass
      : undefined;

  return { classInfo, classInfoError, reloadClassInfo };
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
  const { height } = useDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const subscriptions = useRef<EmitterSubscription[]>([]);

  useEffect(() => {
    function onKeyboardChange(e: KeyboardEvent) {
      console.log(e);

      if (e.startCoordinates) {
        setKeyboardHeight(height - e.endCoordinates.screenY);
      } else {
        setKeyboardHeight(0);
      }
    }

    if (Platform.OS === "ios") {
      subscriptions.current = [
        Keyboard.addListener("keyboardWillChangeFrame", onKeyboardChange),
      ];
    } else {
      subscriptions.current = [
        Keyboard.addListener("keyboardDidHide", onKeyboardChange),
        Keyboard.addListener("keyboardDidShow", onKeyboardChange),
      ];
    }
    return () =>
      subscriptions.current.forEach((subscription) => {
        subscription.remove();
      });
  }, [setKeyboardHeight, subscriptions, height]);

  return keyboardHeight;
};
