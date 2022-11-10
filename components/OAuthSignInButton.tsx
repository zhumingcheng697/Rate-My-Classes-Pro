import React, { useCallback, useMemo } from "react";
import { Button, type IButtonProps, Icon, Text } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

import colors, { subtleBorder } from "../styling/colors";
import { colorModeResponsiveStyle } from "../styling/color-mode-utils";
import { useAuth } from "../mongodb/auth";
import { AppleOAuth, GoogleOAuth, OAuthTokenResponse } from "../libs/OAuth";

type OAuthSignInButtonBaseProps = {
  provider: "Apple" | "Google";
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: any) => void;
};

type OAuthSignInButtonProps = OAuthSignInButtonBaseProps &
  Omit<IButtonProps, keyof OAuthSignInButtonBaseProps | "onPress">;

function OAuthSignInButton({
  provider,
  isLoading,
  setIsLoading,
  setError,
  isDisabled = false,
  ...rest
}: OAuthSignInButtonProps) {
  const auth = useAuth();

  const useTokenSignIn = useMemo(
    () =>
      provider === "Apple"
        ? AppleOAuth.useTokenSignIn
        : GoogleOAuth.useTokenSignIn,
    []
  );

  const callback = useCallback(async (res?: OAuthTokenResponse) => {
    try {
      if (res) {
        if (provider === "Apple") {
          await auth.continueWithApple(res.idToken, res.username);
        } else {
          await auth.continueWithGoogle(res.idToken, res.username);
        }
      }
    } catch (error: any) {
      setError(error);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onError = useCallback((error) => {
    setError(error);
    setIsLoading(false);
  }, []);

  const signIn = useTokenSignIn(callback, onError);

  return (
    <Button
      isDisabled={isDisabled || isLoading}
      borderWidth={"1px"}
      onPress={async () => {
        setIsLoading(true);
        await signIn();
      }}
      {...colorModeResponsiveStyle((selector) => ({
        background: selector({
          light: "#ffffff",
          dark: colors.background.secondary.dark,
        }),
        borderColor: subtleBorder,
      }))}
      {...rest}
      startIcon={
        <Icon
          size={"20px"}
          marginRight={"-2px"}
          {...colorModeResponsiveStyle((selector) => ({
            color: selector({ light: "#000000", dark: "#ffffff" }),
          }))}
          as={<Ionicons name={`logo-${provider.toLowerCase()}`} />}
        />
      }
    >
      <Text
        variant={"button"}
        {...colorModeResponsiveStyle((selector) => ({
          color: selector({ light: "#000000", dark: "#ffffff" }),
        }))}
      >
        Continue with {provider}
      </Text>
    </Button>
  );
}

type AppleSignInButtonBaseProps = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: any) => void;
};

export type AppleSignInButtonProps = AppleSignInButtonBaseProps &
  Omit<IButtonProps, keyof AppleSignInButtonBaseProps | "onPress">;

export function AppleSignInButton(props: AppleSignInButtonProps) {
  return <OAuthSignInButton {...props} provider={"Apple"} />;
}

type GoogleSignInButtonBaseProps = {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: any) => void;
};

export type GoogleSignInButtonProps = GoogleSignInButtonBaseProps &
  Omit<IButtonProps, keyof GoogleSignInButtonBaseProps | "onPress">;

export function GoogleSignInButton(props: GoogleSignInButtonProps) {
  return <OAuthSignInButton {...props} provider={"Google"} />;
}
