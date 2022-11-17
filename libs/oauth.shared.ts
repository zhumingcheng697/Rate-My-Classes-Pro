import type { ReactNode } from "react";
import { Platform } from "react-native";
import {
  APPLE_OAUTH_ENDPOINT,
  GOOGLE_OAUTH_ENDPOINT,
} from "react-native-dotenv";

import { tryCatch } from "./utils";

export type OAuthProviderProps = {
  children: ReactNode;
};

export type OAuthTokenResponse = {
  idToken: string;
  username: string | null;
};

export type OAuthCodeResponse = {
  authCode: string;
};

export type OAuthSignInOptions =
  | {
      callback: (res?: OAuthTokenResponse) => void;
      onError: (error: any) => void;
      flow?: "idToken";
    }
  | {
      callback: (res?: OAuthCodeResponse) => void;
      onError: (error: any) => void;
      flow: "authCode";
    };

export async function getOAuthToken(
  authCode: string,
  provider: "Apple" | "Google"
) {
  try {
    const endpoint =
      provider === "Apple" ? APPLE_OAUTH_ENDPOINT : GOOGLE_OAUTH_ENDPOINT;

    const res = await fetch(
      `${endpoint}?platform=${Platform.OS}&code=${encodeURIComponent(authCode)}`
    );

    return (await res.json()) as { id_token?: string; refresh_token?: string };
  } catch (e: any) {
    throw (
      (typeof e?.error === "string" && tryCatch(() => JSON.parse(e.error))) || e
    );
  }
}

export async function revokeOAuthToken(
  refreshToken: string,
  provider: "Apple" | "Google"
) {
  try {
    const endpoint =
      provider === "Apple" ? APPLE_OAUTH_ENDPOINT : GOOGLE_OAUTH_ENDPOINT;

    await fetch(
      `${endpoint}?action=revoke&platform=${
        Platform.OS
      }&token=${encodeURIComponent(refreshToken)}`
    );
  } catch (e: any) {
    throw (
      (typeof e?.error === "string" && tryCatch(() => JSON.parse(e.error))) || e
    );
  }
}
