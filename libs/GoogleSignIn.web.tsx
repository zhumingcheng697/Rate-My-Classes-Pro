import React from "react";
import GoogleLogin, { type GoogleLoginResponse } from "react-google-login";
import type { IButtonProps } from "native-base";
import { GOOGLE_WEB_CLIENT_ID } from "react-native-dotenv";

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

  return (
    <GoogleLogin
      clientId={GOOGLE_WEB_CLIENT_ID}
      cookiePolicy={"single_host_origin"}
      onSuccess={async (res) => {
        const user = res as GoogleLoginResponse;
        const username =
          user.profileObj.name || user.profileObj.givenName || "User";

        await auth.continueWithGoogle(user.tokenId, username);
        setIsLoading(false);
      }}
      onFailure={(error) => {
        console.error(error);

        // handle errors
        if (error?.error === "popup_closed_by_user") {
          setIsLoading(false);
          return;
        } else if (error?.error === "access_denied") {
          setIsLoading(false);
          return;
        } else {
          setError(error?.details ?? error);
        }
        setIsLoading(false);
      }}
      render={(props) => (
        <OAuthSignInButton
          {...rest}
          provider={"Google"}
          isDisabled={isLoading || isDisabled || props.disabled}
          onPress={() => {
            setIsLoading(true);
            props.onClick();
          }}
        />
      )}
    />
  );
}
