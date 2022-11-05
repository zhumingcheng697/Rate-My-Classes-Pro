import React from "react";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import type { IButtonProps } from "native-base";

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
    <OAuthSignInButton
      {...rest}
      provider={"Google"}
      isDisabled={isLoading || isDisabled}
      onPress={async () => {
        try {
          setIsLoading(true);

          await GoogleSignin.hasPlayServices();

          const { user, idToken } = await GoogleSignin.signIn();

          if (!idToken) throw new Error("Unable to retrieve id token");

          const { name, givenName, familyName } = user;

          const nameComponents = name
            ? [name]
            : givenName
            ? [givenName, familyName]
            : [];

          const username = nameComponents.filter(Boolean).join(" ") || "User";

          await auth.continueWithGoogle(idToken, username);
        } catch (error: any) {
          // handle errors
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            return;
          } else if (error.code === statusCodes.IN_PROGRESS) {
            return;
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            setError("Google Play services not available or outdated");
          } else {
            setError(error);
          }
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }}
    />
  );
}
