import React from "react";
import { type RouteProp } from "@react-navigation/native";
import { type StackNavigationOptions } from "@react-navigation/stack";

import Semester from "../../libs/semester";
import { type SharedNavigationParamList } from "../../libs/types";
import SharingButton from "../../components/SharingButton";

type ScheduleScreenRouteProp = RouteProp<SharedNavigationParamList, "Schedule">;

export type ScheduleScreenOptionsProp = {
  route: ScheduleScreenRouteProp;
};

export default ({
  route,
}: ScheduleScreenOptionsProp): StackNavigationOptions => ({
  title: route.params.semester
    ? `${new Semester(route.params.semester).toString()} Schedule`
    : "Schedule",
  headerRight: () => <SharingButton />,
});
