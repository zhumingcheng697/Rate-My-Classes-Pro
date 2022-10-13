import type {
  NavigationState,
  ParamListBase,
  PartialRoute,
  PartialState,
  Route,
} from "@react-navigation/native";

import type {
  ClassCode,
  RootNavigationParamList,
  SharedNavigationParamList,
  ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
  StarredOrReviewed,
  NavigationParamListFor,
} from "../../libs/types";

type PathToRouteMap<ParamList extends ParamListBase> = {
  [Screen in keyof ParamList]: (
    paths: string[],
    params: Record<string, string>
  ) => PartialRoute<
    Route<
      Screen extends string
        ? Screen
        : NavigationState<ParamList>["routeNames"][number],
      ParamList[Screen]
    >
  >;
};

type ResultState<ParamList extends ParamListBase> = PartialState<
  NavigationState<ParamList>
>;

type ResultRoute<ParamList extends ParamListBase> =
  ResultState<ParamList>["routes"][number];

const firstMePathToFirstScreenNamesMap: Record<
  string,
  (keyof MeNavigationParamList)[]
> = {
  ["account"]: ["Account"],
  ["starred"]: ["Account", "Starred"],
  ["reviewed"]: ["Account", "Reviewed"],
  ["settings"]: ["Account", "Settings"],
  ["sign-up"]: ["Account", "SignInSignUp"],
  ["sign-in"]: ["Account", "SignInSignUp"],
};

const lastPathToScreenNameMap: Record<string, keyof SharedNavigationParamList> =
  {
    ["review"]: "Review",
    ["schedule"]: "Schedule",
    ["sign-up"]: "SignInSignUp",
    ["sign-in"]: "SignInSignUp",
  };

const getClassFromPaths = (paths: string[]): ClassCode => ({
  schoolCode: paths[1].toUpperCase(),
  departmentCode: paths[2].toUpperCase(),
  classNumber: paths[3].toUpperCase(),
});

const checkIsSigningUp = (paths: string[]) =>
  paths[paths.length - 1] === "sign-up";

const checkStarredOrReviewed = (paths: string[]): StarredOrReviewed =>
  paths[0]?.toLowerCase() === "reviewed" ? "Reviewed" : "Starred";

function parseExplorePath(
  paths: string[],
  params: Record<string, string>
): ResultRoute<ExploreNavigationParamList>[] {
  const explorePathToRouteMap: PathToRouteMap<ExploreNavigationParamList> = {
    University: () => ({ name: "University" }),
    School: (paths) => ({
      name: "School",
      params: { schoolCode: paths[1].toUpperCase() },
    }),
    Department: (paths) => ({
      name: "Department",
      params: {
        schoolCode: paths[1].toUpperCase(),
        departmentCode: paths[2].toUpperCase(),
      },
    }),
    Detail: (paths) => ({
      name: "Detail",
      params: { classCode: getClassFromPaths(paths) },
    }),
    Review: (paths) => ({
      name: "Review",
      params: { classCode: getClassFromPaths(paths) },
    }),
    Schedule: (paths) => ({
      name: "Schedule",
      params: {
        classCode: getClassFromPaths(paths),
      },
    }),
    SignInSignUp: (paths) => ({
      name: "SignInSignUp",
      params: {
        classCode: getClassFromPaths(paths),
        isSigningUp: checkIsSigningUp(paths),
      },
    }),
  };

  const pathsLengthToScreenNamesMap: Record<
    number,
    (keyof ExploreNavigationParamList)[]
  > = {
    [0]: ["University"],
    [1]: ["University"],
    [2]: ["University", "School"],
    [3]: ["University", "School", "Department"],
    [4]: ["University", "School", "Department", "Detail"],
  };

  let screenNames: (keyof ExploreNavigationParamList)[];

  const lastPath = paths[4]?.toLowerCase();
  if (lastPath in lastPathToScreenNameMap) {
    screenNames = [
      ...pathsLengthToScreenNamesMap[4],
      lastPathToScreenNameMap[lastPath],
    ];
  } else {
    screenNames = pathsLengthToScreenNamesMap[Math.min(paths.length, 4)];
  }

  return screenNames.map((screenName) =>
    explorePathToRouteMap[screenName](paths, params)
  );
}

function parseSearchPath(
  paths: string[],
  params: Record<string, string>
): ResultRoute<SearchNavigationParamList>[] {
  const searchPathtoRouteMap: PathToRouteMap<SearchNavigationParamList> = {
    Search: (_, { query }) => ({ name: "Search", params: { query } }),
    Detail: (paths, { query }) => ({
      name: "Detail",
      params: { classCode: getClassFromPaths(paths), query },
    }),
    Review: (paths, { query }) => ({
      name: "Review",
      params: { classCode: getClassFromPaths(paths), query },
    }),
    Schedule: (paths, { query }) => ({
      name: "Schedule",
      params: {
        classCode: getClassFromPaths(paths),
        query,
      },
    }),
    SignInSignUp: (paths, { query }) => ({
      name: "SignInSignUp",
      params: {
        classCode: getClassFromPaths(paths),
        query,
        isSigningUp: checkIsSigningUp(paths),
      },
    }),
  };

  let screenNames: (keyof SearchNavigationParamList)[];

  const lastPath = paths[4]?.toLowerCase();
  if (lastPath in lastPathToScreenNameMap) {
    screenNames = ["Search", "Detail", lastPathToScreenNameMap[lastPath]];
  } else if (paths.length >= 4) {
    screenNames = ["Search", "Detail"];
  } else {
    screenNames = ["Search"];
  }

  return screenNames.map((screenName) =>
    searchPathtoRouteMap[screenName](paths, params)
  );
}

function parseMePath(
  paths: string[],
  params: Record<string, string>
): ResultRoute<MeNavigationParamList>[] {
  const mePathToRouteMap: PathToRouteMap<MeNavigationParamList> = {
    Account: () => ({ name: "Account" }),
    Starred: () => ({ name: "Starred" }),
    Reviewed: () => ({ name: "Reviewed" }),
    Settings: () => ({ name: "Settings" }),
    Detail: (paths) => ({
      name: "Detail",
      params: {
        classCode: getClassFromPaths(paths),
        starredOrReviewed: checkStarredOrReviewed(paths),
      },
    }),
    Review: (paths) => ({
      name: "Review",
      params: {
        classCode: getClassFromPaths(paths),
        starredOrReviewed: checkStarredOrReviewed(paths),
      },
    }),
    Schedule: (paths) => ({
      name: "Schedule",
      params: {
        classCode: getClassFromPaths(paths),
        starredOrReviewed: checkStarredOrReviewed(paths),
      },
    }),
    SignInSignUp: (paths) => ({
      name: "SignInSignUp",
      params: {
        classCode: paths.length > 4 ? getClassFromPaths(paths) : undefined,
        starredOrReviewed:
          paths.length > 4 ? checkStarredOrReviewed(paths) : undefined,
        isSigningUp: checkIsSigningUp(paths),
      },
    }),
  };

  let screenNames: (keyof MeNavigationParamList)[];

  const firstPath = paths[0]?.toLowerCase();

  if (firstPath in firstMePathToFirstScreenNamesMap) {
    if (
      paths.length >= 4 &&
      (firstPath === "starred" || firstPath === "reviewed")
    ) {
      const lastPath = paths[4]?.toLowerCase();
      if (lastPath in lastPathToScreenNameMap) {
        screenNames = [
          ...firstMePathToFirstScreenNamesMap[firstPath],
          "Detail",
          lastPathToScreenNameMap[lastPath],
        ];
      } else {
        screenNames = [
          ...firstMePathToFirstScreenNamesMap[firstPath],
          "Detail",
        ];
      }
    } else {
      screenNames = firstMePathToFirstScreenNamesMap[firstPath];
    }
  } else {
    screenNames = ["Account"];
  }

  return screenNames.map((screenName) =>
    mePathToRouteMap[screenName](paths, params)
  );
}

export default function parse(
  path: string
): ResultState<RootNavigationParamList> {
  const rootPathsToRoutesMap: {
    [T in keyof RootNavigationParamList]: (
      paths: string[],
      params: Record<string, string>
    ) => ResultRoute<NavigationParamListFor<T>>[];
  } = {
    ExploreTab: parseExplorePath,
    SearchTab: parseSearchPath,
    MeTab: parseMePath,
  };

  const [route, param] = path.split(/\?/);

  const paths = route?.split(/\//)?.filter(Boolean) ?? [];

  const params: Record<string, string> = Object.fromEntries(
    param
      ?.split(/&/)
      ?.map((param) =>
        param
          .split(/=/)
          .map((e, i) =>
            i === 0
              ? decodeURIComponent(e).toLowerCase()
              : decodeURIComponent(e)
          )
      ) ?? []
  );

  const firstPathToTabNameMap: Record<string, keyof RootNavigationParamList> = {
    explore: "ExploreTab",
    search: "SearchTab",
  };

  const firstPath = paths[0]?.toLowerCase() ?? "explore";

  const tabName: keyof RootNavigationParamList =
    firstPathToTabNameMap[firstPath] ??
    (firstPath in firstMePathToFirstScreenNamesMap ? "MeTab" : "ExploreTab");

  return {
    routes: [
      {
        name: tabName,
        state: {
          routes: rootPathsToRoutesMap[tabName](paths, params),
        },
      },
    ],
  };
}
