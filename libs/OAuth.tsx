import React, { useCallback, type ReactNode } from "react";
import { Platform } from "react-native";
import appleAuth from "@invertase/react-native-apple-authentication";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import {
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_IOS_CLIENT_ID,
} from "react-native-dotenv";

import { composeUsername } from "./utils";

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
});

export type OAuthProviderProps = {
  children: ReactNode;
};

export function OAuthProvider({ children }: OAuthProviderProps) {
  return <>{children}</>;
}

export type OAuthResponse = { idToken: string; username: string | null };

export namespace AppleOAuth {
  export function isSupported() {
    return !(
      Platform.OS === "ios" && parseInt(Platform.Version.split(".")[0]) < 13
    );
  }

  export function useSignIn(
    callback: (res?: OAuthResponse) => void,
    onError: (error: any) => void
  ) {
    return useCallback(async () => {
      try {
        const { user, fullName, identityToken } =
          await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME],
          });

        const state = await appleAuth.getCredentialStateForUser(user);

        if (state !== appleAuth.State.AUTHORIZED || !identityToken)
          return onError(new Error("Unable to authorize"));

        const username = composeUsername({
          givenName: fullName?.givenName,
          middleName: fullName?.middleName,
          familyName: fullName?.familyName,
          nickname: fullName?.nickname,
        });

        return callback({ idToken: identityToken, username });
      } catch (error: any) {
        if (
          `${error?.code}` !== "1001" &&
          !/com\.apple\.AuthenticationServices\.AuthorizationError error 1001/.test(
            `${error?.message}` || ""
          )
        ) {
          console.error(error);
          return onError(error);
        }

        return callback();
      }
    }, [callback, onError]);
  }
}

export namespace GoogleOAuth {
  export function useSignIn(
    callback: (res?: OAuthResponse) => void,
    onError: (error: any) => void
  ) {
    return useCallback(async () => {
      try {
        await GoogleSignin.hasPlayServices();

        const { user, idToken } = await GoogleSignin.signIn();

        if (!idToken) return onError(new Error("Unable to retrieve id token"));

        const username = composeUsername({
          fullName: user.name,
          givenName: user.givenName,
          familyName: user.familyName,
        });

        return callback({ idToken, username });
      } catch (error: any) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          return callback();
        } else if (error.code === statusCodes.IN_PROGRESS) {
          return callback();
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          onError("Google Play services not available or outdated");
        } else {
          onError(error);
        }
        console.error(error);
      }
    }, [callback, onError]);
  }

  export async function signOut() {
    await GoogleSignin.signOut();
  }
}
