import {
  getPathFromState,
  getStateFromPath,
  LinkingOptions,
} from "@react-navigation/native";

import {
  RootNavigationParamList,
  ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
  ClassInfo,
  StarredOrReviewed,
} from "../../libs/types";

type RouteToPathMap<ParamList> = {
  [Screen in keyof ParamList]: (param: ParamList[Screen]) => string;
};

const getPathForClass = (classInfo: ClassInfo) =>
  `${classInfo.schoolCode}/${classInfo.departmentCode}/${classInfo.classNumber}`;

const addQueryParam = (query: string | undefined) =>
  query ? `?query=${encodeURIComponent(query)}` : "";

const checkStarredOrReviewed = (
  starredOrReviewed: StarredOrReviewed | undefined
) => starredOrReviewed?.toLowerCase() || "starred";

const exploreRouteToPath: RouteToPathMap<ExploreNavigationParamList> = {
  University: () => "explore",
  School: ({ schoolCode }) => `explore/${schoolCode}`,
  Department: ({ schoolCode, departmentCode }) =>
    `explore/${schoolCode}/${departmentCode}`,
  Detail: ({ classInfo }) => `explore/${getPathForClass(classInfo)}`,
  Review: ({ classInfo }) => `explore/${getPathForClass(classInfo)}/review`,
  Schedule: ({ classInfo }) => `explore/${getPathForClass(classInfo)}/schedule`,
  SignInSignUp: ({ classInfo, isSigningUp }) =>
    classInfo
      ? `explore/${getPathForClass(classInfo)}/${
          isSigningUp ? "sign-up" : "sign-in"
        }`
      : isSigningUp
      ? "sign-up"
      : "sign-in",
};

const searchRouteToPath: RouteToPathMap<SearchNavigationParamList> = {
  Search: ({ query }) => "search" + addQueryParam(query),
  Detail: ({ classInfo, query }) =>
    `search/${getPathForClass(classInfo)}` + addQueryParam(query),
  Review: ({ classInfo, query }) =>
    `search/${getPathForClass(classInfo)}/review` + addQueryParam(query),
  Schedule: ({ classInfo, query }) =>
    `search/${getPathForClass(classInfo)}/schedule` + addQueryParam(query),
  SignInSignUp: ({ classInfo, isSigningUp, query }) =>
    classInfo
      ? `search/${getPathForClass(classInfo)}/${
          isSigningUp ? "sign-up" : "sign-in"
        }` + addQueryParam(query)
      : isSigningUp
      ? "sign-up"
      : "sign-in",
};

const meRouteToPath: RouteToPathMap<MeNavigationParamList> = {
  Account: () => "account",
  Starred: () => "starred",
  Reviewed: () => "reviewed",
  Settings: () => "settings",
  Detail: ({ classInfo, starredOrReviewed }) =>
    `${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
      classInfo
    )}`,
  Review: ({ classInfo, starredOrReviewed }) =>
    `${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
      classInfo
    )}/review`,
  Schedule: ({ classInfo, starredOrReviewed }) =>
    `${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
      classInfo
    )}/schedule`,
  SignInSignUp: ({ classInfo, isSigningUp, starredOrReviewed }) =>
    classInfo
      ? `${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
          classInfo
        )}/${isSigningUp ? "sign-up" : "sign-in"}`
      : isSigningUp
      ? "sign-up"
      : "sign-in",
};

const linking: LinkingOptions<RootNavigationParamList> = {
  prefixes: [
    "rate-my-classes-pro://",
    "https://rate-my-classes-pro.netlify.app/",
  ],
  getPathFromState(tabState, options) {
    // console.log(tabState);

    const path = getPathFromState(tabState, options); //.replace(/\?.*$/, "");

    // const { index: tabIndex, routes: tabRoutes } = tabState;

    // if (typeof tabIndex === "number" && tabRoutes) {
    //   const { name: tabName, state: stackState } = tabRoutes[tabIndex] ?? {};

    //   if (tabName && stackState) {
    //     const { index: stackIndex, routes: stackRoutes } = stackState;

    //     if (typeof stackIndex === "number" && stackRoutes) {
    //       const { name: screenName, params: screenParams } =
    //         stackRoutes[stackIndex] ?? {};

    //       if (screenName) {
    //         switch (tabName as keyof RootNavigationParamList) {
    //           case "ExploreTab":
    //             const exploreMapper = exploreRouteToPath[
    //               screenName as keyof ExploreNavigationParamList
    //             ] as (params: typeof screenParams) => string;
    //             return exploreMapper(screenParams);
    //           case "SearchTab":
    //             const searchMapper = searchRouteToPath[
    //               screenName as keyof SearchNavigationParamList
    //             ] as (params: typeof screenParams) => string;
    //             return searchMapper(screenParams);
    //           case "MeTab":
    //             const meMapper = meRouteToPath[
    //               screenName as keyof MeNavigationParamList
    //             ] as (params: typeof screenParams) => string;
    //             return meMapper(screenParams);
    //         }
    //       }
    //     }
    //   }
    // }

    return path;
  },
  getStateFromPath(path, options) {
    const [route, queryParam] = path.split(/\?/);

    const routes = route.split(/\//).filter(Boolean);

    const state = getStateFromPath(path, options);
    console.log(routes, queryParam, state);

    return state;
  },
};

export default linking;
