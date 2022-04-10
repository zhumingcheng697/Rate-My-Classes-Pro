import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";

import SearchScreen from "../screens/search/SearchScreen";
import DetailScreen from "../screens/shared/DetailScreen";
import SignInSignUpScreen from "../screens/shared/SignInSignUpScreen";
import PlaceHolderScreen from "../screens/PlaceHolderScreen";
import detailScreenOptions from "./options/detailScreenOptions";
import reviewScreenOptions from "./options/reviewScreenOptions";
import signInSignUpScreenOptions from "./options/signInSignUpScreenOptions";
import { type SearchNavigationParamList } from "../shared/types";

const Stack = createStackNavigator<SearchNavigationParamList>();

export default function SearchNavigation() {
  return (
    <Stack.Navigator screenOptions={{ ...TransitionPresets.DefaultTransition }}>
      <Stack.Screen name={"Search"} component={SearchScreen} />
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
