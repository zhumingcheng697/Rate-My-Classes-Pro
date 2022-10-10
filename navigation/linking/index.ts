import {
  getPathFromState,
  getStateFromPath,
  LinkingOptions,
} from "@react-navigation/native";

import stringnify from "./stringify";
import type {
  RootNavigationParamList,
  StackNavigationParamList,
  ValueOf,
} from "../../libs/types";

const linking: LinkingOptions<RootNavigationParamList> = {
  prefixes: [
    "rate-my-classes-pro://",
    "https://rate-my-classes-pro.netlify.app/",
  ],
  getPathFromState(tabState) {
    try {
      const { index: tabIndex, routes: tabRoutes } = tabState;

      if (typeof tabIndex === "number" && tabRoutes) {
        const { name: tabName, state: stackState } = tabRoutes[tabIndex] ?? {};

        if (tabName && stackState) {
          const { index: stackIndex, routes: stackRoutes } = stackState;

          if (typeof stackIndex === "number" && stackRoutes) {
            const { name: screenName, params: screenParams } =
              stackRoutes[stackIndex] ?? {};

            if (screenName) {
              return stringnify(
                tabName as keyof RootNavigationParamList,
                screenName as keyof StackNavigationParamList,
                screenParams as ValueOf<StackNavigationParamList>
              );
            }
          }
        }
      }

      return "/explore";
    } catch (e) {
      console.error(tabState, e);
      return "/explore";
    }
  },
  getStateFromPath(path, options) {
    const [route, param] = path.split(/\?/);

    const routes = route?.split(/\//)?.filter(Boolean) ?? [];

    const params: Record<string, string> = Object.fromEntries(
      param
        ?.split(/&/)
        ?.map((param) => param.split(/=/).map(decodeURIComponent)) ?? []
    );

    const state = getStateFromPath(path, options);

    return state;
  },
};

export default linking;
