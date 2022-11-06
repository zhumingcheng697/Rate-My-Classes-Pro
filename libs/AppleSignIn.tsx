import React from "react";
import { Platform } from "react-native";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import type { IButtonProps } from "native-base";

import OAuthSignInButton from "../components/OAuthSignInButton";
import { useAuth } from "../mongodb/auth";
import { composeUsername } from "./utils";

export function isAppleSignInSupported() {
  return !(
    Platform.OS === "ios" && parseInt(Platform.Version.split(".")[0]) < 13
  );
}

type AppleSignInButtonBaseProps = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: any) => void;
};

export type AppleSignInButtonProps = AppleSignInButtonBaseProps &
  Omit<IButtonProps, keyof AppleSignInButtonBaseProps | "onPress">;

export function AppleSignInButton({
  isLoading,
  setIsLoading,
  setError,
  isDisabled = false,
  ...rest
}: AppleSignInButtonProps) {
  const auth = useAuth();

  return (
    <OAuthSignInButton
      {...rest}
      provider={"Apple"}
      isDisabled={isLoading || isDisabled}
      onPress={async () => {
        try {
          setIsLoading(true);

          const { user, fullName, identityToken } =
            await appleAuth.performRequest({
              requestedOperation: appleAuth.Operation.LOGIN,
              requestedScopes: [appleAuth.Scope.FULL_NAME],
            });

          const state = await appleAuth.getCredentialStateForUser(user);

          if (state === appleAuth.State.AUTHORIZED && identityToken) {
            const username = composeUsername({
              givenName: fullName?.givenName,
              middleName: fullName?.middleName,
              familyName: fullName?.familyName,
              nickname: fullName?.nickname,
            });

            await auth.continueWithApple(identityToken, username);
          } else {
            throw new Error("Unable to authorize");
          }
        } catch (error: any) {
          if (
            `${error?.code}` !== "1001" &&
            !/com\.apple\.AuthenticationServices\.AuthorizationError error 1001/.test(
              `${error?.message}` || ""
            )
          ) {
            setError(error);
          }
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}
