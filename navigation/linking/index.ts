import {
  getPathFromState,
  getStateFromPath,
  LinkingOptions,
} from "@react-navigation/native";

import stringnifyRoute from "./stringify";
import {
  RootNavigationParamList,
  ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
} from "../../libs/types";

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

    //       type Nav =
    //         | ExploreNavigationParamList
    //         | SearchNavigationParamList
    //         | MeNavigationParamList;

    //       if (screenName) {
    //         return stringnifyRoute(
    //           tabName as keyof RootNavigationParamList,
    //           screenName as keyof Nav,
    //           screenParams as Nav[keyof Nav]
    //         );
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
