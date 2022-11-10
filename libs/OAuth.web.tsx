import React, { type ReactNode } from "react";
import { useScript, appleAuthHelpers } from "react-apple-signin-auth";
import { GoogleOAuthProvider, googleLogout } from "@react-oauth/google";
import {
  APPLE_SIGN_IN_SERVICE_ID,
  WEB_DEPLOYMENT_URL,
  GOOGLE_WEB_CLIENT_ID,
} from "react-native-dotenv";

import { composeUsername } from "./utils";

export type OAuthProviderProps = {
  children: ReactNode;
};

export function OAuthProvider({ children }: OAuthProviderProps) {
  useScript(appleAuthHelpers.APPLE_SCRIPT_SRC);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_WEB_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}

export namespace AppleOAuth {
  export async function signIn(onError: (error: any) => void) {
    let hasError = false;

    try {
      const res = await appleAuthHelpers.signIn({
        authOptions: {
          clientId: APPLE_SIGN_IN_SERVICE_ID,
          scope: "name",
          redirectURI: WEB_DEPLOYMENT_URL,
          usePopup: true,
        },
        onError: (error) => {
          if (error?.error !== "popup_closed_by_user") {
            hasError = true;
            onError(error?.error || error);
          }
        },
      });

      if (hasError || !res) return;

      const { user, authorization } = res;

      if (authorization?.id_token) {
        const username = composeUsername({
          givenName: user?.name?.firstName,
          familyName: user?.name?.lastName,
        });

        return { idToken: authorization.id_token, username };
      } else {
        onError(new Error("Unable to retrieve id token"));
      }
    } catch (error: any) {
      onError(error);
    }
  }
}

export async function googleSignOut() {
  googleLogout();
}
