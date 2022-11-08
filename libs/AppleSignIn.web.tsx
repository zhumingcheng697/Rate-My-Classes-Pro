import React, { useCallback, useState } from "react";
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
  const [hasError, setHasError] = useState(false);
  const onError = useCallback((error) => {
    if (error?.error !== "popup_closed_by_user") {
      setHasError(true);
      console.error(error);
      setError(error?.error || error);
    }
  }, []);

  return (
    <OAuthSignInButton
      {...rest}
      provider={"Apple"}
      isDisabled={isLoading || isDisabled}
      onPress={async () => {
        try {
          setIsLoading(true);
          setHasError(false);

          const res = await appleAuthHelpers.signIn({
            authOptions: {
              clientId: APPLE_SIGN_IN_SERVICE_ID,
              scope: "name",
              redirectURI: WEB_DEPLOYMENT_URL,
              usePopup: true,
            },
            onError,
          });

          if (hasError || !res) return;

          const { user, authorization } = res;

          if (!authorization?.id_token)
            throw new Error("Unable to retrieve id token");

          const username = composeUsername({
            givenName: user?.name?.firstName,
            familyName: user?.name?.lastName,
          });

          await auth.continueWithApple(authorization.id_token, username);
        } catch (error: any) {
          onError(error);
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}
