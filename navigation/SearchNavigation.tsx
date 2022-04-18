import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import SearchScreen from "../screens/search/SearchScreen";
import DetailScreen from "../screens/shared/DetailScreen";
import ReviewScreen from "../screens/shared/ReviewScreen";
import ScheduleScreen from "../screens/shared/ScheduleScreen";
import SignInSignUpScreen from "../screens/shared/SignInSignUpScreen";
import detailScreenOptions from "./options/detailScreenOptions";
import reviewScreenOptions from "./options/reviewScreenOptions";
import scheduleScreenOptions from "./options/scheduleScreenOptions";
import signInSignUpScreenOptions from "./options/signInSignUpScreenOptions";
import { type SearchNavigationParamList } from "../libs/types";
import defaultScreenOptions from "./options/defaultScreenOptions";

const Stack = createStackNavigator<SearchNavigationParamList>();

export default function SearchNavigation() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name={"Search"} component={SearchScreen} />
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
