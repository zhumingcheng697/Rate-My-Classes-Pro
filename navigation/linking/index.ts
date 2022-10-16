import type { LinkingOptions, NavigationState } from "@react-navigation/native";
import { WEB_DEPLOYMENT_URL } from "react-native-dotenv";

import parse from "./parse";
import stringnify from "./stringify";
import type { RootNavigationParamList } from "../../libs/types";

const linking: LinkingOptions<RootNavigationParamList> = {
  prefixes: [
    "rate-my-classes-pro://",
    "rate-my-classes://",
    "ratemyclasses://",
    WEB_DEPLOYMENT_URL,
  ],
  getPathFromState(state) {
    try {
      return stringnify(state as NavigationState<RootNavigationParamList>);
    } catch (e) {
      console.error(state, e);
      return "";
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
