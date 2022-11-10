import React, { useCallback, useMemo, type ReactNode } from "react";
import { useScript, appleAuthHelpers } from "react-apple-signin-auth";
import {
  GoogleOAuthProvider,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import {
  APPLE_SIGN_IN_SERVICE_ID,
  GOOGLE_WEB_CLIENT_ID,
  GOOGLE_OAUTH_ENDPOINT,
  WEB_DEPLOYMENT_URL,
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

export type OAuthResponse = { idToken: string; username: string | null };

export namespace AppleOAuth {
  export function isSupported() {
    return true;
  }

  export function useSignIn(
    callback: (res?: OAuthResponse) => void,
    onError: (error: any) => void
  ) {
    return useCallback(async () => {
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
              return onError(error?.error || error);
            }
          },
        });

        if (hasError || !res) return callback();

        const { user, authorization } = res;

        if (!authorization?.id_token)
          return onError(new Error("Unable to retrieve id token"));

        const username = composeUsername({
          givenName: user?.name?.firstName,
          familyName: user?.name?.lastName,
        });

        return callback({ idToken: authorization.id_token, username });
      } catch (error: any) {
        return onError(error);
      }
    }, [callback, onError]);
  }
}

export namespace GoogleOAuth {
  export function useSignIn(
    callback: (res?: OAuthResponse) => void,
    onError: (error: any) => void
  ) {
    return useMemo(
      () =>
        useGoogleLogin({
          onSuccess: async ({ code }) => {
            try {
              if (!code)
                return onError(
                  new Error("Unable to retrieve authorization code")
                );

              const res = await fetch(
                `${GOOGLE_OAUTH_ENDPOINT}?code=${encodeURIComponent(code)}`
              );
              const json: { id_token?: string } = await res.json();

              if (!json?.id_token)
                return onError(new Error("Unable to retrieve id token"));

              return callback({ idToken: json.id_token, username: null });
            } catch (error: any) {
              console.error(error);
              onError(error);
            }
          },
          onError: (error: any) => {
            if (error.type !== "popup_closed") {
              console.error(error);
              return onError(error);
            } else {
              return callback();
            }
          },
          flow: "auth-code",
        }),
      [callback, onError]
    );
  }

  export async function signOut() {
    googleLogout();
  }
}
