import { ParamListBase } from "@react-navigation/native";

import type {
  RootNavigationParamList,
  ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
  ClassInfo,
  StarredOrReviewed,
  NavigationParamListForTab,
  ValueOf,
} from "../../libs/types";

type RouteToPathMap<ParamList extends ParamListBase> = {
  [Screen in keyof ParamList]: (param: ParamList[Screen]) => string;
};

const getPathForClass = (classInfo: ClassInfo) =>
  `${encodeURIComponent(
    classInfo.schoolCode.toUpperCase()
  )}/${encodeURIComponent(
    classInfo.departmentCode.toUpperCase()
  )}/${encodeURIComponent(classInfo.classNumber.toUpperCase())}`;

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
    Detail: ({ classInfo }) => `/explore/${getPathForClass(classInfo)}`,
    Review: ({ classInfo }) => `/explore/${getPathForClass(classInfo)}/review`,
    Schedule: ({ classInfo }) =>
      `/explore/${getPathForClass(classInfo)}/schedule`,
    SignInSignUp: ({ classInfo, isSigningUp }) =>
      classInfo
        ? `/explore/${getPathForClass(classInfo)}/${checkIsSigningUp(
            isSigningUp
          )}`
        : checkIsSigningUp(isSigningUp),
  };

  return exploreRouteToPathMap[screen](params);
}

function stringifySearchRoute<Screen extends keyof SearchNavigationParamList>(
  screen: Screen,
  params: SearchNavigationParamList[Screen]
) {
  const searchRouteToPathMap: RouteToPathMap<SearchNavigationParamList> = {
    Search: ({ query }) => "/search" + addQueryParam(query),
    Detail: ({ classInfo, query }) =>
      `/search/${getPathForClass(classInfo)}` + addQueryParam(query),
    Review: ({ classInfo, query }) =>
      `/search/${getPathForClass(classInfo)}/review` + addQueryParam(query),
    Schedule: ({ classInfo, query }) =>
      `/search/${getPathForClass(classInfo)}/schedule` + addQueryParam(query),
    SignInSignUp: ({ classInfo, isSigningUp, query }) =>
      classInfo
        ? `/search/${getPathForClass(classInfo)}/${checkIsSigningUp(
            isSigningUp
          )}` + addQueryParam(query)
        : checkIsSigningUp(isSigningUp),
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
    Detail: ({ classInfo, starredOrReviewed }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classInfo
      )}`,
    Review: ({ classInfo, starredOrReviewed }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classInfo
      )}/review`,
    Schedule: ({ classInfo, starredOrReviewed }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classInfo
      )}/schedule`,
    SignInSignUp: ({ classInfo, isSigningUp, starredOrReviewed }) =>
      classInfo
        ? `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
            classInfo
          )}/${checkIsSigningUp(isSigningUp)}`
        : checkIsSigningUp(isSigningUp),
  };

  return meRouteToPathMap[screen](params);
}

export default function stringnify<
  Tab extends keyof RootNavigationParamList,
  Screen extends keyof NavigationParamListForTab<Tab>,
  Params extends NavigationParamListForTab<Tab>[Screen]
>(tabName: Tab, screenName: Screen, params: Params) {
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

  return rootRouteToPathMap[tabName](screenName, params);
}
