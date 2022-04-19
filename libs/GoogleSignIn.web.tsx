import React from "react";
import GoogleLogin, { type GoogleLoginResponse } from "react-google-login";
import { IButtonProps } from "native-base";

import Button from "../components/GoogleSignInButton";
import { useAuth } from "../mongodb/auth";

type GoogleSignInButtonBaseProps = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: any) => void;
};

export type GoogleSignInButtonProps = GoogleSignInButtonBaseProps &
  Omit<IButtonProps, keyof GoogleSignInButtonBaseProps | "onPress">;

const clientId = process.env.GOOGLE_WEB_CLIENT_ID;

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
      clientId={clientId!}
      onSuccess={async (res) => {
        const user = res as GoogleLoginResponse;
        const username =
          user.profileObj.name || user.profileObj.givenName || "New User";

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
        <Button
          {...rest}
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
