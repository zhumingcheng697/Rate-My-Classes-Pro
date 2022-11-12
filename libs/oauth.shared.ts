import type { ReactNode } from "react";
import { Platform } from "react-native";
import {
  APPLE_OAUTH_ENDPOINT,
  GOOGLE_OAUTH_ENDPOINT,
} from "react-native-dotenv";

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
