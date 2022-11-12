import React, { useCallback, useMemo } from "react";
import { Button, type IButtonProps } from "native-base";

import type { AuthContext } from "../mongodb/auth";
import {
  AppleOAuth,
  GoogleOAuth,
  type OAuthSignInOptions,
} from "../libs/oauth";

type DeleteSpecificAccountButtonBaseProps = {
  auth: AuthContext;
  onSetup: () => void;
  callback: (success: boolean) => void;
  onError: (error: any) => void;
};

type DeleteSpecificAccountButtonProps = DeleteSpecificAccountButtonBaseProps &
  Omit<IButtonProps, keyof DeleteSpecificAccountButtonBaseProps | "onPress">;

function DeleteOAuthAccountButton({
  auth,
  onSetup,
  callback,
  onError,
  provider,
  ...rest
}: DeleteSpecificAccountButtonProps & { provider: "Apple" | "Google" }) {
  const useSignIn = useMemo(
    () => (provider === "Apple" ? AppleOAuth.useSignIn : GoogleOAuth.useSignIn),
    []
  );

  const signInOptions: OAuthSignInOptions = useMemo(
    () => ({
      callback: async (res) => {
        try {
          if (!res) {
            return callback(false);
          }

          // if (provider === "Apple") {
          //   await auth.deleteAppleAccount(res.authCode);
          // } else {
          //   await auth.deleteGoogleAccount(res.authCode);
          // }
          callback(true);
        } catch (error: any) {
          onError(error);
        }
      },
      onError,
      flow: "authCode",
    }),
    [auth, callback, onError]
  );

  const deleteAccount = useSignIn(signInOptions);

  return (
    <Button
      {...rest}
      onPress={async () => {
        onSetup();
        deleteAccount();
      }}
    >
      Delete
    </Button>
  );
}

function DeleteAppleAccountButton(props: DeleteSpecificAccountButtonProps) {
  return <DeleteOAuthAccountButton {...props} provider={"Apple"} />;
}

function DeleteGoogleAccountButton(props: DeleteSpecificAccountButtonProps) {
  return <DeleteOAuthAccountButton {...props} provider={"Google"} />;
}

function DeleteEmailPasswordAccountButton({
  auth,
  onSetup,
  callback,
  onError,
  ...rest
}: DeleteSpecificAccountButtonProps) {
  return (
    <Button
      {...rest}
      onPress={async () => {
        try {
          onSetup();
          // await auth.deleteEmailPasswordAccount();
          callback(true);
        } catch (error: any) {
          onError(error);
        }
      }}
    >
      Delete
    </Button>
  );
}

type DeleteAccountButtonBaseProps = {
  auth: AuthContext;
  setAccountDeleted: (accountDeleted: boolean) => void;
  setIsDeletingAccount: (isDeletingAlert: boolean) => void;
  setDeleteAccountError: (error: any) => void;
  setShowDeleteAccountAlert: (showAlert: boolean) => void;
  setShowDeleteAccountError: (showAlert: boolean) => void;
};

export type DeleteAccountButtonProps = DeleteAccountButtonBaseProps &
  Omit<IButtonProps, keyof DeleteAccountButtonBaseProps | "onPress">;

export function DeleteAccountButton({
  auth,
  setAccountDeleted,
  setIsDeletingAccount,
  setDeleteAccountError,
  setShowDeleteAccountAlert,
  setShowDeleteAccountError,
  ...rest
}: DeleteAccountButtonProps) {
  const provider = auth.user?.providerType;

  const onSetup = useCallback(() => {
    setIsDeletingAccount(true);
    setShowDeleteAccountAlert(false);
  }, []);

  const onSuccess = useCallback((success) => {
    setDeleteAccountError(null);
    setShowDeleteAccountError(false);
    setIsDeletingAccount(false);
    if (success) setAccountDeleted(true);
  }, []);

  const onError = useCallback((error: any) => {
    console.error(error);
    setDeleteAccountError(error);
    setShowDeleteAccountError(true);
    setIsDeletingAccount(false);
  }, []);

  const Button =
    provider === "custom-token"
      ? DeleteAppleAccountButton
      : provider === "oauth2-google"
      ? DeleteGoogleAccountButton
      : DeleteEmailPasswordAccountButton;

  return (
    <Button
      auth={auth}
      onSetup={onSetup}
      callback={onSuccess}
      onError={onError}
      {...rest}
    />
  );
}
