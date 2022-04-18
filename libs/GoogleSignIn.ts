import { GoogleSignin } from "@react-native-google-signin/google-signin";
import config from "react-native-config";

GoogleSignin.configure({
  webClientId: config.GOOGLE_WEB_CLIENT_ID,
  iosClientId: config.GOOGLE_IOS_CLIENT_ID,
});

namespace GoogleSignIn {
  export const signIn = async () => {
    await GoogleSignin.hasPlayServices();

    const user = await GoogleSignin.signIn();
    const username = user.user.name || user.user.givenName || "New User";

    return { idToken: user.idToken!, username };
  };
}

export default GoogleSignIn;
