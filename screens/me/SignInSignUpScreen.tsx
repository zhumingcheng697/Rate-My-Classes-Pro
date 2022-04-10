import React, { useEffect, useState, useCallback } from "react";
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
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [key, setKey] = useState(Math.random());

  const isSigningIn = route.params.isSigningIn;

  useEffect(() => {
    setPassword("");
    setConfirmPassword("");
  }, [isSigningIn]);

  const randomizeKey = useCallback(() => {
    setKey(Math.random());
  }, []);

  return (
    <KeyboardAwareSafeAreaScrollView>
      <VStack margin={"10px"} space={"8px"}>
        {!isSigningIn && (
          <Box>
            <Text variant={"label"}>Username</Text>
            <Input
              value={username}
              onChangeText={setUsername}
              autoCompleteType={"username"}
              onEndEditing={randomizeKey}
            />
          </Box>
        )}
        <Box>
          <Text variant={"label"}>Email</Text>
          <Input
            value={email}
            onChangeText={setEmail}
            autoCompleteType={"email"}
            autoCorrect={false}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
            onEndEditing={randomizeKey}
          />
        </Box>
        <Box>
          <Text variant={"label"}>Password</Text>
          <Input
            key={`${key}`}
            value={password}
            onChangeText={setPassword}
            textContentType={"oneTimeCode"}
            variant={"password"}
          />
        </Box>
        {!isSigningIn && (
          <Box>
            <Text variant={"label"}>Confirm Password</Text>
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              textContentType={"oneTimeCode"}
              variant={"password"}
              onEndEditing={randomizeKey}
            />
          </Box>
        )}
        <Button
          marginY={"15px"}
          onPress={async () => {
            if (isSigningIn) {
              console.log("Signing In");
              navigation.navigate("Account", { isSignedIn: true });
            } else {
              console.log("Signing Up");
              navigation.navigate("Account", { isSignedIn: true });
            }
          }}
        >
          <Text variant={"button"}>{isSigningIn ? "Sign In" : "Sign Up"}</Text>
        </Button>
        <Box>
          <Text textAlign={"center"}>
            {isSigningIn
              ? "Don’t have an account yet?"
              : "Already have an account?"}
          </Text>
          <PlainTextButton
            title={isSigningIn ? "Sign Up" : "Sign In"}
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
