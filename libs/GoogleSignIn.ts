import { GoogleSignin } from "@react-native-google-signin/google-signin";
import config from "react-native-config";

GoogleSignin.configure({
  webClientId: config.GOOGLE_WEB_CLIENT_ID,
  iosClientId: config.GOOGLE_IOS_CLIENT_ID,
});
