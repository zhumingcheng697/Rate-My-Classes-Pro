import React, { type ReactNode } from "react";
import appleAuth from "@invertase/react-native-apple-authentication";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
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

export namespace AppleOAuth {
  export async function signIn(onError: (error: any) => void) {
    try {
      const { user, fullName, identityToken } = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME],
      });

      const state = await appleAuth.getCredentialStateForUser(user);

      if (state === appleAuth.State.AUTHORIZED && identityToken) {
        const username = composeUsername({
          givenName: fullName?.givenName,
          middleName: fullName?.middleName,
          familyName: fullName?.familyName,
          nickname: fullName?.nickname,
        });

        return { idToken: identityToken, username };
      } else {
        onError(new Error("Unable to authorize"));
      }
    } catch (error: any) {
      if (
        `${error?.code}` !== "1001" &&
        !/com\.apple\.AuthenticationServices\.AuthorizationError error 1001/.test(
          `${error?.message}` || ""
        )
      ) {
        onError(error);
      }
    }
  }
}

export async function googleSignOut() {
  await GoogleSignin.signOut();
}
