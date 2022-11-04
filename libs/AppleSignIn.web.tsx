import React from "react";
import { useScript, appleAuthHelpers } from "react-apple-signin-auth";
import type { IButtonProps } from "native-base";
import { APPLE_WEB_CLIENT_ID } from "react-native-dotenv";

import OAuthSignInButton from "../components/OAuthSignInButton";
import { useAuth } from "../mongodb/auth";

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
  useScript(appleAuthHelpers.APPLE_SCRIPT_SRC);
  const auth = useAuth();

  return (
    <OAuthSignInButton
      {...rest}
      provider={"Apple"}
      isDisabled={isLoading || isDisabled}
      onPress={async () => {
        try {
          setIsLoading(true);

          const res = await appleAuthHelpers.signIn({
            authOptions: {
              clientId: APPLE_WEB_CLIENT_ID,
              scope: "name",
              redirectURI: window.location.href,
              usePopup: true,
            },
            onError: (error) => {
              throw error;
            },
          });

          if (res?.authorization?.id_token) {
            const username = res?.user?.name?.firstName || "User";

            await auth.continueWithApple(res.authorization.id_token, username);
          } else {
            setError(new Error("Unable to retrieve id token"));
          }
        } catch (error: any) {
          console.error(error);

          if (error?.error !== "popup_closed_by_user") {
            setError(error?.error || error);
          }
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}
