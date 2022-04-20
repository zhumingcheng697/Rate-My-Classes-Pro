import React, { useEffect, useState } from "react";
import { Text, VStack, Button, Box } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
  useIsFocused,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import { type MeNavigationParamList } from "../../libs/types";
import { useInnerHeight } from "../../libs/hooks";
import LeftAlignedButton from "../../components/LeftAlignedButton";
import AlertPopup from "../../components/AlertPopup";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { useAuth } from "../../mongodb/auth";

type AccountScreenNavigationProp = StackNavigationProp<
  MeNavigationParamList,
  "Account"
>;

type AccountScreenRouteProp = RouteProp<MeNavigationParamList, "Account">;

export default function AccountScreen() {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const route = useRoute<AccountScreenRouteProp>();
  const isFocused = useIsFocused();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const innerHeight = useInnerHeight();
  const auth = useAuth();

  const isAuthenticated = auth.isAuthenticated;

  const wasAuthenticated = route.params?.isAuthenticated ?? isAuthenticated;

  useEffect(() => {
    if (!route.params) {
      navigation.setParams({ isAuthenticated });
    }
  }, []);

  useEffect(() => {
    if (wasAuthenticated !== isAuthenticated) {
      if (!wasAuthenticated) {
        navigation.setParams({ isAuthenticated });
      } else if (isFocused) {
        navigation.replace("Account", { isAuthenticated });
      }
    }
  }, [isFocused, wasAuthenticated, isAuthenticated]);

  return (
    <>
      {wasAuthenticated && (
        <AlertPopup
          isOpen={showAlert && isFocused}
          onClose={() => {
            setShowAlert(false);
          }}
          header={"Sign Out"}
          body={
            "You are about to sign out. After you signed out, you will have to sign in again with your email and password."
          }
          footerPrimaryButton={
            <Button
              background={"red.600"}
              _dark={{ background: "red.500" }}
              onPress={async () => {
                setIsSigningOut(true);
                setShowAlert(false);
                try {
                  await auth.signOut();
                } catch (e) {
                  console.error(e);
                } finally {
                  setIsSigningOut(false);
                }
              }}
            >
              Sign Out
            </Button>
          }
        />
      )}
      <KeyboardAwareSafeAreaScrollView>
        <VStack
          marginY={"10px"}
          space={"10px"}
          minHeight={`${innerHeight - 20}px`}
        >
          <Box>
            {wasAuthenticated && (
              <Text variant={"h1"}>{auth.username ?? " "}</Text>
            )}
            <VStack margin={"10px"} space={"12px"}>
              {wasAuthenticated && (
                <>
                  <LeftAlignedButton
                    title={"Starred"}
                    onPress={() => {
                      navigation.navigate("Starred");
                    }}
                  />
                  <LeftAlignedButton
                    title={"Reviewed"}
                    onPress={() => {
                      navigation.navigate("Reviewed");
                    }}
                  />
                </>
              )}
              {!wasAuthenticated && (
                <>
                  <LeftAlignedButton
                    showChevron={false}
                    title={"Sign In"}
                    onPress={() => {
                      navigation.navigate("SignInSignUp", {
                        isSigningUp: false,
                      });
                    }}
                  />
                  <LeftAlignedButton
                    showChevron={false}
                    marginBottom={"15px"}
                    title={"Sign Up"}
                    onPress={() => {
                      navigation.navigate("SignInSignUp", {
                        isSigningUp: true,
                      });
                    }}
                  />
                </>
              )}
              <LeftAlignedButton
                title={"Settings"}
                onPress={() => {
                  navigation.navigate("Settings");
                }}
              />
              {wasAuthenticated && (
                <LeftAlignedButton
                  title={"Sign Out"}
                  _text={{
                    color: "red.600",
                    _dark: { color: "red.500" },
                  }}
                  showChevron={false}
                  marginTop={"15px"}
                  isDisabled={isSigningOut}
                  onPress={() => {
                    setShowAlert(true);
                  }}
                />
              )}
            </VStack>
          </Box>
          <Box flexGrow={1}></Box>
          <Box>
            <Text
              textAlign={"center"}
              color={"gray.500"}
              _dark={{ color: "gray.400" }}
              fontSize={"md"}
              fontWeight={"medium"}
            >
              Rate My Classes Pro
            </Text>
            <Text
              textAlign={"center"}
              color={"gray.500"}
              _dark={{ color: "gray.400" }}
              fontSize={"sm"}
            >
              © 2022 Mingcheng (McCoy) Zhu
            </Text>
          </Box>
        </VStack>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
