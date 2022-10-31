declare module "react-native-change-icon" {
  export const getIcon: () => Promise<"default" | "VioletIcon">;
  export const changeIcon: (iconName: "VioletIcon" | null) => Promise<string>;
}

declare module "react-native-dotenv" {
  export const REALM_APP_ID: string;
  export const MONGODB_SERVICE_NAME: string;
  export const MONGODB_DATABASE_NAME: string;
  export const GOOGLE_WEB_CLIENT_ID: string;
  export const GOOGLE_IOS_CLIENT_ID: string;
  export const WEB_DEPLOYMENT_URL: string;
}

declare module "*.png" {
  import type { ImageSourcePropType } from "react-native";

  const content: ImageSourcePropType;

  export default content;
}
