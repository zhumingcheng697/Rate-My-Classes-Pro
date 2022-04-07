import React from "react";
import { Text, Button, Input, VStack, Box } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../shared/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import PlainTextButton from "../../components/PlainTextButton";

type SignInSignUpScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "SignInSignUp"
>;

type SignInSignUpScreenRouteProp = RouteProp<
  MeNavigationParamList,
  "SignInSignUp"
>;

export default function SignInSignUpScreen() {
  const navigation = useNavigation<SignInSignUpScreenNavigationProp>();
  const route = useRoute<SignInSignUpScreenRouteProp>();

  const isSigningIn = route.params.isSigningIn;

  return (
    <KeyboardAwareSafeAreaScrollView>
      <VStack margin={"10px"} space={"8px"}>
        {!isSigningIn && (
          <Box>
            <Text variant={"label"}>Username</Text>
            <Input autoCompleteType={"username"} />
          </Box>
        )}
        <Box>
          <Text variant={"label"}>Email</Text>
          <Input
            autoCompleteType={"email"}
            autoCorrect={false}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
          />
        </Box>
        <Box>
          <Text variant={"label"}>Password</Text>
          <Input variant={"password"} />
        </Box>
        {!isSigningIn && (
          <Box>
            <Text variant={"label"}>Confirm Password</Text>
            <Input variant={"password"} />
          </Box>
        )}
        {isSigningIn ? (
          <Button
            marginY={"15px"}
            onPress={() => {
              navigation.navigate("Account", { isSignedIn: true });
            }}
          >
            <Text variant={"button"}>Sign In</Text>
          </Button>
        ) : (
          <Button
            marginY={"15px"}
            onPress={() => {
              navigation.navigate("Account", { isSignedIn: true });
            }}
          >
            <Text variant={"button"}>Sign Up</Text>
          </Button>
        )}
        <Box>
          <Text textAlign={"center"}>
            {isSigningIn
              ? "Don’t have an account yet?"
              : "Already have an account?"}
          </Text>
          <PlainTextButton
            title={"Sign Up"}
            onPress={() => {
              navigation.navigate("SignInSignUp", {
                isSigningIn: !isSigningIn,
              });
            }}
          />
        </Box>
      </VStack>
    </KeyboardAwareSafeAreaScrollView>
  );
}
