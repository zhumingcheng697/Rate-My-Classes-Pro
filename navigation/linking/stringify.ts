import type { NavigationState, ParamListBase } from "@react-navigation/native";

import type {
  RootNavigationParamList,
  ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
  StackNavigationParamList,
  ClassCode,
  StarredOrReviewed,
  NavigationParamListForTab,
  ValueOf,
} from "../../libs/types";

type RouteToPathMap<ParamList extends ParamListBase> = {
  [Screen in keyof ParamList]: (param: ParamList[Screen]) => string;
};

const getPathForClass = (classCode: ClassCode) =>
  `${encodeURIComponent(
    classCode.schoolCode.toUpperCase()
  )}/${encodeURIComponent(
    classCode.departmentCode.toUpperCase()
  )}/${encodeURIComponent(classCode.classNumber.toUpperCase())}`;

const addQueryParam = (query: string | undefined) =>
  query ? `?query=${encodeURIComponent(query)}` : "";

const checkIsSigningUp = (isSigningUp?: boolean) =>
  isSigningUp ? "sign-up" : "sign-in";

const checkStarredOrReviewed = (
  starredOrReviewed: StarredOrReviewed | undefined
) => starredOrReviewed?.toLowerCase() || "starred";

function stringifyExploreRoute<Screen extends keyof ExploreNavigationParamList>(
  screen: Screen,
  params: ExploreNavigationParamList[Screen]
) {
  const exploreRouteToPathMap: RouteToPathMap<ExploreNavigationParamList> = {
    University: () => "/explore",
    School: ({ schoolCode }) => `/explore/${schoolCode.toUpperCase()}`,
    Department: ({ schoolCode, departmentCode }) =>
      `/explore/${schoolCode.toUpperCase()}/${departmentCode.toUpperCase()}`,
    Detail: ({ classCode }) => `/explore/${getPathForClass(classCode)}`,
    Review: ({ classCode }) => `/explore/${getPathForClass(classCode)}/review`,
    Schedule: ({ classCode }) =>
      `/explore/${getPathForClass(classCode)}/schedule`,
    SignInSignUp: ({ classCode, isSigningUp }) =>
      classCode
        ? `/explore/${getPathForClass(classCode)}/${checkIsSigningUp(
            isSigningUp
          )}`
        : `/${checkIsSigningUp(isSigningUp)}`,
  };

  return exploreRouteToPathMap[screen](params);
}

function stringifySearchRoute<Screen extends keyof SearchNavigationParamList>(
  screen: Screen,
  params: SearchNavigationParamList[Screen]
) {
  const searchRouteToPathMap: RouteToPathMap<SearchNavigationParamList> = {
    Search: ({ query }) => "/search" + addQueryParam(query),
    Detail: ({ classCode, query }) =>
      `/search/${getPathForClass(classCode)}` + addQueryParam(query),
    Review: ({ classCode, query }) =>
      `/search/${getPathForClass(classCode)}/review` + addQueryParam(query),
    Schedule: ({ classCode, query }) =>
      `/search/${getPathForClass(classCode)}/schedule` + addQueryParam(query),
    SignInSignUp: ({ classCode, isSigningUp, query }) =>
      classCode
        ? `/search/${getPathForClass(classCode)}/${checkIsSigningUp(
            isSigningUp
          )}` + addQueryParam(query)
        : `/${checkIsSigningUp(isSigningUp)}`,
  };

  return searchRouteToPathMap[screen](params);
}

function stringifyMeRoute<Screen extends keyof MeNavigationParamList>(
  screen: Screen,
  params: MeNavigationParamList[Screen]
) {
  const meRouteToPathMap: RouteToPathMap<MeNavigationParamList> = {
    Account: () => "/account",
    Starred: () => "/starred",
    Reviewed: () => "/reviewed",
    Settings: () => "/settings",
    Detail: ({ classCode, starredOrReviewed }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classCode
      )}`,
    Review: ({ classCode, starredOrReviewed }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classCode
      )}/review`,
    Schedule: ({ classCode, starredOrReviewed }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classCode
      )}/schedule`,
    SignInSignUp: ({ classCode, isSigningUp, starredOrReviewed }) =>
      classCode
        ? `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
            classCode
          )}/${checkIsSigningUp(isSigningUp)}`
        : `/${checkIsSigningUp(isSigningUp)}`,
  };

  return meRouteToPathMap[screen](params);
}

export default function stringnify(
  tabState: NavigationState<RootNavigationParamList>
) {
  const rootRouteToPathMap: {
    [T in keyof RootNavigationParamList]: (
      screen: keyof NavigationParamListForTab<T>,
      params: ValueOf<NavigationParamListForTab<T>>
    ) => string;
  } = {
    ExploreTab: stringifyExploreRoute,
    SearchTab: stringifySearchRoute,
    MeTab: stringifyMeRoute,
  };

  const { index: tabIndex, routes: tabRoutes } = tabState;

  if (typeof tabIndex === "number" && tabRoutes) {
    const { name: tabName, state: stackState } = tabRoutes[tabIndex] ?? {};

    if (tabName && stackState) {
      const { index: stackIndex, routes: stackRoutes } =
        stackState as NavigationState<StackNavigationParamList>;

      if (typeof stackIndex === "number" && stackRoutes) {
        const { name: screenName, params: screenParams } =
          stackRoutes[stackIndex] ?? {};

        if (screenName) {
          return rootRouteToPathMap[tabName](screenName, screenParams);
        }
      }
    }
  }

  return "/explore";
}
