import type { LinkingOptions, NavigationState } from "@react-navigation/native";

import parse from "./parse";
import stringnify from "./stringify";
import type { RootNavigationParamList } from "../../libs/types";

const linking: LinkingOptions<RootNavigationParamList> = {
  prefixes: [
    "rate-my-classes-pro://",
    "rate-my-classes://",
    "ratemyclasses://",
    "https://rate-my-classes-pro.netlify.app/",
  ],
  getPathFromState(state) {
    try {
      return stringnify(state as NavigationState<RootNavigationParamList>);
    } catch (e) {
      console.error(state, e);
      return "/explore";
    }
  },
  getStateFromPath(path) {
    try {
      const [route, param] = path.split(/\?/);

      const routes = route?.split(/\//)?.filter(Boolean) ?? [];

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

      return parse(routes, params);
    } catch (e) {
      console.error(path, e);
    }
  },
};

export default linking;
