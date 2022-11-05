import React, { useCallback } from "react";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import type { IButtonProps } from "native-base";
import { GOOGLE_OAUTH_ENDPOINT } from "react-native-dotenv";

import OAuthSignInButton from "../components/OAuthSignInButton";
import { useAuth } from "../mongodb/auth";

type GoogleSignInButtonBaseProps = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: any) => void;
};

type GoogleOAuthResponse = {
  access_token?: string;
  id_token?: string;
};

type GoogleUserInfo = {
  given_name?: string;
  name?: string;
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

  const getUserInfo = useCallback(async (accessToken: string) => {
    try {
      const { data } = await axios.get<GoogleUserInfo>(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return data;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const login = useGoogleLogin({
    onSuccess: async ({ code }) => {
      try {
        if (!code) throw new Error("Unable to retrieve authorization code");

        const { data } = await axios.post<GoogleOAuthResponse>(
          GOOGLE_OAUTH_ENDPOINT,
          { code }
        );

        const { access_token, id_token } = data;

        if (!id_token) throw new Error("Unable to retrieve id token");

        const userInfo = access_token && (await getUserInfo(access_token));

        const username =
          (userInfo && (userInfo?.name || userInfo?.given_name)) || "User";

        await auth.continueWithGoogle(id_token, username);
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
