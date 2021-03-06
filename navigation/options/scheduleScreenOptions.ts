import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationOptions } from "@react-navigation/stack";

import Semester from "../../libs/semester";
import { type SharedNavigationParamList } from "../../libs/types";

type ScheduleScreenRouteProp = RouteProp<SharedNavigationParamList, "Schedule">;

export type ScheduleScreenOptionsProp = {
  route: ScheduleScreenRouteProp;
};

export default ({
  route,
}: ScheduleScreenOptionsProp): StackNavigationOptions => ({
  title: `${new Semester(route.params.semester).toString()} Schedule`,
});
