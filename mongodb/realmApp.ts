import Realm from "./Realm";
import config from "react-native-config";

export default new Realm.App({
  id: config.REALM_APP_ID || process.env.REALM_APP_ID!,
});
