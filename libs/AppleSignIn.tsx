import React from "react";
import { Platform } from "react-native";
import { appleAuth } from "@invertase/react-native-apple-authentication";
import type { IButtonProps } from "native-base";

import OAuthSignInButton from "../components/OAuthSignInButton";
import { useAuth } from "../mongodb/auth";

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

          const res = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME],
          });

          const state = await appleAuth.getCredentialStateForUser(res.user);

          if (state === appleAuth.State.AUTHORIZED && res.identityToken) {
            const username =
              res.fullName?.givenName || res.fullName?.nickname || "User";

            await auth.continueWithApple(res.identityToken, username);
          } else {
            setError(new Error("Unable to authorize"));
          }
        } catch (error: any) {
          console.error(error);

          setError(error);
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}
