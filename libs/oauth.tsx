import React, { useCallback } from "react";
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
import {
  type OAuthProviderProps,
  type OAuthSignInOptions,
  getOAuthToken,
  revokeOAuthToken,
} from "./oauth.shared";

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  offlineAccess: true,
});

export function OAuthProvider({ children }: OAuthProviderProps) {
  return <>{children}</>;
}

export namespace AppleOAuth {
  export function isSupported() {
    return !(
      Platform.OS === "ios" && parseInt(Platform.Version.split(".")[0], 10) < 13
    );
  }

  export function useSignIn({ callback, onError, flow }: OAuthSignInOptions) {
    return useCallback(async () => {
      try {
        const { user, fullName, identityToken, authorizationCode } =
          await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.FULL_NAME],
          });

        const state = await appleAuth.getCredentialStateForUser(user);

        if (state !== appleAuth.State.AUTHORIZED)
          return onError(new Error("Unable to authorize"));

        if (!identityToken || !authorizationCode)
          return onError(new Error("Unable to retrieve id token or auth code"));

        if (flow === "authCode")
          return callback({ authCode: authorizationCode });

        const username = composeUsername({
          givenName: fullName?.givenName,
          middleName: fullName?.middleName,
          familyName: fullName?.familyName,
          nickname: fullName?.nickname,
        });

        return callback({
          idToken: identityToken,
          username,
        });
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
    }, [callback, onError, flow]);
  }

  export async function getToken(authCode: string) {
    return await getOAuthToken(authCode, "Apple");
  }

  export async function revokeToken(refreshToken: string) {
    return await revokeOAuthToken(refreshToken, "Apple");
  }
}

export namespace GoogleOAuth {
  export function useSignIn({ callback, onError, flow }: OAuthSignInOptions) {
    return useCallback(async () => {
      try {
        await GoogleSignin.hasPlayServices();

        const { user, idToken, serverAuthCode } = await GoogleSignin.signIn();

        if (!idToken || !serverAuthCode)
          return onError(new Error("Unable to retrieve id token or auth code"));

        if (flow === "authCode") return callback({ authCode: serverAuthCode });

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
    }, [callback, onError, flow]);
  }

  export async function signOut() {
    await GoogleSignin.signOut();
  }

  export async function getToken(authCode: string) {
    return await getOAuthToken(authCode, "Google");
  }

  export async function revokeToken(refreshToken: string) {
    return await revokeOAuthToken(refreshToken, "Google");
  }
}

export type {
  OAuthProviderProps,
  OAuthTokenResponse,
  OAuthCodeResponse,
  OAuthSignInOptions,
} from "./oauth.shared";
