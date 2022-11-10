import React from "react";
import type { IButtonProps } from "native-base";

import OAuthSignInButton from "../components/OAuthSignInButton";
import { useAuth } from "../mongodb/auth";
import { GoogleOAuth } from "./OAuth";

type GoogleSignInButtonBaseProps = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: any) => void;
};

export type GoogleSignInButtonProps = GoogleSignInButtonBaseProps &
  Omit<IButtonProps, keyof GoogleSignInButtonBaseProps | "onPress">;

export function GoogleSignInButton({
  isLoading,
  setIsLoading,
  setError,
  isDisabled = false,
  ...rest
}: GoogleSignInButtonProps) {
  const auth = useAuth();
  const signIn = GoogleOAuth.useTokenSignIn(
    async (res) => {
      try {
        if (res) await auth.continueWithGoogle(res.idToken, res.username);
      } catch (error: any) {
        console.error(error);
        setError(error);
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
      provider={"Google"}
      isDisabled={isLoading || isDisabled}
      onPress={async () => {
        setIsLoading(true);
        await signIn();
      }}
    />
  );
}
