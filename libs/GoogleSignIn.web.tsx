import React from "react";
import GoogleLogin, { type GoogleLoginResponse } from "react-google-login";
import { type IButtonProps } from "native-base";

import Button from "../components/GoogleSignInButton";
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
      clientId={process.env.GOOGLE_WEB_CLIENT_ID!}
      onSuccess={async (res) => {
        const user = res as GoogleLoginResponse;
        const username =
          user.profileObj.name || user.profileObj.givenName || "New User";

        await auth.continueWithGoogle(user.tokenId, username);
        setIsLoading(false);
      }}
      onFailure={(error) => {
        console.error(error);
        setError(error);
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
