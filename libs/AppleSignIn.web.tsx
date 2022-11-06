import React from "react";
import { appleAuthHelpers } from "react-apple-signin-auth";
import type { IButtonProps } from "native-base";
import {
  APPLE_SIGN_IN_SERVICE_ID,
  WEB_DEPLOYMENT_URL,
} from "react-native-dotenv";

import OAuthSignInButton from "../components/OAuthSignInButton";
import { useAuth } from "../mongodb/auth";
import { composeUsername } from "./utils";

export function isAppleSignInSupported() {
  return true;
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

          const { user, authorization } = await appleAuthHelpers.signIn({
            authOptions: {
              clientId: APPLE_SIGN_IN_SERVICE_ID,
              scope: "name",
              redirectURI: WEB_DEPLOYMENT_URL,
              usePopup: true,
            },
            onError: (error) => {
              throw error;
            },
          });

          if (authorization?.id_token) {
            const username = composeUsername({
              givenName: user?.name?.firstName,
              familyName: user?.name?.lastName,
            });

            await auth.continueWithApple(authorization.id_token, username);
          } else {
            setError(new Error("Unable to retrieve id token"));
          }
        } catch (error: any) {
          if (error?.error !== "popup_closed_by_user") {
            console.error(error);
            setError(error?.error || error);
          }
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}
