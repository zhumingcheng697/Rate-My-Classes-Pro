import React, { useCallback } from "react";
import { useScript, appleAuthHelpers } from "react-apple-signin-auth";
import {
  GoogleOAuthProvider,
  googleLogout,
  useGoogleLogin,
} from "@react-oauth/google";
import {
  APPLE_SIGN_IN_SERVICE_ID,
  GOOGLE_WEB_CLIENT_ID,
  WEB_DEPLOYMENT_URL,
} from "react-native-dotenv";

import { composeUsername } from "./utils";
import {
  type OAuthProviderProps,
  type OAuthSignInOptions,
  getOAuthToken,
  revokeOAuthToken,
} from "./oauth.shared";

export function OAuthProvider({ children }: OAuthProviderProps) {
  useScript(appleAuthHelpers.APPLE_SCRIPT_SRC);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_WEB_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}

export namespace AppleOAuth {
  export function isSupported() {
    return true;
  }

  export function useSignIn({ callback, onError, flow }: OAuthSignInOptions) {
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

        if (!authorization?.id_token || !authorization?.code)
          return onError(new Error("Unable to retrieve id token or auth code"));

        if (flow === "authCode")
          return callback({ authCode: authorization.code });

        const username = composeUsername({
          givenName: user?.name?.firstName,
          familyName: user?.name?.lastName,
        });

        return callback({ idToken: authorization.id_token, username });
      } catch (error: any) {
        return onError(error);
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
    const onSuccess = useCallback(
      async ({ code }: { code: string }) => {
        try {
          if (!code)
            return onError(new Error("Unable to retrieve authorization code"));

          if (flow === "authCode") return callback({ authCode: code });

          const { id_token } = await getToken(code);

          if (!id_token)
            return onError(new Error("Unable to retrieve id token"));

          return callback({ idToken: id_token, username: null });
        } catch (error: any) {
          console.error(error);
          onError(error);
        }
      },
      [callback, onError, flow]
    );

    const _onError = useCallback(
      (error: any) => {
        if (error.type !== "popup_closed") {
          console.error(error);
          return onError(error);
        } else {
          return callback();
        }
      },
      [callback, onError]
    );

    return useGoogleLogin({ onSuccess, onError: _onError, flow: "auth-code" });
  }

  export async function signOut() {
    googleLogout();
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
