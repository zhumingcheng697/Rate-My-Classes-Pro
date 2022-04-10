import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import AccountScreen from "../screens/me/AccountScreen";
import StarredReviewedScreen from "../screens/me/StarredReviewedScreen";
import SettingsScreen from "../screens/me/SettingsScreen";
import DetailScreen from "../screens/shared/DetailScreen";
import SignInSignUpScreen from "../screens/shared/SignInSignUpScreen";
import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import detailScreenOptions from "./options/detailScreenOptions";
import reviewScreenOptions from "./options/reviewScreenOptions";
import signInSignUpScreenOptions from "./options/signInSignUpScreenOptions";
import { type MeNavigationParamList } from "../shared/types";

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
