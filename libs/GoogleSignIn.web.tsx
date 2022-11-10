import React from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import type { IButtonProps } from "native-base";
import { GOOGLE_OAUTH_ENDPOINT } from "react-native-dotenv";

import OAuthSignInButton from "../components/OAuthSignInButton";
import { useAuth } from "../mongodb/auth";

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

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        if (!code) throw new Error("Unable to retrieve authorization code");

        const res = await fetch(
          `${GOOGLE_OAUTH_ENDPOINT}?code=${encodeURIComponent(code)}`
        );
        const json: { id_token?: string } = await res.json();

        if (!json?.id_token) throw new Error("Unable to retrieve id token");

        await auth.continueWithGoogle(json.id_token, null);
      } catch (error: any) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error: any) => {
      if (error.type !== "popup_closed") {
        console.error(error);
        setError(error);
      }
      setIsLoading(false);
    },
    flow: "auth-code",
  });

  return (
    <OAuthSignInButton
      {...rest}
      provider={"Google"}
      isDisabled={isLoading || isDisabled}
      onPress={() => {
        setIsLoading(true);
        login();
      }}
    />
  );
}
