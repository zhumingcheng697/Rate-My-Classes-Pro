import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import UniversityScreen from "../screens/explore/UniversityScreen";
import SchoolScreen from "../screens/explore/SchoolScreen";
import DepartmentScreen from "../screens/explore/DepartmentScreen";
import DetailScreen from "../screens/detail/DetailScreen";
import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import reviewScreenOptions from "./options/reviewScreenOptions";
import detailScreenOptions from "./options/detailScreenOptions";
import { type ExploreNavigationParamList } from "../shared/types";
import { getFullDepartmentCode } from "../shared/utils";

const Stack = createStackNavigator<ExploreNavigationParamList>();

export default function ExploreNavigation() {
  return (
    <Stack.Navigator screenOptions={{ ...TransitionPresets.DefaultTransition }}>
      <Stack.Screen
        name={"University"}
        component={UniversityScreen}
        options={{ title: "Explore" }}
      />
      <Stack.Screen
        name={"School"}
        component={SchoolScreen}
        options={({ route }) => ({
          title: route.params.schoolCode.toUpperCase(),
        })}
      />
      <Stack.Screen
        name={"Department"}
        component={DepartmentScreen}
        options={({ route }) => ({
          title: getFullDepartmentCode(route.params),
        })}
      />
      <Stack.Screen
        name={"Detail"}
        component={DetailScreen}
        options={detailScreenOptions}
      />
      <Stack.Screen
        name={"Review"}
        component={PlaceHolderScreen}
        options={reviewScreenOptions}
      />
    </Stack.Navigator>
  );
}
