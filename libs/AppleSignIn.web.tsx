import React from "react";
import type { IButtonProps } from "native-base";

import OAuthSignInButton from "../components/OAuthSignInButton";
import { useAuth } from "../mongodb/auth";
import { AppleOAuth } from "./OAuth";

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
  const signIn = AppleOAuth.useSignIn(
    async (res) => {
      try {
        if (res) await auth.continueWithApple(res.idToken, res.username);
      } catch (error: any) {
        setError(error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    (error) => {
      setError(error);
      setIsLoading(false);
    }
  );

  return (
    <OAuthSignInButton
      {...rest}
      provider={"Apple"}
      isDisabled={isLoading || isDisabled}
      onPress={async () => {
        setIsLoading(true);
        await signIn();
      }}
    />
  );
}
