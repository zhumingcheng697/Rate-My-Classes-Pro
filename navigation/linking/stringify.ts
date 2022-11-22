import type { NavigationState, ParamListBase } from "@react-navigation/native";

import type {
  RootNavigationParamList,
  ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
  ClassCode,
  StarredOrReviewed,
  NavigationParamListFor,
  RouteNameFor,
  RouteParamsFor,
  ValueOf,
  PendingReview,
} from "../../libs/types";
import type { SemesterInfo } from "../../libs/semester";
import { getFullSemesterCode, tryCatch } from "../../libs/utils";

type RouteToPathMap<ParamList extends ParamListBase> = {
  [Screen in keyof ParamList]: (param: ParamList[Screen]) => string;
};

const getPathForClass = (classCode: ClassCode) =>
  `${encodeURIComponent(
    classCode.schoolCode.toUpperCase()
  )}/${encodeURIComponent(
    classCode.departmentCode.toUpperCase()
  )}/${encodeURIComponent(classCode.classNumber.toUpperCase())}`;

const addQueryParam = ({
  query,
  semester,
  pendingReview,
}: {
  query?: string;
  semester?: SemesterInfo;
  pendingReview?: PendingReview;
}) => {
  const queryStr = query && `query=${encodeURIComponent(query)}`;
  const semesterStr = semester && `semester=${getFullSemesterCode(semester)}`;
  const reviewStr =
    pendingReview &&
    Object.keys(pendingReview)
      .map((e) => {
        const val =
          e === "semester"
            ? pendingReview.semester
              ? getFullSemesterCode(pendingReview.semester)
              : undefined
            : pendingReview[e as Exclude<keyof PendingReview, "semester">];
        return val
          ? `${e === "semester" ? "for" : e}=${encodeURIComponent(val)}`
          : "";
      })
      .filter(Boolean)
      .join("&");

  if (queryStr || semesterStr || reviewStr) {
    return "?" + [queryStr, semesterStr, reviewStr].filter(Boolean).join("&");
  }

  return "";
};

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
    School: ({ schoolInfo, semester }) =>
      `/explore/${schoolInfo.schoolCode.toUpperCase()}` +
      addQueryParam({ semester }),
    Department: ({ departmentInfo, semester }) =>
      `/explore/${departmentInfo.schoolCode.toUpperCase()}/${departmentInfo.departmentCode.toUpperCase()}` +
      addQueryParam({ semester }),
    Detail: ({ classCode, semester }) =>
      `/explore/${getPathForClass(classCode)}` + addQueryParam({ semester }),
    Review: ({ classCode, semester, pendingReview }) =>
      `/explore/${getPathForClass(classCode)}/review` +
      addQueryParam({ semester, pendingReview }),
    Schedule: ({ classCode, semester }) =>
      `/explore/${getPathForClass(classCode)}/schedule` +
      addQueryParam({ semester }),
    SignInSignUp: ({ classCode, isSigningUp, semester }) =>
      classCode
        ? `/explore/${getPathForClass(classCode)}/${checkIsSigningUp(
            isSigningUp
          )}` + addQueryParam({ semester })
        : `/${checkIsSigningUp(isSigningUp)}`,
  };

  return exploreRouteToPathMap[screen](params);
}

function stringifySearchRoute<Screen extends keyof SearchNavigationParamList>(
  screen: Screen,
  params: SearchNavigationParamList[Screen]
) {
  const searchRouteToPathMap: RouteToPathMap<SearchNavigationParamList> = {
    Search: ({ query, semester }) =>
      "/search" + (query ? addQueryParam({ query, semester }) : ""),
    Detail: ({ classCode, query, semester }) =>
      `/search/${getPathForClass(classCode)}` +
      addQueryParam({ query, semester }),
    Review: ({ classCode, query, semester, pendingReview }) =>
      `/search/${getPathForClass(classCode)}/review` +
      addQueryParam({ query, semester, pendingReview }),
    Schedule: ({ classCode, query, semester }) =>
      `/search/${getPathForClass(classCode)}/schedule` +
      addQueryParam({ query, semester }),
    SignInSignUp: ({ classCode, isSigningUp, query, semester }) =>
      classCode
        ? `/search/${getPathForClass(classCode)}/${checkIsSigningUp(
            isSigningUp
          )}` + addQueryParam({ query, semester })
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
    Detail: ({ classCode, starredOrReviewed, semester }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classCode
      )}` + addQueryParam({ semester }),
    Review: ({ classCode, starredOrReviewed, semester, pendingReview }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classCode
      )}/review` + addQueryParam({ semester, pendingReview }),
    Schedule: ({ classCode, starredOrReviewed, semester }) =>
      `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
        classCode
      )}/schedule` + addQueryParam({ semester }),
    SignInSignUp: ({ classCode, isSigningUp, starredOrReviewed, semester }) =>
      classCode
        ? `/${checkStarredOrReviewed(starredOrReviewed)}/${getPathForClass(
            classCode
          )}/${checkIsSigningUp(isSigningUp)}` + addQueryParam({ semester })
        : `/${checkIsSigningUp(isSigningUp)}`,
  };

  return meRouteToPathMap[screen](params);
}

export function flattenRoute(
  tabState?: NavigationState<RootNavigationParamList>
) {
  const { index: tabIndex, routes: tabRoutes } = tabState ?? {};

  if (typeof tabIndex === "number" && tabRoutes) {
    const { name: tabName, state: stackState } = tabRoutes[tabIndex] ?? {};

    if (tabName && stackState) {
      const { index: stackIndex, routes: stackRoutes } = stackState as
        | NavigationState<ExploreNavigationParamList>
        | NavigationState<SearchNavigationParamList>
        | NavigationState<MeNavigationParamList>;

      if (typeof stackIndex === "number" && stackRoutes) {
        const { name: screenName, params: screenParams } =
          stackRoutes[stackIndex] ?? {};

        if (screenName) {
          return { tabName, screenName, screenParams };
        }
      }
    }

    return { tabName };
  }
}

export function stringifyRoute<
  Tab extends keyof RootNavigationParamList,
  Screen extends RouteNameFor<Tab>,
  Params extends RouteParamsFor<Tab, Screen>
>(tabName: Tab, screenName: Screen, params: Params) {
  const rootRouteToPathMap: {
    [T in keyof RootNavigationParamList]: (
      screen: keyof NavigationParamListFor<T>,
      params: ValueOf<NavigationParamListFor<T>>
    ) => string;
  } = {
    ExploreTab: stringifyExploreRoute,
    SearchTab: stringifySearchRoute,
    MeTab: stringifyMeRoute,
  };

  return tryCatch(() =>
    rootRouteToPathMap[tabName](
      screenName as keyof NavigationParamListFor<Tab>,
      params as ValueOf<NavigationParamListFor<Tab>>
    )
  );
}

export default function stringify(
  tabState: NavigationState<RootNavigationParamList>
) {
  const route = flattenRoute(tabState);

  const baseRoutePathMap: Record<keyof RootNavigationParamList, string> = {
    ExploreTab: "/explore",
    SearchTab: "/search",
    MeTab: "/account",
  };

  if (route) {
    const { tabName, screenName, screenParams } = route;
    if (tabName) {
      if (screenName) {
        return stringifyRoute(tabName, screenName, screenParams) ?? "";
      }
      return baseRoutePathMap[tabName];
    }
  }

  return "";
}
