import React from "react";
import { Platform } from "react-native";
import type { IButtonProps } from "native-base";

import OAuthSignInButton from "../components/OAuthSignInButton";
import { useAuth } from "../mongodb/auth";
import { AppleOAuth } from "./OAuth";

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

          const res = await AppleOAuth.signIn(setError);

          if (res) {
            await auth.continueWithApple(res.idToken, res.username);
          }
        } catch (error: any) {
          setError(error);
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}
