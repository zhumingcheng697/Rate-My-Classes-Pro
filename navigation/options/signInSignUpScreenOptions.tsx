import React from "react";
import { Platform } from "react-native";
import { type RouteProp } from "@react-navigation/native";
import {
  type StackNavigationProp,
  type StackNavigationOptions,
  TransitionPresets,
} from "@react-navigation/stack";

import PlainTextButton from "../../components/PlainTextButton";
import { type SharedNavigationParamList } from "../../libs/types";

type SignInSignUpScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "SignInSignUp"
>;

type SignInSignUpScreenRouteProp = RouteProp<
  SharedNavigationParamList,
  "SignInSignUp"
>;

export type SignInSignUpScreenOptionsProp = {
  navigation: SignInSignUpScreenNavigationProp;
  route: SignInSignUpScreenRouteProp;
};

export default ({
  navigation,
  route,
}: SignInSignUpScreenOptionsProp): StackNavigationOptions => ({
  presentation: "modal",
  gestureEnabled: false,
  title: route.params?.isSigningUp ? "Sign Up" : "Sign In",
  headerLeft: (props) => {
    return (
      <PlainTextButton
        marginLeft={"10px"}
        title={"Cancel"}
        _text={{ fontSize: "md", fontWeight: "normal" }}
        onPress={navigation.goBack}
        {...props}
      />
    );
  },
  ...(Platform.OS === "ios" || Platform.OS === "macos"
    ? TransitionPresets.ModalSlideFromBottomIOS
    : TransitionPresets.DefaultTransition),
});
