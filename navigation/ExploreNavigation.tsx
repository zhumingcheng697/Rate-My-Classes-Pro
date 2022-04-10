import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import UniversityScreen from "../screens/explore/UniversityScreen";
import SchoolScreen from "../screens/explore/SchoolScreen";
import DepartmentScreen from "../screens/explore/DepartmentScreen";
import DetailScreen from "../screens/shared/DetailScreen";
import SignInSignUpScreen from "../screens/shared/SignInSignUpScreen";
import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import detailScreenOptions from "./options/detailScreenOptions";
import reviewScreenOptions from "./options/reviewScreenOptions";
import signInSignUpScreenOptions from "./options/signInSignUpScreenOptions";
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
      <Stack.Screen
        name={"SignInSignUp"}
        component={SignInSignUpScreen}
        initialParams={{ isSigningIn: false }}
        options={signInSignUpScreenOptions}
      />
    </Stack.Navigator>
  );
}
