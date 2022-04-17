import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import AccountScreen from "../screens/me/AccountScreen";
import StarredReviewedScreen from "../screens/me/StarredReviewedScreen";
import SettingsScreen from "../screens/me/SettingsScreen";
import DetailScreen from "../screens/shared/DetailScreen";
import ReviewScreen from "../screens/shared/ReviewScreen";
import ScheduleScreen from "../screens/shared/ScheduleScreen";
import SignInSignUpScreen from "../screens/shared/SignInSignUpScreen";
import detailScreenOptions from "./options/detailScreenOptions";
import reviewScreenOptions from "./options/reviewScreenOptions";
import scheduleScreenOptions from "./options/scheduleScreenOptions";
import signInSignUpScreenOptions from "./options/signInSignUpScreenOptions";
import { type MeNavigationParamList } from "../libs/types";

const Stack = createStackNavigator<MeNavigationParamList>();

export default function MeNavigation() {
  return (
    <Stack.Navigator screenOptions={{ ...TransitionPresets.DefaultTransition }}>
      <Stack.Screen
        name={"Account"}
        component={AccountScreen}
        options={{ title: "Me" }}
      />
      <Stack.Screen name={"Starred"} component={StarredReviewedScreen} />
      <Stack.Screen name={"Reviewed"} component={StarredReviewedScreen} />
      <Stack.Screen name={"Settings"} component={SettingsScreen} />
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
