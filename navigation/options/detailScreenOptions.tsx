import React from "react";
import { IconButton, Icon } from "native-base";
import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationOptions } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";

import { starClass, unstarClass } from "../../redux/actions";
import type {
  ExploreNavigationParamList,
  SearchNavigationParamList,
  MeNavigationParamList,
} from "../../shared/types";
import { getFullClassCode } from "../../shared/utils";

type DetailScreenRouteProp = RouteProp<
  | ExploreNavigationParamList
  | SearchNavigationParamList
  | MeNavigationParamList,
  "Detail"
>;

export type DetailScreenOptionsProp = {
  route: DetailScreenRouteProp;
};

export default ({
  route,
}: DetailScreenOptionsProp): StackNavigationOptions => ({
  title: getFullClassCode(route.params),
  headerRight: (props) => {
    const starredClasses = useSelector((state) => state.starredClassRecord);
    const dispatch = useDispatch();
    const isStarred = !!starredClasses[getFullClassCode(route.params)];
    const pressedHoverStyle = { _icon: { opacity: 0.5 } };

    return (
      <IconButton
        variant={"unstyled"}
        marginRight={"5px"}
        padding={"5px"}
        _pressed={pressedHoverStyle}
        _hover={pressedHoverStyle}
        icon={
          <Icon
            color={isStarred ? "yellow.400" : "gray.300"}
            size={"22px"}
            as={<Ionicons name={"star" + (isStarred ? "" : "-outline")} />}
          />
        }
        onPress={() => {
          if (isStarred) {
            unstarClass(dispatch)(route.params);
          } else {
            starClass(dispatch)(route.params);
          }
        }}
        {...props}
      />
    );
  },
});
