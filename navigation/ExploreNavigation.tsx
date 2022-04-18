import React from "react";
import { useTheme } from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import UniversityScreen from "../screens/explore/UniversityScreen";
import SchoolScreen from "../screens/explore/SchoolScreen";
import DepartmentScreen from "../screens/explore/DepartmentScreen";
import DetailScreen from "../screens/shared/DetailScreen";
import ReviewScreen from "../screens/shared/ReviewScreen";
import ScheduleScreen from "../screens/shared/ScheduleScreen";
import SignInSignUpScreen from "../screens/shared/SignInSignUpScreen";
import detailScreenOptions from "./options/detailScreenOptions";
import reviewScreenOptions from "./options/reviewScreenOptions";
import scheduleScreenOptions from "./options/scheduleScreenOptions";
import signInSignUpScreenOptions from "./options/signInSignUpScreenOptions";
import { type ExploreNavigationParamList } from "../libs/types";
import { getFullDepartmentCode } from "../libs/utils";

const Stack = createStackNavigator<ExploreNavigationParamList>();

export default function ExploreNavigation() {
  const navigationTheme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        ...TransitionPresets.DefaultTransition,
        headerTitleStyle: {
          color: navigationTheme.colors.text,
        },
        headerTintColor: navigationTheme.colors.primary,
      }}
    >
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
        component={ReviewScreen}
        options={reviewScreenOptions}
      />
      <Stack.Screen
        name={"Schedule"}
        component={ScheduleScreen}
        options={scheduleScreenOptions}
      />
      <Stack.Screen
        name={"SignInSignUp"}
        component={SignInSignUpScreen}
        options={signInSignUpScreenOptions}
      />
    </Stack.Navigator>
  );
}
