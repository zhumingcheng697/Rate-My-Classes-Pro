declare module "react-apple-signin-auth" {
  type AppleSignInResponse = {
    authorization?: {
      state?: string;
      code?: string;
      id_token?: string;
    };
    user?: {
      email?: string;
      name?: {
        firstName?: string;
        lastName?: string;
      };
    };
  };

  export const appleAuthHelpers: {
    APPLE_SCRIPT_SRC: string;
    signIn: (config: {
      authOptions: {
        clientId: string;
        scope: "name" | "email" | "name email" | "";
        redirectURI: string;
        state?: string;
        nonce?: string;
        usePopup: boolean;
      };
      onSuccess?: (response?: AppleSignInResponse) => void;
      onError: (error?: { error?: string }) => void;
    }) => Promise<AppleSignInResponse>;
  };

  export const useScript: (src: string) => void;
}

declare module "react-native-change-icon" {
  export const getIcon: () => Promise<"default" | "VioletIcon">;
  export const changeIcon: (iconName: "VioletIcon" | null) => Promise<string>;
}

declare module "react-native-dotenv" {
  export const REALM_APP_ID: string;
  export const MONGODB_SERVICE_NAME: string;
  export const MONGODB_DATABASE_NAME: string;
  export const APPLE_SIGN_IN_SERVICE_ID: string;
  export const GOOGLE_WEB_CLIENT_ID: string;
  export const GOOGLE_IOS_CLIENT_ID: string;
  export const GOOGLE_OAUTH_ENDPOINT: string;
  export const WEB_DEPLOYMENT_URL: string;
}

declare module "*.png" {
  import type { ImageSourcePropType } from "react-native";

  const content: ImageSourcePropType;

  export default content;
}
