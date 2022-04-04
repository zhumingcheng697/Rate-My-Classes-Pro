import React from "react";
import { type RouteProp } from "@react-navigation/native";
import {
  type StackNavigationProp,
  type StackNavigationOptions,
} from "@react-navigation/stack";

import PlainTextButton from "../../components/PlainTextButton";
import type {
  ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
} from "../../shared/types";
import { getFullClassCode } from "../../shared/utils";

type DetailScreenNavigationProp = StackNavigationProp<
  | ExploreNavigationParamList
  | SearchNavigationParamList
  | MeNavigationParamList,
  "Detail"
>;

type DetailScreenRouteProp = RouteProp<
  | ExploreNavigationParamList
  | SearchNavigationParamList
  | MeNavigationParamList,
  "Detail"
>;

export type DetailScreenOptionsProp = {
  navigation: DetailScreenNavigationProp;
  route: DetailScreenRouteProp;
};

export default ({
  navigation,
  route,
}: DetailScreenOptionsProp): StackNavigationOptions => ({
  title: getFullClassCode(route.params),
  headerRight: (props) => {
    return (
      <PlainTextButton
        marginRight={"10px"}
        title={"Star/Unstar"}
        _text={{ fontSize: "md", fontWeight: "semibold" }}
        // onPress={navigation.goBack}
        {...props}
      />
    );
  },
});
