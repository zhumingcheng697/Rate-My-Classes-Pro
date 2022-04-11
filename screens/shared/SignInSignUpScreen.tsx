import React, { useEffect, useState } from "react";
import { Keyboard } from "react-native";
import { Text, Button, Input, VStack, Box } from "native-base";
import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { isObjectEmpty, formSentence } from "../../libs/utils";
import { type SharedNavigationParamList } from "../../libs/types";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import PlainTextButton from "../../components/PlainTextButton";
import AlertPopup from "../../components/AlertPopup";
import { useAuth } from "../../mongodb/auth";

type SignInSignUpScreenNavigationProp = StackNavigationProp<
  SharedNavigationParamList,
  "SignInSignUp"
>;

type SignInSignUpScreenRouteProp = RouteProp<
  SharedNavigationParamList,
  "SignInSignUp"
>;

export default function SignInSignUpScreen() {
  const navigation = useNavigation<SignInSignUpScreenNavigationProp>();
  const route = useRoute<SignInSignUpScreenRouteProp>();
  const auth = useAuth();
  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [key, setKey] = useState(Math.random());

  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState<any>(null);

  const isSigningIn = route.params?.isSigningIn ?? false;

  const isAuthenticated = auth.isAuthenticated;

  useEffect(() => {
    if (isFocused && isAuthenticated) {
      navigation.goBack();
    }
  }, [isFocused, isAuthenticated]);

  useEffect(() => {
    setIsLoading(false);
    setPassword("");
    setConfirmPassword("");
  }, [isSigningIn]);

  useEffect(() => {
    setKey(Math.random());
  }, [username, email, confirmPassword, isSigningIn]);

  return (
    <>
      <AlertPopup
        header={`Unable to ${isSigningIn ? "Sign In" : "Sign Up"}`}
        body={
          error && !isObjectEmpty(error)
            ? error.message
              ? formSentence(error.message)
              : JSON.stringify(error)
            : "Unknown Error"
        }
        isOpen={showAlert && isFocused}
        onClose={() => {
          setShowAlert(false);
        }}
      />
      <KeyboardAwareSafeAreaScrollView>
        <VStack margin={"10px"} space={"8px"}>
          {!isSigningIn && (
            <Box>
              <Text variant={"label"}>Username</Text>
              <Input
                value={username}
                onChangeText={setUsername}
                autoCompleteType={"username"}
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
              />
            </Box>
          )}
          <Button
            marginY={"15px"}
            isDisabled={
              isLoading ||
              !email ||
              !password ||
              (!isSigningIn &&
                (!username || !confirmPassword || password !== confirmPassword))
            }
            onPress={async () => {
              try {
                setIsLoading(true);
                if (isSigningIn) {
                  await auth.signInWithEmailPassword(email, password);
                } else {
                  await auth.signUpWithEmailPassword(username, email, password);
                }
                setError(null);
              } catch (e) {
                setError(e);
                setShowAlert(true);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <Text variant={"button"}>
              {isSigningIn ? "Sign In" : "Sign Up"}
            </Text>
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
                Keyboard.dismiss();
                navigation.setParams({ isSigningIn: !isSigningIn });
              }}
            />
          </Box>
        </VStack>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
