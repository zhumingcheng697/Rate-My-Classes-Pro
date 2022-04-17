import { type RouteProp } from "@react-navigation/native";
import type {
  StackNavigationProp,
  StackNavigationOptions,
} from "@react-navigation/stack";

import Semester from "../../libs/semester";
import { type SharedNavigationParamList } from "../../libs/types";

type ScheduleScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "Schedule"
>;

type ScheduleScreenRouteProp = RouteProp<SharedNavigationParamList, "Schedule">;

export type ScheduleScreenOptionsProp = {
  navigation: ScheduleScreenNavigationProp;
  route: ScheduleScreenRouteProp;
};

export default ({
  route,
}: ScheduleScreenOptionsProp): StackNavigationOptions => ({
  headerBackTitle: "Back",
  title: `${new Semester(route.params.semester).toString()} Schedule`,
});
