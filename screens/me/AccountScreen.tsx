import React, { useEffect, useState } from "react";
import { Text, VStack, Button, Box, theme } from "native-base";
import {
  useNavigation,
  useRoute,
  type RouteProp,
  useIsFocused,
} from "@react-navigation/native";
import { type StackNavigationProp } from "@react-navigation/stack";

import AlertPopup from "../../components/AlertPopup";
import { LeftAlignedButton } from "../../components/LinkCompatibleButton";
import KeyboardAwareSafeAreaScrollView from "../../containers/KeyboardAwareSafeAreaScrollView";
import { type MeNavigationParamList } from "../../libs/types";
import { useHandoff, useInnerHeight } from "../../libs/hooks";
import { composeErrorMessage, Route } from "../../libs/utils";
import { useAuth } from "../../mongodb/auth";
import { colorModeResponsiveStyle } from "../../styling/color-mode-utils";

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
  const [signOutError, setSignOutError] = useState<any>(null);
  const [showSignOutAlert, setShowSignOutAlert] = useState(false);
  const innerHeight = useInnerHeight();
  const auth = useAuth();

  const isAuthenticated = auth.isAuthenticated;

  const wasAuthenticated = route.params?.isAuthenticated ?? isAuthenticated;

  useHandoff({
    isFocused,
    route: Route("MeTab", "Account", route.params),
    title: "View Account",
  });

  useEffect(() => {
    if (!route.params) {
      navigation.setParams({ isAuthenticated });
    }
  }, []);

  useEffect(() => {
    if (wasAuthenticated !== isAuthenticated) {
      if (isFocused && wasAuthenticated) {
        navigation.replace("Account", { isAuthenticated });
      } else {
        navigation.setParams({ isAuthenticated });
      }
    }
  }, [isFocused, wasAuthenticated, isAuthenticated]);

  return (
    <>
      {wasAuthenticated && (
        <AlertPopup
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          header={"Sign Out"}
          body={
            "You are about to sign out. After you signed out, you will have to sign in again to view your starred and reviewed classes or star and review more classes."
          }
          footerPrimaryButton={(isCompact) => (
            <Button
              variant={"dangerous"}
              borderRadius={isCompact ? 8 : undefined}
              py={isCompact ? "5px" : "8px"}
              onPress={async () => {
                setIsSigningOut(true);
                setShowAlert(false);
                try {
                  await auth.signOut();
                } catch (e) {
                  setSignOutError(e);
                  setShowSignOutAlert(true);
                  console.error(e);
                } finally {
                  setIsSigningOut(false);
                }
              }}
            >
              Sign Out
            </Button>
          )}
        />
      )}
      <AlertPopup
        isOpen={!showAlert && showSignOutAlert}
        onClose={() => setShowSignOutAlert(false)}
        header={"Unable to Sign Out"}
        body={composeErrorMessage(signOutError)}
      />
      <KeyboardAwareSafeAreaScrollView>
        <VStack
          marginY={"10px"}
          space={"10px"}
          minHeight={`${innerHeight - 20}px`}
        >
          <Box>
            {wasAuthenticated && (
              <Text variant={"h1"} opacity={auth.isSettingsSettled ? 1 : 0.5}>
                {auth.isUserDocLoaded ? auth.username ?? " " : "Me"}
              </Text>
            )}
            <VStack margin={"10px"} space={"12px"}>
              {wasAuthenticated && (
                <>
                  <LeftAlignedButton
                    title={"Starred"}
                    linkTo={Route("MeTab", "Starred")}
                  />
                  <LeftAlignedButton
                    title={"Reviewed"}
                    linkTo={Route("MeTab", "Reviewed")}
                  />
                </>
              )}
              {!wasAuthenticated && (
                <>
                  <LeftAlignedButton
                    showChevron={false}
                    title={"Sign In"}
                    linkTo={Route("MeTab", "SignInSignUp", {
                      isSigningUp: false,
                    })}
                  />
                  <LeftAlignedButton
                    showChevron={false}
                    marginBottom={"15px"}
                    title={"Sign Up"}
                    linkTo={Route("MeTab", "SignInSignUp", {
                      isSigningUp: true,
                    })}
                  />
                </>
              )}
              <LeftAlignedButton
                title={"Settings"}
                linkTo={Route("MeTab", "Settings")}
              />
              {wasAuthenticated && (
                <LeftAlignedButton
                  title={"Sign Out"}
                  showChevron={false}
                  marginTop={"15px"}
                  isDisabled={isSigningOut}
                  _text={{ variant: "dangerousSubtleButton" }}
                  onPress={() => setShowAlert(true)}
                />
              )}
            </VStack>
          </Box>
          <Box flexGrow={1} />
          <Box>
            <Text
              textAlign={"center"}
              fontSize={"md"}
              fontWeight={"medium"}
              {...colorModeResponsiveStyle((selector) => ({
                color: selector({
                  light: theme.colors.gray[500],
                  dark: theme.colors.gray[400],
                }),
              }))}
            >
              Rate My Classes Pro
            </Text>
            <Text
              textAlign={"center"}
              fontSize={"sm"}
              {...colorModeResponsiveStyle((selector) => ({
                color: selector({
                  light: theme.colors.gray[500],
                  dark: theme.colors.gray[400],
                }),
              }))}
            >
              {`© ${Math.max(
                new Date().getFullYear(),
                2022
              )} Mingcheng (McCoy) Zhu`}
            </Text>
          </Box>
        </VStack>
      </KeyboardAwareSafeAreaScrollView>
    </>
  );
}
