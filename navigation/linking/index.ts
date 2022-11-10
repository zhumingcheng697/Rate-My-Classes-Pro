import type { LinkingOptions, NavigationState } from "@react-navigation/native";
import { WEB_DEPLOYMENT_URL } from "react-native-dotenv";

import parse from "./parse";
import stringnify from "./stringify";
import type { RootNavigationParamList } from "../../libs/types";
import { tryCatch } from "../../libs/utils";

const linking: LinkingOptions<RootNavigationParamList> = {
  prefixes: [
    "rate-my-classes-pro://",
    "rate-my-classes://",
    "ratemyclasses://",
    WEB_DEPLOYMENT_URL,
  ],
  getPathFromState(state) {
    return (
      tryCatch(() =>
        stringnify(state as NavigationState<RootNavigationParamList>)
      ) || ""
    );
  },
  getStateFromPath(path) {
    return tryCatch(() => parse(path));
  },
};

export default linking;
