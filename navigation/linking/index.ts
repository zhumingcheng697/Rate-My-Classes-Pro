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
      return parse(path);
    } catch (e) {
      console.error(path, e);
    }
  },
};

export default linking;
